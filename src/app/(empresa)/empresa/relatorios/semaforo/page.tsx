'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function RelatorioSemaforoPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Relatório Semáforo</h4>
          <p className="text-muted">Indicadores de risco</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Semáforo de Risco</h5>
              <p className="text-muted">
                Relatório semáforo será exibido aqui.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
