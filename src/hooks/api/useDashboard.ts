import { useState, useEffect } from 'react'
import { dashboardService, type DashboardHomeData } from '@/services/dashboard.service'

export function useDashboardHome() {
  const [data, setData] = useState<DashboardHomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await dashboardService.home()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => {
    setLoading(true)
    setError(null)
    dashboardService.home()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err : new Error('Erro desconhecido')))
      .finally(() => setLoading(false))
  }}
}

export function useDashboardBugs() {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await dashboardService.bugs()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error, refetch: () => {
    setLoading(true)
    dashboardService.bugs()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err : new Error('Erro desconhecido')))
      .finally(() => setLoading(false))
  }}
}
