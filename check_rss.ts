import Parser from 'rss-parser'

const parser = new Parser()

async function test() {
  const feed = await parser.parseURL('https://news.google.com/rss/search?q=Esportes&hl=pt-BR&gl=BR&ceid=BR:pt-419')
  for (let i = 0; i < 3; i++) {
    const item = feed.items[i]
    console.log(item.content)
  }
}

test()
