import type { Metadata } from 'next'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import Image from 'next/image'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import avatar9 from '@/assets/images/users/avatar-9.jpg'
import PageTitle from '@/components/PageTitle'
import avatar8 from '@/assets/images/users/avatar-8.jpg'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar7 from '@/assets/images/users/avatar-7.jpg'
import avatar10 from '@/assets/images/users/avatar-10.jpg'

export const metadata: Metadata = { title: 'Avatars' }

const AvatarsCircle = () => {
  return (
    <ComponentContainerCard title="Avatars Circle">
      <div className="d-flex align-items-center">
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xxl rounded-circle" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xl rounded-circle" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-lg rounded-circle" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-md rounded-circle" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-sm rounded-circle" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xs rounded-circle" />
        </span>
      </div>
    </ComponentContainerCard>
  )
}

const AvatarsSquare = () => {
  return (
    <ComponentContainerCard title="Avatars Square">
      <div className="d-flex align-items-center">
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xxl rounded" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xl rounded" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-lg rounded" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-md rounded" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-sm rounded" />
        </span>
        <span role="button" className="me-2 d-inline-block">
          <Image src={avatar9} alt="user" className="thumb-xs rounded" />
        </span>
      </div>
    </ComponentContainerCard>
  )
}

const TextAvatarsCircle = () => {
  return (
    <ComponentContainerCard title="Text Avatars Circle">
      <div className="d-flex align-items-center">
        <span className="thumb-xxl justify-content-center d-flex align-items-center bg-success-subtle text-success rounded-circle me-2">MT</span>
        <span className="thumb-xl justify-content-center d-flex align-items-center bg-pink-subtle text-pink rounded-circle me-2">MT</span>
        <span className="thumb-lg justify-content-center d-flex align-items-center bg-purple-subtle text-purple rounded-circle me-2">MT</span>
        <span className="thumb-md justify-content-center d-flex align-items-center bg-warning-subtle text-warning rounded-circle me-2">MT</span>
        <span className="thumb-sm justify-content-center d-flex align-items-center bg-info-subtle text-info rounded-circle me-2">MT</span>
        <span className="thumb-xs justify-content-center d-flex align-items-center bg-dark-subtle text-dark rounded-circle me-2">MT</span>
      </div>
    </ComponentContainerCard>
  )
}

const TextAvatarsSquare = () => {
  return (
    <ComponentContainerCard title="Text Avatars Square">
      <div className="d-flex align-items-center">
        <span className="thumb-xxl justify-content-center d-flex align-items-center bg-success-subtle text-success rounded me-2">MT</span>
        <span className="thumb-xl justify-content-center d-flex align-items-center bg-pink-subtle text-pink rounded me-2">MT</span>
        <span className="thumb-lg justify-content-center d-flex align-items-center bg-purple-subtle text-purple rounded me-2">MT</span>
        <span className="thumb-md justify-content-center d-flex align-items-center bg-warning-subtle text-warning rounded me-2">MT</span>
        <span className="thumb-sm justify-content-center d-flex align-items-center bg-info-subtle text-info rounded me-2">MT</span>
        <span className="thumb-xs justify-content-center d-flex align-items-center bg-dark-subtle text-dark rounded me-2">MT</span>
      </div>
    </ComponentContainerCard>
  )
}

const IconAvatarsCircle = () => {
  return (
    <ComponentContainerCard title="Icon Avatars Circle">
      <div className="d-flex align-items-center">
        <span className="thumb-xxl justify-content-center d-flex align-items-center bg-success text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
        <span className="thumb-xl justify-content-center d-flex align-items-center bg-pink text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
        <span className="thumb-lg justify-content-center d-flex align-items-center bg-purple text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
        <span className="thumb-md justify-content-center d-flex align-items-center bg-warning text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
        <span className="thumb-sm justify-content-center d-flex align-items-center bg-info text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
        <span className="thumb-xs justify-content-center d-flex align-items-center bg-dark text-white rounded-circle me-2">
          <IconifyIcon icon="iconoir:profile-circle" />
        </span>
      </div>
    </ComponentContainerCard>
  )
}

