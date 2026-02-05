'use client'

import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import PageTitle from '@/components/PageTitle'
import DashboardCards from '@/components/DashboardCards'
import type { DashboardCardProps } from '@/components/DashboardCards'

export default function EmpresaDashboard() {
  const [stats, setStats] = useState({
    percentual: 68,
    total: 102,
    usuarios: 150,
  })
  const [loading, setLoading] = useState(true)
  const navigate = useRouter()

  useEffect(() => {
    // Aqui você carregaria os dados da empresa
    setLoading(false)
  }, [])

  const handleRelatoriosClick = () => {
    navigate.push('/empresa/relatorios/geral')
  }

  const cards: DashboardCardProps[] = [
    {
      title: 'Participantes',
      value: stats.usuarios,
      icon: 'iconoir:community',
      variant: 'primary'
    },
    {
      title: 'Taxa de Resposta',
      value: `${stats.percentual}%`,
      icon: 'iconoir:percent-rotate-clockwise',
      variant: 'success'
    },
    {
      title: 'Respondentes',
      value: stats.total,
      icon: 'iconoir:clipboard-check',
      variant: 'info'
    }
  ]

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <PageTitle title="Dashboard Empresa" />
          <p className="text-muted">Acompanhamento dos resultados da sua empresa</p>
        </Col>
      </Row>

      <DashboardCards 
        cards={cards}
        showManualCard={true}
        manualCardOnClick={handleRelatoriosClick}
      />
    </>
  )
}
