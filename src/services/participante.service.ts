/**
 * Servico de Participantes
 */

import { http, API_ENDPOINTS } from './http.service'
import { demoDbService } from './demo-db.service'
import type {
  ApiResponse,
  PaginatedResponse,
  Participante,
  IndicadoresSaude,
} from '@/types/api'

export interface ListarParticipantesParams {
  page?: number
  perPage?: number
  search?: string
  empresaId?: number
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
}

export interface CriarParticipanteData {
  nome: string
  email: string
  cpf: string
  telefone?: string
  dataNascimento?: string
  genero?: string
  cargo?: string
  departamento?: string
  empresaId: number
  camposPersonalizados?: Record<string, unknown>
}

const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

const paginate = <T>(items: T[], page = 1, perPage = 10): PaginatedResponse<T> => {
  const start = (page - 1) * perPage
  const end = start + perPage

  return {
    data: items.slice(start, end),
    meta: {
      page,
      perPage,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / perPage)),
    },
  }
}

const success = <T>(data: T, message?: string): ApiResponse<T> => ({ success: true, data, message })

export const participanteService = {
  async listar(params: ListarParticipantesParams = {}): Promise<ApiResponse<PaginatedResponse<Participante>>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      let participantes = [...(state.participantes as any[])]

      if (params.empresaId) {
        participantes = participantes.filter((item) => Number(item.empresaId) === Number(params.empresaId))
      }

      if (params.status) {
        participantes = participantes.filter((item) => String(item.status || '').toLowerCase() === params.status?.toLowerCase())
      }

      if (params.search) {
        const term = params.search.toLowerCase()
        participantes = participantes.filter((item) =>
          String(item.nome || '').toLowerCase().includes(term) ||
          String(item.email || '').toLowerCase().includes(term) ||
          String(item.cpf || '').includes(params.search || '')
        )
      }

      return success(paginate(participantes as Participante[], params.page || 1, params.perPage || 10))
    }

    const queryString = new URLSearchParams()
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.empresaId) queryString.append('empresa_id', params.empresaId.toString())
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)

    return http.get(`${API_ENDPOINTS.participantes.list}?${queryString.toString()}`)
  },

  async buscarPorId(id: number): Promise<ApiResponse<Participante>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const participante = (state.participantes as any[]).find((item) => Number(item.id) === Number(id))

      if (!participante) {
        return {
          success: false,
          data: null as unknown as Participante,
          message: 'Participante nao encontrado',
        }
      }

      return success(participante as Participante)
    }

    return http.get(API_ENDPOINTS.participantes.get(id))
  },

  async criar(data: CriarParticipanteData): Promise<ApiResponse<Participante>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.participantes.map((item) => Number(item.id)), 0) + 1

        prev.participantes.push({
          id: nextId,
          empresaId: data.empresaId,
          nome: data.nome,
          email: data.email,
          cpf: data.cpf,
          telefone: data.telefone || '',
          cargo: data.cargo || '',
          departamento: data.departamento || '',
          dataNascimento: data.dataNascimento || '',
          status: 'ativo',
          riscoSaude: 'baixo',
          phq9Score: 0,
          gad7Score: 0,
          ultimaAvaliacao: new Date().toISOString().split('T')[0],
          alertasPendentes: 0,
        } as any)

        return prev
      })

      return success(next.participantes[next.participantes.length - 1] as unknown as Participante, 'Participante criado com sucesso')
    }

    return http.post(API_ENDPOINTS.participantes.create, data)
  },

  async criarEmLote(participantes: CriarParticipanteData[]): Promise<ApiResponse<{ criados: number; erros: number }>> {
    if (isDemoMode()) {
      let criados = 0

      demoDbService.patchState((prev) => {
        let nextId = Math.max(...prev.participantes.map((item) => Number(item.id)), 0) + 1

        participantes.forEach((payload) => {
          prev.participantes.push({
            id: nextId,
            empresaId: payload.empresaId,
            nome: payload.nome,
            email: payload.email,
            cpf: payload.cpf,
            telefone: payload.telefone || '',
            cargo: payload.cargo || '',
            departamento: payload.departamento || '',
            dataNascimento: payload.dataNascimento || '',
            status: 'ativo',
            riscoSaude: 'baixo',
            phq9Score: 0,
            gad7Score: 0,
            ultimaAvaliacao: new Date().toISOString().split('T')[0],
            alertasPendentes: 0,
          } as any)
          nextId += 1
          criados += 1
        })

        return prev
      })

      return success({ criados, erros: 0 })
    }

    return http.post(`${API_ENDPOINTS.participantes.create}/lote`, { participantes })
  },

  async atualizar(id: number, data: Partial<Participante>): Promise<ApiResponse<Participante>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        prev.participantes = prev.participantes.map((participante) =>
          Number(participante.id) === Number(id)
            ? { ...participante, ...(data as any) }
            : participante
        ) as any

        return prev
      })

      const participante = next.participantes.find((item) => Number(item.id) === Number(id))
      return success(participante as unknown as Participante, 'Participante atualizado com sucesso')
    }

    return http.put(API_ENDPOINTS.participantes.update(id), data)
  },

  async remover(id: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.participantes = prev.participantes.filter((item) => Number(item.id) !== Number(id)) as any
        return prev
      })

      return success(undefined as unknown as void)
    }

    return http.delete(API_ENDPOINTS.participantes.delete(id))
  },

  async buscarIndicadores(id: number): Promise<ApiResponse<IndicadoresSaude>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const participante = state.participantes.find((item) => Number(item.id) === Number(id)) as any

      if (!participante) {
        return {
          success: false,
          data: null as unknown as IndicadoresSaude,
          message: 'Participante nao encontrado',
        }
      }

      const phq = Number(participante.phq9Score || 0)
      const gad = Number(participante.gad7Score || 0)
      const tendencia = phq >= 15 || gad >= 15 ? 'piora' : phq >= 10 || gad >= 10 ? 'estavel' : 'melhora'

      return success({
        phq9Ultimo: phq,
        gad7Ultimo: gad,
        tendencia,
        ultimaAvaliacao: String(participante.ultimaAvaliacao || ''),
        proximaReavaliacao: String(participante.proximaReavaliacao || '2026-03-01'),
      } as IndicadoresSaude)
    }

    return http.get(`${API_ENDPOINTS.participantes.get(id)}/indicadores`)
  },

  async buscarProntuario(id: number): Promise<ApiResponse<unknown>> {
    if (isDemoMode()) {
      return success({ participanteId: id, itens: [] })
    }

    return http.get(API_ENDPOINTS.participantes.prontuario(id))
  },

  async listarRelatorios(id: number): Promise<ApiResponse<unknown[]>> {
    if (isDemoMode()) {
      return success([])
    }

    return http.get(API_ENDPOINTS.participantes.relatorios(id))
  },

  async importarExcel(arquivo: File, empresaId: number): Promise<ApiResponse<{ importados: number; erros: number; log: string[] }>> {
    if (isDemoMode()) {
      return success({
        importados: 0,
        erros: 0,
        log: [`Arquivo ${arquivo.name} recebido para empresa ${empresaId} (modo demo)`],
      })
    }

    const formData = new FormData()
    formData.append('arquivo', arquivo)
    formData.append('empresa_id', empresaId.toString())

    return http.post(API_ENDPOINTS.participantes.importar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async importarTexto(texto: string, empresaId: number, formato: 'csv' | 'lista' = 'csv'): Promise<ApiResponse<{ importados: number; erros: number }>> {
    if (isDemoMode()) {
      const linhas = texto
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)

      return success({ importados: linhas.length, erros: 0 })
    }

    return http.post(`${API_ENDPOINTS.participantes.importar}/texto`, {
      texto,
      empresa_id: empresaId,
      formato,
    })
  },
}
