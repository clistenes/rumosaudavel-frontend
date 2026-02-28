/**
 * Servico de Empresas
 */

import { http, API_ENDPOINTS } from './http.service'
import { demoDbService } from './demo-db.service'
import type {
  ApiResponse,
  PaginatedResponse,
  Empresa,
  Participante,
} from '@/types/api'
import type { CreateEmpresaParams, UpdateEmpresaParams } from '@/types/empresa'

export interface ListarEmpresasParams {
  page?: number
  perPage?: number
  search?: string
  cidade?: string
  estado?: string
  status?: string
  ordenarPor?: string
  ordem?: 'asc' | 'desc'
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

const success = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  data,
  message,
})

export const empresaService = {
  async listar(params: ListarEmpresasParams = {}): Promise<ApiResponse<PaginatedResponse<Empresa>>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      let items = [...(state.empresas as any[])]

      if (params.search) {
        const term = params.search.toLowerCase()
        items = items.filter((empresa) =>
          String(empresa.nome || '').toLowerCase().includes(term) ||
          String(empresa.cnpj || '').includes(params.search || '')
        )
      }

      if (params.cidade) {
        items = items.filter((empresa) => String(empresa.cidade || '').toLowerCase() === params.cidade?.toLowerCase())
      }

      if (params.estado) {
        items = items.filter((empresa) => String(empresa.estado || '').toLowerCase() === params.estado?.toLowerCase())
      }

      if (params.status) {
        items = items.filter((empresa) => String(empresa.status || '').toLowerCase() === params.status?.toLowerCase())
      }

      const paged = paginate(items as Empresa[], params.page || 1, params.perPage || 10)
      return success(paged)
    }

    const queryString = new URLSearchParams()
    if (params.page) queryString.append('page', params.page.toString())
    if (params.perPage) queryString.append('per_page', params.perPage.toString())
    if (params.search) queryString.append('search', params.search)
    if (params.cidade) queryString.append('cidade', params.cidade)
    if (params.estado) queryString.append('estado', params.estado)
    if (params.status) queryString.append('status', params.status)
    if (params.ordenarPor) queryString.append('ordenar_por', params.ordenarPor)
    if (params.ordem) queryString.append('ordem', params.ordem)

    const url = `${API_ENDPOINTS.empresas.list}?${queryString.toString()}`
    const response = await http.get<Empresa[]>(url)

    let empresasArray: Empresa[] = []
    if (Array.isArray(response)) {
      empresasArray = response
    } else if (Array.isArray(response.data)) {
      empresasArray = response.data
    } else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      empresasArray = (response.data as any).data
    } else if (response.data && typeof response.data === 'object') {
      empresasArray = [response.data as Empresa]
    }

    return {
      success: true,
      data: {
        data: empresasArray,
        meta: {
          page: 1,
          perPage: empresasArray.length,
          total: empresasArray.length,
          totalPages: 1,
        },
      },
    }
  },

  async buscarPorId(id: number): Promise<ApiResponse<Empresa>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      const empresa = (state.empresas as any[]).find((item) => Number(item.id) === Number(id))

      if (!empresa) {
        return {
          success: false,
          data: null as unknown as Empresa,
          message: 'Empresa nao encontrada',
        }
      }

      return success(empresa as Empresa)
    }

    try {
      const response = await http.get<Empresa>(`/empresas/${id}`)

      let empresa: Empresa | null = null
      if (Array.isArray(response)) {
        empresa = response[0] || null
      } else if (response.data) {
        empresa = response.data
      } else {
        empresa = response as unknown as Empresa
      }

      return {
        success: true,
        data: empresa,
      } as unknown as ApiResponse<Empresa>
    } catch {
      return {
        success: false,
        data: null as any,
        message: 'Empresa nao encontrada',
      } as unknown as ApiResponse<Empresa>
    }
  },

  async criar(data: CreateEmpresaParams): Promise<ApiResponse<Empresa>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        const nextId = Math.max(...prev.empresas.map((item) => Number(item.id)), 0) + 1

        prev.empresas.push({
          id: nextId,
          nome: data.empresa_nome,
          introducao: data.empresa_introducao || '',
          cor: data.empresa_cor,
          termo: data.empresa_termo || 's',
          status: 'ativo',
          dataCadastro: new Date().toISOString().split('T')[0],
          participantes: 0,
          totalParticipantes: 0,
          cnpj: '',
          email: '',
          telefone: '',
        } as any)

        return prev
      })

      return success(next.empresas[next.empresas.length - 1] as unknown as Empresa, 'Empresa criada com sucesso')
    }

    const formData = new FormData()
    formData.append('empresa_nome', data.empresa_nome)
    if (data.empresa_introducao) {
      formData.append('empresa_introducao', data.empresa_introducao)
    }
    formData.append('empresa_cor', data.empresa_cor)
    if (data.empresa_termo) {
      formData.append('empresa_termo', String(data.empresa_termo))
    }
    if (data.empresa_logo) {
      formData.append('empresa_logo', data.empresa_logo)
    }

    return http.post(API_ENDPOINTS.empresas.create, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async atualizar(id: number, params: UpdateEmpresaParams): Promise<ApiResponse<Empresa>> {
    if (isDemoMode()) {
      const next = demoDbService.patchState((prev) => {
        prev.empresas = prev.empresas.map((empresa) =>
          Number(empresa.id) === Number(id)
            ? {
              ...empresa,
              nome: params.data.empresa_nome,
              introducao: params.data.empresa_introducao || empresa.introducao,
              cor: params.data.empresa_cor,
              termo: params.data.empresa_termo || empresa.termo,
            }
            : empresa
        ) as any

        return prev
      })

      const empresa = next.empresas.find((item) => Number(item.id) === Number(id))
      return success(empresa as unknown as Empresa, 'Empresa atualizada com sucesso')
    }

    const data = params.data
    const formData = new FormData()
    formData.append('empresa_nome', data.empresa_nome)
    if (data.empresa_introducao) {
      formData.append('empresa_introducao', data.empresa_introducao)
    }
    formData.append('empresa_cor', data.empresa_cor)
    if (data.empresa_termo) {
      formData.append('empresa_termo', String(data.empresa_termo))
    }
    if (data.empresa_logo) {
      formData.append('empresa_logo', data.empresa_logo)
    }

    return http.post(`/empresas/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async remover(id: number): Promise<ApiResponse<void>> {
    if (isDemoMode()) {
      demoDbService.patchState((prev) => {
        prev.empresas = prev.empresas.filter((empresa) => Number(empresa.id) !== Number(id)) as any
        prev.participantes = prev.participantes.filter((participante) => Number(participante.empresaId) !== Number(id)) as any
        prev.usuarios = prev.usuarios.filter((usuario) => Number(usuario.empresaId) !== Number(id)) as any

        prev.programas = prev.programas.map((programa) => ({
          ...programa,
          empresasVinculadas: (programa.empresasVinculadas || []).filter((v) => Number(v.empresaId) !== Number(id)),
          empresasParticipantes: (programa.empresasParticipantes || []).filter((empresaId) => Number(empresaId) !== Number(id)),
        })) as any

        return prev
      })

      return success(undefined as unknown as void, 'Empresa removida com sucesso')
    }

    return http.delete(`/empresas/${id}`)
  },

  async listarParticipantes(
    empresaId: number,
    params: { page?: number; perPage?: number; search?: string } = {}
  ): Promise<ApiResponse<PaginatedResponse<Participante>>> {
    if (isDemoMode()) {
      const state = demoDbService.getState()
      let participantes = state.participantes.filter((item) => Number(item.empresaId) === Number(empresaId)) as any[]

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

    return http.get(`${API_ENDPOINTS.empresas.participantes(empresaId)}?${queryString.toString()}`)
  },

  async importarParticipantes(
    empresaId: number,
    arquivo: File
  ): Promise<ApiResponse<{ importados: number; erros: number }>> {
    if (isDemoMode()) {
      return success({ importados: 0, erros: 0 }, `Arquivo ${arquivo.name} processado em modo demo para empresa ${empresaId}`)
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
}
