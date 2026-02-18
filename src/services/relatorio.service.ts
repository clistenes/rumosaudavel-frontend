/**
 * Servico de relatorios
 */

import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse } from '@/types/api'

export interface RelatorioAnaliticoParams {
  dataInicio?: string
  dataFim?: string
  programaId?: number
  empresaId?: number
}

export interface RelatorioGraficoParams {
  tipo: 'phq9' | 'gad7' | 'bemEstar' | 'geral'
  periodo: '7d' | '30d' | '90d' | '1y'
  empresaId?: number
  programaId?: number
}

export interface ExportarRelatorioParams {
  formato: 'pdf' | 'excel' | 'csv'
  tipo: 'analitico' | 'individual' | 'consolidado'
  dataInicio?: string
  dataFim?: string
  programaId?: number
  empresaId?: number
}

export const relatorioService = {
  async analitico(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const query = new URLSearchParams()
    if (params.dataInicio) query.append('data_inicio', params.dataInicio)
    if (params.dataFim) query.append('data_fim', params.dataFim)
    if (params.programaId) query.append('programa_id', String(params.programaId))
    if (params.empresaId) query.append('empresa_id', String(params.empresaId))
    return http.get(`${API_ENDPOINTS.relatorios.analitico}?${query.toString()}`)
  },

  async grafico(params: RelatorioGraficoParams): Promise<ApiResponse<unknown>> {
    const query = new URLSearchParams()
    query.append('tipo', params.tipo)
    query.append('periodo', params.periodo)
    if (params.empresaId) query.append('empresa_id', String(params.empresaId))
    if (params.programaId) query.append('programa_id', String(params.programaId))
    return http.get(`${API_ENDPOINTS.relatorios.grafico}?${query.toString()}`)
  },

  async termometro(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const query = new URLSearchParams()
    if (params.dataInicio) query.append('data_inicio', params.dataInicio)
    if (params.dataFim) query.append('data_fim', params.dataFim)
    if (params.programaId) query.append('programa_id', String(params.programaId))
    if (params.empresaId) query.append('empresa_id', String(params.empresaId))
    return http.get(`${API_ENDPOINTS.relatorios.termometro}?${query.toString()}`)
  },

  async semaforo(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const query = new URLSearchParams()
    if (params.dataInicio) query.append('data_inicio', params.dataInicio)
    if (params.dataFim) query.append('data_fim', params.dataFim)
    if (params.programaId) query.append('programa_id', String(params.programaId))
    if (params.empresaId) query.append('empresa_id', String(params.empresaId))
    return http.get(`${API_ENDPOINTS.relatorios.semaforo}?${query.toString()}`)
  },

  async individual(
    participanteId: number,
    params: { dataInicio?: string; dataFim?: string } = {}
  ): Promise<ApiResponse<unknown>> {
    const query = new URLSearchParams()
    if (params.dataInicio) query.append('data_inicio', params.dataInicio)
    if (params.dataFim) query.append('data_fim', params.dataFim)
    return http.get(`${API_ENDPOINTS.relatorios.individualLegacy(participanteId)}?${query.toString()}`)
  },

  async exportar(params: ExportarRelatorioParams): Promise<Blob> {
    const query = new URLSearchParams()
    query.append('formato', params.formato)
    query.append('tipo', params.tipo)
    if (params.dataInicio) query.append('data_inicio', params.dataInicio)
    if (params.dataFim) query.append('data_fim', params.dataFim)
    if (params.programaId) query.append('programa_id', String(params.programaId))
    if (params.empresaId) query.append('empresa_id', String(params.empresaId))

    const response = await http.get<Blob>(
      `${API_ENDPOINTS.relatorios.exportar}?${query.toString()}`,
      { parseAs: 'blob' }
    )

    return response.data
  },
}
