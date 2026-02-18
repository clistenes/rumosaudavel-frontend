import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse, EmpresaType } from '@/types/auth'

export const empresasService = {
  async listar(search?: string, page: number = 1, perPage: number = 20) {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    query.append('page', String(page))
    query.append('per_page', String(perPage))
    return http.get<EmpresaType[]>(`${API_ENDPOINTS.empresas.list}?${query.toString()}`) as Promise<ApiResponse<EmpresaType[]>>
  },

  async obter(id: number) {
    return http.get<EmpresaType>(API_ENDPOINTS.empresas.get(id)) as Promise<ApiResponse<EmpresaType>>
  },

  async criar(data: FormData) {
    return http.post<EmpresaType>(API_ENDPOINTS.empresas.create, data) as Promise<ApiResponse<EmpresaType>>
  },

  async atualizar(id: number, data: FormData) {
    return http.put<EmpresaType>(API_ENDPOINTS.empresas.update(id), data) as Promise<ApiResponse<EmpresaType>>
  },

  async deletar(id: number) {
    return http.delete<void>(API_ENDPOINTS.empresas.delete(id)) as Promise<ApiResponse<void>>
  },

  async listarParticipantes(empresaId: number, search?: string, page: number = 1, perPage: number = 20) {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    query.append('page', String(page))
    query.append('per_page', String(perPage))
    return http.get<unknown[]>(`${API_ENDPOINTS.empresas.participantes(empresaId)}?${query.toString()}`) as Promise<ApiResponse<unknown[]>>
  },

  async listarCampos(empresaId: number) {
    return http.get<unknown[]>(API_ENDPOINTS.empresas.campos(empresaId)) as Promise<ApiResponse<unknown[]>>
  },

  async criarLogin(
    empresaId: number,
    data: {
      login: string
      password: string
      email: string
      acessa_dash?: boolean
      acessa_relatorios?: boolean
      campos_permitidos?: number[]
    }
  ) {
    return http.post<unknown>(API_ENDPOINTS.empresas.logins(empresaId), data) as Promise<ApiResponse<unknown>>
  },

  async configurarFiltros(
    empresaId: number,
    data: { id_campo_dashboard_heatmap_1?: number; id_campo_dashboard_heatmap_2?: number }
  ) {
    return http.post<void>(API_ENDPOINTS.empresas.filtros(empresaId), data) as Promise<ApiResponse<void>>
  },

  async deletarCampo(campoId: number) {
    return http.delete<void>(API_ENDPOINTS.empresas.deleteCampo(campoId)) as Promise<ApiResponse<void>>
  },
}
