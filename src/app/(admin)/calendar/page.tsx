import type { Metadata } from 'next'

import CalendarWidget from './components/CalendarWidget'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import nextjsImg from '@/assets/images/logos/lang-logo/nextjs.png'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import symfonyImg from '@/assets/images/logos/lang-logo/symfony.png'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import langLogo from '@/assets/images/logos/lang-logo/vue.png'
import partyImg from '@/assets/images/extra/party.gif'

export const metadata: Metadata = { title: 'Calendar' }

const Calendar = () => {
  return (
    <>
      <PageTitle title='Calendar' subName='Apps' />
      <Row>
        <Col lg={4}>
          <div>
            <Card>
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="m-0 fs-16">Schedules</h5>
                    <p className="text-muted mb-0 mt-1"><i className="fas fa-star text-primary" /> Create unlimited schedules for your bisuness</p>
                  </Col>
                  <Col xs={'auto'} className="align-self-center">
                    <a href='' className="btn btn-sm text-primary btn-soft-primary " data-bs-toggle="modal" data-bs-target="#addtask"> <i className="fa-solid fa-plus me-1" /> Add New </a>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-0">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item align-items-center d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Image src={nextjsImg} className="me-3 thumb-md align-self-center rounded-circle" alt="..." />
                      </div>
                      <div className="flex-grow-1 ms-0 text-truncate">
                        <h5 className="m-0 fs-13">Meeting with UI/UX Designers</h5>
                        <p className="text-muted mb-0">Today 07:30 AM</p>
                      </div>
                    </div>
                    <span className="badge text-bg-primary rounded">Upcoming</span>
                  </li>
                  <li className="list-group-item align-items-center ">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Image src={avatar5} className="me-3 thumb-md align-self-center rounded-circle" alt="..." />
                      </div>
                      <div className="flex-grow-1 ms-0 text-truncate">
                        <h5 className="m-0 font-13">Lunch with my friend</h5>
                        <p className="text-muted mb-0">Today 12:30 PM</p>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Image src={symfonyImg} className="me-3 thumb-md align-self-center rounded-circle" alt="..." />
                      </div>
                      <div className="flex-grow-1 ms-0 text-truncate">
                        <h5 className="m-0 fs-13">Call for payment Project ID : #254136</h5>
                        <p className="text-muted mb-0">Tomorrow 10:30 AM</p>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item align-items-center ">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Image src={avatar4} className="me-3 thumb-md align-self-center rounded-circle" alt="..." />
                      </div>
                      <div className="flex-grow-1 ms-2 text-truncate">
                        <h5 className="m-0 fs-13">Picnic with my Family</h5>
                        <p className="text-muted mb-0">01 June 2019 - 09:30 AM</p>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <Image src={langLogo} className="me-3 thumb-md align-self-center rounded-circle" alt="..." />
                      </div>
                      <div className="flex-grow-1 ms-2 text-truncate">
                        <h5 className="m-0 fs-13">Meeting with Developers</h5>
                        <p className="text-muted mb-0">04 June 2019 - 07:30 AM</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
            <div className="bg-primary-subtle p-2 border-dashed border-primary rounded mt-3 d-block">
              <Image src={partyImg} alt='partyImg' className="d-inline-block me-1" height={30} />
              <span className="text-primary fw-semibold">Karen Savage's</span><span className="text-primary fw-normal"> Project complated.</span>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <div className="mb-3">
            <Card>
              <CardBody>
                <CalendarWidget />
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Calendar
