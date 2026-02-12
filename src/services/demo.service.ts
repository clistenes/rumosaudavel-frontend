/**
 * Serviço de Demonstração
 * 
 * Este serviço simula todas as operações da API usando dados realistas.
 * Use este serviço quando NEXT_PUBLIC_DEMO_MODE=true
 */

import * as DemoData from '@/assets/data/demo-data'

import type {
  ApiResponse,
  PaginatedResponse,
  Empresa,
  Participante,
  Programa,
  Questionario,
} from '@/types/api'

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Cria resposta padronizada
function createResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || 'Operação realizada com sucesso',
  }
}

// Cria resposta paginada
function createPaginatedResponse<T>(
  items: T[],
  page: number,
  perPage: number
): ApiResponse<PaginatedResponse<T>> {
  const start = (page - 1) * perPage
  const end = start + perPage
  const paginatedItems = items.slice(start, end)
  const totalPages = Math.ceil(items.length / perPage)

  return createResponse({
    data: paginatedItems,
    meta: {
      page,
      perPage,
      total: items.length,
      totalPages,
    },
  })
}

// ============================================================
// SERVIÇO DE EMPRESAS
// ============================================================

export const demoEmpresaService = {
  async listar(params: { page?: number; perPage?: number; search?: string } = {}) {
    await delay(300)
    let empresas = [...DemoData.EMPRESAS_DEMO]

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      empresas = empresas.filter(e =>
        e.nome.toLowerCase().includes(searchLower) ||
        e.cnpj.includes(params.search || '')
      )
    }

    return createPaginatedResponse(empresas, params.page || 1, params.perPage || 10)
  },

  async buscarPorId(id: number) {
    await delay(200)
    const empresa = DemoData.EMPRESAS_DEMO.find(e => e.id === id)
    if (!empresa) {
      throw new Error('Empresa não encontrada')
    }
    return createResponse(empresa)
  },

  async criar(data: any) {
    await delay(500)
    const novaEmpresa = {
      ...data,
      id: Math.max(...DemoData.EMPRESAS_DEMO.map(e => e.id)) + 1,
      dataCadastro: new Date().toISOString().split('T')[0],
      status: 'ativo',
    }
    DemoData.EMPRESAS_DEMO.push(novaEmpresa)
    return createResponse(novaEmpresa, 'Empresa criada com sucesso')
  },

  async atualizar(id: number, data: any) {
    await delay(400)
    const index = DemoData.EMPRESAS_DEMO.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Empresa não encontrada')
    }
    DemoData.EMPRESAS_DEMO[index] = { ...DemoData.EMPRESAS_DEMO[index], ...data }
    return createResponse(DemoData.EMPRESAS_DEMO[index], 'Empresa atualizada com sucesso')
  },

  async remover(id: number) {
    await delay(400)
    const index = DemoData.EMPRESAS_DEMO.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Empresa não encontrada')
    }
    DemoData.EMPRESAS_DEMO.splice(index, 1)
    return createResponse(null, 'Empresa removida com sucesso')
  },

  async listarParticipantes(empresaId: number, params: { page?: number; perPage?: number; search?: string } = {}) {
    await delay(300)
    let participantes = DemoData.PARTICIPANTES_DEMO.filter(p => p.empresaId === empresaId)

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      participantes = participantes.filter(p =>
        p.nome.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.cpf.includes(params.search || '')
      )
    }

    return createPaginatedResponse(participantes, params.page || 1, params.perPage || 10)
  },
}

// ============================================================
// SERVIÇO DE PARTICIPANTES
// ============================================================

export const demoParticipanteService = {
  async listar(params: { page?: number; perPage?: number; search?: string; empresaId?: number } = {}) {
    await delay(300)
    let participantes = [...DemoData.PARTICIPANTES_DEMO]

    if (params.empresaId) {
      participantes = participantes.filter(p => p.empresaId === params.empresaId)
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      participantes = participantes.filter(p =>
        p.nome.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        p.cpf.includes(params.search || '')
      )
    }

    return createPaginatedResponse(participantes, params.page || 1, params.perPage || 10)
  },

  async buscarPorId(id: number) {
    await delay(200)
    const participante = DemoData.PARTICIPANTES_DEMO.find(p => p.id === id)
    if (!participante) {
      throw new Error('Participante não encontrado')
    }
    return createResponse(participante)
  },

  async criar(data: any) {
    await delay(500)
    const novoParticipante = {
      ...data,
      id: Math.max(...DemoData.PARTICIPANTES_DEMO.map(p => p.id)) + 1,
      status: 'ativo',
    }
    DemoData.PARTICIPANTES_DEMO.push(novoParticipante)
    return createResponse(novoParticipante, 'Participante criado com sucesso')
  },

  async atualizar(id: number, data: any) {
    await delay(400)
    const index = DemoData.PARTICIPANTES_DEMO.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Participante não encontrado')
    }
    DemoData.PARTICIPANTES_DEMO[index] = { ...DemoData.PARTICIPANTES_DEMO[index], ...data }
    return createResponse(DemoData.PARTICIPANTES_DEMO[index], 'Participante atualizado com sucesso')
  },

  async buscarIndicadores(id: number) {
    await delay(200)
    const participante = DemoData.PARTICIPANTES_DEMO.find(p => p.id === id)
    if (!participante) {
      throw new Error('Participante não encontrado')
    }
    return createResponse({
      phq9Ultimo: (participante as any).phq9Score || 0,
      gad7Ultimo: (participante as any).gad7Score || 0,
      tendencia: (participante as any).tendencia || 'estavel',
      ultimaAvaliacao: participante.ultimaAvaliacao,
      proximaReavaliacao: (participante as any).proximaReavaliacao || '2026-03-01',
    })
  },

  async importarExcel(arquivo: File, empresaId: number) {
    await delay(2000)
    return createResponse({
      importados: 15,
      erros: 2,
      log: [
        'Linha 3: CPF inválido',
        'Linha 12: E-mail já cadastrado',
      ],
    }, 'Importação concluída com 15 participantes importados')
  },
}

