import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { options } from '@/app/api/auth/[...nextauth]/options'

export async function GET(request: NextRequest) {
  return handleProxy(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleProxy(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleProxy(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request, 'DELETE')
}

async function handleProxy(request: NextRequest, method: string) {
  try {
    // Pegar a sessão do servidor
    const session = await getServerSession(options)
    
    if (!session?.user?.token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Extrair o path da URL
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/proxy/', '')
    const queryString = url.search
    
    // Construir URL da API externa
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}${queryString}`
    
    console.log(`🔄 [Proxy] ${method} ${apiUrl}`)

    // Preparar headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${session.user.token}`,
      'Content-Type': 'application/json',
    }

    // Preparar body para métodos POST/PUT
    let body: string | undefined
    if (method === 'POST' || method === 'PUT') {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const jsonBody = await request.json()
        body = JSON.stringify(jsonBody)
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.text()
        body = formData
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
    }

    // Fazer requisição à API externa
    const response = await fetch(apiUrl, {
      method,
      headers,
      body,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ [Proxy] Erro da API:', data)
      return NextResponse.json(
        data,
        { status: response.status }
      )
    }

    console.log('✅ [Proxy] Sucesso:', data)
    return NextResponse.json(data)

  } catch (error) {
    console.error('❌ [Proxy] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno no proxy' },
      { status: 500 }
    )
  }
}
