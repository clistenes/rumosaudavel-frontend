import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { UserType, ApiResponse } from '@/types/auth'
import { EMPRESAS_DEMO, PARTICIPANTES_DEMO } from '@/assets/data/demo-data'

// Usuários demo com dados realistas das empresas fictícias
const demoUsers = [
  {
    id: '1',
    name: 'Administrador Geral',
    email: 'admin@rumosaudavel.com.br',
    login: 'admin',
    password: 'admin123',
    type: 1, // Admin
    id_empresa: null, // Admin vê todas as empresas
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: null, // Admin não tem empresa vinculada
    token: 'demo-token-admin-001',
    perfil: 'Administrador Master',
    avatar: '/images/avatars/admin.png'
  },
  {
    id: '2',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@nexuspetroquimica.com.br',
    login: 'empresa',
    password: 'empresa123',
    type: 3, // Empresa
    id_empresa: 1, // Nexus Petroquímica
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 1,
      nome: 'Nexus Indústria Petroquímica Ltda',
      nomeCurto: 'Nexus Petroquímica',
      cor: '#0066CC',
      logotipo: 'nexus-logo.png',
      slug: 'nexus-petroquimica',
      cnpj: '12.345.678/0001-90',
      setor: 'Petróleo e Química',
      funcionarios: 2847,
      participantes: 2156,
      adesao: 75.7,
      phq9Medio: 8.4,
      gad7Medio: 6.2,
      cidade: 'Cabo de Santo Agostinho',
      estado: 'PE'
    },
    token: 'demo-token-empresa-001',
    perfil: 'Gestor de RH',
    avatar: '/images/avatars/carlos.png'
  },
  {
    id: '101',
    name: 'José Antônio Pereira',
    email: 'jose.pereira@nexuspetroquimica.com.br',
    login: 'participante',
    password: 'participante123',
    type: 2, // Participante
    id_empresa: 1, // Nexus Petroquímica
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 1,
      nome: 'Nexus Indústria Petroquímica Ltda',
      nomeCurto: 'Nexus Petroquímica',
      cor: '#0066CC',
      logotipo: 'nexus-logo.png',
      slug: 'nexus-petroquimica'
    },
    token: 'demo-token-participante-001',
    perfil: 'Operador de Unidade',
    avatar: '/images/avatars/jose.png',
    // Dados específicos do participante
    cargo: 'Operador de Unidade',
    departamento: 'Produção',
    cpf: '123.456.789-01',
    telefone: '(81) 98765-4321',
    dataNascimento: '1978-05-15',
    dataAdmissao: '2015-03-10',
    // Indicadores de saúde mental
    phq9Ultimo: 18,
    gad7Ultimo: 15,
    statusRisco: 'alto',
    tendencia: 'piora',
    ultimaAvaliacao: '2026-02-05',
    proximaReavaliacao: '2026-03-05',
    alertasPendentes: 2
  },
  // Usuários adicionais para testes
  {
    id: '201',
    name: 'Ana Carolina Silva',
    email: 'ana.silva@santaclara.med.br',
    login: 'enfermeira',
    password: 'enfermeira123',
    type: 2, // Participante
    id_empresa: 5, // Hospital Santa Clara
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 5,
      nome: 'Hospital Santa Clara - Centro Médico',
      nomeCurto: 'Santa Clara',
      cor: '#DC3545',
      logotipo: 'santaclara-logo.png',
      slug: 'hospital-santa-clara'
    },
    token: 'demo-token-participante-002',
    perfil: 'Enfermeira UTIs',
    avatar: '/images/avatars/ana.png',
    cargo: 'Enfermeira UTIs',
    departamento: 'Unidade de Terapia Intensiva',
    cpf: '567.890.123-45',
    telefone: '(11) 98765-1234',
    dataNascimento: '1988-05-18',
    dataAdmissao: '2017-03-10',
    phq9Ultimo: 18,
    gad7Ultimo: 15,
    statusRisco: 'alto',
    tendencia: 'piora',
    ultimaAvaliacao: '2026-02-10',
    proximaReavaliacao: '2026-03-10',
    alertasPendentes: 1
  },
  {
    id: '401',
    name: 'Lucas Eduardo Pereira',
    email: 'lucas.pereira@bancohorizonte.com.br',
    login: 'bancario',
    password: 'bancario123',
    type: 2, // Participante
    id_empresa: 3, // Banco Horizonte
    cadastrado: 1,
    termo_consentimento: 1,
    empresa: {
      id: 3,
      nome: 'Banco Horizonte S.A.',
      nomeCurto: 'Banco Horizonte',
      cor: '#28A745',
      logotipo: 'horizonte-logo.png',
      slug: 'banco-horizonte'
    },
    token: 'demo-token-participante-003',
    perfil: 'Analista de Crédito',
    avatar: '/images/avatars/lucas.png',
    cargo: 'Analista de Crédito',
    departamento: 'Crédito e Cobrança',
    cpf: '012.345.678-90',
    telefone: '(11) 98765-6789',
    dataNascimento: '1987-09-25',
    dataAdmissao: '2017-02-14',
    phq9Ultimo: 6,
    gad7Ultimo: 4,
    statusRisco: 'baixo',
    tendencia: 'melhora',
    ultimaAvaliacao: '2026-02-10',
    proximaReavaliacao: '2026-05-10',
    alertasPendentes: 0
  }
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

        // Modo Produção - login via API Go
        try {
          // Criar FormData para envio
          const formData = new FormData()
          formData.append('login', credentials.login)
          formData.append('password', credentials.password)
          console.log('Enviando login para API:', credentials.login)
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/login`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
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
          console.log('Erro ao fazer login:', error)  
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
        // Campos adicionais para participantes
        token.perfil = (user as any).perfil
        token.avatar = (user as any).avatar
        token.cargo = (user as any).cargo
        token.departamento = (user as any).departamento
        token.cpf = (user as any).cpf
        token.telefone = (user as any).telefone
        token.phq9Ultimo = (user as any).phq9Ultimo
        token.gad7Ultimo = (user as any).gad7Ultimo
        token.statusRisco = (user as any).statusRisco
        token.tendencia = (user as any).tendencia
        token.ultimaAvaliacao = (user as any).ultimaAvaliacao
        token.proximaReavaliacao = (user as any).proximaReavaliacao
        token.alertasPendentes = (user as any).alertasPendentes
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
          // Campos adicionais
          perfil: token.perfil as string,
          avatar: token.avatar as string,
          cargo: token.cargo as string,
          departamento: token.departamento as string,
          cpf: token.cpf as string,
          telefone: token.telefone as string,
          phq9Ultimo: token.phq9Ultimo as number,
          gad7Ultimo: token.gad7Ultimo as number,
          statusRisco: token.statusRisco as string,
          tendencia: token.tendencia as string,
          ultimaAvaliacao: token.ultimaAvaliacao as string,
          proximaReavaliacao: token.proximaReavaliacao as string,
          alertasPendentes: token.alertasPendentes as number,
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
                return `${baseUrl}/inicio`
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
