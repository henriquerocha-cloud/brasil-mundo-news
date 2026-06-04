import Parser from 'rss-parser'
import { prisma } from './prisma'
import { generateContentSummary } from './ai'
import slugify from 'slugify'

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure', 'content:encoded', 'description'],
  },
})

export async function fetchAndProcessRss(sourceId: string) {
  try {
    const source = await prisma.source.findUnique({ where: { id: sourceId } })
    if (!source || !source.isActive) return { success: false, error: 'Source not found or inactive' }

    const feed = await parser.parseURL(source.url)
    let addedCount = 0

    for (const item of feed.items) {
      if (!item.title || !item.link) continue

      // Evita duplicação verificando a URL original
      const existingArticle = await prisma.article.findUnique({
        where: { originalUrl: item.link },
      })

      if (existingArticle) continue

      // Extrair imagem
      let imageUrl = null
      if (item['media:content'] && item['media:content'].$) {
        imageUrl = item['media:content'].$.url
      } else if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url
      } else {
        // Tenta extrair da description ou content (fallback bem basico)
        const contentStr = item['content:encoded'] || item.content || item.description || ''
        const imgMatch = contentStr.match(/<img[^>]+src="?([^"\s]+)"?\s*\/>/i)
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1]
        }
      }

      // Adiciona uma imagem bonita de placeholder se o RSS não enviar nenhuma imagem
      if (!imageUrl) {
        // Usa a imagem padrão do Unsplash com o tema "notícias"
        const seed = Math.floor(Math.random() * 1000)
        imageUrl = `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80&sig=${seed}`
      }
      const content = item['content:encoded'] || item.content || item.description || ''
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date()

      // Gera resumos com IA
      const aiData = await generateContentSummary(content, item.title)

      let baseSlug = slugify(aiData.seoTitle || item.title, { lower: true, strict: true })
      let slug = baseSlug
      let counter = 1
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      await prisma.article.create({
        data: {
          title: item.title,
          slug,
          summary: aiData.summary,
          content: content,
          originalUrl: item.link,
          imageUrl,
          publishedAt,
          sourceId: source.id,
          seoTitle: aiData.seoTitle,
          seoDescription: aiData.seoDescription,
        },
      })
      
      addedCount++
    }

    await prisma.source.update({
      where: { id: source.id },
      data: { lastFetch: new Date() }
    })

    return { success: true, addedCount }
  } catch (error: any) {
    console.error('Failed to fetch RSS', error)
    return { success: false, error: error.message }
  }
}
