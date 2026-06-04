'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw } from 'lucide-react'

import Link from 'next/link'

export function AdminActions({ type }: { type: 'logout' | 'quick_actions' }) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/cron?key=github_actions_sync_secret')
      if (!res.ok) throw new Error('Falha na autorização')
      alert('Sincronização iniciada com sucesso!')
      router.refresh()
    } catch (error) {
      alert('Erro ao sincronizar. Verifique a chave de segurança.')
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
      <Link href="/admin/fontes" className="block w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
        + Adicionar Nova Fonte RSS
      </Link>
      <Link href="/admin/artigos" className="block w-full text-left px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-foreground">
        + Ver e Editar Notícias
      </Link>
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
