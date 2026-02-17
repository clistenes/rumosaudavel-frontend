/**
 * Configuração da API
 * 
 * Quando sair do modo demo, altere o baseURL para a URL da API real
 * e remova NEXT_PUBLIC_DEMO_MODE do .env.local
 */

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const API_CONFIG = {
  // URL base da API
  // Em modo demo: usa /api/demo
  // Em produção: usa /api/proxy para passar pelo proxy que adiciona o token do NextAuth
  baseURL: isDemo ? '/api/demo' : '/api/proxy',
  
  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Tempo limite para requisições (ms)
  timeout: 30000,
  
  // Modo demo
  isDemo,
}

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Empresas
  empresas: {
    list: '/empresas',
    create: '/empresas',
    get: (id: number) => `/empresas/${id}`,
    update: (id: number) => `/empresas/${id}`,
    delete: (id: number) => `/empresas/${id}`,
    campos: (id: number) => `/empresas/${id}/campos`,
    participantes: (id: number) => `/empresas/${id}/participantes`,
  },
  
  // Participantes
  participantes: {
    list: '/participantes',
    create: '/participantes',
    get: (id: number) => `/participantes/${id}`,
    update: (id: number) => `/participantes/${id}`,
    delete: (id: number) => `/participantes/${id}`,
    importar: '/participantes/importar',
    prontuario: (id: number) => `/participantes/${id}/prontuario`,
    relatorios: (id: number) => `/participantes/${id}/relatorios`,
  },
  
  // Programas
  programas: {
    list: '/programas',
    create: '/programas',
    get: (id: number) => `/programas/${id}`,
    update: (id: number) => `/programas/${id}`,
    delete: (id: number) => `/programas/${id}`,
    vincularQuestionario: (id: number) => `/programas/${id}/questionarios`,
    desvincularQuestionario: (programaId: number, questionarioId: number) => 
      `/programas/${programaId}/questionarios/${questionarioId}`,
    intervalos: (id: number) => `/programas/${id}/intervalos`,
  },
  
  // Questionários
  questionarios: {
    list: '/questionarios',
    create: '/questionarios',
    get: (id: number) => `/questionarios/${id}`,
    update: (id: number) => `/questionarios/${id}`,
    delete: (id: number) => `/questionarios/${id}`,
    perguntas: (id: number) => `/questionarios/${id}/perguntas`,
    respostas: (id: number) => `/questionarios/${id}/respostas`,
  },
  
  // Relatórios
  relatorios: {
    analitico: '/relatorios/analitico',
    grafico: '/relatorios/grafico',
    termometro: '/relatorios/termometro',
    semaforo: '/relatorios/semaforo',
    individual: (participanteId: number) => `/relatorios/individual/${participanteId}`,
    exportar: '/relatorios/exportar',
  },
  
  // Dashboard
  dashboard: {
    metricas: '/dashboard/metricas',
    evolucao: '/dashboard/evolucao',
    alertas: '/dashboard/alertas',
  },
  
  // Notificações
  notificacoes: {
    list: '/notificacoes',
    send: '/notificacoes/enviar',
    templates: '/notificacoes/templates',
    agendar: '/notificacoes/agendar',
  },
  
  // Configurações
  configuracoes: {
    get: '/configuracoes',
    update: '/configuracoes',
    backup: '/configuracoes/backup',
    exportar: '/configuracoes/exportar',
  },
}
