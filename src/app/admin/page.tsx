import { prisma } from '@/lib/prisma'
import { FileText, Rss, Eye, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
  const articlesCount = await prisma.article.count()
  const sourcesCount = await prisma.source.count()
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visão geral do sistema do portal Brasil & Mundo News.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total de Notícias</p>
            <h3 className="text-2xl font-bold text-foreground">{articlesCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
            <Rss className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Fontes Ativas</p>
            <h3 className="text-2xl font-bold text-foreground">{sourcesCount}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Visitas Mensais</p>
            <h3 className="text-2xl font-bold text-foreground">1.2M</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Notícias Hoje</p>
            <h3 className="text-2xl font-bold text-foreground">24</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Ações Rápidas</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
              + Adicionar Nova Fonte RSS
            </button>
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
              + Escrever Artigo Manual
            </button>
            <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground flex items-center justify-between">
              <span>Sincronizar RSS Agora</span>
              <span className="text-xs text-muted-foreground">Via API Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
