import Link from 'next/link'
import { LayoutDashboard, Rss, FileText, Settings, Users, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/50">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-card border-r border-border hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold text-foreground">Painel Admin</h2>
        </div>
        <nav className="space-y-1 px-4">
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
        <div className="absolute bottom-0 w-64 p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
