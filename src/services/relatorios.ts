import api from './api'
import { ApiResponse } from '@/types/auth'

export const relatoriosService = {
  async dashboardAnalitico(empresaId: number, params: { idquestionario?: number; idprograma?: number; tipo?: string }) {
    const response = await api.get<ApiResponse<any>>(`/adm/relatorios/${empresaId}/dashboard`, { params })
    return response.data
  },

  async dashboardGrafico(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number; camporesposta?: string }) {
    const response = await api.get<ApiResponse<any>>(`/adm/relatorios/${empresaId}/grafico`, { params })
    return response.data
  },

  async semaforo(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number; camporesposta?: string; campo2?: number; camporesposta2?: string }) {
    const response = await api.get<ApiResponse<any>>(`/adm/relatorios/${empresaId}/semaforo`, { params })
    return response.data
  },

  async heatmap(empresaId: number, params: { idquestionario?: number; idprograma?: number; campo?: number }) {
    const response = await api.get<ApiResponse<any>>(`/adm/relatorios/${empresaId}/heatmap`, { params })
    return response.data
  },

  async individual(userId: number, questionarioId: number) {
    const response = await api.get<ApiResponse<any>>(`/adm/relatorios/${userId}/${questionarioId}/individual`)
    return response.data
  },

  async filtrosSemaforo(filterId: number, empresaId: number) {
    const response = await api.get<ApiResponse<any[]>>('/adm/relatorios/semaforo/filtros', {
      params: { filter_id: filterId, idempresa: empresaId },
    })
    return response.data
  },
}
