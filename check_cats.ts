import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cats = await prisma.category.findMany()
  console.log('Categories:', cats.map(c => c.slug))
  
  for (const cat of cats) {
    const count = await prisma.article.count({ where: { categoryId: cat.id }})
    console.log(`Cat: ${cat.slug} -> ${count} articles`)
  }
}
main()
