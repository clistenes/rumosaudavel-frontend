import React from 'react'
import { stateData } from '../data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap'

const State = () => {
  return (
    <Row className="justify-content-center">
      {
        stateData.map((item, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card className="report-card">
              <CardBody>
                <Row className="d-flex justify-content-center">
                  <Col>
                    <p className="text-dark mb-0 fw-semibold">{item.type}</p>
                    <h3 className="my-2 fs-20">{item.value}</h3>
                
                  </Col>
                  <Col xs={'auto'} className="align-self-center">
                    <div className={`flex-shrink-0  text-${item.variant} thumb-md rounded-circle`}>
                    <IconifyIcon icon={item.icon} className={`fs-3`} />
                    </div>
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