'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function ContatosPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Contatos</h4>
          <p className="text-muted">Canais de comunicação</p>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Suporte</h5>
              <p className="text-muted">
                Em caso de dúvidas, entre em contato com o suporte.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
