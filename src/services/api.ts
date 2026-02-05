import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'
import { toast } from 'sonner'

interface ErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession()
    
    if (session?.user && 'token' in session.user) {
      config.headers.Authorization = `Bearer ${session.user.token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status
    const data = error.response?.data
    
    switch (status) {
      case 401:
        toast.error('Sessão expirada', {
          description: 'Faça login novamente para continuar.',
        })
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        break
      case 403:
        toast.error('Acesso negado', {
          description: 'Você não tem permissão para acessar este recurso.',
        })
        break
      case 404:
        toast.error('Recurso não encontrado', {
          description: data?.message || 'O recurso solicitado não existe.',
        })
        break
      case 422:
        if (data?.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => {
                toast.error(`Erro em ${field}`, { description: msg })
              })
            }
          })
        } else {
          toast.error('Dados inválidos', {
            description: data?.message || 'Verifique os dados informados.',
          })
        }
        break
      case 500:
        toast.error('Erro interno', {
          description: 'Ocorreu um erro no servidor. Tente novamente mais tarde.',
        })
        break
      default:
        toast.error('Erro', {
          description: data?.message || 'Ocorreu um erro inesperado.',
        })
    }
    
    return Promise.reject(error)
  }
)

export default api
