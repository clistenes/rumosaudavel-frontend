export type UserRole = 1 | 2 | 3

export type UserType = {
  id: number
  name: string
  email: string
  login: string
  type: UserRole
  id_empresa: number
  cadastrado: 0 | 1
  termo_consentimento: 0 | 1
  log: string | null
  token?: string
  empresa?: {
    id: number
    nome: string
    cor: string
    logotipo: string
    slug: string
  }
  // Campos adicionais para demo mode
  perfil?: string
  avatar?: string
  cargo?: string
  departamento?: string
  cpf?: string
  telefone?: string
  phq9Ultimo?: number
  gad7Ultimo?: number
  statusRisco?: string
  tendencia?: string
  ultimaAvaliacao?: string
  proximaReavaliacao?: string
  alertasPendentes?: number
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  errors?: Record<string, string[]>
}

export type LoginCredentials = {
  login: string
  password: string
}

export type AuthError = {
  message: string
  error?: string
}

export type EmpresaType = {
  id: number
  nome: string
  introducao?: string
  cor: string
  logotipo?: string
  slug: string
  termo_consentimento: 's' | 'n'
  id_campo_dashboard_heatmap_1?: number
  id_campo_dashboard_heatmap_2?: number
  total_cadastrados?: number
  total_respondentes?: number
  total_questionarios_finalizados?: number
  created_at?: string
  updated_at?: string
}
