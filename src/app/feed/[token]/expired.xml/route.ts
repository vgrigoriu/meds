import { NextResponse } from 'next/server'
import { db } from '@/db'
import { medications } from '@/db/schema'
import { isFeedTokenValid } from '@/db/settings'
import { and, eq, or, lt, sql } from 'drizzle-orm'

interface RouteParams {
  params: Promise<{ token: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { token } = await params

  if (!await isFeedTokenValid(token)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-12 for DB query

  // Get expired medications (not deleted)
  const expiredMeds = await db
    .select()
    .from(medications)
    .where(
      and(
        or(eq(medications.deleted, false), sql`${medications.deleted} IS NULL`),
        or(
          lt(medications.expirationYear, currentYear),
          and(
            eq(medications.expirationYear, currentYear),
            lt(medications.expirationMonth, currentMonth)
          )
        )
      )
    )
    .all()

  const baseUrl = new URL(request.url).origin
  const feedUrl = `${baseUrl}/feed/${token}/expired.xml`
  const updated = now.toISOString()

  const entries = expiredMeds.map((med) => {
    const expDate = new Date(med.expirationYear, med.expirationMonth - 1)
    const expDateStr = expDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })

    return `  <entry>
    <title>${escapeXml(med.name)} - expirat</title>
    <id>${feedUrl}/med/${med.id}</id>
    <updated>${expDate.toISOString()}</updated>
    <summary>${escapeXml(med.name)} a expirat în ${expDateStr}</summary>
  </entry>`
  }).join('\n')

  const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Medicamente expirate</title>
  <id>${feedUrl}</id>
  <updated>${updated}</updated>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
${entries}
</feed>`

  // First day of next month (JS handles year overflow: month 12 → Jan next year)
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const secondsUntilNextMonth = Math.floor((firstOfNextMonth.getTime() - now.getTime()) / 1000)

  return new NextResponse(atom, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': `public, max-age=${secondsUntilNextMonth}`,
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
