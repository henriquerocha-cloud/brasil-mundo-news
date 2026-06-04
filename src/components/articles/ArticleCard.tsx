import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ArticleCard({ article }: { article: any }) {
  return (
    <Link href={`/noticia/${article.slug}`} prefetch={true} className="group flex flex-col gap-4">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${article.imageUrl || '/placeholder.jpg'})` }}
        />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            {article.category?.name || 'Geral'}
          </span>
          <span className="text-xs text-muted-foreground font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true, locale: ptBR })}
          </span>
        </div>
        <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>
      </div>
    </Link>
  )
}
