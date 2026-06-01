import { createHash } from 'crypto'

function sha256(value: string) {
  return createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '')
}

interface CAPIParams {
  eventName: string
  eventId: string
  eventSourceUrl: string
  clientIp?: string
  clientUserAgent?: string
  email?: string
  phone?: string
  value?: number
  currency?: string
}

export async function sendCAPIEvent(params: CAPIParams) {
  const pixelId = process.env.META_PIXEL_ID
  const token = process.env.META_CAPI_TOKEN
  if (!pixelId || !token) return

  const userData: Record<string, unknown> = {}
  if (params.email) userData.em = [sha256(params.email)]
  if (params.phone) userData.ph = [sha256(normalizePhone(params.phone))]
  if (params.clientIp) userData.client_ip_address = params.clientIp
  if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent

  const eventPayload: Record<string, unknown> = {
    event_name: params.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: 'website',
    event_source_url: params.eventSourceUrl,
    user_data: userData,
  }

  if (params.value !== undefined) {
    eventPayload.custom_data = {
      currency: params.currency ?? 'VND',
      value: params.value,
    }
  }

  const testCode = process.env.META_CAPI_TEST_CODE
  const body: Record<string, unknown> = { data: [eventPayload] }
  if (testCode) body.test_event_code = testCode

  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
  } catch (err) {
    console.error('CAPI send error:', err)
  }
}
