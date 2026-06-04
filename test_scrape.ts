import { fetchAndProcessRss } from './src/lib/rss'

async function test() {
  // Let's create a standalone function to test scraping
  const cheerio = require('cheerio')
  const url = 'https://news.google.com/rss/articles/CBMiJWh0dHBzOi8vZzEuZ2xvYm8uY29tL3BvbGl0aWNhL25vdGljaWEvMjAyNC8wNS8wMi90c2UtZGVjaWRlLXNlLWNhc3NhLW1vcm8tcG9yLWFidXNvLWRlLXBvZGVyLWVjb25vbWljby1uYS1lbGVpY2FvLWRlLTIwMjIuZ2h0bWzSAQA?oc=5'
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const html = await res.text()
    
    const urlMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>/i) || html.match(/URL='?([^'">]+)'?/i)
    let realUrl = url
    if (urlMatch && urlMatch[1] && urlMatch[1].startsWith('http')) {
      realUrl = urlMatch[1]
    }
    
    console.log('Real URL:', realUrl)
    
    const realRes = await fetch(realUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const realHtml = await realRes.text()
    const $ = cheerio.load(realHtml)
    const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content')
    
    console.log('Image:', ogImage)
  } catch (e) {
    console.error(e)
  }
}

test()
