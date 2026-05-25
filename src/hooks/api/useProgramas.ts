/**
 * Hooks específicos para Programas
 */

import { useCallback } from 'react'
import { programaService, type ListarProgramasParams, type CriarProgramaData, type VincularQuestionarioData } from '@/services'
import { useFetch, useMutation, usePaginatedFetch } from './useFetch'

// Hook para listar programas
export function useProgramas(params: ListarProgramasParams = {}) {
  return usePaginatedFetch(
    (page, perPage) => programaService.listar({ ...params, page, perPage }),
    params.perPage || 10
  )
}

// Hook para buscar um programa específico
export function usePrograma(id: number | null) {
  const fetchFn = useCallback(() => {
    if (!id) throw new Error('ID não fornecido')
    return programaService.buscarPorId(id)
  }, [id])
  
  return useFetch(fetchFn, !!id)
}

// Hook para criar programa
export function useCriarPrograma() {
  return useMutation((data: CriarProgramaData) => 
    programaService.criar(data)
  )
}

// Hook para atualizar programa
export function useAtualizarPrograma() {
  return useMutation(({ id, data }: { id: number; data: Parameters<typeof programaService.atualizar>[1] }) => 
    programaService.atualizar(id, data)
  )
}

// Hook para remover programa
export function useRemoverPrograma() {
  return useMutation((id: number) => programaService.remover(id))
}

export function useDuplicarPrograma() {
  return useMutation((id: number) => programaService.duplicar(id))
}

export function useVincularEmpresaPrograma() {
  return useMutation(({ programaId, empresaId }: { programaId: number; empresaId: number }) =>
    programaService.vincularEmpresa(programaId, empresaId)
  )
}

// Hook para listar questionários vinculados
export function useQuestionariosPrograma(programaId: number | null) {
  const fetchFn = useCallback(() => {
    if (!programaId) throw new Error('ID do programa não fornecido')
    return programaService.listarQuestionarios(programaId)
  }, [programaId])
  
  return useFetch(fetchFn, !!programaId)
}

// Hook para vincular questionário
export function useVincularQuestionario() {
  return useMutation(({ programaId, data }: { programaId: number; data: VincularQuestionarioData }) => 
    programaService.vincularQuestionario(programaId, data)
  )
}

// Hook para desvincular questionário
export function useDesvincularQuestionario() {
  return useMutation(({ programaId, questionarioId }: { programaId: number; questionarioId: number }) => 
    programaService.desvincularQuestionario(programaId, questionarioId)
  )
}
