'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function ProntuarioPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Meu Prontuário</h4>
          <p className="text-muted">Histórico e informações pessoais</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Histórico de Coaching</h5>
              <p className="text-muted">
                Nenhum registro encontrado.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
