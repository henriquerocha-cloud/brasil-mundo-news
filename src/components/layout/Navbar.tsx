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
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/70 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-20'}`}>
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl md:text-3xl font-black font-serif tracking-tight text-foreground">
                B&M<span className="text-primary">.</span>
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8 ml-8">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  prefetch={true}
                  className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {cat.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Search Bar */}
            <div className="hidden sm:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center relative animate-in fade-in slide-in-from-right-4 duration-200">
                  <input
                    type="search"
                    placeholder="Buscar..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-[200px] rounded-full border-none bg-secondary/50 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-foreground/80 hover:text-primary transition-colors p-2"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground/80 hover:text-primary transition-colors p-2"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Link
              href="#newsletter"
              className="hidden sm:inline-flex items-center justify-center rounded-full text-xs uppercase tracking-wider font-bold border border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white h-9 px-6 transition-all duration-300"
            >
              Assinar
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md absolute w-full animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-6 space-y-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 rounded-lg border-none bg-secondary/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </form>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                prefetch={true}
                className="text-foreground/80 hover:text-primary text-lg font-bold transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
