"use client"

import Link from 'next/link'
import { Menu, Search, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const categories = [
  'Brasil', 'Mundo', 'Política', 'Economia', 
  'Tecnologia', 'Esportes', 'Entretenimento'
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

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
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                B&M News
              </span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categoria/${cat.toLowerCase()}`}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-foreground/80 hover:text-primary transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Assinar Newsletter
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/categoria/${cat.toLowerCase()}`}
                className="text-foreground/80 hover:text-primary py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
