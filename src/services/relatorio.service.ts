/**
 * Serviço de Relatórios
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
  /**
   * Busca relatório analítico
   */
  async analitico(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const queryString = new URLSearchParams()
    if (params.dataInicio) queryString.append('data_inicio', params.dataInicio)
    if (params.dataFim) queryString.append('data_fim', params.dataFim)
    if (params.programaId) queryString.append('programa_id', params.programaId.toString())
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    
    return http.get(`${API_ENDPOINTS.relatorios.analitico}?${queryString.toString()}`)
  },

  /**
   * Busca dados para gráficos
   */
  async grafico(params: RelatorioGraficoParams): Promise<ApiResponse<unknown>> {
    const queryString = new URLSearchParams()
    queryString.append('tipo', params.tipo)
    queryString.append('periodo', params.periodo)
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    if (params.programaId) queryString.append('programa_id', params.programaId.toString())
    
    return http.get(`${API_ENDPOINTS.relatorios.grafico}?${queryString.toString()}`)
  },

  /**
   * Busca relatório termômetro
   */
  async termometro(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const queryString = new URLSearchParams()
    if (params.dataInicio) queryString.append('data_inicio', params.dataInicio)
    if (params.dataFim) queryString.append('data_fim', params.dataFim)
    if (params.programaId) queryString.append('programa_id', params.programaId.toString())
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    
    return http.get(`${API_ENDPOINTS.relatorios.termometro}?${queryString.toString()}`)
  },

  /**
   * Busca relatório semáforo
   */
  async semaforo(params: RelatorioAnaliticoParams = {}): Promise<ApiResponse<unknown>> {
    const queryString = new URLSearchParams()
    if (params.dataInicio) queryString.append('data_inicio', params.dataInicio)
    if (params.dataFim) queryString.append('data_fim', params.dataFim)
    if (params.programaId) queryString.append('programa_id', params.programaId.toString())
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    
    return http.get(`${API_ENDPOINTS.relatorios.semaforo}?${queryString.toString()}`)
  },

  /**
   * Busca relatório individual do participante
   */
  async individual(
    participanteId: number, 
    params: { dataInicio?: string; dataFim?: string } = {}
  ): Promise<ApiResponse<unknown>> {
    const queryString = new URLSearchParams()
    if (params.dataInicio) queryString.append('data_inicio', params.dataInicio)
    if (params.dataFim) queryString.append('data_fim', params.dataFim)
    
    return http.get(`${API_ENDPOINTS.relatorios.individual(participanteId)}?${queryString.toString()}`)
  },

  /**
   * Exporta relatório
   */
  async exportar(params: ExportarRelatorioParams): Promise<Blob> {
    const queryString = new URLSearchParams()
    queryString.append('formato', params.formato)
    queryString.append('tipo', params.tipo)
    if (params.dataInicio) queryString.append('data_inicio', params.dataInicio)
    if (params.dataFim) queryString.append('data_fim', params.dataFim)
    if (params.programaId) queryString.append('programa_id', params.programaId.toString())
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    
    const response = await fetch(
      `${API_ENDPOINTS.relatorios.exportar}?${queryString.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Erro ao exportar relatório')
    }
    
    return response.blob()
  },
}
