'use client'

import { Card, Col, Row } from 'react-bootstrap'

export default function EmpresaParticipantesPage() {
  return (
    <>
      <Row className="mb-4">
        <Col>
          <h4 className="page-title">Participantes</h4>
          <p className="text-muted">Lista de participantes da sua empresa</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Lista de Participantes</h5>
              <p className="text-muted">
                Nenhum participante encontrado.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
