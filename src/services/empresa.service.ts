/**
 * Serviço de Empresas
 */

import { http, API_ENDPOINTS } from './http.service'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Empresa,
  Participante 
} from '@/types/api'

export interface ListarEmpresasParams {
  page?: number
  perPage?: number
  search?: string
  cidade?: string
  estado?: string
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
}

export const empresaService = {
  /**
   * Lista todas as empresas
   */
  async listar(params: ListarEmpresasParams = {}): Promise<ApiResponse<PaginatedResponse<Empresa>>> {
    const queryString = new URLSearchParams()
    
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.cidade) queryString.append('cidade', params.cidade)
    if (params.estado) queryString.append('estado', params.estado)
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)
    
    return http.get(`${API_ENDPOINTS.empresas.list}?${queryString.toString()}`)
  },

  /**
   * Busca uma empresa por ID
   */
  async buscarPorId(id: number): Promise<ApiResponse<Empresa>> {
    return http.get(API_ENDPOINTS.empresas.get(id))
  },

  /**
   * Cria uma nova empresa
   */
  async criar(data: Omit<Empresa, 'id' | 'dataCriacao' | 'totalParticipantes'>): Promise<ApiResponse<Empresa>> {
    return http.post(API_ENDPOINTS.empresas.create, data)
  },

  /**
   * Atualiza uma empresa
   */
  async atualizar(id: number, data: Partial<Empresa>): Promise<ApiResponse<Empresa>> {
    return http.put(API_ENDPOINTS.empresas.update(id), data)
  },

  /**
   * Remove uma empresa
   */
  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.empresas.delete(id))
  },

  /**
   * Lista participantes de uma empresa
   */
  async listarParticipantes(
    empresaId: number, 
    params: { page?: number; perPage?: number; search?: string } = {}
  ): Promise<ApiResponse<PaginatedResponse<Participante>>> {
    const queryString = new URLSearchParams()
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    
    return http.get(`${API_ENDPOINTS.empresas.participantes(empresaId)}?${queryString.toString()}`)
  },

  /**
   * Importa participantes em lote
   */
  async importarParticipantes(
    empresaId: number, 
    arquivo: File
  ): Promise<ApiResponse<{ importados: number; erros: number }>> {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    formData.append('empresa_id', empresaId.toString())
    
    return http.post(API_ENDPOINTS.participantes.importar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
