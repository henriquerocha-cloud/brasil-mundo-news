import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Trocando imagens feias do Google por fotos lindas...')

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
  ]

  const articles = await prisma.article.findMany()

  for (const article of articles) {
    if (
      !article.imageUrl ||
      article.imageUrl.includes('googleusercontent.com') ||
      article.imageUrl.includes('news.google.com')
    ) {
      const newImageUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
      await prisma.article.update({
        where: { id: article.id },
        data: { imageUrl: newImageUrl }
      })
    }
  }

  console.log('Pronto! Imagens atualizadas.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
