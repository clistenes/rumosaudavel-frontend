/**
 * Servico de Questionarios
 */

import { http, API_ENDPOINTS } from './http.service'
import { demoDbService } from './demo-db.service'
import type {
  ApiResponse,
  PaginatedResponse,
  Questionario,
  Pergunta,
  Resposta,
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

const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

const paginate = <T>(items: T[], page = 1, perPage = 10): PaginatedResponse<T> => ({
  data: items.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
  meta: {
    page,
    perPage,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / perPage)),
  },
})

const success = <T>(data: T, message?: string): ApiResponse<T> => ({ success: true, data, message })

export const questionarioService = {
  async listar(params: ListarQuestionariosParams = {}): Promise<ApiResponse<PaginatedResponse<Questionario>>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      let questionarios = [...(state.questionarios as any[])]

      if (params.search) {
        const term = params.search.toLowerCase()
        questionarios = questionarios.filter((item) =>
          String(item.nome || item.titulo || '').toLowerCase().includes(term) ||
          String(item.descricao || '').toLowerCase().includes(term)
        )
      }

      if (params.categoria) {
        questionarios = questionarios.filter((item) => String(item.categoria || '').toLowerCase() === params.categoria?.toLowerCase())
      }

      if (params.tipo) {
        questionarios = questionarios.filter((item) => String(item.tipo || '').toLowerCase() === params.tipo?.toLowerCase())
      }

      if (params.status) {
        questionarios = questionarios.filter((item) => String(item.status || '').toLowerCase() === params.status?.toLowerCase())
      }

      return success(paginate(questionarios as Questionario[], params.page || 1, params.perPage || 10))
    }

    const queryString = new URLSearchParams()
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.categoria) queryString.append('categoria', params.categoria)
    if (params.tipo) queryString.append('tipo', params.tipo)
    if (params.status) queryString.append('status', params.status)

    const response = await http.get<any>(`${API_ENDPOINTS.questionarios.list}?${queryString.toString()}`)

    // Normaliza respostas heterogêneas da API (array direto, envelope ou objeto)
    const payload: any = (response as any)?.data ?? response
    const page = params.page || 1
    const perPage = params.perPage || 10

    if (Array.isArray(payload)) {
      const data = payload as Questionario[]
      return success({
        data,
        meta: {
          page,
          perPage,
          total: data.length,
          totalPages: Math.max(1, Math.ceil(data.length / perPage)),
        },
      } as PaginatedResponse<Questionario>)
    }

    if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
      const maybeMeta = payload.meta || {}
      const data = payload.data as Questionario[]
      return success({
        data,
        meta: {
          page: Number(maybeMeta.page ?? maybeMeta.current_page ?? page),
          perPage: Number(maybeMeta.perPage ?? maybeMeta.per_page ?? perPage),
          total: Number(maybeMeta.total ?? data.length),
          totalPages: Number(maybeMeta.totalPages ?? maybeMeta.last_page ?? Math.max(1, Math.ceil(data.length / perPage))),
        },
      } as PaginatedResponse<Questionario>)
    }

    if (payload && typeof payload === 'object') {
      const data = [payload as Questionario]
      return success({
        data,
        meta: {
          page,
          perPage,
          total: data.length,
          totalPages: 1,
        },
      } as PaginatedResponse<Questionario>)
    }

    return success({
      data: [],
      meta: {
        page,
        perPage,
        total: 0,
        totalPages: 1,
      },
    } as PaginatedResponse<Questionario>)
  },

  async buscarPorId(id: number): Promise<ApiResponse<Questionario>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const questionario = (state.questionarios as any[]).find((item) => Number(item.id) === Number(id))

      if (!questionario) {
        return {
          success: false,
          data: null as unknown as Questionario,
          message: 'Questionario nao encontrado',
        }
      }

      return success(questionario as Questionario)
    }

    return http.get(API_ENDPOINTS.questionarios.get(id))
  },

  async criar(data: CriarQuestionarioData): Promise<ApiResponse<Questionario>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.questionarios.map((item) => Number(item.id)), 0) + 1

        prev.questionarios.push({
          id: nextId,
          titulo: data.titulo,
          nome: data.titulo,
          codigo: data.titulo,
          descricao: data.descricao,
          categoria: data.categoria,
          tipo: data.tipo,
          status: 'ativo',
          aplicacoesTotal: 0,
          aplicacoesUltimoMes: 0,
        } as any)

        return prev
      })

      return success(next.questionarios[next.questionarios.length - 1] as unknown as Questionario, 'Questionario criado com sucesso')
    }

    return http.post(API_ENDPOINTS.questionarios.create, data)
  },

  async atualizar(id: number, data: Partial<Questionario>): Promise<ApiResponse<Questionario>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        prev.questionarios = prev.questionarios.map((questionario) =>
          Number(questionario.id) === Number(id)
            ? { ...questionario, ...(data as any) }
            : questionario
        ) as any

        return prev
      })

      const questionario = next.questionarios.find((item) => Number(item.id) === Number(id))
      return success(questionario as unknown as Questionario, 'Questionario atualizado com sucesso')
    }

    return http.put(API_ENDPOINTS.questionarios.update(id), data)
  },

  async remover(id: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.questionarios = prev.questionarios.filter((item) => Number(item.id) !== Number(id)) as any
        prev.perguntas = prev.perguntas.filter((item) => Number(item.id_questionario) !== Number(id)) as any
        prev.alternativas = prev.alternativas.filter((item) => Number(item.id_questionario) !== Number(id)) as any
        prev.dimensoes = prev.dimensoes.filter((item) => Number(item.id_questionario) !== Number(id)) as any
        prev.grupos = prev.grupos.filter((item) => Number(item.id_questionario) !== Number(id)) as any

        prev.programas = prev.programas.map((programa) => ({
          ...programa,
          questionariosVinculados: (programa.questionariosVinculados || []).filter(
            (v) => Number(v.questionarioId) !== Number(id)
          ),
        })) as any

        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.delete(API_ENDPOINTS.questionarios.delete(id))
  },

  async listarPerguntas(questionarioId: number): Promise<ApiResponse<Pergunta[]>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const perguntas = state.perguntas
        .filter((item) => Number(item.id_questionario) === Number(questionarioId))
        .sort((a, b) => Number(a.pos || 0) - Number(b.pos || 0)) as unknown as Pergunta[]

      return success(perguntas)
    }

    return http.get(API_ENDPOINTS.questionarios.perguntas(questionarioId))
  },

  async adicionarPergunta(
    questionarioId: number,
    data: Omit<Pergunta, 'id' | 'questionarioId'>
  ): Promise<ApiResponse<Pergunta>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.perguntas.map((item) => Number(item.id)), 0) + 1
        prev.perguntas.push({
          ...(data as any),
          id: nextId,
          id_questionario: questionarioId,
        })
        return prev
      })

      return success(next.perguntas[next.perguntas.length - 1] as unknown as Pergunta, 'Pergunta adicionada com sucesso')
    }

    return http.post(API_ENDPOINTS.questionarios.perguntas(questionarioId), data)
  },

  async atualizarPergunta(
    _questionarioId: number,
    perguntaId: number,
    data: Partial<Pergunta>
  ): Promise<ApiResponse<Pergunta>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        prev.perguntas = prev.perguntas.map((pergunta) =>
          Number(pergunta.id) === Number(perguntaId)
            ? { ...pergunta, ...(data as any) }
            : pergunta
        ) as any

        return prev
      })

      const pergunta = next.perguntas.find((item) => Number(item.id) === Number(perguntaId))
      return success(pergunta as unknown as Pergunta, 'Pergunta atualizada com sucesso')
    }

    return http.put(API_ENDPOINTS.questionarios.atualizarPergunta(perguntaId), data)
  },

  async removerPergunta(_questionarioId: number, perguntaId: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.perguntas = prev.perguntas.filter((item) => Number(item.id) !== Number(perguntaId)) as any
        prev.alternativas = prev.alternativas.filter((item) => Number(item.id_pergunta) !== Number(perguntaId)) as any
        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.delete(API_ENDPOINTS.questionarios.deletarPergunta(perguntaId))
  },

  async reordenarPerguntas(
    questionarioId: number,
    ordem: { perguntaId: number; ordem: number }[]
  ): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.perguntas = prev.perguntas.map((pergunta) => {
          if (Number(pergunta.id_questionario) !== Number(questionarioId)) return pergunta
          const found = ordem.find((item) => Number(item.perguntaId) === Number(pergunta.id))
          return found ? { ...pergunta, pos: found.ordem } : pergunta
        }) as any

        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.put(`${API_ENDPOINTS.questionarios.perguntas(questionarioId)}/ordem`, { ordem })
  },

  async responder(
    questionarioId: number,
    data: ResponderQuestionarioData
  ): Promise<ApiResponse<{ resultado: unknown; pontuacao: number }>> {
    if (isDemoMode()) {
      const pontuacao = data.respostas.reduce((total, item) => total + Number(item.valor || 0), 0)
      return success({
        resultado: {
          questionarioId,
          totalRespostas: data.respostas.length,
        },
        pontuacao,
      }, 'Respostas registradas com sucesso')
    }

    return http.post(API_ENDPOINTS.questionarios.respostas(questionarioId), data)
  },

  async buscarRespostas(
    questionarioId: number,
    participanteId: number
  ): Promise<ApiResponse<Resposta[]>> {
    if (isDemoMode()) {
      return success([])
    }

    return http.get(`${API_ENDPOINTS.questionarios.respostas(questionarioId)}?participante_id=${participanteId}`)
  },
}
