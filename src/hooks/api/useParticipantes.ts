/**
 * Hooks específicos para Participantes
 */

import { useCallback } from 'react'
import { participanteService, type ListarParticipantesParams, type CriarParticipanteData } from '@/services'
import { useFetch, useMutation, usePaginatedFetch } from './useFetch'

// Hook para listar participantes
export function useParticipantes(params: ListarParticipantesParams = {}) {
  return usePaginatedFetch((page, perPage) => 
    participanteService.listar({ ...params, page, perPage })
  )
}

// Hook para buscar um participante específico
export function useParticipante(id: number | null) {
  const fetchFn = useCallback(() => {
    if (!id) throw new Error('ID não fornecido')
    return participanteService.buscarPorId(id)
  }, [id])
  
  return useFetch(fetchFn, !!id)
}

// Hook para buscar indicadores de saúde
export function useIndicadoresSaude(participanteId: number | null) {
  const fetchFn = useCallback(() => {
    if (!participanteId) throw new Error('ID não fornecido')
    return participanteService.buscarIndicadores(participanteId)
  }, [participanteId])
  
  return useFetch(fetchFn, !!participanteId)
}

// Hook para criar participante
export function useCriarParticipante() {
  return useMutation((data: CriarParticipanteData) => 
    participanteService.criar(data)
  )
}

// Hook para criar participantes em lote
export function useCriarParticipantesLote() {
  return useMutation((participantes: CriarParticipanteData[]) => 
    participanteService.criarEmLote(participantes)
  )
}

// Hook para atualizar participante
export function useAtualizarParticipante() {
  return useMutation(({ id, data }: { id: number; data: Parameters<typeof participanteService.atualizar>[1] }) => 
    participanteService.atualizar(id, data)
  )
}

// Hook para remover participante
export function useRemoverParticipante() {
  return useMutation((id: number) => participanteService.remover(id))
}

// Hook para importar participantes via Excel
export function useImportarParticipantesExcel() {
  return useMutation(({ arquivo, empresaId }: { arquivo: File; empresaId: number }) => 
    participanteService.importarExcel(arquivo, empresaId)
  )
}

// Hook para importar participantes via texto
export function useImportarParticipantesTexto() {
  return useMutation(({ texto, empresaId, formato }: { texto: string; empresaId: number; formato: 'csv' | 'lista' }) => 
    participanteService.importarTexto(texto, empresaId, formato)
  )
}
