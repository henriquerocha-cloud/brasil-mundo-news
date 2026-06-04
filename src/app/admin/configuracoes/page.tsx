import { prisma } from '@/lib/prisma'
import { Save } from 'lucide-react'

export default async function ConfiguracoesPage() {
  const settings = await prisma.settings.findMany()

  // Converte a lista em um objeto para facilitar
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">Ajustes gerais do portal Brasil & Mundo News.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Geral</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nome do Site</label>
              <input 
                type="text" 
                defaultValue={settingsMap['site_name'] || 'Brasil & Mundo News'}
                className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary opacity-70"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">O nome principal exibido na barra superior.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Automação IA & RSS</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Frequência de Sincronização (CRON)</label>
              <select 
                className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary opacity-70"
                disabled
              >
                <option>A cada 15 minutos (Padrão Github Actions)</option>
                <option>A cada 30 minutos</option>
                <option>A cada hora</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Chave da API Gemini (IA)</label>
              <input 
                type="password" 
                defaultValue="*************************"
                className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary opacity-70"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Configurada via variáveis de ambiente da Vercel.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            disabled
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors opacity-50 cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}
