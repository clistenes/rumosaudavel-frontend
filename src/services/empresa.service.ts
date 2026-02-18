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
import type { CreateEmpresaParams, UpdateEmpresaParams } from '@/types/empresa'

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

const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

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
    
    try {
      const response = await http.get<Empresa[]>(url)
      console.log('🏢 [empresaService] Resposta bruta:', response)
      
      // O proxy pode retornar array direto ou envelopado
      let empresasArray: Empresa[] = []
      
      // Verificar se response é array direto (do proxy)
      if (Array.isArray(response)) {
        empresasArray = response
        console.log('🏢 [empresaService] Response é array direto:', empresasArray.length)
      } 
      // Verificar se response.data é array
      else if (Array.isArray(response.data)) {
        empresasArray = response.data
      } 
      // Verificar se response.data é objeto envelopado { data: [] }
      else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        empresasArray = (response.data as any).data
      } 
      // Verificar se é objeto único
      else if (response.data && typeof response.data === 'object') {
        empresasArray = [response.data as Empresa]
      }
      
      console.log('🏢 [empresaService] Empresas processadas:', empresasArray.length)
      
      // Retornar no formato esperado pelo frontend (PaginatedResponse)
      return {
        success: true,
        data: {
          data: empresasArray,
          meta: {
            page: 1,
            perPage: empresasArray.length,
            total: empresasArray.length,
            totalPages: 1,
          }
        }
      } as unknown as ApiResponse<PaginatedResponse<Empresa>>
    } catch (error) {
      console.error('🏢 [empresaService] Erro ao listar empresas:', error)
      // Retornar array vazio em caso de erro
      return {
        success: false,
        data: {
          data: [],
          meta: {
            page: 1,
            perPage: 0,
            total: 0,
            totalPages: 0,
          }
        },
        message: 'Erro ao carregar empresas'
      } as unknown as ApiResponse<PaginatedResponse<Empresa>>
    }
  },

  /**
   * Busca uma empresa por ID
   */
  async buscarPorId(id: number): Promise<ApiResponse<Empresa>> {
    try {
      const response = await http.get<Empresa>(`/empresas/${id}`)
      
      // O proxy retorna array direto ou objeto direto
      let empresa: Empresa | null = null
      
      if (Array.isArray(response)) {
        // Se for array, pega o primeiro
        empresa = response[0] || null
      } else if (response.data) {
        // Se tiver response.data
        empresa = response.data
      } else {
        // Se for objeto direto
        empresa = response as unknown as Empresa
      }
      
      return {
        success: true,
        data: empresa
      } as unknown as ApiResponse<Empresa>
    } catch (error) {
      return {
        success: false,
        data: null as any,
        message: 'Empresa não encontrada'
      } as unknown as ApiResponse<Empresa>
    }
  },

  /**
   * Cria uma nova empresa (multipart/form-data)
   */
  async criar(data: CreateEmpresaParams): Promise<ApiResponse<Empresa>> {
    const formData = new FormData()
    formData.append('empresa_nome', data.empresa_nome)
    if (data.empresa_introducao) {
      formData.append('empresa_introducao', data.empresa_introducao)
    }
    formData.append('empresa_cor', data.empresa_cor)
    if (data.empresa_termo) {
      formData.append('empresa_termo', String(data.empresa_termo))
    }
    if (data.empresa_logo) {
      formData.append('empresa_logo', data.empresa_logo)
    }

    return http.post(API_ENDPOINTS.empresas.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /**
   * Atualiza uma empresa (multipart/form-data)
   */
  async atualizar(id: number, params: UpdateEmpresaParams): Promise<ApiResponse<Empresa>> {
    const data = params.data
    const formData = new FormData()
    formData.append('empresa_nome', data.empresa_nome)
    if (data.empresa_introducao) {
      formData.append('empresa_introducao', data.empresa_introducao)
    }
    formData.append('empresa_cor', data.empresa_cor)
    if (data.empresa_termo) {
      formData.append('empresa_termo', String(data.empresa_termo))
    }
    if (data.empresa_logo) {
      formData.append('empresa_logo', data.empresa_logo)
    }

    return http.post(`/empresas/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /**
   * Remove uma empresa
   */
  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(`/empresas/${id}`)
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
