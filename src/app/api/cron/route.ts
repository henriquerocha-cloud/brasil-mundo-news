import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchAndProcessRss } from '@/lib/rss'

export async function GET(request: Request) {
  // Proteção da rota via query parameter
  const { searchParams } = new URL(request.url)
  const cronSecret = process.env.CRON_SECRET || 'github_actions_sync_secret'
  
  if (searchParams.get('key') !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
