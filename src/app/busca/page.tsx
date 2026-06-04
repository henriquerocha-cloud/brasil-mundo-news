import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Clock, Search as SearchIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const revalidate = 0 // Busca não pode ter cache estático absoluto para a query

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return { title: `Resultados para "${q || ''}" | Brasil & Mundo News` }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q || ''

  let articles: any[] = []
  
  if (query.trim().length > 0) {
    articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { publishedAt: 'desc' },
      take: 30,
      include: { category: true }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-[60vh]">
      <div className="flex flex-col items-center justify-center text-center py-12 bg-secondary/50 rounded-3xl border border-border">
        <SearchIcon className="w-12 h-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Resultados da Busca
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {query ? (
            <>Você buscou por <span className="font-bold text-foreground">"{query}"</span></>
          ) : (
            'Digite um termo na barra superior para buscar notícias.'
          )}
        </p>
      </div>

      {query && articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl">Nenhuma notícia encontrada para este termo.</p>
          <p className="mt-2">Tente buscar usando outras palavras-chave.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any) => (
            <Link key={article.slug} href={`/noticia/${article.slug}`} className="group flex flex-col gap-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md overflow-hidden">
              <div className="w-full h-48 sm:h-56 overflow-hidden shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                {article.imageUrl ? (
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-muted"></div>
                )}
                <span className="absolute bottom-3 left-3 z-20 text-white text-xs font-bold uppercase tracking-wider bg-primary/90 px-2 py-1 rounded">
                  {article.category?.name || 'Notícia'}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-5 pt-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-3 leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center text-muted-foreground text-xs font-medium mt-auto">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ptBR })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
