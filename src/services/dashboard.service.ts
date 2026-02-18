import { http } from './http.service'

export interface DashboardHomeData {
  empresas: number
  participantes: number
  questionarios: number
}

export const dashboardService = {
  async home(): Promise<DashboardHomeData> {
    const response = await http.get<DashboardHomeData>('/dashboard/home')
    return response.data || (response as unknown as DashboardHomeData)
  },

  async bugs(): Promise<unknown> {
    const response = await http.get<unknown>('/dashboard/bugs')
    return response.data || response
  },
}
