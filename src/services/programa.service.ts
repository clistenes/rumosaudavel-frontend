/**
 * Servico de Programas
 */

import { http, API_ENDPOINTS } from './http.service'
import { demoDbService } from './demo-db.service'
import type {
  ApiDomainError,
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
  introducao?: string
  descricao?: string
  questionarios?: number[]
  ordenacao_questionarios?: string
  dataInicio?: string
  dataFim?: string
}

export interface AtualizarProgramaData {
  nome?: string
  introducao?: string
  descricao?: string
  questionarios?: number[]
  ordenacao_questionarios?: string
  status?: string
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

export interface EmpresaVinculadaPrograma {
  id: number
  nome: string
  intervalo_inicio?: string | null
  intervalo_termino?: string | null
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

const normalizeProgramaItem = (item: unknown): Programa => {
  const source = (item || {}) as Record<string, unknown>

  return {
    id: Number(source.id || 0),
    nome: String(source.nome ?? source.name ?? ''),
    descricao: String(source.descricao ?? source.introducao ?? ''),
    status: (String(source.status || 'ativo') as Programa['status']),
    dataCriacao: String(source.dataCriacao ?? source.created_at ?? source.createdAt ?? ''),
    dataInicio: source.dataInicio ? String(source.dataInicio) : undefined,
    dataFim: source.dataFim ? String(source.dataFim) : undefined,
    totalEmpresas: Number(source.totalEmpresas || 0),
    totalParticipantes: Number(source.totalParticipantes || 0),
    totalQuestionarios: Number(source.totalQuestionarios || 0),
    progressoMedio: Number(source.progressoMedio || 0),
  }
}

const isPaginatedProgramResponse = (value: unknown): value is PaginatedResponse<Programa> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return 'data' in value
}

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
    const endpoint = queryString.toString()
      ? `${API_ENDPOINTS.programas.list}?${queryString.toString()}`
      : API_ENDPOINTS.programas.list
    const response = await http.get<unknown>(endpoint)
    const payload = response.data

    if (Array.isArray(payload)) {
      const normalizados = payload.map(normalizeProgramaItem)
      return success(paginate(normalizados, params.page || 1, params.perPage || 10))
    }

    if (isPaginatedProgramResponse(payload)) {
      const itens = Array.isArray(payload.data) ? payload.data.map(normalizeProgramaItem) : []
      const page = payload.meta?.page || params.page || 1
      const perPage = payload.meta?.perPage || params.perPage || 10
      const total = payload.meta?.total || itens.length
      const totalPages = payload.meta?.totalPages || Math.max(1, Math.ceil(total / Math.max(perPage, 1)))

      return success({
        data: itens,
        meta: { page, perPage, total, totalPages },
      })
    }

    return success(paginate([], params.page || 1, params.perPage || 10))
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

