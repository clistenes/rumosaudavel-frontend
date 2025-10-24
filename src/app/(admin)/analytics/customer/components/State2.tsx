import React from 'react'
import { state2Data } from '../data'
import { Card, CardBody, Col, ProgressBar, Row } from 'react-bootstrap'

const State2 = () => {
  return (
    <Row className="g-3">
      {
        state2Data.map((item, idx) => (
          <Col md={6} lg={6} key={idx}>
            <Card className="mb-3 mb-lg-0">
              <CardBody className="text-center">
                <span className="fs-18 fw-semibold">{item.value}</span>
                <h6 className="text-uppercase text-muted my-2 m-0">{item.title}</h6>
                <div className="d-flex align-items-center">
                    <ProgressBar now={item.progress} variant='primary' className="w-100" style={{ height: 5 }} />
                  <small className="flex-shrink-1 ms-1">{item.progress}%</small>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))
      }
    </Row>
  )
}

export default State2