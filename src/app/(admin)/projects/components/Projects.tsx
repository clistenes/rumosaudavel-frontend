import { getAllProject } from '@/helpers/data'
import { splitArray } from '@/utils/array'
import Image from 'next/image'
import React from 'react'
import { Card, CardBody, Col, ProgressBar, Row } from 'react-bootstrap'

const Projects = async () => {
  const projectData = await getAllProject()
  const projectChunks = splitArray(projectData, 3)
  return (
    <>
      {
        projectChunks.map((chunk, idx) => (
          <Row key={idx}>
            {chunk.map((item, idx) => (
              <Col lg={4} key={idx}>
                <Card>
                  <CardBody>
                    <div className="position-absolute top-0 start-0 translate-middle"><i className={`fas fa-circle text-${item.progressColor ? item.progressColor : 'success'} `} /></div>
                    <Row>
                      <Col md={6}>
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <Image src={item.logo} alt='app-img' className="thumb-lg rounded-circle" />
                          </div>
                          <div className="flex-grow-1 ms-2 text-truncate">
                            <h4 className="m-0 fw-semibold text-dark fs-16">{item.title}</h4>
                            <p className="text-muted mb-0 fs-13"><span className="text-dark">Client : </span>{item.client}</p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6} className="text-lg-end">
                        <h6 className="fw-semibold m-0">Start : <span className="text-muted fw-normal"> {item.start_date}</span></h6>
                        <h6 className="fw-semibold  mb-0 mt-2">Deadline : <span className="text-muted fw-normal"> {item.deadline}</span></h6>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-semibold m-0 align-self-center">All Hours : <span className="text-muted fw-normal"> {item.all_hours}</span></h6>
                        <h6 className="fw-semibold">Today : <span className="text-muted fw-normal"> {item.today_hours}</span><span className="badge bg-soft-pink text-pink fw-semibold ms-2"><i className="far fa-fw fa-clock" /> {item.days_left} days left</span></h6>
                      </div>
                      <p className="text-muted mb-1">There are many variations of passages of Lorem Ipsum available,
                        but the majority have suffered alteration in some form.
                      </p>
                      <p className="text-muted text-end mb-1">{item.progress}% Complete</p>
                        <ProgressBar now={item.progress} className='mb-3' variant={item.progressColor ? item.progressColor : 'primary'} style={{ height: 3 }} />
                      <div className="d-flex justify-content-between">
                        <div className="img-group d-flex justify-content-center">
                          {
                            item.team.map((img, idx) => (
                              <a className="user-avatar position-relative d-inline-block" key={idx} href="#">
                                <Image src={img} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                              </a>
                            ))
                          }
                          <a href='' className="user-avatar position-relative d-inline-block ms-1">
                            <span className="thumb-md shadow-sm justify-content-center d-flex align-items-center bg-light rounded-circle fw-semibold fs-6">+6</span>
                          </a>
                        </div>
                        <ul className="list-inline mb-0 align-self-center">
                          <li className="list-item d-inline-block me-2">
                            <a href="#">
                              <i className="fa-solid fa-list-ul text-success fs-15" />&nbsp;
                              <span className="text-muted fw-bold">34/100</span>
                            </a>
                          </li>
                          <li className="list-item d-inline-block">
                            <a  href="#">
                              <i className="fa-regular fa-message text-primary fs-15" />&nbsp;
                              <span className="text-muted fw-bold">3</span>
                            </a>
                          </li>
                          <li className="list-item d-inline-block">
                            <a className="ms-2" href="#">
                              <i className="fa-solid fa-pencil text-muted fs-18" />
                            </a>
                          </li>&nbsp;
                          <li className="list-item d-inline-block">
                            <a  href="#">
                              <i className="fa-regular fa-trash-can text-muted fs-18" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <hr className="hr-dashed" />
                    <Row className="mt-3">
                      <div className="col-lg">
                        <div className="d-flex">
                          <i className="iconoir-headset align-self-center text-secondary fs-24" />
                          <div className="d-block align-self-center ms-2">
                            <h6 className="m-0">Last Meeting</h6>
                            <p className="mb-0 text-muted">28 Oct 2020 / 10:30AM - 12:30PM</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-auto">
                        <div className="d-flex">
                          <i className="iconoir-headset align-self-center text-secondary fs-24" />
                          <div className="d-block align-self-center ms-2">
                            <h6 className="m-0">Next Meeting</h6>
                            <p className="mb-0 text-muted">06 Nov 2020 / 10:30AM - 12:30PM</p>
                          </div>
                        </div>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        ))
      }
    </>
  )
}

export default Projects