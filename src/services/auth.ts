import type { ApiResponse } from '@/types/auth'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.message || 'Erro na autenticação')
  }
  return data
}

export const authService = {
  async forgotPassword(email: string) {
    const response = await fetch(`${apiUrl}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return parseResponse<void>(response)
  },

  async resetPassword(token: string, password: string, passwordConfirmation: string) {
    const response = await fetch(`${apiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    })
    return parseResponse<void>(response)
  },

  async getMe(token?: string) {
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return parseResponse<{ user: unknown }>(response)
  },
}
