'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function QuestionariosPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Meus Questionários</h4>
          <p className="text-muted">Lista de questionários disponíveis para você</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Questionários Pendentes</h5>
              <p className="text-muted">
                Você não tem questionários pendentes no momento.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
