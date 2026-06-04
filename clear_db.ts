import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Deletando todas as notícias para ressincronizar com categorias corretas...')
  await prisma.article.deleteMany()
  console.log('Todas as notícias deletadas!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
