import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Clock, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return { title: 'Categoria não encontrada | Brasil & Mundo News' }
  return { title: `${category.name} | Brasil & Mundo News` }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  
  // Se a categoria não existir no DB, podemos tentar buscar apenas ignorando ou gerar um erro 404
  if (!category) {
    // Se for uma das categorias fixas mas o BD estiver vazio, fingimos que existe
    const fixedCategories = ['brasil', 'mundo', 'politica', 'economia', 'tecnologia', 'esportes', 'entretenimento']
    if (!fixedCategories.includes(slug)) {
      notFound()
    }
  }

  const articles = await prisma.article.findMany({
    where: { 
      isPublished: true,
      ...(category ? { categoryId: category.id } : {}) // Filtro real
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
    include: { category: true }
  })

  const categoryName = category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{categoryName}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground border-l-4 border-primary pl-4">
          {categoryName}
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">Nenhuma notícia encontrada nesta categoria no momento.</p>
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
                  {article.category?.name || categoryName}
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