const IconAvatarsSquare = () => {
  return (
    <ComponentContainerCard title="Icon Avatars Square">
      <div className="d-flex align-items-center">
        <span className="thumb-xxl justify-content-center d-flex align-items-center bg-success text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
        <span className="thumb-xl justify-content-center d-flex align-items-center bg-pink text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
        <span className="thumb-lg justify-content-center d-flex align-items-center bg-purple text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
        <span className="thumb-md justify-content-center d-flex align-items-center bg-warning text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
        <span className="thumb-sm justify-content-center d-flex align-items-center bg-info text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
        <span className="thumb-xs justify-content-center d-flex align-items-center bg-dark text-white rounded me-2">
          <IconifyIcon icon="iconoir:people-tag" />
        </span>
      </div>
    </ComponentContainerCard>
  )
}

const Avatars = () => {
  return (
    <>
      <PageTitle title='Avatar' subName='UI Ki' />
      <Row>
        <Col lg={4}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Avatar</CardTitle>
                  <p className="text-muted mb-0">Single user example</p>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row className=" d-flex justify-content-center">
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <Image src={avatar8} alt="user" className="rounded-circle thumb-lg" />
                    </div>
                    <div className="flex-grow-1 ms-2 text-truncate">
                      <p className="fs-14 fw-semibold mb-0">Charles Smith</p>
                      <p className="mb-0 fs-12 text-muted">Charles@example.com</p>
                    </div>
                  </div>
                </Col>
                <Col xs={'auto'} className="align-self-center">
                  <div className="button-items">
                    <button type="button" className="btn btn-outline-primary"><i className="fab fa-facebook-f" /></button>
                    <button type="button" className="btn btn-outline-info"><i className="fab fa-twitter" /></button>
                    <button type="button" className="btn btn-outline-pink"><i className="fab fa-dribbble" /></button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Group Avatar</CardTitle>
                  <p className="text-muted mb-0">Group user example</p>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Row className=" d-flex justify-content-center">
                <Col>
                  <div className="img-group d-flex align-items-center">
                    <a className="user-avatar position-relative d-inline-block" href="#">
                      <Image src={avatar1} alt="avatar" className="thumb-lg shadow-sm rounded-circle" />
                    </a>
                    <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                      <Image src={avatar4} alt="avatar" className="thumb-lg shadow-sm rounded-circle" />
                    </a>
                    <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                      <Image src={avatar6} alt="avatar" className="thumb-lg shadow-sm rounded-circle" />
                    </a>
                    <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                      <Image src={avatar5} alt="avatar" className="thumb-lg shadow-sm rounded-circle" />
                    </a>
                    <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                      <Image src={avatar7} alt="avatar" className="thumb-lg shadow-sm rounded-circle" />
                    </a>
                    <a href='' className="user-avatar position-relative d-inline-block ms-1">
                      <span className="thumb-lg shadow-sm justify-content-center d-flex align-items-center bg-soft-primary rounded-circle fw-semibold fs-6">+6</span>
                    </a>
                  </div>
                </Col>
                <Col xs={'auto'} className="align-self-center">
                  <button type="button" className="btn btn-outline-light btn-sm">Message</button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Avatar With Badge</CardTitle>
                  <p className="text-muted mb-0">Single user with badge example</p>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="img-group d-flex">
                <a className="position-relative me-1" href="#">
                  <Image src={avatar10} alt="user" className="rounded-circle thumb-lg" />
                  <i className="fas fa-circle text-success fs-9 border border-white rounded-circle ms-1 position-absolute bottom-0 start-0 translate-middle" />
                </a>
                <a className="position-relative me-1" href="#">
                  <Image src={avatar4} alt="user" className="rounded-circle thumb-lg" />
                  <i className="fas fa-circle text-success fs-9 border border-white rounded-circle ms-1 position-absolute bottom-0 start-0 translate-middle" />
                </a>
                <a className="position-relative me-1" href="#">
                  <Image src={avatar1} alt="user" className="rounded-circle thumb-lg" />
                  <i className="fas fa-circle text-secondary fs-9 border border-white rounded-circle ms-1 position-absolute bottom-0 start-0 translate-middle" />
                </a>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6} lg={6}>
          <AvatarsCircle />
        </Col>
        <Col md={6} lg={6}>
          <AvatarsSquare />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={6}>
          <TextAvatarsCircle />
        </Col>
        <Col md={6} lg={6}>
          <TextAvatarsSquare />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={6}>
          <IconAvatarsCircle />
        </Col>
        <Col md={6} lg={6}>
          <IconAvatarsSquare />
        </Col>
      </Row>
    </>
  )
}

export default Avatars
