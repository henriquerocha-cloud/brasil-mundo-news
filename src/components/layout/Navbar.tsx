"use client"

import Link from 'next/link'
import { Menu, Search, Moon, Sun, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const categories = [
  { name: 'Brasil', slug: 'brasil' },
  { name: 'Mundo', slug: 'mundo' },
  { name: 'Política', slug: 'politica' },
  { name: 'Economia', slug: 'economia' },
  { name: 'Tecnologia', slug: 'tecnologia' },
  { name: 'Esportes', slug: 'esportes' },
  { name: 'Entretenimento', slug: 'entretenimento' }
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                B&M News
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  prefetch={true}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden sm:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center relative animate-in fade-in slide-in-from-right-4 duration-200">
                  <input
                    type="search"
                    placeholder="Buscar notícias..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-[200px] lg:w-[250px] rounded-full border border-border bg-secondary pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-foreground/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Link
              href="#newsletter"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 shrink-0 transition-transform active:scale-95"
            >
              Assinar Newsletter
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-1">
            <form onSubmit={handleSearch} className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm focus:outline-none focus:border-primary"
              />
            </form>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                prefetch={true}
                className="text-foreground/80 hover:text-primary py-2 px-3 rounded-md hover:bg-secondary font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="#newsletter"
              onClick={() => setIsOpen(false)}
              className="text-primary font-bold py-2 px-3 mt-2 rounded-md hover:bg-primary/10 transition-colors"
            >
              Assinar Newsletter
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
