import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, Share2, Link as LinkIcon } from 'lucide-react'
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Try to find the article in DB
  const article = await prisma.article.findUnique({
    where: { slug: slug },
    include: { category: true }
  })

  if (!article) {
    return { title: 'Notícia não encontrada | Brasil & Mundo News' }
  }

  return {
    title: `${article.seoTitle || article.title} | Brasil & Mundo News`,
    description: article.seoDescription || article.summary,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  }
}

const MOCK_ARTICLE = {
  title: "Avanços na Inteligência Artificial prometem revolucionar a medicina diagnóstica",
  seoTitle: "Avanços na IA revolucionam medicina diagnóstica",
  slug: "avancos-ia-medicina",
  summary: "Pesquisadores desenvolvem novo modelo de IA capaz de detectar doenças em estágios iniciais com precisão superior a 95%, reduzindo drasticamente o tempo de diagnóstico.",
  content: "<p>Em um estudo publicado recentemente, cientistas detalharam como a nova rede neural foi treinada utilizando mais de 2 milhões de exames de imagem. O resultado é um sistema que não apenas identifica anomalias, mas também sugere possíveis patologias com um nível de precisão que rivaliza com o de especialistas experientes.</p><p>Especialistas da área de saúde apontam que a tecnologia não visa substituir os médicos, mas atuar como uma poderosa ferramenta de apoio à decisão, permitindo que os profissionais foquem no tratamento humanizado dos pacientes.</p><p>As próximas fases do projeto incluem testes clínicos em larga escala em diversos hospitais ao redor do mundo. A expectativa é que, se aprovada, a IA possa ser integrada aos sistemas de saúde pública em até três anos, democratizando o acesso a diagnósticos de alta qualidade.</p>",
  imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  category: { name: "Saúde", slug: "saude" },
  publishedAt: new Date(),
  originalUrl: "https://example.com/noticia-original",
  source: { name: "Agência Científica" }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let article = await prisma.article.findUnique({
    where: { slug: slug },
    include: { category: true, source: true }
  })

  // Se não achar no DB mas for a URL de teste, usa o mock
  if (!article && params.slug === MOCK_ARTICLE.slug) {
    article = MOCK_ARTICLE as any
  }

  if (!article) {
    notFound()
  }

  // Notícias relacionadas (pega da mesma categoria ou recentes)
  const related = await prisma.article.findMany({
    where: { 
      isPublished: true, 
      id: { not: article.id },
      ...(article.categoryId ? { categoryId: article.categoryId } : {})
    },
    take: 3,
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Top AdSense */}
      <div className="w-full h-[90px] bg-muted border border-border flex items-center justify-center rounded-lg mb-8 max-w-5xl mx-auto text-muted-foreground text-sm">
        Anúncio (728x90)
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3">
          {/* Header da Notícia */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link href={`/categoria/${article.category?.slug}`} className="text-primary font-bold uppercase tracking-wider text-sm hover:underline">
                {article.category?.name || 'Geral'}
              </Link>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="w-4 h-4 mr-1.5" />
                {format(new Date(article.publishedAt), "d 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-foreground mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-6">
              {article.summary}
            </p>

            <div className="flex items-center justify-between py-4 border-y border-border">
              <div className="text-sm font-medium">
                Fonte: <a href={article.originalUrl} target="_blank" rel="noopener nofollow" className="text-primary hover:underline">{article.source?.name || 'Externa'}</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">Compartilhar:</span>
                <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors text-foreground"><FaFacebook className="w-4 h-4" /></button>
                <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors text-foreground"><FaTwitter className="w-4 h-4" /></button>
                <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors text-foreground"><FaLinkedin className="w-4 h-4" /></button>
                <button className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-white transition-colors text-foreground"><LinkIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </header>

          {/* Imagem Principal */}
          {article.imageUrl && (
            <figure className="mb-10 rounded-2xl overflow-hidden shadow-sm border border-border">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </figure>
          )}

          {/* AdSense In-Article */}
          <div className="w-full h-[100px] bg-muted border border-border flex items-center justify-center rounded-lg mb-8 text-muted-foreground text-sm">
            Anúncio no Meio do Artigo
          </div>

          {/* Conteúdo */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-10" dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.summary}</p>` }} />

          {/* Link para fonte original */}
          <div className="bg-secondary p-6 rounded-xl border border-border mb-12 flex items-center justify-between">
            <div>
              <h4 className="font-bold mb-1 text-foreground">Leia a matéria completa</h4>
              <p className="text-sm text-muted-foreground">Esta é uma versão resumida. O conteúdo integral encontra-se na fonte original.</p>
            </div>
            <a 
              href={article.originalUrl} 
              target="_blank" 
              rel="noopener nofollow"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shrink-0"
            >
              Ir para Fonte Origem
            </a>
          </div>
        </article>

        {/* Sidebar Direita */}
        <aside className="lg:w-1/3 space-y-8">
          {/* AdSense Sidebar */}
          <div className="w-full h-[250px] bg-muted border border-border flex items-center justify-center rounded-lg text-muted-foreground text-sm font-medium mx-auto max-w-[300px]">
            Anúncio Sidebar (300x250)
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">
              Leia Também
            </h3>
            <div className="space-y-6">
              {related.map((rel: any) => (
                <Link key={rel.slug} href={`/noticia/${rel.slug}`} className="group block">
                  <div className="flex gap-4">
                    {rel.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-border">
                        <img 
                          src={rel.imageUrl} 
                          alt={rel.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-3 leading-snug mb-2">
                        {rel.title}
                      </h4>
                      <div className="flex items-center text-muted-foreground text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(rel.publishedAt), "dd/MM/yyyy")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Fallback caso não tenha relacionadas */}
              {related.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Nenhuma notícia relacionada no momento.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
      
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.seoTitle || article.title,
            "image": article.imageUrl ? [article.imageUrl] : [],
            "datePublished": article.publishedAt.toISOString(),
            "dateModified": article.updatedAt ? article.updatedAt.toISOString() : article.publishedAt.toISOString(),
            "author": [{
              "@type": "Organization",
              "name": article.source?.name || "Brasil & Mundo News",
              "url": article.originalUrl
            }]
          })
        }}
      />
    </div>
  )
}

