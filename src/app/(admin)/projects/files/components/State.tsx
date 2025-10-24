import React from 'react'
import { stateData, StateType } from '../data'
import { Card, CardBody, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar, Row } from 'react-bootstrap'
import Image from 'next/image'

const StateCard = ({ files, image, name, usage }: StateType) => {
  return (
    <Card>
      <CardBody>
        <Dropdown drop={'start'} className="float-end">
          <DropdownToggle as={'a'} className="text-muted fs-16 p-1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fa-solid fa-ellipsis-vertical" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end mt-4">
            <DropdownItem>View Detail</DropdownItem>
            <DropdownItem>Clear All</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Image src={image} className="me-2 align-self-center thumb-xl" alt="..." />
        <h5 className="fw-semibold mt-3 fs-14">{name}</h5>
        <div className="d-flex justify-content-between my-2">
          <p className="text-muted mb-0 fs-13 fw-semibold"><span className="text-dark">{files} </span>Files</p>
          <p className="text-muted mb-0 fs-13 fw-semibold"><span className="text-dark">500 </span>GB</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1 text-truncate">
            <div className="d-flex align-items-center">
                <ProgressBar now={usage} variant='secondary' className="bg-secondary-subtle w-100" style={{ height: 5 }} />
              <small className="flex-shrink-1 ms-1">{usage}%</small>
            </div>
          </div>
        </div>
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