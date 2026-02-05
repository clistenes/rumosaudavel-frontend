'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function RelatorioGeralPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Relatório Geral</h4>
          <p className="text-muted">Visão geral dos resultados</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Resumo</h5>
              <p className="text-muted">
                Relatório geral será exibido aqui.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
