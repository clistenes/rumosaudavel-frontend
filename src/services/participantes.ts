import api from './api'
import { ApiResponse } from '@/types/auth'

export const participantesService = {
  async adicionarBatch(data: FormData) {
    const response = await api.post<ApiResponse<{ criados: number; duplicados: string[]; total: number }>>(
      '/adm/participantes/batch',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async obter(participanteId: number) {
    const response = await api.get<ApiResponse<any>>(`/adm/participantes/${participanteId}`)
    return response.data
  },

  async obterDadosPessoais(participanteId: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/participantes/${participanteId}/dados-pessoais`)
    return response.data
  },

  async obterHistoricoCoaching(participanteId: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/participantes/${participanteId}/historico-coaching`)
    return response.data
  },

  async adicionarHistoricoCoaching(participanteId: number, data: FormData) {
    const response = await api.post<ApiResponse<any>>(
      `/adm/participantes/${participanteId}/historico-coaching`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async atualizarHistoricoCoaching(historicoId: number, data: FormData) {
    const response = await api.put<ApiResponse<any>>(
      `/adm/historico-coaching/${historicoId}`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return response.data
  },

  async deletarHistoricoCoaching(historicoId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/historico-coaching/${historicoId}`)
    return response.data
  },

  async obterContatos(participanteId: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/participantes/${participanteId}/contatos`)
    return response.data
  },

  async adicionarContato(participanteId: number, data: { data: string; hora_inicio: string; hora_final: string; tipo_contato: string; contato: string }) {
    const response = await api.post<ApiResponse<any>>(`/adm/participantes/${participanteId}/contatos`, data)
    return response.data
  },

  async deletarContato(contatoId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/contatos/${contatoId}`)
    return response.data
  },

  async simularAcesso(participanteId: number) {
    const response = await api.post<ApiResponse<{ token: string; user: any }>>(
      `/adm/participantes/${participanteId}/simular-acesso`
    )
    return response.data
  },

  async pesquisarUsuarios(search?: string, page: number = 1, perPage: number = 20) {
    const response = await api.get<ApiResponse<any[]>>('/adm/pesquisar-usuarios', {
      params: { search, page, per_page: perPage },
    })
    return response.data
  },
}
