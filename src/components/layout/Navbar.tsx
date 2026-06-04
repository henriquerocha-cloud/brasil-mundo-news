'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, User, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { getCategoryColor } from '@/lib/categoryColors'
import { WeatherWidget } from '@/components/weather/WeatherWidget'
import { NotificationPopup } from '@/components/ui/NotificationPopup'

const categories = [
  { name: 'brasil', slug: 'brasil' },
  { name: 'mundo', slug: 'mundo' },
  { name: 'política', slug: 'politica' },
  { name: 'economia', slug: 'economia' },
  { name: 'tecnologia', slug: 'tecnologia' },
  { name: 'esportes', slug: 'esportes' },
  { name: 'entretenimento', slug: 'entretenimento' }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="w-full bg-white flex flex-col relative z-50">
      <NotificationPopup />
      
      {/* Nível 1: Topo Branco */}
      <div className="h-16 border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Esquerda: Menu */}
          <div className="flex items-center">
            <button 
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium text-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5 text-primary" />
              Menu
            </button>
          </div>

          {/* Centro: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-3xl font-black tracking-tighter text-primary">
                B&M<span className="text-blue-400">.com</span>
              </span>
            </Link>
          </div>

          {/* Direita: Conta e Busca */}
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hidden md:flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
              Conta B&M <User className="w-4 h-4 text-primary" />
            </Link>
            <button className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
              Busca <Search className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Nível 2: Categorias Coloridas */}
      <div className="h-12 border-b border-border bg-white hidden md:block">
        <div className="container mx-auto px-4 h-full">
          <nav className="flex h-full items-center justify-between px-8">
            {categories.map((category) => (
              <Link 
                key={category.slug} 
                href={`/categoria/${category.slug}`}
                className="text-[15px] font-black tracking-tight hover:opacity-80 transition-opacity"
                style={{ color: getCategoryColor(category.slug) }}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Nível 3: Weather Bar */}
      <div className="h-10 border-b border-border bg-white flex items-center relative">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <WeatherWidget />
        </div>
      </div>

      {/* Menu Overlay Sidebar */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-72 bg-white z-[101] shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <span className="text-2xl font-black tracking-tighter text-primary">
                B&M<span className="text-blue-400">.com</span>
              </span>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Menu className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="p-3 text-lg font-bold rounded hover:bg-muted transition-colors">Início</Link>
              {categories.map(cat => (
                <Link 
                  key={cat.slug} 
                  href={`/categoria/${cat.slug}`} 
                  onClick={() => setIsOpen(false)}
                  className="p-3 text-lg font-bold rounded hover:bg-muted transition-colors"
                  style={{ color: getCategoryColor(cat.slug) }}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
