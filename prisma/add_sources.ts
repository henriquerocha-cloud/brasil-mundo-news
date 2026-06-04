import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adicionando fontes RSS extras...')

  const sources = [
    {
      name: 'Google News - Esportes',
      url: 'https://news.google.com/rss/search?q=Esportes&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    },
    {
      name: 'Google News - Mundo',
      url: 'https://news.google.com/rss/search?q=Mundo&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    },
    {
      name: 'Google News - Economia',
      url: 'https://news.google.com/rss/search?q=Economia&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    },
    {
      name: 'Google News - Política',
      url: 'https://news.google.com/rss/search?q=Política&hl=pt-BR&gl=BR&ceid=BR:pt-419',
      type: 'RSS',
    },
    {
      name: 'Google News - Entretenimento',
      url: 'https://news.google.com/rss/search?q=Entretenimento&hl=pt-BR&gl=BR&ceid=BR:pt-419',
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

  console.log('Fontes adicionadas com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
