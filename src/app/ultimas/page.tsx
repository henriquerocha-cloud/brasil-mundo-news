import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock } from 'lucide-react'

export const revalidate = 60

export default async function UltimasNoticias() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    include: { category: true }
  })

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-foreground border-l-4 border-primary pl-4">
        Últimas Notícias
      </h1>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
      ) : (
        <div className="space-y-8">
          {articles.map((article) => (
            <Link key={article.id} href={`/noticia/${article.slug}`} className="group flex flex-col md:flex-row gap-6 bg-card rounded-2xl p-4 md:p-6 border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
              {article.imageUrl && (
                <div className="w-full md:w-64 h-48 md:h-40 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between py-2">
                <div>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                    {article.category?.name || 'Notícia'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <div className="flex items-center text-muted-foreground text-sm font-medium mt-4">
                  <Clock className="w-4 h-4 mr-1.5" />
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
