/**
 * Hooks base para query/mutation com envelope de API normalizado.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ApiMeta, ApiResponse, PaginatedResponse } from '@/types/api'
import { normalizeApiResponse } from '@/services/api-normalizer'

interface UseFetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>
  setData: (data: T | null) => void
}

export function useFetch<T>(
  fetchFn: () => Promise<ApiResponse<T>>,
  immediate = true
): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const rawResponse = await fetchFnRef.current()
      const response = normalizeApiResponse<T>(rawResponse as unknown)

      setState({
        data: response.data,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err : new Error('Erro desconhecido'),
      })
    }
  }, [])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [immediate, fetchData])

  return {
    ...state,
    refetch: fetchData,
    setData: (data: T | null) => setState((prev) => ({ ...prev, data })),
  }
}

interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | null>
  mutateAsync: (variables: V) => Promise<T | null>
  loading: boolean
  error: Error | null
  reset: () => void
}

export function useMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>
): UseMutationReturn<T, V> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
  }, [])

  const mutate = useCallback(async (variables: V): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      const rawResponse = await mutationFn(variables)
      const response = normalizeApiResponse<T>(rawResponse as unknown)
      setLoading(false)
      return response.data
    } catch (err) {
      const mutationError = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(mutationError)
      setLoading(false)
      return null
    }
  }, [mutationFn])

  const mutateAsync = useCallback(async (variables: V): Promise<T | null> => mutate(variables), [mutate])

  return {
    mutate,
    mutateAsync,
    loading,
    error,
    reset,
  }
}

interface UsePaginatedFetchReturn<T> extends UseFetchState<PaginatedResponse<T>> {
  meta: ApiMeta | null
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  refetch: () => Promise<void>
}

export function usePaginatedFetch<T>(
  fetchFn: (page: number, perPage: number) => Promise<ApiResponse<PaginatedResponse<T>>>,
  perPage = 10
): UsePaginatedFetchReturn<T> {
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<ApiMeta | null>(null)
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const fetchWithPagination = useCallback(async (): Promise<ApiResponse<PaginatedResponse<T>>> => {
    return fetchFnRef.current(page, perPage)
  }, [page, perPage])

  const { data, loading, error, refetch } = useFetch(fetchWithPagination, true)

  useEffect(() => {
    if (data?.meta) {
      setMeta(data.meta)
    }
  }, [data])

  const nextPage = useCallback(() => {
    if (meta && page < meta.totalPages) {
      setPage((prev) => prev + 1)
    }
  }, [meta, page])

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }, [page])

  const goToPage = useCallback((newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage)
    }
  }, [meta])

  return {
    data,
    meta,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  }
}
