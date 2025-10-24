import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { stateData } from '../data'

const State = () => {
  return (
    <>
      {
        stateData.map((item, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card>
              <CardBody>
                <Row className="d-flex justify-content-center">
                  <Col xs={9}>
                    <p className="text-dark mb-0 fw-semibold">{item.platform}</p>
                    <h3 className="mt-2 mb-0 fs-20">{item.clicks} <span className="fs-13 text-muted fw-medium">Click</span> </h3>
                  </Col>
                  <Col xs={3} className="align-self-center">
                    <div className={`d-flex justify-content-center align-items-center thumb-lg bg-soft-${item.color}  rounded-circle mx-auto`}>
                      <i className={`${item.icon} align-self-center mb-0 text-${item.color}`} />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))
      }
    </>
  )
}

export default State