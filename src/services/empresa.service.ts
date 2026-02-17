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
    
    const url = `${API_ENDPOINTS.empresas.list}?${queryString.toString()}`
    console.log('🏢 [empresaService] Listando empresas:', url)
    console.log('🏢 [empresaService] Parâmetros:', params)
    
    const response = await http.get<Empresa[] | Empresa>(url)
    console.log('🏢 [empresaService] Resposta bruta:', response)
    
    // Adaptar resposta da API (pode ser array ou objeto único)
    let empresasArray: Empresa[]
    if (Array.isArray(response.data)) {
      empresasArray = response.data
    } else if (response.data) {
      // Se for um objeto único, converte para array
      empresasArray = [response.data]
    } else {
      empresasArray = []
    }
    
    console.log('🏢 [empresaService] Empresas processadas:', empresasArray.length)
    
    // Retornar no formato esperado pelo frontend (PaginatedResponse)
    return {
      success: true,
      data: {
        data: empresasArray,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: empresasArray.length,
          total: empresasArray.length,
        }
      }
    } as unknown as ApiResponse<PaginatedResponse<Empresa>>
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
