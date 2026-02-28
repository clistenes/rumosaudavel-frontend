/**
 * Servico de Programas
 */

import { http, API_ENDPOINTS } from './http.service'
import { demoDbService } from './demo-db.service'
import type {
  ApiResponse,
  PaginatedResponse,
  Programa,
  Questionario,
} from '@/types/api'

export interface ListarProgramasParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
}

export interface CriarProgramaData {
  nome: string
  descricao: string
  dataInicio?: string
  dataFim?: string
}

export interface VincularQuestionarioData {
  questionarioId: number
  ordem: number
  obrigatorio: boolean
  permiteReavaliacao: boolean
  intervaloDias: number
  dependenciaId?: number
  dependenciaCondicao?: string
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

export const programaService = {
  async listar(params: ListarProgramasParams = {}): Promise<ApiResponse<PaginatedResponse<Programa>>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      let programas = [...(state.programas as any[])]

      if (params.search) {
        const term = params.search.toLowerCase()
        programas = programas.filter((item) =>
          String(item.nome || '').toLowerCase().includes(term) ||
          String(item.descricao || '').toLowerCase().includes(term)
        )
      }

      if (params.status) {
        programas = programas.filter((item) => String(item.status || '').toLowerCase() === params.status?.toLowerCase())
      }

      return success(paginate(programas as Programa[], params.page || 1, params.perPage || 10))
    }

    const queryString = new URLSearchParams()
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)

    return http.get(`${API_ENDPOINTS.programas.list}?${queryString.toString()}`)
  },

  async buscarPorId(id: number): Promise<ApiResponse<Programa>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const programa = (state.programas as any[]).find((item) => Number(item.id) === Number(id))

      if (!programa) {
        return {
          success: false,
          data: null as unknown as Programa,
          message: 'Programa nao encontrado',
        }
      }

      return success(programa as Programa)
    }

    return http.get(API_ENDPOINTS.programas.get(id))
  },

  async criar(data: CriarProgramaData): Promise<ApiResponse<Programa>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.programas.map((item) => Number(item.id)), 0) + 1

        prev.programas.push({
          id: nextId,
          nome: data.nome,
          descricao: data.descricao,
          dataInicio: data.dataInicio,
          dataFim: data.dataFim,
          duracaoMeses: 6,
          status: 'ativo',
          empresasParticipantes: [],
          empresasVinculadas: [],
          questionariosVinculados: [],
          participantesAtivos: 0,
          avaliacaoMedia: 0,
          sessoesRealizadas: 0,
        } as any)

        return prev
      })

      return success(next.programas[next.programas.length - 1] as unknown as Programa, 'Programa criado com sucesso')
    }

    return http.post(API_ENDPOINTS.programas.create, data)
  },

  async atualizar(id: number, data: Partial<Programa>): Promise<ApiResponse<Programa>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) =>
          Number(programa.id) === Number(id)
            ? { ...programa, ...(data as any) }
            : programa
        ) as any

        return prev
      })

      const programa = next.programas.find((item) => Number(item.id) === Number(id))
      return success(programa as unknown as Programa, 'Programa atualizado com sucesso')
    }

    return http.put(API_ENDPOINTS.programas.update(id), data)
  },

  async remover(id: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.filter((item) => Number(item.id) !== Number(id)) as any
        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.delete(API_ENDPOINTS.programas.delete(id))
  },

  async listarQuestionarios(programaId: number): Promise<ApiResponse<Questionario[]>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const programa = (state.programas as any[]).find((item) => Number(item.id) === Number(programaId))
      const questionarioIds = (programa?.questionariosVinculados || []).map((v: any) => Number(v.questionarioId))
      const questionarios = state.questionarios.filter((questionario) => questionarioIds.includes(Number(questionario.id))) as unknown as Questionario[]
      return success(questionarios)
    }

    return http.get(API_ENDPOINTS.programas.vincularQuestionario(programaId))
  },

  async vincularQuestionario(
    programaId: number,
    data: VincularQuestionarioData
  ): Promise<ApiResponse<Questionario>> {
    if (isDemoMode()) {
      const now = Date.now()
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa

          const atuais = programa.questionariosVinculados || []
          if (atuais.some((v) => Number(v.questionarioId) === Number(data.questionarioId))) {
            return programa
          }

          return {
            ...programa,
            questionariosVinculados: [
              ...atuais,
              {
                id: now,
                ...data,
              },
            ],
          }
        }) as any

        return prev
      })

      const state = demoDbService.getState()
      const questionario = state.questionarios.find((item) => Number(item.id) === Number(data.questionarioId))
      return success(questionario as unknown as Questionario, 'Questionario vinculado com sucesso')
    }

    return http.post(API_ENDPOINTS.programas.vincularQuestionario(programaId), data)
  },

  async desvincularQuestionario(programaId: number, questionarioId: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa
          return {
            ...programa,
            questionariosVinculados: (programa.questionariosVinculados || []).filter(
              (item) => Number(item.questionarioId) !== Number(questionarioId)
            ),
          }
        }) as any

        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.delete(API_ENDPOINTS.programas.desvincularQuestionario(programaId, questionarioId))
  },

  async reordenarQuestionarios(
    programaId: number,
    ordem: { questionarioId: number; ordem: number }[]
  ): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa

          const ordenados = [...(programa.questionariosVinculados || [])].map((item) => {
            const found = ordem.find((o) => Number(o.questionarioId) === Number(item.questionarioId))
            return found ? { ...item, ordem: found.ordem } : item
          })

          return {
            ...programa,
            questionariosVinculados: ordenados.sort((a, b) => Number(a.ordem) - Number(b.ordem)),
          }
        }) as any

        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.put(`${API_ENDPOINTS.programas.vincularQuestionario(programaId)}/ordem`, { ordem })
  },

  async atualizarIntervalos(
    programaId: number,
    intervalos: { nome: string; dias: number; cor: string }[]
  ): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) =>
          Number(programa.id) === Number(programaId)
            ? { ...programa, intervalos }
            : programa
        ) as any
        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.put(API_ENDPOINTS.programas.intervalos(programaId), { intervalos })
  },
}
