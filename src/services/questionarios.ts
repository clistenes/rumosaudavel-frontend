import { http, API_ENDPOINTS } from './http.service'
import type { ApiResponse } from '@/types/auth'

export const questionariosService = {
  async listar(search?: string, page: number = 1) {
    const query = new URLSearchParams()
    if (search) query.append('search', search)
    query.append('page', String(page))
    return http.get<any[]>(`${API_ENDPOINTS.questionarios.list}?${query.toString()}`) as Promise<ApiResponse<any[]>>
  },

  async criar(data: { nome: string; nome_site?: string; descricao?: string; info_adm?: string }) {
    return http.post<any>(API_ENDPOINTS.questionarios.create, data) as Promise<ApiResponse<any>>
  },

  async obter(id: number) {
    return http.get<any>(API_ENDPOINTS.questionarios.get(id)) as Promise<ApiResponse<any>>
  },

  async atualizar(id: number, data: { nome?: string; nome_site?: string; descricao?: string; info_adm?: string }) {
    return http.put<any>(API_ENDPOINTS.questionarios.update(id), data) as Promise<ApiResponse<any>>
  },

  async deletar(id: number) {
    return http.delete<void>(API_ENDPOINTS.questionarios.delete(id)) as Promise<ApiResponse<void>>
  },

  async duplicar(id: number) {
    return http.post<any>(API_ENDPOINTS.questionarios.duplicar(id), {}) as Promise<ApiResponse<any>>
  },

  async exportar(id: number) {
    const response = await http.get<Blob>(API_ENDPOINTS.questionarios.exportar(id), { parseAs: 'blob' })
    return response.data
  },

  async definirTipoResultado(id: number, tipoResultado: string) {
    return http.post<void>(API_ENDPOINTS.questionarios.tipoResultado(id), {
      tipo_resultado: tipoResultado,
    }) as Promise<ApiResponse<void>>
  },

  async salvarOrdenacao(id: number, data: unknown[]) {
    return http.post<void>(API_ENDPOINTS.questionarios.ordenar(id), data) as Promise<ApiResponse<void>>
  },

  async listarPerguntas(id: number) {
    return http.get<unknown[]>(API_ENDPOINTS.questionarios.perguntas(id)) as Promise<ApiResponse<unknown[]>>
  },

  async criarPergunta(questionarioId: number, data: unknown) {
    return http.post<any>(API_ENDPOINTS.questionarios.perguntas(questionarioId), data) as Promise<ApiResponse<any>>
  },

  async obterPergunta(id: number) {
    return http.get<any>(API_ENDPOINTS.questionarios.obterPergunta(id)) as Promise<ApiResponse<any>>
  },

  async atualizarPergunta(id: number, data: unknown) {
    return http.put<any>(API_ENDPOINTS.questionarios.atualizarPergunta(id), data) as Promise<ApiResponse<any>>
  },

  async deletarPergunta(id: number) {
    return http.delete<void>(API_ENDPOINTS.questionarios.deletarPergunta(id)) as Promise<ApiResponse<void>>
  },

  async criarPerguntaDependente(data: unknown) {
    return http.post<any>(API_ENDPOINTS.questionarios.perguntaDependente, data) as Promise<ApiResponse<any>>
  },

  async adicionarAlternativa(perguntaId: number, data: { alternativa: string; pontuacao: number; tipo: string; comentario?: string }) {
    return http.post<any>(API_ENDPOINTS.questionarios.adicionarAlternativa(perguntaId), data) as Promise<ApiResponse<any>>
  },

  async deletarAlternativa(alternativaId: number) {
    return http.delete<void>(API_ENDPOINTS.questionarios.deletarAlternativa(alternativaId)) as Promise<ApiResponse<void>>
  },

  async listarIntervalos(questionarioId: number) {
    return http.get<any[]>(API_ENDPOINTS.questionarios.intervalos(questionarioId)) as Promise<ApiResponse<any[]>>
  },

  async criarIntervalo(questionarioId: number, data: { cor: string; legenda: string; intervalo_inicio: number; intervalo_termino: number; texto?: string }) {
    return http.post<any>(API_ENDPOINTS.questionarios.intervalos(questionarioId), data) as Promise<ApiResponse<any>>
  },

  async atualizarIntervalo(intervaloId: number, data: unknown) {
    return http.put<any>(API_ENDPOINTS.questionarios.atualizarIntervalo(intervaloId), data) as Promise<ApiResponse<any>>
  },

  async deletarIntervalo(intervaloId: number) {
    return http.delete<void>(API_ENDPOINTS.questionarios.deletarIntervalo(intervaloId)) as Promise<ApiResponse<void>>
  },

  async salvarTextos(questionarioId: number, data: { texto_depressao?: string; texto_ansiedade?: string }) {
    return http.post<void>(API_ENDPOINTS.questionarios.salvarTextos(questionarioId), data) as Promise<ApiResponse<void>>
  },
}
