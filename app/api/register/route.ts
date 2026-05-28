import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, company, pkg, interest } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Thiếu họ tên hoặc số điện thoại.' }, { status: 400 })
    }

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

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Register route error:', err)
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
