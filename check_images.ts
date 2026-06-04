import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 10
  })

  for (let i = 0; i < articles.length; i++) {
    console.log(`[${i}] Title: ${articles[i].title}`)
    console.log(`    Image: ${articles[i].imageUrl}`)
  }
}
main()
