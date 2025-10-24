import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
import { pagesUsersData } from '../data'
import Image from 'next/image'
import Link from 'next/link'

const PagesUsers = () => {
  return (
    <Col lg={4}>
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col>
              <CardTitle as={'h4'}>Pages View by Users</CardTitle>
            </Col>
            <Col xs={'auto'}>
              <Dropdown>
                <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Today<i className="las la-angle-down ms-1" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>Today</DropdownItem>
                  <DropdownItem>Yesterday</DropdownItem>
                  <DropdownItem>Last Week</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="px-0">
          <ul className="list-group list-group-flush mb-n3">
            {
              pagesUsersData.map((item, idx) => (
                <li className="list-group-item align-items-center d-flex justify-content-between" key={idx}>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <Image src={item.logo} height={30} className="me-2 align-self-center rounded" alt="..." />
                    </div>
                    <div className="flex-grow-1 ms-2 text-truncate">
                      <h6 className="m-0">{item.title}</h6>
                      <p className="mb-0 text-muted">{item.file}</p>
                    </div>
                  </div>
                  <div className="align-self-center">
                    <Link href="" className="btn btn-sm btn-soft-primary">{item.views}k <i className="las la-external-link-alt font-15" /></Link>
                  </div>
                </li>
              ))
            }
          </ul>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="d-flex">
            <h2 className="m-0 align-self-center">80</h2>
            <div className="d-block ms-2 align-self-center">
              <span className="text-warning">Right now</span>
              <h5 className="my-1">Traffic Sources</h5>
              <p className="mb-0 text-muted">It is a long established fact that a reader will
                be of a page when looking at its layout.&nbsp;
                <Link href='' className="text-primary">Read More <i className="las la-arrow-right" /></Link>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default PagesUsers