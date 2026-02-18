import { http, API_ENDPOINTS } from './http.service'

export interface DashboardHomeData {
  empresas: number
  participantes: number
  questionarios: number
}

export const dashboardService = {
  async home(): Promise<DashboardHomeData> {
    const response = await http.get<DashboardHomeData>(API_ENDPOINTS.dashboard.home)
    return response.data || (response as unknown as DashboardHomeData)
  },

  async bugs(): Promise<unknown> {
    const response = await http.get<unknown>(API_ENDPOINTS.dashboard.bugs)
    return response.data || response
  },
}