    const response = await http.get<unknown>(API_ENDPOINTS.programas.get(id))
    return success(normalizeProgramaItem(response.data))
  },

  async listarEmpresasVinculadas(programaId: number): Promise<ApiResponse<EmpresaVinculadaPrograma[]>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const programa = (state.programas as any[]).find((item) => Number(item.id) === Number(programaId))
      const vinculos = Array.isArray(programa?.empresasVinculadas) ? programa.empresasVinculadas : []
      const empresas = vinculos
        .map((vinculo: any) => state.empresas.find((empresa: any) => Number(empresa.id) === Number(vinculo.empresaId)))
        .filter(Boolean)
        .map((empresa: any) => ({
          id: Number(empresa.id),
          nome: String(empresa.nome || ''),
        }))

      return success(empresas)
    }

    try {
      return await http.get<EmpresaVinculadaPrograma[]>(
        `${API_ENDPOINTS.programas.listEmpresasVinculadas}?id=${programaId}`
      )
    } catch (error) {
      const apiError = error as ApiDomainError
      if (apiError?.status === 404) {
        return success([])
      }
      throw error
    }
  },

  async vincularEmpresa(programaId: number, empresaId: number): Promise<ApiResponse<{ status?: string }>> {
    if (isDemoMode()) {
      const nowIso = new Date().toISOString()
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa

          const atuais = Array.isArray(programa.empresasVinculadas) ? programa.empresasVinculadas : []
          const jaVinculada = atuais.some((v: any) => Number(v.empresaId) === Number(empresaId))
          if (jaVinculada) return programa

          return {
            ...programa,
            empresasVinculadas: [
              ...atuais,
              {
                id: Number(empresaId),
                empresaId: Number(empresaId),
                intervaloInicio: null,
                intervaloFim: null,
                indeterminado: true,
                acessoPublicoAtivo: false,
                usuariosPermitidos: [],
                createdAt: nowIso,
                updatedAt: nowIso,
              },
            ],
          }
        }) as any

        return prev
      })

      return success({ status: 'vinculado' })
    }

    return http.post(API_ENDPOINTS.programas.vincular, {
      id_empresa: empresaId,
      id_programa: programaId,
    })
  },

  async definirIntervaloEmpresa(
    programaId: number,
    empresaId: number,
    data: { inicio: string; termino: string }
  ): Promise<ApiResponse<{ status?: string }>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa
          const vinculos = Array.isArray(programa.empresasVinculadas) ? programa.empresasVinculadas : []

          return {
            ...programa,
            empresasVinculadas: vinculos.map((vinculo: any) =>
              Number(vinculo.empresaId) === Number(empresaId)
                ? {
                  ...vinculo,
                  indeterminado: false,
                  intervaloInicio: data.inicio,
                  intervaloFim: data.termino,
                  updatedAt: new Date().toISOString(),
                }
                : vinculo
            ),
          }
        }) as any
        return prev
      })

      return success({ status: 'atualizado' })
    }

    return http.post(API_ENDPOINTS.programas.definirIntervalo, {
      id_empresa: empresaId,
      id_programa: programaId,
      inicio: data.inicio,
      termino: data.termino,
    })
  },

  async resetarIntervaloEmpresa(programaId: number, empresaId: number): Promise<ApiResponse<{ status?: string }>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.programas = prev.programas.map((programa) => {
          if (Number(programa.id) !== Number(programaId)) return programa
          const vinculos = Array.isArray(programa.empresasVinculadas) ? programa.empresasVinculadas : []

          return {
            ...programa,
            empresasVinculadas: vinculos.map((vinculo: any) =>
              Number(vinculo.empresaId) === Number(empresaId)
                ? {
                  ...vinculo,
                  indeterminado: true,
                  intervaloInicio: null,
                  intervaloFim: null,
                  updatedAt: new Date().toISOString(),
                }
                : vinculo
            ),
          }
        }) as any
        return prev
      })

      return success({ status: 'resetado' })
    }

    return http.delete(API_ENDPOINTS.programas.resetarIntervalo(empresaId, programaId))
  },

  async criar(data: CriarProgramaData): Promise<ApiResponse<Programa | { id_programa?: number; status?: string }>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.programas.map((item) => Number(item.id)), 0) + 1

        prev.programas.push({
          id: nextId,
          nome: data.nome,
          descricao: data.descricao || data.introducao || '',
          dataInicio: data.dataInicio,
          dataFim: data.dataFim,
          duracaoMeses: 6,
          status: 'ativo',
          empresasParticipantes: [],
          empresasVinculadas: [],
          questionariosVinculados: (data.questionarios || []).map((questionarioId, index) => ({
            id: Date.now() + index,
            questionarioId,
            ordem: index + 1,
            obrigatorio: true,
            permiteReavaliacao: false,
            intervaloDias: 0,
          })),
          participantesAtivos: 0,
          avaliacaoMedia: 0,
          sessoesRealizadas: 0,
        } as any)

        return prev
      })

      return success(next.programas[next.programas.length - 1] as unknown as Programa, 'Programa criado com sucesso')
    }

    return http.post(API_ENDPOINTS.programas.create, {
      nome: data.nome,
      introducao: data.introducao ?? data.descricao ?? '',
      ordenacao_questionarios: data.ordenacao_questionarios ?? (data.questionarios || []).join(','),
      questionarios: data.questionarios || [],
    })
  },

  async atualizar(id: number, data: AtualizarProgramaData): Promise<ApiResponse<Programa | { status?: string }>> {
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

    return http.put(API_ENDPOINTS.programas.update, {
      id,
      nome: data.nome,
      introducao: data.introducao ?? data.descricao ?? '',
      ordenacao_questionarios: data.ordenacao_questionarios ?? (data.questionarios || []).join(','),
      questionarios: data.questionarios || [],
    })
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

  async duplicar(id: number): Promise<ApiResponse<{ status?: string; id_programa?: number }>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const original = (state.programas as any[]).find((item) => Number(item.id) === Number(id))
      if (!original) {
        return {
          success: false,
          data: null as unknown as { status?: string; id_programa?: number },
          message: 'Programa nao encontrado',
        }
      }

      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.programas.map((item) => Number(item.id)), 0) + 1
        prev.programas.push({
          ...original,
          id: nextId,
          nome: `${String(original.nome || 'Programa')} (copia)`,
        })
        return prev
      })

      const duplicated = next.programas[next.programas.length - 1] as any
      return success({ status: 'duplicado', id_programa: Number(duplicated.id) })
    }

    return http.post(API_ENDPOINTS.programas.duplicar(id), {})
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
