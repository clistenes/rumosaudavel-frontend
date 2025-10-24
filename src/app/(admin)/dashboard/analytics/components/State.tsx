import React from 'react'
import { stateData, StateType } from '../data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const StateCard = ({ color, description, icon, percentage, title, value ,down}: StateType) => {
  return (
    <Card className="report-card">
      <CardBody>
        <Row className="d-flex justify-content-center">
          <Col>
            <p className="text-dark mb-0 fw-semibold">{title}</p>
            <h3 className="my-1 fs-20">{value}</h3>
            <p className="mb-0 text-truncate text-muted"><span className={`text-${down ? 'danger' : 'success'}`}><i className="las la-trending-up" />{percentage}%</span> {description}</p>
          </Col>
          <Col xs={'auto'} className="align-self-center">
            <div className={`flex-shrink-0 bg-${color}-subtle text-${color} thumb-md rounded-circle`}>
              <IconifyIcon icon={icon} className="fs-4" />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const State = () => {
  return (
    <Row className="justify-content-center">
      {
        stateData.map((item, idx) => (
          <Col md={6} lg={3} key={idx}>
            <StateCard {...item} />
          </Col>
        ))
      }
    </Row>
  )
}

export default State