import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse } from '@/types/auth'

export const programasService = {
  async listar() {
    return http.get<unknown[]>(API_ENDPOINTS.programas.list) as Promise<ApiResponse<unknown[]>>
  },

  async obter(id: number) {
    return http.get<unknown>(API_ENDPOINTS.programas.get(id)) as Promise<ApiResponse<unknown>>
  },

  async criar(data: { nome: string; introducao?: string; questionarios?: number[]; ordenacao_questionarios?: string }) {
    return http.post<unknown>(API_ENDPOINTS.programas.create, data) as Promise<ApiResponse<unknown>>
  },

  async atualizar(id: number, data: { nome?: string; introducao?: string; questionarios?: number[]; ordenacao_questionarios?: string }) {
    return http.put<unknown>(API_ENDPOINTS.programas.update, { id, ...data }) as Promise<ApiResponse<unknown>>
  },

  async deletar(id: number) {
    return http.delete<void>(API_ENDPOINTS.programas.delete(id)) as Promise<ApiResponse<void>>
  },

  async duplicar(id: number) {
    return http.post<unknown>(API_ENDPOINTS.programas.duplicar(id), {}) as Promise<ApiResponse<unknown>>
  },

  async vincularEmpresa(programaId: number, empresaId: number) {
    return http.post<unknown>(API_ENDPOINTS.programas.vincularEmpresa(programaId), {
      id_empresa: empresaId,
    }) as Promise<ApiResponse<unknown>>
  },

  async removerVinculoEmpresa(programaId: number, empresaId: number) {
    return http.delete<void>(
      API_ENDPOINTS.programas.removerVinculoEmpresa(programaId, empresaId)
    ) as Promise<ApiResponse<void>>
  },

  async configurarIntervalo(programaId: number, empresaId: number, data: { intervalo_inicio: string; intervalo_termino: string }) {
    return http.post<void>(API_ENDPOINTS.programas.intervaloEmpresa(programaId, empresaId), data) as Promise<ApiResponse<void>>
  },

  async tornarIndeterminado(programaId: number, empresaId: number) {
    return http.delete<void>(API_ENDPOINTS.programas.intervaloEmpresa(programaId, empresaId)) as Promise<ApiResponse<void>>
  },

  async listarAcessos(empresaId: number, programaId: number) {
    return http.get<unknown[]>(API_ENDPOINTS.programas.acessosEmpresaPrograma(empresaId, programaId)) as Promise<ApiResponse<unknown[]>>
  },

  async atualizarAcesso(empresaId: number, programaId: number, data: { id_user: number; tem_acesso: boolean }) {
    return http.post<void>(API_ENDPOINTS.programas.acessosEmpresaPrograma(empresaId, programaId), data) as Promise<ApiResponse<void>>
  },
}
