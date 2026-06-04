import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Populando banco de dados...')

  const categories = [
    { name: 'Brasil', slug: 'brasil' },
    { name: 'Mundo', slug: 'mundo' },
    { name: 'Política', slug: 'politica' },
    { name: 'Economia', slug: 'economia' },
    { name: 'Tecnologia', slug: 'tecnologia' },
    { name: 'Esportes', slug: 'esportes' },
    { name: 'Entretenimento', slug: 'entretenimento' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const sources = [
    {
      name: 'Google News - Brasil',
      url: 'https://news.google.com/rss/search?q=Brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    },
    {
      name: 'Google News - Tecnologia',
      url: 'https://news.google.com/rss/search?q=Tecnologia&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    }
  ]

  for (const src of sources) {
    await prisma.source.upsert({
      where: { url: src.url },
      update: {},
      create: src,
    })
  }

  console.log('Banco populado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
