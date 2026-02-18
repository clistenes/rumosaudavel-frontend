import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse } from '@/types/auth'

export const participantesService = {
  async adicionarBatch(data: FormData) {
    return http.post<{ criados: number; duplicados: string[]; total: number }>(
      API_ENDPOINTS.participantes.importar,
      data
    ) as Promise<ApiResponse<{ criados: number; duplicados: string[]; total: number }>>
  },

  async obter(participanteId: number) {
    return http.get<unknown>(API_ENDPOINTS.participantes.get(participanteId)) as Promise<ApiResponse<unknown>>
  },

  async obterDadosPessoais(participanteId: number) {
    return http.get<unknown[]>(API_ENDPOINTS.participantes.dadosPessoais(participanteId)) as Promise<ApiResponse<unknown[]>>
  },

  async obterHistoricoCoaching(participanteId: number) {
    return http.get<unknown[]>(API_ENDPOINTS.participantes.historicoCoaching(participanteId)) as Promise<ApiResponse<unknown[]>>
  },

  async adicionarHistoricoCoaching(participanteId: number, data: FormData) {
    return http.post<unknown>(API_ENDPOINTS.participantes.historicoCoaching(participanteId), data) as Promise<ApiResponse<unknown>>
  },

  async atualizarHistoricoCoaching(historicoId: number, data: FormData) {
    return http.put<unknown>(API_ENDPOINTS.participantes.deleteHistoricoCoaching(historicoId), data) as Promise<ApiResponse<unknown>>
  },

  async deletarHistoricoCoaching(historicoId: number) {
    return http.delete<void>(API_ENDPOINTS.participantes.deleteHistoricoCoaching(historicoId)) as Promise<ApiResponse<void>>
  },

  async obterContatos(participanteId: number) {
    return http.get<unknown[]>(API_ENDPOINTS.participantes.contatos(participanteId)) as Promise<ApiResponse<unknown[]>>
  },

  async adicionarContato(
    participanteId: number,
    data: { data: string; hora_inicio: string; hora_final: string; tipo_contato: string; contato: string }
  ) {
    return http.post<unknown>(API_ENDPOINTS.participantes.contatos(participanteId), data) as Promise<ApiResponse<unknown>>
  },

  async deletarContato(contatoId: number) {
    return http.delete<void>(API_ENDPOINTS.participantes.deleteContato(contatoId)) as Promise<ApiResponse<void>>
  },

  async simularAcesso(participanteId: number) {
    return http.post<{ token: string; user: unknown }>(API_ENDPOINTS.participantes.simularAcesso(participanteId), {}) as Promise<
      ApiResponse<{ token: string; user: unknown }>
    >
  },

  async pesquisarUsuarios(search?: string, page: number = 1, perPage: number = 20) {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    query.append('page', String(page))
    query.append('per_page', String(perPage))
    return http.get<unknown[]>(`${API_ENDPOINTS.participantes.pesquisarUsuarios}?${query.toString()}`) as Promise<ApiResponse<unknown[]>>
  },
}
