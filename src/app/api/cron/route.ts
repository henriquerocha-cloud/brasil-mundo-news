import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAndProcessRss } from '@/lib/rss'

export async function GET(request: Request) {
  // Opcional: Proteger a rota via query parameter (ex: ?key=SECRET)
  // const { searchParams } = new URL(request.url)
  // if (searchParams.get('key') !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  try {
    const sources = await prisma.source.findMany({
      where: { isActive: true },
    })

    const results = []
    for (const source of sources) {
      const result = await fetchAndProcessRss(source.id)
      results.push({ source: source.name, ...result })
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
