import { currentYear } from '@/context/constants'
import React from 'react'
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="footer text-center text-sm-start d-print-none">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Card className="mb-0 border-bottom-0 rounded-bottom-0">
              <CardBody>
                <p className="text-muted mb-0">
                  © {currentYear}&nbsp;Dastone
                  <span className="text-muted d-none d-sm-inline-block float-end">
                    Design with&nbsp;
                    <i className="iconoir-heart-solid text-danger align-middle" />&nbsp;by Mannatthemes</span>
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer