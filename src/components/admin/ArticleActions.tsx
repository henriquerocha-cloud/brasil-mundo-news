'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteArticle } from '@/app/admin/actions'

export function ArticleActions({ articleId }: { articleId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita.')) return
    
    setIsDeleting(true)
    const res = await deleteArticle(articleId)
    if (!res.success) {
      alert(res.error)
      setIsDeleting(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
      title="Excluir"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
