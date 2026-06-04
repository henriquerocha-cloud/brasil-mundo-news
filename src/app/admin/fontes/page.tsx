import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SourceActions, AddSourceForm } from '@/components/admin/SourceActions'

export default async function FontesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { articles: true }
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fontes (RSS)</h1>
        <p className="text-muted-foreground mt-2">Gerencie de onde as notícias são importadas automaticamente.</p>
      </div>

      <AddSourceForm />

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">URL (RSS)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Artigos Capturados</th>
                <th className="px-6 py-4 font-medium">Última Sincronização</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {source.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate" title={source.url}>
                    {source.url}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${source.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {source.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {source._count.articles}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {source.lastFetch 
                      ? format(new Date(source.lastFetch), "dd MMM yyyy, HH:mm", { locale: ptBR })
                      : 'Nunca'
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SourceActions sourceId={source.id} isActive={source.isActive} />
                  </td>
                </tr>
              ))}
              {sources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma fonte cadastrada.
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
