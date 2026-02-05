import api from './api'
import { ApiResponse } from '@/types/auth'

export const questionariosService = {
  async listar(search?: string, page: number = 1) {
    const response = await api.get<ApiResponse<any[]>>('/adm/questionarios', {
      params: { search, page },
    })
    return response.data
  },

  async criar(data: { nome: string; nome_site?: string; descricao?: string; info_adm?: string }) {
    const response = await api.post<ApiResponse<any>>('/adm/questionarios', data)
    return response.data
  },

  async obter(id: number) {
    const response = await api.get<ApiResponse<any>>(`/adm/questionarios/${id}`)
    return response.data
  },

  async atualizar(id: number, data: { nome?: string; nome_site?: string; descricao?: string; info_adm?: string }) {
    const response = await api.put<ApiResponse<any>>(`/adm/questionarios/${id}`, data)
    return response.data
  },

  async deletar(id: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/questionarios/${id}`)
    return response.data
  },

  async duplicar(id: number) {
    const response = await api.post<ApiResponse<any>>(`/adm/questionarios/${id}/duplicar`)
    return response.data
  },

  async exportar(id: number) {
    const response = await api.get(`/adm/questionarios/${id}/exportar`, {
      responseType: 'blob',
    })
    return response.data
  },

  async definirTipoResultado(id: number, tipoResultado: string) {
    const response = await api.post<ApiResponse<void>>(`/adm/questionarios/${id}/tipo-resultado`, {
      tipo_resultado: tipoResultado,
    })
    return response.data
  },

  async salvarOrdenacao(id: number, data: any[]) {
    const response = await api.post<ApiResponse<void>>(`/adm/questionarios/${id}/ordenar`, data)
    return response.data
  },

  async listarPerguntas(id: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/questionarios/${id}/perguntas`)
    return response.data
  },

  async criarPergunta(questionarioId: number, data: any) {
    const response = await api.post<ApiResponse<any>>(`/adm/questionarios/${questionarioId}/perguntas`, data)
    return response.data
  },

  async obterPergunta(id: number) {
    const response = await api.get<ApiResponse<any>>(`/adm/perguntas/${id}`)
    return response.data
  },

  async atualizarPergunta(id: number, data: any) {
    const response = await api.put<ApiResponse<any>>(`/adm/perguntas/${id}`, data)
    return response.data
  },

  async deletarPergunta(id: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/perguntas/${id}`)
    return response.data
  },

  async criarPerguntaDependente(data: any) {
    const response = await api.post<ApiResponse<any>>('/adm/perguntas/dependente', data)
    return response.data
  },

  async adicionarAlternativa(perguntaId: number, data: { alternativa: string; pontuacao: number; tipo: string; comentario?: string }) {
    const response = await api.post<ApiResponse<any>>(`/adm/perguntas/${perguntaId}/alternativas`, data)
    return response.data
  },

  async deletarAlternativa(alternativaId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/alternativas/${alternativaId}`)
    return response.data
  },

  async listarIntervalos(questionarioId: number) {
    const response = await api.get<ApiResponse<any[]>>(`/adm/questionarios/${questionarioId}/intervalos`)
    return response.data
  },

  async criarIntervalo(questionarioId: number, data: { cor: string; legenda: string; intervalo_inicio: number; intervalo_termino: number; texto?: string }) {
    const response = await api.post<ApiResponse<any>>(`/adm/questionarios/${questionarioId}/intervalos`, data)
    return response.data
  },

  async atualizarIntervalo(intervaloId: number, data: any) {
    const response = await api.put<ApiResponse<any>>(`/adm/intervalos/${intervaloId}`, data)
    return response.data
  },

  async deletarIntervalo(intervaloId: number) {
    const response = await api.delete<ApiResponse<void>>(`/adm/intervalos/${intervaloId}`)
    return response.data
  },

  async salvarTextos(questionarioId: number, data: { texto_depressao?: string; texto_ansiedade?: string }) {
    const response = await api.post<ApiResponse<void>>(`/adm/questionarios/${questionarioId}/textos`, data)
    return response.data
  },
}
