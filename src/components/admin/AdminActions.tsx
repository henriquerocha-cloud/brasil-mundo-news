'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw } from 'lucide-react'

export function AdminActions({ type }: { type: 'logout' | 'quick_actions' }) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetch('/api/cron')
      alert('Sincronização iniciada com sucesso!')
      router.refresh()
    } catch (error) {
      alert('Erro ao sincronizar.')
    } finally {
      setSyncing(false)
    }
  }

  if (type === 'logout') {
    return (
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
        + Adicionar Nova Fonte RSS (Em breve)
      </button>
      <button className="w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
        + Escrever Artigo Manual (Em breve)
      </button>
      <button 
        onClick={handleSync}
        disabled={syncing}
        className="w-full text-left px-4 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center justify-between disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
          {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          {syncing ? 'Sincronizando...' : 'Sincronizar RSS Agora'}
        </span>
        <span className="text-xs opacity-75">Via API Route</span>
      </button>
    </div>
  )
}
