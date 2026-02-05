import api from './api'
import { ApiResponse } from '@/types/auth'

export const programasService = {
  async listar() {
    const response = await api.get<ApiResponse<any[]>>('/adm/programas')
    return response.data
  },

  async obter(id: number) {
    const response = await api.get<ApiResponse<any>>(`/adm/programas/${id}`)
    return response.data
  },

  async criar(data: { nome: string; introducao?: string; questionarios?: number[]; ordenacao_questionarios?: string }) {
    const response = await api.post<ApiResponse<any>>('/adm/programas', data)
    return response.data
  },

  async atualizar(id: number, data: { nome?: string; introducao?: string; questionarios?: number[]; ordenacao_questionarios?: string }) {
    const response = await api.put<ApiResponse<any>>(`/adm/programas/${id}`, data)
    return response.data
  },

  async deletar(id: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/programas/${id}`)
    return response.data
  },

  async duplicar(id: number) {
    const response = await api.post<ApiResponse<any>>(`/adm/programas/${id}/duplicar`)
    return response.data
  },

  async vincularEmpresa(programaId: number, empresaId: number) {
    const response = await api.post<ApiResponse<any>>(`/adm/programas/${programaId}/empresas`, {
      id_empresa: empresaId,
    })
    return response.data
  },

  async removerVinculoEmpresa(programaId: number, empresaId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/programas/${programaId}/empresas/${empresaId}`)
    return response.data
  },

  async configurarIntervalo(programaId: number, empresaId: number, data: { intervalo_inicio: string; intervalo_termino: string }) {
    const response = await api.post<ApiResponse<void>>(
      `/adm/programas/${programaId}/empresas/${empresaId}/intervalo`,
      data
    )
    return response.data
  },

  async tornarIndeterminado(programaId: number, empresaId: number) {
    const response = await api.delete<ApiResponse<void>>(
      `/adm/programas/${programaId}/empresas/${empresaId}/intervalo`
    )
    return response.data
  },

  async listarAcessos(empresaId: number, programaId: number) {
    const response = await api.get<ApiResponse<any[]>>(
      `/adm/empresas/${empresaId}/programas/${programaId}/acessos`
    )
    return response.data
  },

  async atualizarAcesso(empresaId: number, programaId: number, data: { id_user: number; tem_acesso: boolean }) {
    const response = await api.post<ApiResponse<void>>(
      `/adm/empresas/${empresaId}/programas/${programaId}/acessos`,
      data
    )
    return response.data
  },
}
