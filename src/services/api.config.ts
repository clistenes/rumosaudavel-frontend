/**
 * Configuracao central da API.
 * Em producao: /api/proxy (com sessao NextAuth no servidor).
 * Em demo: mantem sinalizacao local para evitar chamadas reais.
 */

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const API_CONFIG = {
  baseURL: isDemo ? '/api/demo' : '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  isDemo,
}

export const API_ENDPOINTS = {
  auth: {
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    me: '/auth/me',
  },

  adm: {
    dashboard: '/dashboard/home',
  },

  empresas: {
    list: '/empresas',
    create: '/empresas',
    get: (id: number) => `/empresas/${id}`,
    update: (id: number) => `/empresas/${id}`,
    delete: (id: number) => `/empresas/${id}`,
    campos: (id: number) => `/empresas/${id}/campos`,
    participantes: (id: number) => `/empresas/${id}/participantes`,
    logins: (id: number) => `/empresas/${id}/logins`,
    filtros: (id: number) => `/empresas/${id}/filtros`,
    deleteCampo: (campoId: number) => `/campos-empresas/${campoId}`,
  },

  participantes: {
    list: '/participantes',
    create: '/participantes',
    get: (id: number) => `/participantes/${id}`,
    update: (id: number) => `/participantes/${id}`,
    delete: (id: number) => `/participantes/${id}`,
    importar: '/participantes/batch',
    dadosPessoais: (id: number) => `/participantes/${id}/dados-pessoais`,
    historicoCoaching: (id: number) => `/participantes/${id}/historico-coaching`,
    deleteHistoricoCoaching: (id: number) => `/historico-coaching/${id}`,
    contatos: (id: number) => `/participantes/${id}/contatos`,
    deleteContato: (id: number) => `/contatos/${id}`,
    simularAcesso: (id: number) => `/participantes/${id}/simular-acesso`,
    pesquisarUsuarios: '/pesquisar-usuarios',
    prontuario: (id: number) => `/participante/${id}/prontuario`,
    relatorios: (id: number) => `/participante/${id}/relatorios`,
  },

  programas: {
    list: '/programas',
    create: '/programas',
    get: (id: number) => `/programas/${id}`,
    update: (id: number) => `/programas/${id}`,
    delete: (id: number) => `/programas/${id}`,
    duplicar: (id: number) => `/programas/${id}/duplicar`,
    vincularQuestionario: (id: number) => `/programas/${id}/questionarios`,
    desvincularQuestionario: (programaId: number, questionarioId: number) =>
      `/programas/${programaId}/questionarios/${questionarioId}`,
    vincularEmpresa: (programaId: number) => `/programas/${programaId}/empresas`,
    removerVinculoEmpresa: (programaId: number, empresaId: number) =>
      `/programas/${programaId}/empresas/${empresaId}`,
    intervaloEmpresa: (programaId: number, empresaId: number) =>
      `/programas/${programaId}/empresas/${empresaId}/intervalo`,
    intervalos: (programaId: number) => `/programas/${programaId}/intervalos`,
    acessosEmpresaPrograma: (empresaId: number, programaId: number) =>
      `/empresas/${empresaId}/programas/${programaId}/acessos`,
  },

  questionarios: {
    list: '/questionarios',
    create: '/questionarios',
    get: (id: number) => `/questionarios/${id}`,
    update: (id: number) => `/questionarios/${id}`,
    delete: (id: number) => `/questionarios/${id}`,
    duplicar: (id: number) => `/questionarios/${id}/duplicar`,
    exportar: (id: number) => `/questionarios/${id}/exportar`,
    tipoResultado: (id: number) => `/questionarios/${id}/tipo-resultado`,
    ordenar: (id: number) => `/questionarios/${id}/ordenar`,
    perguntas: (id: number) => `/questionarios/${id}/perguntas`,
    obterPergunta: (id: number) => `/perguntas/${id}`,
    atualizarPergunta: (id: number) => `/perguntas/${id}`,
    deletarPergunta: (id: number) => `/perguntas/${id}`,
    perguntaDependente: '/perguntas/dependente',
    adicionarAlternativa: (perguntaId: number) => `/perguntas/${perguntaId}/alternativas`,
    deletarAlternativa: (id: number) => `/alternativas/${id}`,
    intervalos: (questionarioId: number) => `/questionarios/${questionarioId}/intervalos`,
    atualizarIntervalo: (id: number) => `/intervalos/${id}`,
    deletarIntervalo: (id: number) => `/intervalos/${id}`,
    salvarTextos: (questionarioId: number) => `/questionarios/${questionarioId}/textos`,
    respostas: (id: number) => `/participante/questionario/${id}/respostas`,
  },

  relatorios: {
    analitico: '/relatorios/analitico',
    grafico: '/relatorios/grafico',
    semaforo: '/relatorios/semaforo',
    termometro: '/relatorios/termometro',
    individualLegacy: (participanteId: number) => `/relatorios/individual/${participanteId}`,
    analiticoEmpresa: (empresaId: number) => `/relatorios/${empresaId}/dashboard`,
    graficoEmpresa: (empresaId: number) => `/relatorios/${empresaId}/grafico`,
    semaforoEmpresa: (empresaId: number) => `/relatorios/${empresaId}/semaforo`,
    heatmapEmpresa: (empresaId: number) => `/relatorios/${empresaId}/heatmap`,
    individual: (userId: number, questionarioId: number) => `/relatorios/${userId}/${questionarioId}/individual`,
    filtrosSemaforo: '/relatorios/semaforo/filtros',
    exportar: '/relatorios/exportar',
  },

  usuarios: {
    list: '/usuarios',
    get: (id: number) => `/usuarios/${id}`,
    create: '/usuarios',
    update: (id: number) => `/usuarios/${id}`,
    delete: (id: number) => `/usuarios/${id}`,
  },

  dashboard: {
    home: '/dashboard/home',
    bugs: '/dashboard/bugs',
  },
}
