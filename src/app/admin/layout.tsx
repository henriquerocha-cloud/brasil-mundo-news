import Link from 'next/link'
import { cookies } from 'next/headers'
import { LayoutDashboard, Rss, FileText, Settings, Users } from 'lucide-react'
import { AdminActions } from '@/components/admin/AdminActions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  const isAuthenticated = session?.value === 'authenticated'

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/50">
        <main className="flex-1 p-6 md:p-8 overflow-auto flex items-center justify-center">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/50">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex md:flex-col">
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground">Painel Admin</h2>
        </div>
        <nav className="space-y-1 px-4 flex-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/artigos" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <FileText className="w-5 h-5" />
            Notícias
          </Link>
          <Link href="/admin/fontes" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Rss className="w-5 h-5" />
            Fontes (RSS)
          </Link>
          <Link href="/admin/configuracoes" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            Configurações
          </Link>
          <Link href="/admin/usuarios" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Users className="w-5 h-5" />
            Usuários
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <AdminActions type="logout" />
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
