import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import React from 'react'
import nextjsImg from '@/assets/images/logos/lang-logo/nextjs.png'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar5 from '@/assets/images/users/avatar-5.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'
import avatar6 from '@/assets/images/users/avatar-6.jpg'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create Project' }

const CreateProjectPage = () => {
  return (
    <>
    <PageTitle title='Create New' subName='Projects' />
    <Row>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody className="p-0">
              <Row className=" g-0 h-100">
                <Col lg={7} className="border-end">
                  <form className="p-4 pt-3">
                    <div className="form-group mb-2 mb-lg-1">
                      <label htmlFor="projectName" className="form-label">Project Name :</label>
                      <input type="text" className="form-control" id="projectName" aria-describedby="emailHelp" placeholder="Enter project name" />
                    </div>
                    <div className="form-group">
                      <Row>
                        <Col lg={3} xs={6} className="mb-2 mb-lg-1">
                          <label className="form-label mt-2" htmlFor="pro-start-date">Start Date</label>
                          <input type="text" className="form-control" name="startdate" id="pro-start-date" placeholder="Enter start date" />
                        </Col>
                        <Col lg={3} xs={6} className="mb-2 mb-lg-1">
                          <label className="form-label mt-2" htmlFor="pro-end-date">End Date</label>
                          <input type="text" className="form-control" name="enddate" id="pro-end-date" placeholder="Enter end date" />
                        </Col>
                        <Col lg={3} xs={6} className="mb-2 mb-lg-1">
                          <label className="form-label mt-2" htmlFor="pro-rate">Rate</label>
                          <input type="text" className="form-control" id="pro-rate" placeholder="Enter rate" />
                        </Col>
                        <Col lg={3} xs={6} className="mb-2 mb-lg-1">
                          <label className="form-label mt-2" htmlFor="pro-price-type">Price Type</label>
                          <select className="form-select">
                            <option>Hourly</option>
                            <option>Daily</option>
                            <option>Fix</option>
                          </select>
                        </Col>
                      </Row>
                    </div>
                    <div className="form-group">
                      <Row>
                        <Col lg={6} className="mb-2 mb-lg-1">
                          <label className="form-label mt-2">Required</label>
                          <select className="form-select">
                            <option>--Select--</option>
                            <option>UI/UX Design</option>
                            <option>Payment System </option>
                            <option>Android 10</option>
                          </select>
                        </Col>
                        <Col lg={3} xs={6}>
                          <label className="form-label mt-2">Invoice Time</label>
                          <select className="form-select">
                            <option>30 Day</option>
                            <option>3 Month</option>
                            <option>1 Year</option>
                          </select>
                        </Col>
                        <Col lg={3} xs={6}>
                          <label className="form-label mt-2">Priority</label>
                          <select className="form-select">
                            <option>-- select --</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </Col>
                      </Row>
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label mt-2" htmlFor="pro-message">Message</label>
                      <textarea className="form-control" rows={5} id="pro-message" placeholder="writing here.." defaultValue={""} />
                    </div>
                    <button type="submit" className="btn btn-primary">Create project</button>&nbsp;
                    <button type="button" className="btn btn-danger">Cancel</button>
                  </form>
                </Col>
                <Col lg={5} className="align-self-center">
                  <form className="p-4">
                    <div className="form-group">
                      <div className="d-flex align-items-center">
                        <Image src={nextjsImg} alt='logo' className="thumb-xxl rounded me-3" />
                        <div className="flex-grow-1 text-truncate">
                          <label className="btn btn-primary text-light">
                            Change Avatar <input type="file" hidden />
                          </label>
                        </div>
                      </div>
                    </div>
                    <h5 className="fw-normal my-3 lh-lg">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised.</h5>
                    <div className="form-group">
                      <label className="form-label" htmlFor="team-leader">Project team leaders</label>
                      <div className="img-group d-flex justify-content-start">
                        <a className="user-avatar position-relative d-inline-block" href="#">
                          <Image src={avatar1} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                          <Image src={avatar2} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                          <Image src={avatar4} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                          <Image src={avatar5} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                          <Image src={avatar4} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a className="user-avatar position-relative d-inline-block ms-n2" href="#">
                          <Image src={avatar6} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                        </a>
                        <a href='' className="user-avatar position-relative d-inline-block ms-1">
                          <span className="thumb-md shadow-sm justify-content-center d-flex align-items-center bg-info-subtle rounded-circle fw-semibold fs-6">+32</span>
                        </a>
                      </div>
                      <input id="add-member" type="file" name="files[]" multiple style={{ display: 'none' }} />
                    </div>
                    <div className="p-3  border-info border-dashed bg-info-subtle  mt-3 rounded">
                      <Row className=" d-flex justify-content-center">
                        <Col>
                          <div>
                            <a href="#" className="fw-bold me-1 text-info">You've almost reached your goal</a> 75% of your goals are completed just complate 25% of remaining goals to achieve your target.
                          </div>
                        </Col>
                        <Col xs={'auto'} className="align-self-center">
                          <span className="badge rounded text-info bg-transparent border border-info mb-2 p-1">Last Create Project</span>
                          <p className="text-dark  fw-semibold fs-13">15 Dec 2024, AM-10:15</p>
                        </Col>
                      </Row>
                    </div>
                  </form>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Row>
    </>
  )
}

export default CreateProjectPage