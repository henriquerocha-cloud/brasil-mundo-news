import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const revalidate = 60 // ISR de 60 segundos

async function getHomeData() {
  const latestArticles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: { category: true }
  })

  // Se o banco estiver vazio, retorna dados mockados para demonstração do design
  if (latestArticles.length === 0) {
    return {
      heroArticle: null,
      secondaryArticles: [],
      latestNews: [],
      trendingNews: [],
    }
  }

  return {
    heroArticle: latestArticles[0],
    secondaryArticles: latestArticles.slice(1, 5),
    latestNews: latestArticles.slice(5, 12),
    trendingNews: latestArticles.slice(12, 17), // Na vida real seria ordenado por views
  }
}

// Mock Data for Design Demonstration
const MOCK_HERO = {
  title: "Avanços na Inteligência Artificial prometem revolucionar a medicina diagnóstica",
  slug: "avancos-ia-medicina",
  summary: "Pesquisadores desenvolvem novo modelo de IA capaz de detectar doenças em estágios iniciais com precisão superior a 95%, reduzindo drasticamente o tempo de diagnóstico.",
  imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  category: { name: "Saúde", slug: "saude" },
  publishedAt: new Date()
}

const MOCK_SECONDARY = [
  { title: "Bolsa fecha em alta histórica após novos anúncios econômicos", slug: "bolsa-alta", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80", category: { name: "Economia" }, publishedAt: new Date(Date.now() - 3600000) },
  { title: "Novo foguete comercial atinge órbita com sucesso", slug: "foguete-orbita", imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80", category: { name: "Ciência" }, publishedAt: new Date(Date.now() - 7200000) },
  { title: "Seleção brasileira se prepara para as eliminatórias", slug: "selecao-eliminatorias", imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80", category: { name: "Esportes" }, publishedAt: new Date(Date.now() - 14400000) },
  { title: "Festival de cinema anuncia vencedores deste ano", slug: "festival-cinema", imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80", category: { name: "Entretenimento" }, publishedAt: new Date(Date.now() - 28800000) },
]

export default async function Home() {
  const data = await getHomeData()
  
  const hero = data.heroArticle || MOCK_HERO
  const secondary = data.secondaryArticles.length > 0 ? data.secondaryArticles : MOCK_SECONDARY
  const latest = data.latestNews.length > 0 ? data.latestNews : MOCK_SECONDARY
  const trending = data.trendingNews.length > 0 ? data.trendingNews : MOCK_SECONDARY

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* Top AdSense Placeholder */}
      <div className="w-full h-[90px] bg-muted border border-border flex items-center justify-center rounded-lg relative overflow-hidden group">
        <span className="text-muted-foreground text-sm font-medium z-10">Anúncio (728x90)</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Link href={`/noticia/${hero.slug}`} className="lg:col-span-8 group relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px] block">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10 transition-opacity duration-300"></div>
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-primary/20"></div>
          )}
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full text-white">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-md mb-4">
              {hero.category?.name || 'Destaque'}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 group-hover:text-blue-400 transition-colors">
              {hero.title}
            </h1>
            <p className="text-slate-200 text-lg md:text-xl line-clamp-2 mb-4 max-w-3xl">
              {hero.summary}
            </p>
            <div className="flex items-center text-slate-300 text-sm font-medium">
              <Clock className="w-4 h-4 mr-2" />
              {formatDistanceToNow(new Date(hero.publishedAt), { addSuffix: true, locale: ptBR })}
            </div>
          </div>
        </Link>

        <div className="lg:col-span-4 flex flex-col gap-6">
          {secondary.slice(0, 2).map((article: any) => (
            <Link key={article.slug} href={`/noticia/${article.slug}`} className="group relative rounded-2xl overflow-hidden flex-1 block h-[200px] lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10"></div>
              {article.imageUrl ? (
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-secondary"></div>
              )}
              <div className="absolute bottom-0 left-0 p-5 z-20 text-white">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                  {article.category?.name || 'Notícia'}
                </span>
                <h3 className="text-xl font-bold leading-snug group-hover:text-blue-300 transition-colors line-clamp-3">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid Content: Latest & Trending */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Últimas Notícias */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground border-l-4 border-primary pl-3">
              Últimas Notícias
            </h2>
            <Link href="/ultimas" className="text-sm font-medium text-primary hover:underline flex items-center">
              Ver todas <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {latest.map((article: any) => (
              <Link key={article.slug} href={`/noticia/${article.slug}`} className="group flex flex-col sm:flex-row gap-4 bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                <div className="w-full sm:w-48 h-48 sm:h-32 rounded-lg overflow-hidden shrink-0">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted"></div>
                  )}
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                      {article.category?.name || 'Atualidade'}
                    </span>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs font-medium mt-auto">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* AdSense Sidebar 300x250 */}
          <div className="w-full h-[250px] bg-muted border border-border flex items-center justify-center rounded-lg text-muted-foreground text-sm font-medium mx-auto max-w-[300px]">
            Anúncio (300x250)
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              Em Alta
            </h2>
            <div className="space-y-6">
              {trending.map((article: any, i: number) => (
                <Link key={article.slug} href={`/noticia/${article.slug}`} className="group flex gap-4 items-start">
                  <span className="text-4xl font-black text-muted-foreground/30 group-hover:text-primary/40 transition-colors shrink-0 w-8">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-3 leading-snug">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* AdSense Sidebar 300x600 */}
          <div className="w-full h-[600px] bg-muted border border-border flex items-center justify-center rounded-lg text-muted-foreground text-sm font-medium mx-auto max-w-[300px] sticky top-24">
            Anúncio (300x600)
          </div>
        </aside>
      </section>
    </div>
  )
}
