import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

async function test(modelName: string) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent('Diga oi')
    console.log(`${modelName} WORKS! ->`, result.response.text())
    return true
  } catch (e: any) {
    console.log(`${modelName} FAILED:`, e.message)
    return false
  }
}

async function main() {
  await test('gemini-1.5-flash')
  await test('gemini-1.5-flash-latest')
  await test('gemini-pro')
}
main()
