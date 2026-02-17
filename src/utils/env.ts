/**
 * Utilitário para verificar se o sistema está em modo DEMO
 */

export const isDemoMode = (): boolean => {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || ''
}
