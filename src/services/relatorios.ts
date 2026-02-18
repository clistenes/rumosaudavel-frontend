import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse } from '@/types/auth'

export const relatoriosService = {
  async dashboardAnalitico(empresaId: number, params: { idquestionario?: number; idprograma?: number; tipo?: string }) {
    const query = new URLSearchParams()
    if (params.idquestionario) query.append('idquestionario', String(params.idquestionario))
    if (params.idprograma) query.append('idprograma', String(params.idprograma))
    if (params.tipo) query.append('tipo', params.tipo)
    return http.get<unknown>(`${API_ENDPOINTS.relatorios.analiticoEmpresa(empresaId)}?${query.toString()}`) as Promise<ApiResponse<unknown>>
  },

  async dashboardGrafico(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number; camporesposta?: string }) {
    const query = new URLSearchParams()
    if (params.idquestionario) query.append('idquestionario', String(params.idquestionario))
    if (params.idprograma) query.append('idprograma', String(params.idprograma))
    if (params.campo) query.append('campo', String(params.campo))
    if (params.camporesposta) query.append('camporesposta', params.camporesposta)
    return http.get<unknown>(`${API_ENDPOINTS.relatorios.graficoEmpresa(empresaId)}?${query.toString()}`) as Promise<ApiResponse<unknown>>
  },

  async semaforo(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number; camporesposta?: string; campo2?: number; camporesposta2?: string }) {
    const query = new URLSearchParams()
    if (params.idquestionario) query.append('idquestionario', String(params.idquestionario))
    if (params.idprograma) query.append('idprograma', String(params.idprograma))
    if (params.campo) query.append('campo', String(params.campo))
    if (params.camporesposta) query.append('camporesposta', params.camporesposta)
    if (params.campo2) query.append('campo2', String(params.campo2))
    if (params.camporesposta2) query.append('camporesposta2', params.camporesposta2)
    return http.get<unknown>(`${API_ENDPOINTS.relatorios.semaforoEmpresa(empresaId)}?${query.toString()}`) as Promise<ApiResponse<unknown>>
  },

  async heatmap(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number }) {
    const query = new URLSearchParams()
    if (params.idquestionario) query.append('idquestionario', String(params.idquestionario))
    if (params.idprograma) query.append('idprograma', String(params.idprograma))
    if (params.campo) query.append('campo', String(params.campo))
    return http.get<unknown>(`${API_ENDPOINTS.relatorios.heatmapEmpresa(empresaId)}?${query.toString()}`) as Promise<ApiResponse<unknown>>
  },

  async individual(userId: number, questionarioId: number) {
    return http.get<unknown>(API_ENDPOINTS.relatorios.individual(userId, questionarioId)) as Promise<ApiResponse<unknown>>
  },

  async filtrosSemaforo(filterId: number, empresaId: number) {
    const query = new URLSearchParams()
    query.append('filter_id', String(filterId))
    query.append('idempresa', String(empresaId))
    return http.get<unknown[]>(`${API_ENDPOINTS.relatorios.filtrosSemaforo}?${query.toString()}`) as Promise<ApiResponse<unknown[]>>
  },
}
