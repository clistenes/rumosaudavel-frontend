/**
 * Serviço de Programas
 */

import { http, API_ENDPOINTS } from './http.service'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Programa,
  Questionario 
} from '@/types/api'

export interface ListarProgramasParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
}

export interface CriarProgramaData {
  nome: string
  descricao: string
  dataInicio?: string
  dataFim?: string
}

export interface VincularQuestionarioData {
  questionarioId: number
  ordem: number
  obrigatorio: boolean
  permiteReavaliacao: boolean
  intervaloDias: number
  dependenciaId?: number
  dependenciaCondicao?: string
}

export const programaService = {
  /**
   * Lista todos os programas
   */
  async listar(params: ListarProgramasParams = {}): Promise<ApiResponse<PaginatedResponse<Programa>>> {
    const queryString = new URLSearchParams()
    
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)
    
    return http.get(`${API_ENDPOINTS.programas.list}?${queryString.toString()}`)
  },

  /**
   * Busca um programa por ID
   */
  async buscarPorId(id: number): Promise<ApiResponse<Programa>> {
    return http.get(API_ENDPOINTS.programas.get(id))
  },

  /**
   * Cria um novo programa
   */
  async criar(data: CriarProgramaData): Promise<ApiResponse<Programa>> {
    return http.post(API_ENDPOINTS.programas.create, data)
  },

  /**
   * Atualiza um programa
   */
  async atualizar(id: number, data: Partial<Programa>): Promise<ApiResponse<Programa>> {
    return http.put(API_ENDPOINTS.programas.update(id), data)
  },

  /**
   * Remove um programa
   */
  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.programas.delete(id))
  },

  /**
   * Lista questionários vinculados ao programa
   */
  async listarQuestionarios(programaId: number): Promise<ApiResponse<Questionario[]>> {
    return http.get(API_ENDPOINTS.programas.vincularQuestionario(programaId))
  },

  /**
   * Vincula um questionário ao programa
   */
  async vincularQuestionario(
    programaId: number, 
    data: VincularQuestionarioData
  ): Promise<ApiResponse<Questionario>> {
    return http.post(API_ENDPOINTS.programas.vincularQuestionario(programaId), data)
  },

  /**
   * Desvincula um questionário do programa
   */
  async desvincularQuestionario(programaId: number, questionarioId: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.programas.desvincularQuestionario(programaId, questionarioId))
  },

  /**
   * Reordena questionários do programa
   */
  async reordenarQuestionarios(
    programaId: number, 
    ordem: { questionarioId: number; ordem: number }[]
  ): Promise<ApiResponse<void>> {
    return http.put(`${API_ENDPOINTS.programas.vincularQuestionario(programaId)}/ordem`, { ordem })
  },

  /**
   * Atualiza intervalos do programa
   */
  async atualizarIntervalos(
    programaId: number, 
    intervalos: { nome: string; dias: number; cor: string }[]
  ): Promise<ApiResponse<void>> {
    return http.put(API_ENDPOINTS.programas.intervalos(programaId), { intervalos })
  },
}