// ============================================================
// SERVIÇO DE PROGRAMAS
// ============================================================

export const demoProgramaService = {
  async listar(params: { page?: number; perPage?: number; search?: string } = {}) {
    await delay(300)
    let programas = [...DemoData.PROGRAMAS_DEMO]

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      programas = programas.filter((p: any) =>
        p.nome.toLowerCase().includes(searchLower) ||
        p.descricao.toLowerCase().includes(searchLower)
      )
    }

    return createPaginatedResponse(programas, params.page || 1, params.perPage || 10)
  },

  async buscarPorId(id: number) {
    await delay(200)
    const programa = DemoData.PROGRAMAS_DEMO.find((p: any) => p.id === id)
    if (!programa) {
      throw new Error('Programa não encontrado')
    }
    return createResponse(programa)
  },

  async criar(data: any) {
    await delay(500)
    const novoPrograma = {
      ...data,
      id: Math.max(...DemoData.PROGRAMAS_DEMO.map((p: any) => p.id)) + 1,
      status: 'ativo',
    }
    DemoData.PROGRAMAS_DEMO.push(novoPrograma)
    return createResponse(novoPrograma, 'Programa criado com sucesso')
  },

  async vincularQuestionario(programaId: number, data: { questionarioId: number; ordem: number }) {
    await delay(400)
    return createResponse({
      programaId,
      ...data,
      status: 'vinculado',
    }, 'Questionário vinculado com sucesso')
  },

  async desvincularQuestionario(programaId: number, questionarioId: number) {
    await delay(300)
    return createResponse(null, 'Questionário desvinculado com sucesso')
  },
}

// ============================================================
// SERVIÇO DE QUESTIONÁRIOS
// ============================================================

export const demoQuestionarioService = {
  async listar(params: { page?: number; perPage?: number; search?: string } = {}) {
    await delay(300)
    let questionarios = [...DemoData.QUESTIONARIOS_DEMO]

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      questionarios = questionarios.filter((q: any) =>
        q.nome.toLowerCase().includes(searchLower) ||
        q.descricao.toLowerCase().includes(searchLower)
      )
    }

    return createPaginatedResponse(questionarios, params.page || 1, params.perPage || 10)
  },

  async buscarPorId(id: number) {
    await delay(200)
    const questionario = DemoData.QUESTIONARIOS_DEMO.find((q: any) => q.id === id)
    if (!questionario) {
      throw new Error('Questionário não encontrado')
    }
    return createResponse(questionario)
  },

  async criar(data: any) {
    await delay(500)
    const novoQuestionario = {
      ...data,
      id: Math.max(...DemoData.QUESTIONARIOS_DEMO.map((q: any) => q.id)) + 1,
      status: 'ativo',
    }
    DemoData.QUESTIONARIOS_DEMO.push(novoQuestionario)
    return createResponse(novoQuestionario, 'Questionário criado com sucesso')
  },

  async responder(questionarioId: number, data: { respostas: any[] }) {
    await delay(800)
    const pontuacao = Math.floor(Math.random() * 15) + 3
    return createResponse({
      resultado: {
        pontuacao,
        interpretacao: getStatusRiscoBadge(pontuacao),
      },
      pontuacao,
    }, 'Respostas registradas com sucesso')
  },
}

// ============================================================
// SERVIÇO DE RELATÓRIOS
// ============================================================

