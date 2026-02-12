import { UserType } from './auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      login: string
      type: number
      id_empresa: number
      cadastrado: number
      termo_consentimento: number
      empresa?: UserType['empresa']
      token: string
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
  }

  interface User {
    id: string
    login: string
    type: number
    id_empresa: number
    cadastrado: number
    termo_consentimento: number
    empresa?: UserType['empresa']
    token: string
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
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    login?: string
    type?: number
    id_empresa?: number
    cadastrado?: number
    termo_consentimento?: number
    empresa?: UserType['empresa']
    accessToken?: string
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
}
