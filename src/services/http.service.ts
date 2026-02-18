/**
 * Servico HTTP base para requisicoes a API
 * Centraliza auth, parse de payload e normalizacao de resposta/erro.
 */

import { API_CONFIG, API_ENDPOINTS } from './api.config'
import { normalizeApiError, normalizeApiResponse } from './api-normalizer'
import type { ApiResponse } from '@/types/api'

const isDemoMode = () => API_CONFIG.isDemo

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

const getHeadersSync = (customHeaders?: Record<string, string>): Record<string, string> => {
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    ...(customHeaders || {}),
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

interface RequestOptions extends RequestInit {
  parseAs?: 'json' | 'blob' | 'text' | 'raw'
}

const isSerializableObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !(value instanceof FormData) &&
  !(value instanceof URLSearchParams) &&
  !(value instanceof Blob) &&
  !(value instanceof ArrayBuffer)

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  if (isDemoMode() && !endpoint.startsWith('/api/demo')) {
    throw new Error('Modo demo: use dados mockados')
  }

  const url = `${API_CONFIG.baseURL}${endpoint}`
  const { parseAs = 'json', ...fetchOptions } = options

  let body = fetchOptions.body
  const headers = getHeadersSync(fetchOptions.headers as Record<string, string> | undefined)

  if (isSerializableObject(body)) {
    body = JSON.stringify(body)
  }

  if (body instanceof FormData) {
    delete headers['Content-Type']
  } else if (body instanceof URLSearchParams) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    body = body.toString()
  }

  const config: RequestInit = {
    ...fetchOptions,
    body,
    headers,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw await normalizeApiError(response)
    }

    if (parseAs === 'raw') {
      return normalizeApiResponse<T>(response)
    }

    if (parseAs === 'blob') {
      return normalizeApiResponse<T>(await response.blob())
    }

    if (parseAs === 'text') {
      return normalizeApiResponse<T>(await response.text())
    }

    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text()

    return normalizeApiResponse<T>(payload)
  } catch (error) {
    console.error('[API Request Failed]', endpoint, error)
    throw error
  }
}

export const http = {
  get: <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body as BodyInit,
    }),

  put: <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body as BodyInit,
    }),

  patch: <T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>> =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body as BodyInit,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

export { API_CONFIG, API_ENDPOINTS }

export const buildQueryString = (params: Record<string, unknown>): string => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return query ? `?${query}` : ''
}
