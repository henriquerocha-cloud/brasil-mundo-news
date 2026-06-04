import Parser from 'rss-parser'
import { prisma } from './prisma'
import { generateContentSummary } from './ai'
import slugify from 'slugify'
import * as cheerio from 'cheerio'

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure', 'content:encoded', 'description'],
  },
})

async function scrapeRealImageUrl(googleNewsUrl: string): Promise<string | null> {
  try {
    // 1. Fetch Google News URL
    const res = await fetch(googleNewsUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const html = await res.text()
    
    // 2. Extrair a URL real do redirect (Google News usa uma tag c-wiz ou a href escondido)
    const urlMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>/i) || html.match(/URL='?([^'">]+)'?/i)
    let realUrl = googleNewsUrl
    if (urlMatch && urlMatch[1] && urlMatch[1].startsWith('http')) {
      realUrl = urlMatch[1]
    }

    // 3. Fetch da URL real
    const realRes = await fetch(realUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const realHtml = await realRes.text()
    
    // 4. Usar cheerio para pegar og:image
    const $ = cheerio.load(realHtml)
    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content')
    
    return ogImage || null
  } catch (e) {
    return null
  }
}

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
        // Tenta extrair da description ou content
        const contentStr = item['content:encoded'] || item.content || item.description || ''
        const imgMatch = contentStr.match(/<img[^>]+src="?([^"\s>]+)"?[^>]*>/i)
        if (imgMatch && imgMatch[1]) {
          imageUrl = imgMatch[1]
        }
      }

      // Se a imagem for uma imagem genérica do Google (ex: favicon ou logo "G"), descartamos para usar nosso banco de imagens bonito
      if (imageUrl && (imageUrl.includes('googleusercontent.com') || imageUrl.includes('news.google.com'))) {
        imageUrl = null
      }

      // Adiciona uma imagem bonita de placeholder se o RSS não enviar nenhuma imagem e o scraper falhar
      if (!imageUrl) {
        const fallbackImages = [
          'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80', // Jornal
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80', // Maquina de escrever
          'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', // Banca de jornal
          'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&q=80', // Lente de camera
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Predio comercial
          'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=800&q=80', // Microfones impressa
          'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&q=80', // News desk
          'https://images.unsplash.com/photo-1529243856184-fd5f656c1070?w=800&q=80', // Evento publico
          'https://images.unsplash.com/photo-1557425955-df376b5903c8?w=800&q=80', // Tecnologia
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80'  // Mundo/Globo
        ];
        imageUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
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

      // Encontrar a categoria no banco de dados
      let categorySlug = aiData.categorySlug
      if (!categorySlug) {
        const sourceName = source.name.toLowerCase()
        if (sourceName.includes('brasil')) categorySlug = 'brasil'
        else if (sourceName.includes('mundo')) categorySlug = 'mundo'
        else if (sourceName.includes('política') || sourceName.includes('politica')) categorySlug = 'politica'
        else if (sourceName.includes('economia')) categorySlug = 'economia'
        else if (sourceName.includes('tecnologia')) categorySlug = 'tecnologia'
        else if (sourceName.includes('esporte')) categorySlug = 'esportes'
        else if (sourceName.includes('entretenimento')) categorySlug = 'entretenimento'
        else categorySlug = 'brasil' // Padrão
      }

      let categoryId = null
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
      if (category) {
        categoryId = category.id
      }

      // Fallback extremo
      if (!categoryId) {
        const fallbackCategory = await prisma.category.findFirst()
        if (fallbackCategory) {
          categoryId = fallbackCategory.id
        }
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
          categoryId,
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
