/**
 * Serviço de Participantes
 */

import { http, API_ENDPOINTS } from './http.service'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Participante,
  IndicadoresSaude 
} from '@/types/api'

export interface ListarParticipantesParams {
  page?: number
  perPage?: number
  search?: string
  empresaId?: number
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
}

export interface CriarParticipanteData {
  nome: string
  email: string
  cpf: string
  telefone?: string
  dataNascimento?: string
  genero?: string
  cargo?: string
  departamento?: string
  empresaId: number
  camposPersonalizados?: Record<string, unknown>
}

export const participanteService = {
  /**
   * Lista todos os participantes
   */
  async listar(params: ListarParticipantesParams = {}): Promise<ApiResponse<PaginatedResponse<Participante>>> {
    const queryString = new URLSearchParams()
    
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)
    
    return http.get(`${API_ENDPOINTS.participantes.list}?${queryString.toString()}`)
  },

  /**
   * Busca um participante por ID
   */
  async buscarPorId(id: number): Promise<ApiResponse<Participante>> {
    return http.get(API_ENDPOINTS.participantes.get(id))
  },

  /**
   * Cria um novo participante
   */
  async criar(data: CriarParticipanteData): Promise<ApiResponse<Participante>> {
    return http.post(API_ENDPOINTS.participantes.create, data)
  },

  /**
   * Cria múltiplos participantes em lote
   */
  async criarEmLote(participantes: CriarParticipanteData[]): Promise<ApiResponse<{ criados: number; erros: number }>> {
    return http.post(`${API_ENDPOINTS.participantes.create}/lote`, { participantes })
  },

  /**
   * Atualiza um participante
   */
  async atualizar(id: number, data: Partial<Participante>): Promise<ApiResponse<Participante>> {
    return http.put(API_ENDPOINTS.participantes.update(id), data)
  },

  /**
   * Remove um participante
   */
  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.participantes.delete(id))
  },

  /**
   * Busca indicadores de saúde do participante
   */
  async buscarIndicadores(id: number): Promise<ApiResponse<IndicadoresSaude>> {
    return http.get(`${API_ENDPOINTS.participantes.get(id)}/indicadores`)
  },

  /**
   * Busca prontuário do participante
   */
  async buscarProntuario(id: number): Promise<ApiResponse<unknown>> {
    return http.get(API_ENDPOINTS.participantes.prontuario(id))
  },

  /**
   * Lista relatórios do participante
   */
  async listarRelatorios(id: number): Promise<ApiResponse<unknown[]>> {
    return http.get(API_ENDPOINTS.participantes.relatorios(id))
  },

  /**
   * Importa participantes de arquivo Excel
   */
  async importarExcel(arquivo: File, empresaId: number): Promise<ApiResponse<{ importados: number; erros: number; log: string[] }>> {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    formData.append('empresa_id', empresaId.toString())
    
    return http.post(API_ENDPOINTS.participantes.importar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * Importa participantes de texto (CSV ou lista)
   */
  async importarTexto(texto: string, empresaId: number, formato: 'csv' | 'lista' = 'csv'): Promise<ApiResponse<{ importados: number; erros: number }>> {
    return http.post(`${API_ENDPOINTS.participantes.importar}/texto`, {
      texto,
      empresa_id: empresaId,
      formato,
    })
  },
}