export const demoRelatorioService = {
  async analitico(params: { dataInicio?: string; dataFim?: string } = {}) {
    await delay(500)
    return createResponse({
      estatisticas: DemoData.ESTATISTICAS_GLOBAIS,
      empresas: DemoData.EMPRESAS_DEMO.map(e => ({
        id: e.id,
        nome: e.nomeCurto,
        participantes: e.participantes,
        phq9Medio: e.phq9Medio,
        gad7Medio: e.gad7Medio,
        adesao: e.adesao,
      })),
      evolucao: DemoData.EVOLUCAO_MENSAL,
    })
  },

  async grafico(params: { tipo: string; periodo: string }) {
    await delay(400)
    const dados = DemoData.EVOLUCAO_MENSAL.map((e: any) => ({
      label: e.mes || e.mesNome,
      valor: params.tipo === 'phq9' ? (e.phq9Medio || e.phq9) : (e.gad7Medio || e.gad7),
    }))
    return createResponse({ dados })
  },

  async termometro() {
    await delay(400)
    return createResponse({
      categorias: [
        { nome: 'Risco Mínimo', quantidade: 14927, cor: '#28a745' },
        { nome: 'Risco Leve', quantidade: 764, cor: '#17a2b8' },
        { nome: 'Risco Moderado', quantidade: 0, cor: '#ffc107' },
        { nome: 'Risco Alto', quantidade: 65, cor: '#dc3545' },
      ],
    })
  },

  async individual(participanteId: number) {
    await delay(300)
    const participante = DemoData.PARTICIPANTES_DEMO.find(p => p.id === participanteId)
    if (!participante) {
      throw new Error('Participante não encontrado')
    }
    return createResponse({
      participante,
      historico: DemoData.EVOLUCAO_MENSAL.map((e: any) => ({
        data: e.mes || e.mesNome,
        phq9: Math.floor(Math.random() * 10) + 5,
        gad7: Math.floor(Math.random() * 8) + 4,
      })),
    })
  },
}

// ============================================================
// SERVIÇO DE DASHBOARD
// ============================================================

export const demoDashboardService = {
  async metricas() {
    await delay(200)
    const stats = DemoData.ESTATISTICAS_GLOBAIS as any
    return createResponse({
      cards: [
        { label: 'Participantes Ativos', valor: stats.totalParticipantes || stats.totalParticipantes, tendencia: 12.5, icone: 'fa:users', cor: 'primary' },
        { label: 'Avaliações Realizadas', valor: stats.avaliacoesRealizadas || 47268, tendencia: 23.1, icone: 'fa:clipboard-check', cor: 'success' },
        { label: 'Taxa de Adesão', valor: stats.taxaAdesaoMedia || stats.adesaoGlobal || 87.3, tendencia: 5.4, icone: 'fa:chart-line', cor: 'info', sufixo: '%' },
        { label: 'Alertas de Risco', valor: stats.participantesRiscoAlto || 65, tendencia: -8.2, icone: 'fa:exclamation-triangle', cor: 'warning' },
      ],
      evolucao: DemoData.EVOLUCAO_MENSAL,
      alertas: DemoData.ALERTAS_DEMO.slice(0, 5),
    })
  },

  async alertas() {
    await delay(200)
    return createResponse(DemoData.ALERTAS_DEMO)
  },
}

// ============================================================
// SERVIÇO DE NOTIFICAÇÕES
// ============================================================

export const demoNotificacaoService = {
  async listar() {
    await delay(200)
    return createResponse([
      {
        id: 1,
        titulo: 'Lembrete: PHQ-9 Pendente',
        mensagem: 'Você tem um questionário para responder até 15/02/2026',
        tipo: 'lembrete',
        canal: 'email',
        status: 'enviado',
        dataEnvio: '2026-02-10 09:00:00',
      },
      {
        id: 2,
        titulo: 'Alerta: Risco Identificado',
        mensagem: 'Um participante apresentou pontuação elevada',
        tipo: 'alerta',
        canal: 'push',
        status: 'lido',
        dataEnvio: '2026-02-10 08:30:00',
      },
    ])
  },

  async enviar(data: { titulo: string; mensagem: string; destinatarios: string[] }) {
    await delay(500)
    return createResponse({
      enviados: data.destinatarios.length,
      falhas: 0,
    }, 'Notificações enviadas com sucesso')
  },
}

// ============================================================
// FUNÇÕES HELPER
// ============================================================

function getStatusRiscoBadge(phq9: number) {
  if (phq9 >= 15) return { label: 'Risco Severo', variant: 'danger' }
  if (phq9 >= 10) return { label: 'Risco Moderado', variant: 'warning' }
  if (phq9 >= 5) return { label: 'Risco Leve', variant: 'info' }
  return { label: 'Risco Mínimo', variant: 'success' }
}

// ============================================================
// EXPORTAÇÃO GERAL
// ============================================================

export const demoServices = {
  empresas: demoEmpresaService,
  participantes: demoParticipanteService,
  programas: demoProgramaService,
  questionarios: demoQuestionarioService,
  relatorios: demoRelatorioService,
  dashboard: demoDashboardService,
  notificacoes: demoNotificacaoService,
}

// Função utilitária para verificar se está em modo demo
export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

// Re-exporta os dados
export { DemoData }
