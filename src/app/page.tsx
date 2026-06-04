import { prisma } from '@/lib/prisma'
import { AdUnit } from '@/components/ads/AdUnit'
import Link from 'next/link'
import { getCategoryColor } from '@/lib/categoryColors'

export const revalidate = 60 // Revalida a cada 60 segundos (ISR)

export default async function Home() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: {
      category: true,
      source: true
    }
  })

  // Destruturação para a Grade Globo
  const mainArticle = articles[0]
  const column1Articles = articles.slice(1, 3)
  const column2Articles = articles.slice(3, 5)
  const feedArticles = articles.slice(5)

  return (
    <div className="min-h-screen bg-background">
      {/* AdSpace Superior (Banner Central) */}
      <div className="container mx-auto px-4 py-6 text-center">
        <AdUnit zone="header" />
      </div>

      <div className="container mx-auto px-4">
        
        {/* GRID ESTILO GLOBO.COM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Coluna Esquerda: Destaque Principal Gigante */}
          {mainArticle ? (
            <div className="lg:col-span-6 group relative rounded-lg overflow-hidden h-[400px] lg:h-[500px] shadow-sm">
              <Link href={`/noticia/${mainArticle.slug}`} prefetch={true} className="absolute inset-0 flex flex-col">
                <div 
                  className="flex-1 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${mainArticle.imageUrl || '/placeholder.jpg'})` }}
                />
                
                {/* Tarja Inferior Colorida com Texto */}
                <div 
                  className="p-6 md:p-8 shrink-0 relative z-10 transition-colors"
                  style={{ backgroundColor: getCategoryColor(mainArticle.category?.slug) }}
                >
                  <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {mainArticle.title}
                  </h1>
                  <p className="text-white/90 text-sm md:text-base mt-2 line-clamp-2 font-medium">
                    {mainArticle.summary}
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="lg:col-span-12 h-[400px] bg-secondary rounded-lg flex items-center justify-center border border-border">
              <p className="text-muted-foreground text-lg font-medium">Nenhuma notícia encontrada. Aguarde a sincronização.</p>
            </div>
          )}

          {/* Coluna Meio: Matérias Menores 1 */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {column1Articles.map((article) => (
              <div key={article.id} className="group flex-1 flex flex-col gap-3">
                <Link href={`/noticia/${article.slug}`} prefetch={true} className="block">
                  <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-3 relative">
                     <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
                    />
                  </div>
                  <h2 
                    className="text-[17px] font-black leading-snug hover:underline"
                    style={{ color: getCategoryColor(article.category?.slug) }}
                  >
                    {article.title}
                  </h2>
                </Link>
              </div>
            ))}
          </div>

          {/* Coluna Direita: Matérias Menores 2 */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {column2Articles.map((article) => (
              <div key={article.id} className="group flex-1 flex flex-col gap-3">
                <Link href={`/noticia/${article.slug}`} prefetch={true} className="block">
                  <div className="w-full aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-3 relative">
                     <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
                    />
                  </div>
                  <h2 
                    className="text-[17px] font-black leading-snug hover:underline"
                    style={{ color: getCategoryColor(article.category?.slug) }}
                  >
                    {article.title}
                  </h2>
                </Link>
              </div>
            ))}
          </div>

        </div>

        {/* FEED INFERIOR */}
        {feedArticles.length > 0 && (
          <div className="border-t-4 border-primary pt-8 mb-16">
            <h3 className="text-2xl font-black mb-8 text-foreground">Mais Notícias</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {feedArticles.map(article => (
                <Link key={article.id} href={`/noticia/${article.slug}`} className="group flex flex-col gap-2">
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
                    />
                  </div>
                  <h4 
                    className="text-sm font-bold leading-snug hover:underline"
                    style={{ color: getCategoryColor(article.category?.slug) }}
                  >
                    {article.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
