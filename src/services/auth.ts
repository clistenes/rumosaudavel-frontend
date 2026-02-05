import api from './api'
import { ApiResponse, EmpresaType } from '@/types/auth'

export const authService = {
  async forgotPassword(email: string) {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(token: string, password: string, passwordConfirmation: string) {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  },

  async getMe() {
    const response = await api.get<ApiResponse<{ user: any }>>('/auth/me')
    return response.data
  },
}
