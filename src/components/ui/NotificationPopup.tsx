'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

export function NotificationPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Checa se o usuário já dispensou ou aceitou as notificações
    const hasSeenPopup = localStorage.getItem('bm_notifications_seen')
    
    // Se não viu, mostra o popup após 3 segundos
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('bm_notifications_seen', 'true')
  }

  const handleActivate = async () => {
    setIsVisible(false)
    localStorage.setItem('bm_notifications_seen', 'true')
    
    // Simula o pedido real de notificação do navegador
    if ('Notification' in window) {
      try {
        await Notification.requestPermission()
      } catch (e) {
        console.error(e)
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className="absolute top-[115px] left-4 md:left-8 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-100 p-6 w-[360px] md:w-[420px] relative">
        {/* Setinha apontando para cima (Opcional para dar cara de balao) */}
        <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
        
        <p className="text-[15px] text-gray-700 leading-snug mb-5 relative z-10">
          Que tal ficar por dentro das notícias mais importantes em tempo real? <strong>Ative as notificações da B&M News!</strong>
        </p>
        
        <div className="flex items-center justify-end gap-3 relative z-10">
          <button 
            onClick={handleDismiss}
            className="px-4 py-2 text-sm font-bold text-primary bg-white border border-gray-200 hover:bg-gray-50 rounded transition-colors"
          >
            Agora não
          </button>
          <button 
            onClick={handleActivate}
            className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded transition-colors"
          >
            <Bell className="w-4 h-4 fill-white" />
            Ativar
          </button>
        </div>
      </div>
    </div>
  )
}
