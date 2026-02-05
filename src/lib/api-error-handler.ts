import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  status: number
  data?: ErrorResponse

  constructor(status: number, message: string, data?: ErrorResponse) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): void {
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data as ErrorResponse

    switch (status) {
      case 401:
        toast.error('Sessão expirada', {
          description: 'Faça login novamente para continuar.',
        })
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
  } else if (error instanceof Error) {
    toast.error('Erro', {
      description: error.message,
    })
  } else {
    toast.error('Erro', {
      description: 'Ocorreu um erro inesperado.',
    })
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse
    return data?.message || data?.error || 'Ocorreu um erro na requisição'
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'Ocorreu um erro inesperado'
}
