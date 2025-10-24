import PageTitle from '@/components/PageTitle'
import Image from 'next/image'
import React from 'react'
import avatar3 from '@/assets/images/users/avatar-3.jpg'
import baha_flag from '@/assets/images/flags/baha_flag.jpg'
import partyImg from '@/assets/images/extra/party.gif'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Customer Details' }

const CustomerDetails = () => {
  return (
    <>
      <PageTitle title='Customer' subName='Ecommerce' />
      <Row>
        <Col md={4}>
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
                      <Image src={avatar3} alt={'avatar3'} className="rounded-circle img-fluid" />
                      <div className="position-absolute top-50 start-100 translate-middle">
                        <Image src={baha_flag} alt='baha_flag' className="rounded-circle thumb-sm border border-3 border-white" />
                      </div>
                    </div>
                    <div className="flex-grow-1 text-truncate ms-3 align-self-end">
                      <h5 className="m-0 fs-3 fw-bold">Rosa Dodson</h5>
                      <p className="text-muted mb-0">@rosa</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-body mb-2  d-flex align-items-center"><i className="iconoir-language fs-20 me-1 text-muted" /><span className="text-body fw-semibold">Language :</span> English / French / Spanish</div>
                    <div className="text-muted mb-2 d-flex align-items-center"><i className="iconoir-mail-out fs-20 me-1" /><span className="text-body fw-semibold">Email :</span><a href="#" className="text-primary text-decoration-underline">example@example.com</a></div>
                    <div className="text-body mb-3 d-flex align-items-center"><i className="iconoir-phone fs-20 me-1 text-muted" /><span className="text-body fw-semibold">Phone :</span> +1 123 456 789</div>
                    <ul className="mb-0 list-unstyled">
                      <li className="list-inline-item">
                        <a href="#" className="d-flex justify-content-center align-items-center thumb-md rounded-circle mx-auto social twitter">
                          <i className="icofont-twitter fs-18 align-self-center mb-0 " />
                        </a>
                      </li>&nbsp;
                      <li className="list-inline-item">
                        <a href="#" className="d-flex justify-content-center align-items-center thumb-md rounded-circle mx-auto social instagram">
                          <i className="icofont-instagram fs-18 align-self-center mb-0 " />
                        </a>
                      </li>&nbsp;
                      <li className="list-inline-item">
                        <a href="#" className="d-flex justify-content-center align-items-center thumb-md rounded-circle mx-auto social facebook">
                          <i className="icofont-facebook fs-18 align-self-center mb-0 " />
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg={8}>
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
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Orders</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <button className="btn btn-primary"><i className="fas fa-eye me-1" /> View All</button>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><Link href="/ecommerce/order-details">#632536</Link></td>
                      <td>
                        <p className="d-inline-block align-middle mb-0">
                          <span className="d-block align-middle mb-0 product-name text-body">Bata Shoes</span>
                          <span className="text-muted font-13">size-08 (Model 2024)</span>
                        </p>
                      </td>
                      <td>15/08/2023</td>
                      <td>UPI</td>
                      <td>
                        <span className="badge bg-success-subtle text-success"><i className="fas fa-check me-1" /> Completed</span>
                      </td>
                      <td>$390</td>
                    </tr>
                    <tr>
                      <td><Link href="/ecommerce/order-details">#365485</Link></td>
                      <td>
                        <p className="d-inline-block align-middle mb-0">
                          <span className="d-block align-middle mb-0 product-name text-body">Morden Chair</span>
                          <span className="text-muted font-13">Size-Mediam (Model 2021)</span>
                        </p>
                      </td>
                      <td>22/09/2023</td>
                      <td>Banking</td>
                      <td>
                        <span className="badge bg-success-subtle text-success"><i className="fas fa-check me-1" /> Completed</span>
                      </td>
                      <td>$630</td>
                    </tr>
                    <tr>
                      <td><Link href="/ecommerce/order-details">#325415</Link></td>
                      <td>
                        <p className="d-inline-block align-middle mb-0">
                          <span className="d-block align-middle mb-0 product-name text-body">Reebok Shoes</span>
                          <span className="text-muted font-13">size-08 (Model 2021)</span>
                        </p>
                      </td>
                      <td>31/12/2023</td>
                      <td>Paypal</td>
                      <td>
                        <span className="badge bg-danger-subtle text-danger"><i className="fas fa-xmark me-1" /> Cancle</span>
                      </td>
                      <td>$450</td>
                    </tr>
                    <tr>
                      <td><Link href="/ecommerce/order-details">#546987</Link></td>
                      <td>
                        <p className="d-inline-block align-middle mb-0">
                          <span className="d-block align-middle mb-0 product-name text-body">Cosco Vollyboll</span>
                          <span className="text-muted font-13">size-04 (Model 2021)</span>
                        </p>
                      </td>
                      <td>05/01/2024</td>
                      <td>UPI</td>
                      <td>
                        <span className="badge bg-success-subtle text-success"><i className="fas fa-check me-1" /> Completed</span>
                      </td>
                      <td>$880</td>
                    </tr>
                    <tr>
                      <td><Link href="/ecommerce/order-details">#951236</Link></td>
                      <td>
                        <p className="d-inline-block align-middle mb-0">
                          <span className="d-block align-middle mb-0 product-name text-body">Royal Purse</span>
                          <span className="text-muted font-13">Pure Lether 100%</span>
                        </p>
                      </td>
                      <td>20/02/2024</td>
                      <td>BTC</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary"><i className="fas fa-clock me-1" /> Pendding</span>
                      </td>
                      <td>$520</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>

  )
}

export default CustomerDetails