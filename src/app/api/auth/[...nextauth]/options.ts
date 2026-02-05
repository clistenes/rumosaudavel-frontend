import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { UserType, ApiResponse } from '@/types/auth'

// Usuários fake para modo demo
const demoUsers = [
  {
    id: '1',
    name: 'Administrador Demo',
    email: 'admin@demo.com',
    login: 'admin',
    password: 'admin123',
    type: 1,
    id_empresa: 1,
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 1,
      nome: 'Empresa Demo',
      cor: '#FF6600',
      logotipo: 'logo.png',
      slug: 'empresa-demo'
    },
    token: 'fake-jwt-token-admin',
  },
  {
    id: '2',
    name: 'Participante Demo',
    email: 'participante@demo.com',
    login: 'participante',
    password: 'participante123',
    type: 2,
    id_empresa: 1,
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 1,
      nome: 'Empresa Demo',
      cor: '#FF6600',
      logotipo: 'logo.png',
      slug: 'empresa-demo'
    },
    token: 'fake-jwt-token-participante',
  },
  {
    id: '3',
    name: 'Empresa Demo',
    email: 'empresa@demo.com',
    login: 'empresa',
    password: 'empresa123',
    type: 3,
    id_empresa: 1,
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 1,
      nome: 'Empresa Demo',
      cor: '#FF6600',
      logotipo: 'logo.png',
      slug: 'empresa-demo'
    },
    token: 'fake-jwt-token-empresa',
  },
]

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        login: {
          label: 'Login',
          type: 'text',
          placeholder: 'Digite seu usuário',
        },
        password: {
          label: 'Senha',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error('Login e senha são obrigatórios')
        }

        // Modo Demo - login fake sem API
        if (isDemoMode) {
          const user = demoUsers.find(
            u => u.login === credentials.login && u.password === credentials.password
          )

          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              login: user.login,
              type: user.type,
              id_empresa: user.id_empresa,
              cadastrado: user.cadastrado,
              termo_consentimento: user.termo_consentimento,
              empresa: user.empresa,
              token: user.token,
            } as User
          }

          throw new Error('Credenciais inválidas (Modo Demo)')
        }

        // Modo Produção - login via API Laravel
        try {
          const response = await axios.post<ApiResponse<UserType>>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              login: credentials.login,
              password: credentials.password,
            }
          )

          if (response.data.success && response.data.data) {
            const user = response.data.data
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              login: user.login,
              type: user.type,
              id_empresa: user.id_empresa,
              cadastrado: user.cadastrado,
              termo_consentimento: user.termo_consentimento,
              empresa: user.empresa,
              token: response.data.data.token || '',
            } as User
          }

          throw new Error(response.data.message || 'Credenciais inválidas')
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login')
          }
          throw error
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.login = user.login
        token.type = user.type
        token.id_empresa = user.id_empresa
        token.cadastrado = user.cadastrado
        token.termo_consentimento = user.termo_consentimento
        token.empresa = user.empresa
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: token.email,
          login: token.login as string,
          type: token.type as number,
          id_empresa: token.id_empresa as number,
          cadastrado: token.cadastrado as number,
          termo_consentimento: token.termo_consentimento as number,
          empresa: token.empresa as UserType['empresa'],
          token: token.accessToken as string,
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        const pathname = new URL(url).pathname
        
        if (pathname === '/auth/login' || pathname === '/') {
          const { getSession } = await import('next-auth/react')
          const session = await getSession()
          
          if (session?.user?.type) {
            switch (session.user.type) {
              case 1:
                return `${baseUrl}/adm`
              case 2:
                return `${baseUrl}/participante`
              case 3:
                return `${baseUrl}/empresa`
              default:
                return url
            }
          }
        }
        
        return url
      }
      return baseUrl
    },
  },
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
}
