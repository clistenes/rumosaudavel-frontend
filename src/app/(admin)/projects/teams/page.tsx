import PageTitle from '@/components/PageTitle'
import React from 'react'
import { teamsData, TeamsType } from './data'
import Image from 'next/image'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Teams' }

const TeamsCard = ({ extra_members, leader, logo, name, status, status_color, team }: TeamsType) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <Image src={logo} alt='logo' className="thumb-lg rounded-circle" />
              </div>
              <div className="flex-grow-1 ms-2 text-truncate">
                <h4 className="m-0 fw-semibold text-dark fs-16">{name}</h4>
                <p className="text-dark mb-0 fs-13">Recently : <span className={`text-${status == 'Available' ? 'success' : 'danger'}`}>{status} </span></p>
              </div>
            </div>
          </Col>
          <Col md={6} className=" text-end">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 me-2 text-truncate">
                <h4 className="m-0 fw-semibold text-dark fs-14">{leader.name}</h4>
                <p className="text-dark mb-0 fs-13">{leader.role}</p>
              </div>
              <div className="flex-shrink-0">
                <Image src={leader.avatar} alt='avatar' className="thumb-lg rounded-circle" />
              </div>
            </div>
          </Col>
        </Row>
        <div className="mt-3">
          <p className="text-muted mb-1 text-t">There are many variations of passages of Lorem Ipsum available,
            but the majority have suffered alteration in some form.
          </p>
          <p className="text-muted text-end mb-1">34% Complete</p>
          <div className="progress mb-3" style={{ height: 3 }}>
            <div className="progress-bar bg-primary" role="progressbar" style={{ width: '34%' }} aria-valuenow={34} aria-valuemin={0} aria-valuemax={100} />
          </div>
          <div className="d-flex justify-content-between">
            <div className="img-group d-flex justify-content-center">
              {
                team.map((img) => (
                  <a className="user-avatar position-relative d-inline-block" href="#">
                    <Image src={img} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                  </a>
                ))
              }
              <a href='' className="user-avatar position-relative d-inline-block ms-1">
                <span className="thumb-md shadow-sm justify-content-center d-flex align-items-center bg-soft-primary rounded-circle fw-semibold fs-6">+{extra_members}</span>
              </a>
            </div>
            <div className="align-self-center">
              <button className="btn btn-sm text-primary btn-soft-primary"><i className="fa-regular fa-message me-1" />Massage</button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

const TeamsPage = () => {
  return (
    <>
      <PageTitle title='Teams' subName='Projects' />
      <Row>
        {
          teamsData.map((item, idx) => (
            <Col lg={4} key={idx}>
              <TeamsCard {...item} />
            </Col>
          ))
        }
      </Row>
    </>
  )
}

export default TeamsPage