import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Recategorizando notícias existentes...')

  const articles = await prisma.article.findMany({
    include: { source: true }
  })

  let updated = 0
  for (const article of articles) {
    if (!article.source) continue;

    const sourceName = article.source.name.toLowerCase()
    let categorySlug = 'brasil'
    
    if (sourceName.includes('brasil')) categorySlug = 'brasil'
    else if (sourceName.includes('mundo')) categorySlug = 'mundo'
    else if (sourceName.includes('política') || sourceName.includes('politica')) categorySlug = 'politica'
    else if (sourceName.includes('economia')) categorySlug = 'economia'
    else if (sourceName.includes('tecnologia')) categorySlug = 'tecnologia'
    else if (sourceName.includes('esporte')) categorySlug = 'esportes'
    else if (sourceName.includes('entretenimento')) categorySlug = 'entretenimento'

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (category && category.id !== article.categoryId) {
      await prisma.article.update({
        where: { id: article.id },
        data: { categoryId: category.id }
      })
      updated++
    }
  }

  console.log(`Pronto! ${updated} notícias recategorizadas.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
