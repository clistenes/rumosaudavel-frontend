'use client'

import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { toast } from 'sonner'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    empresas: 0,
    participantes: 0,
    questionarios: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aqui você pode carregar as estatísticas reais da API
    // Por enquanto, vou apenas simular
    const loadStats = async () => {
      try {
        // Simular chamada à API
        // const response = await api.get('/adm/dashboard')
        // setStats(response.data.data)
        
        // Dados mockados temporariamente
        setStats({
          empresas: 15,
          participantes: 1250,
          questionarios: 25,
        })
      } catch (error) {
        toast.error('Erro ao carregar estatísticas')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

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
          <h4 className="page-title">Dashboard Administrativo</h4>
          <p className="text-muted">Bem-vindo ao painel de administração do Rumo Saudável</p>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="widget-flat">
            <Card.Body>
              <div className="float-end">
                <IconifyIcon icon="fa6-solid:building" className="widget-icon" />
              </div>
              <h5 className="text-muted fw-normal mt-0">Empresas</h5>
              <h3 className="mt-2 mb-0">{stats.empresas}</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Total de empresas cadastradas</span>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="widget-flat">
            <Card.Body>
              <div className="float-end">
                <IconifyIcon icon="fa6-solid:users" className="widget-icon" />
              </div>
              <h5 className="text-muted fw-normal mt-0">Participantes</h5>
              <h3 className="mt-2 mb-0">{stats.participantes}</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Total de participantes</span>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="widget-flat">
            <Card.Body>
              <div className="float-end">
                <IconifyIcon icon="fa6-solid:clipboard-question" className="widget-icon" />
              </div>
              <h5 className="text-muted fw-normal mt-0">Questionários</h5>
              <h3 className="mt-2 mb-0">{stats.questionarios}</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Questionários disponíveis</span>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
