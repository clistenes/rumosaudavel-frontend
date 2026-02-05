import api from './api'
import { ApiResponse, EmpresaType } from '@/types/auth'

export const empresasService = {
  async listar(search?: string, page: number = 1, perPage: number = 20) {
    const response = await api.get<ApiResponse<EmpresaType[]>>('/adm/empresas', {
      params: { search, page, per_page: perPage },
    })
    return response.data
  },

  async obter(id: number) {
    const response = await api.get<ApiResponse<EmpresaType>>(`/adm/empresas/${id}`)
    return response.data
  },

  async criar(data: FormData) {
    const response = await api.post<ApiResponse<EmpresaType>>('/adm/empresas', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async atualizar(id: number, data: FormData) {
    const response = await api.put<ApiResponse<EmpresaType>>(`/adm/empresas/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deletar(id: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/empresas/${id}`)
    return response.data
  },

  async listarParticipantes(empresaId: number, search?: string, page: number = 1, perPage: number = 20) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/empresas/${empresaId}/participantes`, {
      params: { search, page, per_page: perPage },
    })
    return response.data
  },

  async listarCampos(empresaId: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/empresas/${empresaId}/campos`)
    return response.data
  },

  async criarLogin(empresaId: number, data: { login: string; password: string; email: string; acessa_dash?: boolean; acessa_relatorios?: boolean; campos_permitidos?: number[] }) {
    const response = await api.post<ApiResponse<any>>(`/adm/empresas/${empresaId}/logins`, data)
    return response.data
  },

  async configurarFiltros(empresaId: number, data: { id_campo_dashboard_heatmap_1?: number; id_campo_dashboard_heatmap_2?: number }) {
    const response = await api.post<ApiResponse<void>>(`/adm/empresas/${empresaId}/filtros`, data)
    return response.data
  },

  async deletarCampo(campoId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/campos-empresas/${campoId}`)
    return response.data
  },
}
