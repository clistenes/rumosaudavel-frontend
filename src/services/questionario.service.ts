/**
 * Serviço de Questionários
 */

import { http, API_ENDPOINTS } from './http.service'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Questionario,
  Pergunta,
  Resposta 
} from '@/types/api'

export interface ListarQuestionariosParams {
  page?: number
  perPage?: number
  search?: string
  categoria?: string
  tipo?: string
  status?: string
}

export interface CriarQuestionarioData {
  titulo: string
  descricao: string
  categoria: string
  tipo: string
}

export interface ResponderQuestionarioData {
  respostas: {
    perguntaId: number
    valor: string | number
  }[]
}

export const questionarioService = {
  /**
   * Lista todos os questionários
   */
  async listar(params: ListarQuestionariosParams = {}): Promise<ApiResponse<PaginatedResponse<Questionario>>> {
    const queryString = new URLSearchParams()
    
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.categoria) queryString.append('categoria', params.categoria)
    if (params.tipo) queryString.append('tipo', params.tipo)
    if (params.status) queryString.append('status', params.status)
    
    return http.get(`${API_ENDPOINTS.questionarios.list}?${queryString.toString()}`)
  },

  /**
   * Busca um questionário por ID
   */
  async buscarPorId(id: number): Promise<ApiResponse<Questionario>> {
    return http.get(API_ENDPOINTS.questionarios.get(id))
  },

  /**
   * Cria um novo questionário
   */
  async criar(data: CriarQuestionarioData): Promise<ApiResponse<Questionario>> {
    return http.post(API_ENDPOINTS.questionarios.create, data)
  },

  /**
   * Atualiza um questionário
   */
  async atualizar(id: number, data: Partial<Questionario>): Promise<ApiResponse<Questionario>> {
    return http.put(API_ENDPOINTS.questionarios.update(id), data)
  },

  /**
   * Remove um questionário
   */
  async remover(id: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.questionarios.delete(id))
  },

  /**
   * Lista perguntas de um questionário
   */
  async listarPerguntas(questionarioId: number): Promise<ApiResponse<Pergunta[]>> {
    return http.get(API_ENDPOINTS.questionarios.perguntas(questionarioId))
  },

  /**
   * Adiciona uma pergunta ao questionário
   */
  async adicionarPergunta(
    questionarioId: number, 
    data: Omit<Pergunta, 'id' | 'questionarioId'>
  ): Promise<ApiResponse<Pergunta>> {
    return http.post(API_ENDPOINTS.questionarios.perguntas(questionarioId), data)
  },

  /**
   * Atualiza uma pergunta
   */
  async atualizarPergunta(
    _questionarioId: number,
    perguntaId: number, 
    data: Partial<Pergunta>
  ): Promise<ApiResponse<Pergunta>> {
    return http.put(API_ENDPOINTS.questionarios.atualizarPergunta(perguntaId), data)
  },

  /**
   * Remove uma pergunta
   */
  async removerPergunta(_questionarioId: number, perguntaId: number): Promise<ApiResponse<void>> {
    return http.delete(API_ENDPOINTS.questionarios.deletarPergunta(perguntaId))
  },

  /**
   * Reordena perguntas
   */
  async reordenarPerguntas(
    questionarioId: number, 
    ordem: { perguntaId: number; ordem: number }[]
  ): Promise<ApiResponse<void>> {
    return http.put(`${API_ENDPOINTS.questionarios.perguntas(questionarioId)}/ordem`, { ordem })
  },

  /**
   * Envia respostas do questionário
   */
  async responder(
    questionarioId: number, 
    data: ResponderQuestionarioData
  ): Promise<ApiResponse<{ resultado: unknown; pontuacao: number }>> {
    return http.post(API_ENDPOINTS.questionarios.respostas(questionarioId), data)
  },

  /**
   * Busca respostas do participante
   */
  async buscarRespostas(
    questionarioId: number, 
    participanteId: number
  ): Promise<ApiResponse<Resposta[]>> {
    return http.get(`${API_ENDPOINTS.questionarios.respostas(questionarioId)}?participante_id=${participanteId}`)
  },
}
