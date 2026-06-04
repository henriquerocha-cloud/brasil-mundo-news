'use client'

import { useState } from 'react'
import { Trash2, Power, PowerOff } from 'lucide-react'
import { deleteSource, toggleSource, addSource } from '@/app/admin/actions'

export function SourceActions({ sourceId, isActive }: { sourceId: string, isActive: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Excluir esta fonte também vai apagar TODAS as notícias importadas dela. Tem certeza?')) return
    setLoading(true)
    const res = await deleteSource(sourceId)
    if (!res.success) {
      alert(res.error)
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setLoading(true)
    const res = await toggleSource(sourceId, isActive)
    if (!res.success) {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={handleToggle}
        disabled={loading}
        className={`p-2 rounded-md transition-colors disabled:opacity-50 ${isActive ? 'text-green-500 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-secondary'}`}
        title={isActive ? 'Desativar Fonte' : 'Ativar Fonte'}
      >
        {isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
      </button>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
        title="Excluir Fonte"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

export function AddSourceForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await addSource(formData)
    
    if (res.success) {
      alert('Fonte adicionada com sucesso!')
      ;(e.target as HTMLFormElement).reset()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-xl shadow-sm mb-8 space-y-4">
      <h3 className="text-lg font-bold text-foreground">Adicionar Nova Fonte RSS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Nome da Fonte</label>
          <input 
            type="text" 
            name="name"
            required 
            placeholder="Ex: G1 Tecnologia" 
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">URL do RSS</label>
          <input 
            type="url" 
            name="url"
            required 
            placeholder="Ex: https://g1.globo.com/rss/g1/tecnologia/" 
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Adicionando...' : 'Adicionar Fonte'}
      </button>
    </form>
  )
}
