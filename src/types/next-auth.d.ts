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
  }
}
