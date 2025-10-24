import React from 'react'
import { stateData } from '../data'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const State = () => {
  return (
    <Row>
      {
        stateData.map((item, idx) => (
          <Col xs={12} lg={6} xl key={idx}>
            <Card>
              <CardBody>
                <Row className="align-items-center">
                  <Col className="text-center">
                    <span className="h4">{item.value}</span>
                    <h6 className="text-uppercase text-muted mt-2 m-0">{item.label}</h6>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))
      }
    </Row>
  )
}

export default State