import { PrismaClient } from '@prisma/client'
import { fetchAndProcessRss } from './src/lib/rss'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando sincronização forçada de todas as fontes...')

  const sources = await prisma.source.findMany({
    where: { isActive: true },
  })

  for (const source of sources) {
    console.log(`Sincronizando fonte: ${source.name}`)
    const result = await fetchAndProcessRss(source.id)
    console.log(result)
  }

  console.log('Sincronização concluída!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
