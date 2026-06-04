import fs from 'fs'

async function test() {
  const url = 'https://news.google.com/rss/articles/CBMiJWh0dHBzOi8vZzEuZ2xvYm8uY29tL3BvbGl0aWNhL25vdGljaWEvMjAyNC8wNS8wMi90c2UtZGVjaWRlLXNlLWNhc3NhLW1vcm8tcG9yLWFidXNvLWRlLXBvZGVyLWVjb25vbWljby1uYS1lbGVpY2FvLWRlLTIwMjIuZ2h0bWzSAQA?oc=5'
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    })
    const html = await res.text()
    fs.writeFileSync('gnews.html', html)
    console.log('Saved to gnews.html')
  } catch (e) {
    console.error(e)
  }
}

test()
