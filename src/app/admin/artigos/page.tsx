import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArticleActions } from '@/components/admin/ArticleActions'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ArtigosPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 100, // Limite para não sobrecarregar
    include: {
      category: true,
      source: true
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notícias</h1>
          <p className="text-muted-foreground mt-2">Gerencie as notícias importadas e cadastradas no portal.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
          title="Em breve"
        >
          <Plus className="w-4 h-4" />
          Nova Notícia Manual
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Fonte</th>
                <th className="px-6 py-4 font-medium">Publicação</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/noticia/${article.slug}`} target="_blank" className="font-medium text-foreground hover:text-primary line-clamp-2">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                      {article.category?.name || 'Sem categoria'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {article.source?.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {format(new Date(article.publishedAt), "dd MMM yyyy, HH:mm", { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArticleActions articleId={article.id} />
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma notícia encontrada. O banco de dados está vazio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
