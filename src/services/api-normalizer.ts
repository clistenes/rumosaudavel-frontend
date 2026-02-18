import type { ApiDomainError, ApiError, ApiMeta, ApiResponse } from '@/types/api'

type UnknownRecord = Record<string, unknown>

const isObject = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeMeta = (meta: unknown): ApiMeta | undefined => {
  if (!isObject(meta)) return undefined

  const page =
    Number(meta.page ?? meta.current_page ?? 1) || 1
  const perPage =
    Number(meta.perPage ?? meta.per_page ?? 10) || 10
  const total =
    Number(meta.total ?? 0) || 0
  const totalPages =
    Number(meta.totalPages ?? meta.last_page ?? Math.ceil(total / Math.max(perPage, 1))) || 1

  return { page, perPage, total, totalPages }
}

const normalizeErrors = (errors: unknown): ApiError[] | undefined => {
  if (!errors) return undefined

  if (Array.isArray(errors)) {
    return errors
      .filter((error) => isObject(error))
      .map((error) => ({
        field: String(error.field ?? ''),
        message: String(error.message ?? 'Erro de validação'),
        code: String(error.code ?? 'validation_error'),
      }))
  }

  if (isObject(errors)) {
    return Object.entries(errors).flatMap(([field, messages]) => {
      if (!Array.isArray(messages)) {
        return [{
          field,
          message: String(messages ?? 'Erro de validação'),
          code: 'validation_error',
        }]
      }

      return messages.map((message) => ({
        field,
        message: String(message),
        code: 'validation_error',
      }))
    })
  }

  return undefined
}

export const normalizeApiResponse = <T>(raw: unknown): ApiResponse<T> => {
  if (isObject(raw) && typeof raw.success === 'boolean') {
    return {
      success: raw.success,
      data: (raw.data ?? null) as T,
      message: typeof raw.message === 'string' ? raw.message : undefined,
      errors: normalizeErrors(raw.errors),
      meta: normalizeMeta(raw.meta),
    }
  }

  if (isObject(raw) && 'data' in raw) {
    return {
      success: true,
      data: raw.data as T,
      message: typeof raw.message === 'string' ? raw.message : undefined,
      errors: normalizeErrors(raw.errors),
      meta: normalizeMeta(raw.meta),
    }
  }

  return {
    success: true,
    data: raw as T,
  }
}

export const normalizeApiError = async (
  response: Response
): Promise<ApiDomainError> => {
  let body: unknown = null

  try {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      body = await response.json()
    } else {
      body = await response.text()
    }
  } catch {
    body = null
  }

  const normalized = normalizeApiResponse<unknown>(body)
  const error = new Error(
    normalized.message || `Erro ${response.status}: ${response.statusText}`
  ) as ApiDomainError

  error.status = response.status
  error.message = normalized.message || error.message
  error.fieldErrors = normalized.errors
  error.raw = body

  return error
}
