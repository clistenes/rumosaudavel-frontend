'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function RelatorioHeatmapPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Heatmap</h4>
          <p className="text-muted">Mapa de calor de exposição ao risco</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Heatmap de Exposição</h5>
              <p className="text-muted">
                Heatmap será exibido aqui.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
