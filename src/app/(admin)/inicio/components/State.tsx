'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import DashboardCards from '@/components/DashboardCards'
import type { DashboardCardProps } from '@/components/DashboardCards'
import { useDashboardHome } from '@/hooks/api/useDashboard'

const AdminDashboard = () => {
  const navigate = useRouter()
  const { data, loading, error } = useDashboardHome()

  const handleManualClick = () => {
    navigate.push('/adm/ajuda')
  }

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '-'
    return num.toLocaleString('pt-BR')
  }

  const cards: DashboardCardProps[] = [
    {
      title: 'Empresas Ativas',
      value: loading ? '...' : formatNumber(data?.empresas),
      icon: 'iconoir:suitcase',
      variant: 'primary'
    },
    {
      title: 'Usuários Cadastrados',
      value: loading ? '...' : formatNumber(data?.participantes),
      icon: 'iconoir:user',
      variant: 'info'
    },
    {
      title: 'Questionários Ativos',
      value: loading ? '...' : formatNumber(data?.questionarios),
      icon: 'iconoir:okrs',
      variant: 'pink'
    }
  ]

  return (
    <DashboardCards 
      cards={cards} 
      showManualCard={true}
      manualCardOnClick={handleManualClick}
    />
  )
}

export default AdminDashboard
