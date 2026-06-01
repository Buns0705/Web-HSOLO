import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendCAPIEvent } from '@/lib/meta'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, pkg, interest, eventId } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu họ tên hoặc số điện thoại.' }, { status: 400 })
    }

    // 1. Save to Supabase
    const client = createServiceClient()
    if (client) {
      const { error } = await client.from('registrations').insert({
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        company: company ? String(company).trim() : null,
        package: pkg || 'Sign In – 100.000đ',
        interest: interest ? String(interest).trim() : null,
      })
      if (error) {
        console.error('Supabase insert error:', error)
        return NextResponse.json({ error: 'Lỗi lưu dữ liệu. Vui lòng thử lại.' }, { status: 500 })
      }
    }

    // 2. Fire server-side CAPI (parallel, non-blocking for response)
    const pkgValue = pkg?.includes('500') ? 500000 : 100000
    const sourceUrl = req.headers.get('referer') || req.headers.get('origin') || ''
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      undefined
    const clientUserAgent = req.headers.get('user-agent') || undefined

    void sendCAPIEvent({
      eventName: 'Lead',
      eventId: String(eventId || `reg_${Date.now()}`),
      eventSourceUrl: sourceUrl,
      clientIp,
      clientUserAgent,
      email: email ? String(email).trim() : undefined,
      phone: phone ? String(phone).trim() : undefined,
      value: pkgValue,
      currency: 'VND',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Register route error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
