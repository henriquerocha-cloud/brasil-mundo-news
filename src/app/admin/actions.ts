'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({
      where: { id }
    })
    revalidatePath('/')
    revalidatePath('/ultimas')
    revalidatePath('/admin/artigos')
    return { success: true }
  } catch (error) {
    console.error('Error deleting article:', error)
    return { success: false, error: 'Falha ao excluir notícia' }
  }
}

export async function addSource(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const url = formData.get('url') as string
    
    if (!name || !url) return { success: false, error: 'Nome e URL são obrigatórios' }
    
    await prisma.source.create({
      data: { name, url, type: 'RSS', isActive: true }
    })
    
    revalidatePath('/admin/fontes')
    return { success: true }
  } catch (error) {
    console.error('Error adding source:', error)
    return { success: false, error: 'Falha ao adicionar fonte (pode já existir)' }
  }
}

export async function deleteSource(id: string) {
  try {
    // Primeiro deletar todos os artigos dessa fonte para não dar erro de foreign key
    await prisma.article.deleteMany({
      where: { sourceId: id }
    })
    
    await prisma.source.delete({
      where: { id }
    })
    
    revalidatePath('/admin/fontes')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting source:', error)
    return { success: false, error: 'Falha ao excluir fonte' }
  }
}

export async function toggleSource(id: string, currentStatus: boolean) {
  try {
    await prisma.source.update({
      where: { id },
      data: { isActive: !currentStatus }
    })
    revalidatePath('/admin/fontes')
    return { success: true }
  } catch (error) {
    console.error('Error toggling source:', error)
    return { success: false, error: 'Falha ao alterar fonte' }
  }
}
