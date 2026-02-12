/**
 * Tipos para respostas da API
 */

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: ApiError[]
  meta?: ApiMeta
}

export interface ApiError {
  field: string
  message: string
  code: string
}

export interface ApiMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: ApiMeta
}

// Tipos específicos da API
export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

export interface User {
  id: number
  nome: string
  email: string
  tipo: 'admin' | 'empresa' | 'participante'
  avatar?: string
  empresaId?: number
}

export interface Empresa {
  id: number
  nome: string
  cnpj: string
  email: string
  telefone: string
  endereco?: string
  cidade?: string
  estado?: string
  logo?: string
  ativo: boolean
  totalParticipantes: number
  dataCriacao: string
  camposPersonalizados?: CampoPersonalizado[]
}

export interface CampoPersonalizado {
  id: number
  nome: string
  tipo: 'texto' | 'numero' | 'data' | 'lista' | 'checkbox'
  obrigatorio: boolean
  opcoes?: string[]
}

export interface Participante {
  id: number
  nome: string
  email: string
  cpf: string
  telefone?: string
  dataNascimento?: string
  genero?: string
  cargo?: string
  departamento?: string
  empresaId: number
  empresaNome?: string
  status: 'ativo' | 'inativo'
  dataCadastro: string
  ultimoAcesso?: string
  indicadores?: IndicadoresSaude
}

export interface IndicadoresSaude {
  phq9Ultimo: number
  gad7Ultimo: number
  tendencia: 'melhora' | 'piora' | 'estavel'
  ultimaAvaliacao: string
  proximaReavaliacao: string
}

export interface Programa {
  id: number
  nome: string
  descricao: string
  status: 'ativo' | 'inativo' | 'pausado'
  dataCriacao: string
  dataInicio?: string
  dataFim?: string
  totalEmpresas: number
  totalParticipantes: number
  totalQuestionarios: number
  progressoMedio: number
}

export interface Questionario {
  id: number
  titulo: string
  descricao: string
  categoria: string
  tipo: 'avaliacao' | 'triagem' | 'acompanhamento' | 'feedback'
  status: 'ativo' | 'rascunho' | 'arquivado'
  totalPerguntas: number
  tempoEstimado: number
  dataCriacao: string
}

export interface Pergunta {
  id: number
  questionarioId: number
  texto: string
  tipo: 'escala' | 'multipla' | 'sim_nao' | 'texto' | 'numero'
  obrigatoria: boolean
  ordem: number
  opcoes?: OpcaoResposta[]
  dependencia?: DependenciaPergunta
}

export interface OpcaoResposta {
  id: number
  texto: string
  valor: number
  ordem: number
}

export interface DependenciaPergunta {
  perguntaId: number
  opcaoId: number
}

export interface Resposta {
  id: number
  participanteId: number
  questionarioId: number
  perguntaId: number
  valor: string | number
  dataResposta: string
}

export interface Notificacao {
  id: number
  titulo: string
  mensagem: string
  tipo: 'lembrete' | 'alerta' | 'info' | 'sucesso'
  canal: 'email' | 'sms' | 'push' | 'todos'
  status: 'pendente' | 'enviado' | 'lido' | 'falhou'
  dataEnvio: string
  dataLeitura?: string
}

export interface MetricaDashboard {
  label: string
  valor: number
  tendencia: number
  icone: string
  cor: string
}

export interface Alerta {
  id: number
  tipo: 'risco' | 'warning' | 'info' | 'sucesso'
  titulo: string
  mensagem: string
  data: string
  lido: boolean
}

export interface Configuracao {
  chave: string
  valor: string
  descricao: string
  categoria: string
}
