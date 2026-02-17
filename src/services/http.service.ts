/**
 * Serviço HTTP base para requisições à API
 * 
 * Este serviço centraliza todas as chamadas HTTP, adicionando:
 * - Headers padrão (incluindo token de autenticação)
 * - Tratamento de erros
 * - Logs em ambiente de desenvolvimento
 * - Suporte ao modo demo
 */

import { API_CONFIG, API_ENDPOINTS } from './api.config'
import type { ApiResponse, ApiError } from '@/types/api'

// Verifica se estamos no modo demo
const isDemoMode = () => API_CONFIG.isDemo

// Recupera o token do localStorage ou session
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// Configura os headers da requisição de forma síncrona (para compatibilidade)
const getHeadersSync = (customHeaders?: Record<string, string>): Record<string, string> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    ...customHeaders,
  }

  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

// Trata erros da API
const handleError = async (response: Response): Promise<never> => {
  let errorMessage = 'Erro na requisição'
  let errors: ApiError[] = []

  try {
    const data = await response.json()
    errorMessage = data.message || errorMessage
    errors = data.errors || []
  } catch {
    errorMessage = `Erro ${response.status}: ${response.statusText}`
  }

  const error = new Error(errorMessage) as Error & { status: number; errors: ApiError[] }
  error.status = response.status
  error.errors = errors
  
  console.error('[API Error]', error)
  throw error
}

// Função base para requisições HTTP
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Se estiver em modo demo, retorna erro simulado ou usa dados mock
  if (isDemoMode() && !endpoint.startsWith('/api/demo')) {
    console.log('[DEMO MODE] Requisição simulada:', endpoint)
    // Em modo demo, não fazemos requisições reais
    // Os dados são mockados nos hooks/serviços específicos
    throw new Error('Modo demo: Use os dados mockados')
  }

  const url = `${API_CONFIG.baseURL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: getHeadersSync(options.headers as Record<string, string>),
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      await handleError(response)
    }

    const data: ApiResponse<T> = await response.json()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Success]', endpoint, data)
    }

    return data
  } catch (error) {
    console.error('[API Request Failed]', error)
    throw error
  }
}

// Métodos HTTP
export const http = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

// Exporta também os endpoints e configurações
export { API_CONFIG, API_ENDPOINTS }

// Helper para construir query strings
export const buildQueryString = (params: Record<string, unknown>): string => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
  
  return query ? `?${query}` : ''
}
