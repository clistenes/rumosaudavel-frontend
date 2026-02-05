'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function RelatorioGraficosPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Gráficos</h4>
          <p className="text-muted">Visualização gráfica dos dados</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Gráficos</h5>
              <p className="text-muted">
                Gráficos serão exibidos aqui.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
