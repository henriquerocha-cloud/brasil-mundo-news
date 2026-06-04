"use client"

import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              B&M News
            </h3>
            <p className="text-sm text-muted-foreground">
              Sua fonte confiável de notícias do Brasil e do mundo. Atualizado 24 horas por dia, 7 dias por semana.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaTwitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaYoutube className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Editorias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/categoria/brasil" className="hover:text-primary transition-colors">Brasil</Link></li>
              <li><Link href="/categoria/mundo" className="hover:text-primary transition-colors">Mundo</Link></li>
              <li><Link href="/categoria/economia" className="hover:text-primary transition-colors">Economia</Link></li>
              <li><Link href="/categoria/politica" className="hover:text-primary transition-colors">Política</Link></li>
              <li><Link href="/categoria/tecnologia" className="hover:text-primary transition-colors">Tecnologia</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Institucional</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Painel Admin</Link></li>
            </ul>
          </div>

          <div id="newsletter" className="scroll-mt-24">
            <h4 className="font-semibold mb-4 text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receba as principais notícias do dia no seu e-mail.
            </p>
            <form 
              className="flex gap-2" 
              onSubmit={(e) => {
                e.preventDefault()
                alert('Obrigado por se inscrever! Você receberá nossas notícias em breve.')
              }}
            >
              <input 
                type="email" 
                required
                placeholder="Seu e-mail" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Brasil & Mundo News. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
