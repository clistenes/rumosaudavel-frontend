'use client'

import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { toast } from 'sonner'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export default function EmpresaDashboard() {
  const [stats, setStats] = useState({
    percentual: 0,
    total: 0,
    usuarios: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aqui você carregaria os dados da empresa
    setLoading(false)
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
          <h4 className="page-title">Dashboard da Empresa</h4>
          <p className="text-muted">Acompanhamento dos resultados da sua empresa</p>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="widget-flat">
            <Card.Body>
              <div className="float-end">
                <IconifyIcon icon="fa6-solid:chart-pie" className="widget-icon" />
              </div>
              <h5 className="text-muted fw-normal mt-0">Participação</h5>
              <h3 className="mt-2 mb-0">{stats.percentual}%</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Taxa de participação</span>
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
              <h5 className="text-muted fw-normal mt-0">Respondentes</h5>
              <h3 className="mt-2 mb-0">{stats.total}</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Total de respondentes</span>
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="widget-flat">
            <Card.Body>
              <div className="float-end">
                <IconifyIcon icon="fa6-solid:user-check" className="widget-icon" />
              </div>
              <h5 className="text-muted fw-normal mt-0">Cadastrados</h5>
              <h3 className="mt-2 mb-0">{stats.usuarios}</h3>
              <p className="mb-0 text-muted">
                <span className="text-nowrap">Usuários cadastrados</span>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
