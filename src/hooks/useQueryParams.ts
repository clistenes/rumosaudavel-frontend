'use client'
import { useSearchParams } from 'next/navigation'

const useQueryParams = () => {
  const searchParams = useSearchParams()
  if (!searchParams) return {}
  return Object.fromEntries([...searchParams])
}

export default useQueryParams
