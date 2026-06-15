// Supabase Edge Function — Prokerala Panchang proxy with DB caching
//
// Flow per request:
//   1. Check panchangam_cache in Supabase DB for this date
//   2a. Cache hit  → return cached JSON (0 Prokerala credits consumed)
//   2b. Cache miss → call Prokerala, store result in DB, return result
//
// Manual overrides set by the admin panel are stored with is_manual_override=true
// and are returned like any other cache hit — the Edge Function never overwrites them.
//
// Deploy:  supabase functions deploy panchangam
// Secrets: supabase secrets set PROKERALA_CLIENT_ID=xxx PROKERALA_CLIENT_SECRET=xxx
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase)

import { serve }        from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TOKEN_URL         = 'https://api.prokerala.com/token'
const PANCHANG_URL      = 'https://api.prokerala.com/v2/astrology/panchang'
const INAUSPICIOUS_URL  = 'https://api.prokerala.com/v2/astrology/inauspicious-period'
const AUSPICIOUS_URL    = 'https://api.prokerala.com/v2/astrology/auspicious-period'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Token cache — persists within Deno isolate lifetime (~seconds to minutes)
let tokenCache: { value: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.value

  const clientId     = Deno.env.get('PROKERALA_CLIENT_ID')
  const clientSecret = Deno.env.get('PROKERALA_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    throw new Error('PROKERALA_CLIENT_ID / PROKERALA_CLIENT_SECRET not set in Supabase secrets')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  })
  if (!res.ok) throw new Error(`Token error ${res.status}: ${await res.text()}`)

  const json = await res.json()
  tokenCache = { value: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 }
  return tokenCache.value
}

// Format an ISO-8601 datetime string → "H:MM AM/PM" in IST (UTC+5:30)
// Deno Edge Functions run in UTC — must manually apply the IST offset.
function fmt(iso: string): string {
  try {
    const utcMs = new Date(iso).getTime()
    const istMs = utcMs + (5 * 60 + 30) * 60 * 1000   // add +5:30
    const d = new Date(istMs)
    const h = d.getUTCHours(), m = d.getUTCMinutes()
    const ampm = h >= 12 ? 'PM' : 'AM'
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`
  } catch { return '' }
}

function fmtRange(s: string | undefined, e: string | undefined): string {
  return s && e ? `${fmt(s)} - ${fmt(e)}` : ''
}

function firstPeriod(v: unknown): { start: string; end: string } | null {
  if (!v) return null
  if (Array.isArray(v) && v.length > 0) return v[0]
  if (typeof v === 'object' && v !== null && 'start' in (v as object)) return v as { start: string; end: string }
  return null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // ── Parse request ──────────────────────────────────────────────────────────
    let date: string, lat: string, lng: string
    if (req.method === 'POST') {
      const b = await req.json()
      date = b.date ?? new Date().toISOString().split('T')[0]
      lat  = String(b.lat  ?? '16.5062')
      lng  = String(b.lng  ?? '80.6480')
    } else {
      const u = new URL(req.url)
      date = u.searchParams.get('date') ?? new Date().toISOString().split('T')[0]
      lat  = u.searchParams.get('lat')  ?? '16.5062'
      lng  = u.searchParams.get('lng')  ?? '80.6480'
    }

    // ── Step 1: Check DB cache ─────────────────────────────────────────────────
    const supabaseUrl     = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const db = createClient(supabaseUrl, serviceRoleKey)

    const { data: cached } = await db
      .from('panchangam_cache')
      .select('data, is_manual_override')
      .eq('date', date)
      .maybeSingle()

    if (cached?.data) {
      // Cache hit — return immediately (no Prokerala call, no credits used)
      return new Response(JSON.stringify(cached.data), {
        headers: { ...CORS, 'Content-Type': 'application/json', 'X-Cache': cached.is_manual_override ? 'MANUAL' : 'HIT' },
      })
    }

    // ── Step 2: Cache miss — call Prokerala (3 endpoints in parallel) ─────────
    const token = await getToken()

    const baseParams = new URLSearchParams({
      ayanamsa:    '1',
      coordinates: `${lat},${lng}`,
      datetime:    `${date}T00:00:00+05:30`,
      timezone:    'Asia/Kolkata',
      la:          'en',
    })
    const advancedParams = new URLSearchParams({ ...Object.fromEntries(baseParams), result_type: 'advanced' })

    const authHeader = { Authorization: `Bearer ${token}` }

    const [panchangRes, inauspiciousRes, auspiciousRes] = await Promise.all([
      fetch(`${PANCHANG_URL}?${advancedParams}`,     { headers: authHeader }),
      fetch(`${INAUSPICIOUS_URL}?${baseParams}`,     { headers: authHeader }),
      fetch(`${AUSPICIOUS_URL}?${baseParams}`,       { headers: authHeader }),
    ])

    if (!panchangRes.ok) throw new Error(`Prokerala panchang ${panchangRes.status}: ${await panchangRes.text()}`)

    const d   = ((await panchangRes.json()).data    ?? {}) as Record<string, unknown>
    const ina = inauspiciousRes.ok ? ((await inauspiciousRes.json()).data ?? {}) as Record<string, unknown> : {}
    const aus = auspiciousRes.ok  ? ((await auspiciousRes.json()).data  ?? {}) as Record<string, unknown> : {}

    // ── Pancha Anga arrays ─────────────────────────────────────────────────────
    const tithis  = Array.isArray(d.tithi)    ? d.tithi    : [d.tithi].filter(Boolean)
    const naks    = Array.isArray(d.nakshatra) ? d.nakshatra: [d.nakshatra].filter(Boolean)
    const yogas   = Array.isArray(d.yoga)     ? d.yoga     : [d.yoga].filter(Boolean)
    const karanas = Array.isArray(d.karana)   ? d.karana   : [d.karana].filter(Boolean)

    const [t0, t1] = tithis as Array<Record<string,unknown>>
    const [n0, n1] = naks   as Array<Record<string,unknown>>
    const [y0, y1] = yogas  as Array<Record<string,unknown>>
    const [k0, k1] = karanas as Array<Record<string,unknown>>

    // Prokerala returns periods as a muhurat[] array — find each item by name
    type MuhuratItem = { name: string; period: Array<{start: string; end: string}> }
    const inaList = (ina.muhurat ?? []) as MuhuratItem[]
    const ausList = (aus.muhurat ?? []) as MuhuratItem[]

    const findPeriod = (list: MuhuratItem[], ...names: string[]) => {
      for (const n of names) {
        const item = list.find(m => m.name.toLowerCase() === n.toLowerCase())
        if (item?.period?.length) return item.period
      }
      return []
    }

    const rahuSlots   = findPeriod(inaList, 'Rahu', 'Rahu Kaal', 'Rahu Kalam')
    const yamaSlots   = findPeriod(inaList, 'Yamaganda', 'Yama Ganda', 'Yamaganda Kaal')
    const gulikaSlots = findPeriod(inaList, 'Gulika', 'Gulika Kaal')
    const durSlots    = findPeriod(inaList, 'Dur Muhurat', 'Dur Muhurta')
    const varjyamSlots= findPeriod(inaList, 'Varjyam')
    const amritSlots  = findPeriod(ausList,  'Amrit Kaal', 'Amrit Kalam')

    const result = {
      sunrise: d.sunrise ? fmt(d.sunrise as string) : '',
      sunset:  d.sunset  ? fmt(d.sunset  as string) : '',
      tithiName:           ((t0?.name ?? '') as string),
      tithiId:             ((t0?.id   ?? 0)  as number),
      tithiEnd:            t0?.end ? fmt(t0.end as string) : '',
      tithiNextName:       ((t1?.name ?? '') as string),
      tithiNextId:         ((t1?.id   ?? 0)  as number),
      pakshaName:          ((t0?.paksha as Record<string,unknown>)?.name ?? '') as string,
      tithiNextPakshaName: ((t1?.paksha as Record<string,unknown>)?.name ?? '') as string,
      nakshatramName:      ((n0?.name ?? '') as string),
      nakshatramId:        ((n0?.id   ?? 0)  as number),
      nakshatramEnd:       n0?.end ? fmt(n0.end as string) : '',
      nakshatramNextName:  ((n1?.name ?? '') as string),
      nakshatramNextId:    ((n1?.id   ?? 0)  as number),
      yogamName:           ((y0?.name ?? '') as string),
      yogamId:             ((y0?.id   ?? 0)  as number),
      yogamEnd:            y0?.end ? fmt(y0.end as string) : '',
      yogamNextName:       ((y1?.name ?? '') as string),
      yogamNextId:         ((y1?.id   ?? 0)  as number),
      karanamName:         ((k0?.name ?? '') as string),
      karanamId:           ((k0?.id   ?? 0)  as number),
      karanamEnd:          k0?.end ? fmt(k0.end as string) : '',
      karanamNextName:     ((k1?.name ?? '') as string),
      karanamNextId:       ((k1?.id   ?? 0)  as number),
      rahuKalam:    rahuSlots.length   > 0 ? fmtRange(rahuSlots[0].start,    rahuSlots[0].end)    : '',
      yamagandam:   yamaSlots.length   > 0 ? fmtRange(yamaSlots[0].start,    yamaSlots[0].end)    : '',
      gulikaKalam:  gulikaSlots.length > 0 ? fmtRange(gulikaSlots[0].start,  gulikaSlots[0].end)  : '',
      durmuhurtham: durSlots.map(s => fmtRange(s.start, s.end)).filter(Boolean).join('\n'),
      varjyam:      varjyamSlots.length > 0 ? fmtRange(varjyamSlots[0].start, varjyamSlots[0].end) : '',
      amritakalam:  amritSlots.length  > 0 ? fmtRange(amritSlots[0].start,  amritSlots[0].end)  : '',
    }

    // ── Step 3: Write to cache (ignore conflict — another request may have beaten us) ──
    await db.from('panchangam_cache').insert({
      date,
      data: result,
      is_manual_override: false,
      cached_at: new Date().toISOString(),
    }).then(({ error }) => {
      if (error && error.code !== '23505') {
        console.warn('[panchangam-fn] Cache write error:', error.message)
      }
    })

    return new Response(JSON.stringify(result), {
      headers: { ...CORS, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    })
  } catch (err) {
    console.error('[panchangam-fn]', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
