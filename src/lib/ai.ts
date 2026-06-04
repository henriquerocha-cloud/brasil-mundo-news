import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateContentSummary(content: string, title: string) {
  // Limpa tags HTML para o fallback
  const cleanContent = content.replace(/<[^>]*>?/gm, '').trim();

  if (!process.env.GEMINI_API_KEY) {
    return {
      summary: cleanContent.substring(0, 200) + '...',
      seoTitle: title,
      seoDescription: cleanContent.substring(0, 150) + '...',
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
      Você é um jornalista e editor experiente do portal Brasil & Mundo News. 
      Analise a seguinte notícia e forneça:
      1. Um resumo jornalístico envolvente (máximo 3 parágrafos) do texto.
      2. Um título otimizado para SEO (máximo 60 caracteres).
      3. Uma meta descrição para SEO (máximo 150 caracteres).
      4. A categoria ideal para esta notícia, escolhendo EXATAMENTE UMA destas opções (em minúsculas):
         [brasil, mundo, politica, economia, tecnologia, esportes, entretenimento]
      
      Retorne APENAS um objeto JSON válido (sem markdown), com as seguintes chaves:
      - "summary": (string, o resumo da notícia)
      - "seoTitle": (string, o título SEO)
      - "seoDescription": (string, a meta descrição)
      - "categorySlug": (string, o slug da categoria escolhida, ex: "economia")

      Título original: ${title}
      Conteúdo original:
      ${content.substring(0, 5000)}
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text().trim()
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '')
    
    const parsed = JSON.parse(jsonStr)
    return {
      summary: parsed.summary,
      seoTitle: parsed.seoTitle,
      seoDescription: parsed.seoDescription,
      categorySlug: parsed.categorySlug,
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    return {
      summary: cleanContent.substring(0, 300) + '...',
      seoTitle: title,
      seoDescription: cleanContent.substring(0, 150) + '...',
    }
  }
}
