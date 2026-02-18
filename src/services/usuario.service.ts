import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse, PaginatedResponse, User } from '@/types/api'

export interface ListarUsuariosParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
  role?: string
}

export interface CriarUsuarioData {
  nome: string
  email: string
  login: string
  password: string
  type?: number
  id_empresa?: number | null
}

export const usuarioService = {
  async listar(params: ListarUsuariosParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const query = new URLSearchParams()
    if (params.page) query.append('page', String(params.page))
    if (params.perPage) query.append('per_page', String(params.perPage))
    if (params.search) query.append('search', params.search)
    if (params.status) query.append('status', params.status)
    if (params.role) query.append('role', params.role)

    return http.get(`${API_ENDPOINTS.usuarios.list}?${query.toString()}`)
  },

  async buscarPorId(id: number): Promise<ApiResponse<User>> {
    return http.get(API_ENDPOINTS.usuarios.get(id))
  },

  async criar(data: CriarUsuarioData): Promise<ApiResponse<User>> {
    return http.post(API_ENDPOINTS.usuarios.create, data)
  },

  async atualizar(id: number, data: Partial<CriarUsuarioData>): Promise<ApiResponse<User>> {
    return http.put(API_ENDPOINTS.usuarios.update(id), data)
  },

  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.usuarios.delete(id))
  },
}
