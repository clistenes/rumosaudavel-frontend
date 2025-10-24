import type { Metadata } from 'next'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import ProfileCard from './components/ProfileCard'
import PersonalInformation from './components/PersonalInformation'
import ProfileView from './components/ProfileView'
import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import partyImg from '@/assets/images/extra/party.gif'

export const metadata: Metadata = { title: 'Profile' }

const Profile = () => {
  return (
    <>
      <PageTitle title='Profile' subName='Pages' />
      <Row className="justify-content-center">
        <Col md={4}>
          <ProfileCard />
          <PersonalInformation />
        </Col>
        <Col md={8}>
          <div>
            <div className="bg-primary-subtle p-2 border-dashed border-primary rounded mb-3">
              <Image src={partyImg} alt='partyImg' className="d-inline-block me-1" height={30} />
              <span className="text-primary fw-semibold">Rosa Dodson's</span><span className="text-primary fw-normal"> best performance from last year</span>
            </div>
            <Row className="g-3">
              <Col md={6} lg={3}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <i className="iconoir-dollar-circle fs-24 align-self-center text-info me-2" />
                      <div className="flex-grow-1 text-truncate">
                        <p className="text-dark mb-0 fw-semibold fs-13">Total Cost</p>
                        <h3 className="mt-1 mb-0 fs-18 fw-bold">$27,215k <span className="fs-11 text-muted fw-normal">New 365 Days</span> </h3>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <i className="iconoir-cart fs-24 align-self-center text-blue me-2" />
                      <div className="flex-grow-1 text-truncate">
                        <p className="text-dark mb-0 fw-semibold fs-13">Total Order</p>
                        <h3 className="mt-1 mb-0 fs-18 fw-bold">190 <span className="fs-11 text-muted fw-normal">Order 365 Days</span> </h3>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <i className="iconoir-thumbs-up fs-24 align-self-center text-primary me-2" />
                      <div className="flex-grow-1 text-truncate">
                        <p className="text-dark mb-0 fw-semibold fs-13">Completed</p>
                        <h3 className="mt-1 mb-0 fs-18 fw-bold">165 <span className="fs-11 text-muted fw-normal">Comp. Order 365 Days</span> </h3>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card>
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <i className="iconoir-xmark-circle fs-24 align-self-center text-danger me-2" />
                      <div className="flex-grow-1 text-truncate">
                        <p className="text-dark mb-0 fw-semibold fs-13">Cancled</p>
                        <h3 className="mt-1 mb-0 fs-18 fw-bold">25 <span className="fs-11 text-muted fw-normal">Canc.Order 365 Days</span> </h3>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <ProfileView />
        </Col>
      </Row>
    </>
  )
}

export default Profile
