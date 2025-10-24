import { Card, CardBody, Col, Row } from 'react-bootstrap'

import avatar7 from '@/assets/images/users/avatar-7.jpg'
import Image from 'next/image'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import CompletionChart from './CompletionChart'
import Link from 'next/link'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import baha_flag from '@/assets/images/flags/baha_flag.jpg'

const ProfileCard = () => {
  return (
    <Card>
      <CardBody className="p-4  rounded text-center img-bg">
      </CardBody>
      <div className="position-relative">
        <div className="shape overflow-hidden text-card-bg">
          <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <CardBody className="mt-n6">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center">
              <div className="position-relative">
                <Image src={avatar5} alt='avatar5' className="rounded-circle img-fluid" />
                <div className="position-absolute top-50 start-100 translate-middle">
                  <Image src={baha_flag} alt='baha_flag' className="rounded-circle thumb-sm border border-3 border-white" />
                </div>
              </div>
              <div className="flex-grow-1 text-truncate ms-3 align-self-end">
                <h5 className="m-0 fs-3 fw-bold">Karen Savage</h5>
                <p className="text-muted mb-0">@karen</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-body mb-2  d-flex align-items-center"><i className="iconoir-language fs-20 me-1 text-muted" /><span className="text-body fw-semibold">Language :</span> English / French / Spanish</div>
              <div className="text-muted mb-2 d-flex align-items-center"><i className="iconoir-mail-out fs-20 me-1" /><span className="text-body fw-semibold">Email :</span><a href="#" className="text-primary text-decoration-underline">example@example.com</a></div>
              <div className="text-body mb-3 d-flex align-items-center"><i className="iconoir-phone fs-20 me-1 text-muted" /><span className="text-body fw-semibold">Phone :</span> +1 123 456 789</div>
              <button type="button" className="btn btn-primary  d-inline-block">Follow</button>
              <button type="button" className="btn btn-light  d-inline-block">Hire Me</button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>

  )
}

export default ProfileCard
