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

// Log de debug das variáveis de ambiente (aparecerá no console do servidor)
console.log('🔧 [NextAuth] Configuração:')
console.log('🔧 [NextAuth] DEMO_MODE:', isDemoMode)
console.log('🔧 [NextAuth] API_URL:', process.env.NEXT_PUBLIC_API_URL)

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
          return null
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

          return null
        }

        // Modo Produção - login via API Go
        try {
          // Criar URLSearchParams para envio (application/x-www-form-urlencoded)
          const params = new URLSearchParams()
          params.append('login', credentials.login)
          params.append('password', credentials.password)
          
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`
          console.log('🚀 [NextAuth] Tentando login na API:', apiUrl)
          console.log('🚀 [NextAuth] Dados enviados:', params.toString())
          
          const response = await axios.post(
            apiUrl,
            params,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          )

          console.log('✅ [NextAuth] Resposta da API:', response.data)

          // Verifica se retornou token (sucesso no login)
          if (response.data.token) {
            const { token, type } = response.data
            console.log('✅ [NextAuth] Token recebido, tipo:', type)
            
            // Decodificar token JWT para extrair user_id
            const tokenData = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
            console.log('✅ [NextAuth] Dados do token:', tokenData)
            
            const userId = tokenData.user_id
            const userType = parseInt(type)
            const empresaId = tokenData.empresa_id
            
            // Buscar dados completos do usuário na API
            try {
              const userResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                }
              )
              
              const userData = userResponse.data
              console.log('✅ [NextAuth] Dados do usuário:', userData)
              
              return {
                id: String(userId),
                name: userData.name || userData.nome || credentials.login,
                email: userData.email || '',
                login: credentials.login,
                type: userType,
                id_empresa: empresaId,
                cadastrado: userData.cadastrado || 1,
                termo_consentimento: userData.termo_consentimento || 1,
                empresa: userData.empresa || null,
                token: token,
              } as User
            } catch (userError) {
              console.log('⚠️ [NextAuth] Não foi possível buscar dados do usuário, usando dados básicos')
              // Se não conseguir buscar dados do usuário, retorna com dados básicos
              return {
                id: String(userId),
                name: credentials.login,
                email: '',
                login: credentials.login,
                type: userType,
                id_empresa: empresaId,
                cadastrado: 1,
                termo_consentimento: 1,
                empresa: undefined,
                token: token,
              } as unknown as User
            }
          }

          console.log('❌ [NextAuth] API não retornou token:', response.data)
          return null
        } catch (error) {
          console.error('❌ [NextAuth] Erro ao fazer login:', error)
          
          if (axios.isAxiosError(error)) {
            console.error('❌ [NextAuth] Status:', error.response?.status)
            console.error('❌ [NextAuth] Resposta da API:', error.response?.data)
            if (error.response?.status === 401 || error.response?.status === 403) {
              return null
            }
            throw new Error(error.response?.data?.message || `Erro ${error.response?.status}: ${error.response?.statusText}`)
          }
          throw error
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
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
          
          console.log('🔄 [NextAuth] Redirect - Sessão:', session?.user)
          console.log('🔄 [NextAuth] Redirect - Tipo bruto:', session?.user?.type, typeof session?.user?.type)
          
          if (session?.user?.type) {
            // Converter para número para garantir comparação correta
            const userType = Number(session.user.type)
            console.log('🔄 [NextAuth] Redirect - Tipo convertido:', userType)
            
            switch (userType) {
              case 1:
                console.log('🔄 [NextAuth] Redirect - Admin → /inicio')
                return `${baseUrl}/inicio`
              case 2:
                console.log('🔄 [NextAuth] Redirect - Participante → /participante')
                return `${baseUrl}/participante`
              case 3:
                console.log('🔄 [NextAuth] Redirect - Empresa → /empresa')
                return `${baseUrl}/empresa`
              default:
                console.log('🔄 [NextAuth] Redirect - Tipo desconhecido:', userType)
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
