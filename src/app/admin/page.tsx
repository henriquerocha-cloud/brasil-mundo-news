import { prisma } from '@/lib/prisma'
import { FileText, Rss, Eye, TrendingUp, Users, LogOut } from 'lucide-react'
import { AdminActions } from '@/components/admin/AdminActions'

export default async function AdminDashboard() {
  const articlesCount = await prisma.article.count()
  const sourcesCount = await prisma.source.count()
  
  // Calcular visitantes online (últimos 5 minutos)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const onlineUsersGroups = await prisma.pageVisit.groupBy({
    by: ['ipHash'],
    where: {
      createdAt: {
        gte: fiveMinutesAgo
      }
    }
  })
  const onlineUsers = onlineUsersGroups.length

  // Visitas Únicas de hoje (por IP)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayVisitsGroup = await prisma.pageVisit.groupBy({
    by: ['ipHash'],
    where: {
      createdAt: {
        gte: today
      }
    }
  })
  const uniqueVisitsToday = todayVisitsGroup.length

  // Visitas Totais ou Mensais (Mocamos o mensal como o total do banco para simplificar agora)
  const totalVisits = await prisma.pageVisit.count()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Visão geral do sistema do portal Brasil & Mundo News.</p>
        </div>
        <AdminActions type="logout" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Usuários Online</p>
            <h3 className="text-2xl font-bold text-foreground">{onlineUsers}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Visitantes Únicos Hoje</p>
            <h3 className="text-2xl font-bold text-foreground">{uniqueVisitsToday}</h3>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Ações Rápidas</h3>
          </div>
          <AdminActions type="quick_actions" />
        </div>
      </div>
    </div>
  )
}
