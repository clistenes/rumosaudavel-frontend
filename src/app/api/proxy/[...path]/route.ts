import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { options } from '@/app/api/auth/[...nextauth]/options'

const JSON_CONTENT_TYPE = 'application/json'
const allowInsecureTls = process.env.NEXTAUTH_ALLOW_INSECURE_TLS === 'true'

const buildUpstreamUrl = (request: NextRequest) => {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/proxy/', '')
  const queryString = url.search
  return `${process.env.NEXT_PUBLIC_API_URL}/${path}${queryString}`
}

const buildHeaders = (request: NextRequest, token: string) => {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)

  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)

  const accept = request.headers.get('accept')
  if (accept) headers.set('Accept', accept)

  return headers
}

const parseBody = async (request: NextRequest): Promise<BodyInit | undefined> => {
  if (request.method === 'GET' || request.method === 'DELETE') return undefined

  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const payload = await request.json()
    return JSON.stringify(payload)
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return await request.text()
  }

  if (contentType.includes('multipart/form-data')) {
    const bytes = await request.arrayBuffer()
    return bytes
  }

  return await request.text()
}

const proxy = async (request: NextRequest) => {
  try {
    const session = await getServerSession(options)

    if (!session?.user?.token) {
      return NextResponse.json({ success: false, message: 'Não autenticado' }, { status: 401 })
    }

    const apiUrl = buildUpstreamUrl(request)
    const headers = buildHeaders(request, session.user.token)
    const body = await parseBody(request)

    const previousTlsEnv = process.env.NODE_TLS_REJECT_UNAUTHORIZED
    if (allowInsecureTls) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }

    let response: Response
    try {
      response = await fetch(apiUrl, {
        method: request.method,
        headers,
        body,
        cache: 'no-store',
      })
    } finally {
      if (allowInsecureTls) {
        if (previousTlsEnv === undefined) {
          delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
        } else {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTlsEnv
        }
      }
    }

    const contentType = response.headers.get('content-type') || ''

    if (!contentType.includes(JSON_CONTENT_TYPE)) {
      const blob = await response.blob()
      return new NextResponse(blob, {
        status: response.status,
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
        },
      })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[Proxy] erro', error)
    const message =
      error instanceof Error && /certificate|CERT_/i.test(error.message)
        ? 'Erro TLS no proxy (certificado da API). Defina NEXTAUTH_ALLOW_INSECURE_TLS=true no .env.local para desenvolvimento local.'
        : 'Erro interno no proxy'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return proxy(request)
}

export async function POST(request: NextRequest) {
  return proxy(request)
}

export async function PUT(request: NextRequest) {
  return proxy(request)
}

export async function PATCH(request: NextRequest) {
  return proxy(request)
}

export async function DELETE(request: NextRequest) {
  return proxy(request)
}
