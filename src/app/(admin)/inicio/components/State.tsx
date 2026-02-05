'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import DashboardCards from '@/components/DashboardCards'
import type { DashboardCardProps } from '@/components/DashboardCards'

const AdminDashboard = () => {
  const navigate = useRouter()

  const handleManualClick = () => {
    navigate.push('/adm/ajuda')
  }

  const cards: DashboardCardProps[] = [
    {
      title: 'Empresas Ativas',
      value: '18',
      icon: 'iconoir:suitcase',
      variant: 'primary'
    },
    {
      title: 'Usuários Cadastrados',
      value: '2.328',
      icon: 'iconoir:user',
      variant: 'info'
    },
    {
      title: 'Questionários Ativos',
      value: '58',
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
