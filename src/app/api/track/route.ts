import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, referer, userAgent } = body

    // Tentar pegar o IP real
    let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    // x-forwarded-for pode conter múltiplos IPs
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim()
    }

    // Criar um hash do IP para privacidade (GDPR/LGPD)
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    // Salvar no banco
    await prisma.pageVisit.create({
      data: {
        ipHash,
        path: path || '/',
        referer: referer || '',
        userAgent: userAgent || ''
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
