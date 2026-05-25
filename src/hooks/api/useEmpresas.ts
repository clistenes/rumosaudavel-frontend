/**
 * Hooks específicos para Empresas
 */

import { useCallback } from 'react'
import { empresaService, type ListarEmpresasParams } from '@/services'
import { useFetch, useMutation, usePaginatedFetch } from './useFetch'
import type { UpdateEmpresaParams } from '@/types/empresa'

// Hook para listar empresas
export function useEmpresas(params: ListarEmpresasParams = {}) {
  const fetchFn = useCallback(() => empresaService.listar(params), [JSON.stringify(params)])
  return usePaginatedFetch(
    (page, perPage) => empresaService.listar({ ...params, page, perPage }),
    params.perPage || 10
  )
}

// Hook para buscar uma empresa específica
export function useEmpresa(id: number | null) {
  const fetchFn = useCallback(() => {
    if (!id) throw new Error('ID não fornecido')
    return empresaService.buscarPorId(id)
  }, [id])

  return useFetch(
    fetchFn,
    !!id // Só executa se tiver ID
  )
}

// Hook para obter dashboard da empresa
export function useEmpresaDashboard(empresaId: number | null) {
  const fetchFn = useCallback(() => {
    if (!empresaId) throw new Error('ID da empresa nao fornecido')
    return empresaService.dashboard(empresaId)
  }, [empresaId])

  return useFetch(fetchFn, !!empresaId)
}

// Hook para criar empresa
export function useCriarEmpresa() {
  return useMutation((data: Parameters<typeof empresaService.criar>[0]) =>
    empresaService.criar(data)
  )
}

// Hook para atualizar empresa
export function useAtualizarEmpresa() {
  return useMutation((params: UpdateEmpresaParams) =>
    empresaService.atualizar(params.id, params)
  )
}

// Hook para remover empresa
export function useRemoverEmpresa() {
  return useMutation((id: number) => empresaService.remover(id))
}

// Hook para listar participantes de uma empresa
export function useParticipantesEmpresa(empresaId: number | null, params: { search?: string } = {}) {
  const fetchFn = useCallback(() => {
    if (!empresaId) throw new Error('ID da empresa não fornecido')
    return empresaService.listarParticipantes(empresaId, params)
  }, [empresaId, JSON.stringify(params)])

  return usePaginatedFetch(
    (page, perPage) => {
      if (!empresaId) throw new Error('ID da empresa não fornecido')
      return empresaService.listarParticipantes(empresaId, { ...params, page, perPage })
    },
    10
  )
}
