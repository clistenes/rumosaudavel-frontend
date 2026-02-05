'use client'

import { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

export default function ParticipanteDashboard() {
  const [questionarios, setQuestionarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aqui você carregaria os questionários do participante
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
          <h4 className="page-title">Área do Participante</h4>
          <p className="text-muted">Bem-vindo à sua área de questionários</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Meus Questionários</h5>
              <p className="text-muted">
                Lista de questionários disponíveis será exibida aqui.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
