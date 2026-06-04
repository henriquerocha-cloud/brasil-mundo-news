import { prisma } from '@/lib/prisma'
import { AdUnit } from '@/components/ads/AdUnit'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

  const heroArticle = articles[0]
  const sideArticles = articles.slice(1, 3)
  const feedArticles = articles.slice(3, 13)
  const trendingArticles = articles.slice(13, 18)

  return (
    <div className="min-h-screen bg-background">
      {/* AdSpace Superior */}
      <div className="container mx-auto px-4 py-6">
        <AdUnit zone="header" />
      </div>

      <div className="container mx-auto px-4">
        {/* HERO SECTION: Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 mb-16 lg:h-[600px]">
          {/* Matéria Principal (Esquerda) */}
          {heroArticle ? (
            <div className="lg:col-span-8 h-[400px] lg:h-full group relative overflow-hidden rounded-2xl">
              <Link href={`/noticia/${heroArticle.slug}`} prefetch={true} className="absolute inset-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${heroArticle.imageUrl || '/placeholder.jpg'})` }}
                />
                {/* Degradê Glassmórfico Escuro na base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full">
                      {heroArticle.category?.name || 'Geral'}
                    </span>
                    <span className="flex items-center text-white/80 text-sm font-medium">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {formatDistanceToNow(new Date(heroArticle.publishedAt), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-black font-serif text-white leading-tight mb-3 group-hover:text-primary/90 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                    {heroArticle.title}
                  </h1>
                  <p className="text-white/80 text-lg line-clamp-2 max-w-3xl font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    {heroArticle.summary}
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="lg:col-span-12 h-[400px] bg-card rounded-2xl flex items-center justify-center border border-border">
              <p className="text-muted-foreground text-lg font-medium">Nenhuma notícia encontrada. Aguarde a sincronização.</p>
            </div>
          )}

          {/* Duas Matérias Secundárias (Direita) */}
          {sideArticles.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-2 lg:gap-4 h-full">
              {sideArticles.map((article) => (
                <div key={article.id} className="h-[250px] lg:h-[calc(50%-0.5rem)] group relative overflow-hidden rounded-2xl">
                  <Link href={`/noticia/${article.slug}`} prefetch={true} className="absolute inset-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
                        {article.category?.name || 'Geral'}
                      </span>
                      <h2 className="text-xl lg:text-2xl font-bold font-serif text-white leading-snug group-hover:text-primary-foreground transition-colors duration-300 line-clamp-3">
                        {article.title}
                      </h2>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTEÚDO PRINCIPAL: Feed e Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Feed de Notícias (Esquerda) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-8">
              <h2 className="text-2xl font-black font-serif text-foreground">Últimas Notícias</h2>
              <Link href="/ultimas" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors uppercase tracking-widest">
                Ver todas &rarr;
              </Link>
            </div>
            
            <div className="flex flex-col gap-8">
              {feedArticles.map((article) => (
                <div key={article.id} className="group grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  <div className="md:col-span-1 h-32 md:h-28 relative overflow-hidden rounded-xl shadow-sm">
                    <Link href={`/noticia/${article.slug}`} prefetch={true} className="absolute inset-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
                      />
                    </Link>
                  </div>
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {article.category?.name || 'Geral'}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                    <Link href={`/noticia/${article.slug}`} prefetch={true}>
                      <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {article.summary}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {feedArticles.length > 0 && (
              <div className="mt-12 text-center">
                <Link 
                  href="/ultimas"
                  className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground rounded-full font-bold transition-all duration-300"
                >
                  Carregar mais notícias
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar / Em Alta (Direita) */}
          <div className="lg:col-span-4 space-y-10">
            <AdUnit zone="sidebar" />
            
            <div>
              <h2 className="text-xl font-black font-serif text-foreground border-b-2 border-foreground pb-4 mb-6">Em Alta</h2>
              <div className="flex flex-col gap-6">
                {trendingArticles.map((article, idx) => (
                  <div key={article.id} className="flex gap-4 group">
                    <div className="text-4xl font-black text-muted-foreground/30 font-serif leading-none group-hover:text-primary transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <Link href={`/noticia/${article.slug}`} prefetch={true}>
                        <h4 className="text-base font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-3">
                          {article.title}
                        </h4>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AdUnit zone="sidebar-bottom" />
          </div>
        </div>
      </div>
    </div>
  )
}
