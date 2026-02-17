/**
 * Hooks específicos para Questionários
 */

import { useCallback } from 'react'
import { questionarioService, type ListarQuestionariosParams, type CriarQuestionarioData, type ResponderQuestionarioData } from '@/services'
import { useFetch, useMutation, usePaginatedFetch } from './useFetch'

// Hook para listar questionários
export function useQuestionarios(params: ListarQuestionariosParams = {}) {
  return usePaginatedFetch((page, perPage) => 
    questionarioService.listar({ ...params, page, perPage })
  )
}

// Hook para buscar um questionário específico
export function useQuestionario(id: number | null) {
  const fetchFn = useCallback(() => {
    if (!id) throw new Error('ID não fornecido')
    return questionarioService.buscarPorId(id)
  }, [id])
  
  return useFetch(fetchFn, !!id)
}

// Hook para criar questionário
export function useCriarQuestionario() {
  return useMutation((data: CriarQuestionarioData) => 
    questionarioService.criar(data)
  )
}

// Hook para atualizar questionário
export function useAtualizarQuestionario() {
  return useMutation(({ id, data }: { id: number; data: Parameters<typeof questionarioService.atualizar>[1] }) => 
    questionarioService.atualizar(id, data)
  )
}

// Hook para remover questionário
export function useRemoverQuestionario() {
  return useMutation((id: number) => questionarioService.remover(id))
}

// Hook para listar perguntas do questionário
export function usePerguntasQuestionario(questionarioId: number | null) {
  const fetchFn = useCallback(() => {
    if (!questionarioId) throw new Error('ID do questionário não fornecido')
    return questionarioService.listarPerguntas(questionarioId)
  }, [questionarioId])
  
  return useFetch(fetchFn, !!questionarioId)
}

// Hook para responder questionário
export function useResponderQuestionario() {
  return useMutation(({ questionarioId, data }: { questionarioId: number; data: ResponderQuestionarioData }) => 
    questionarioService.responder(questionarioId, data)
  )
}
