import PageTitle from '@/components/PageTitle'
import React from 'react'
import OrderProduct from './components/OrderProduct'
import Link from 'next/link'
import Image from 'next/image'
import baha_flag from '@/assets/images/flags/baha_flag.jpg'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Detail' }

const OrderDetailsPage = () => {
  return (
    <>
      <PageTitle title='Order Detail' subName='Ecommerce' />
      <Row>
        <Col lg={8}>
          <OrderProduct />
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Bought - Awaiting Delivery</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <Link href='' className="text-secondary"><i className="fas fa-download me-1" /> Download Invoice</Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="position-relative m-4">
                <div className="progress" role="progressbar" aria-label="Progress" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} style={{ height: 1 }}>
                  <div className="progress-bar" style={{ width: '50%' }} />
                </div>
                <div className="position-absolute top-0 start-0 translate-middle bg-primary text-white rounded-pill thumb-md"><i className="iconoir-home" /></div>
                <div className="position-absolute top-0 start-50 translate-middle bg-primary-subtle text-primary rounded-pill thumb-md"><i className="iconoir-delivery-truck" /></div>
                <div className="position-absolute top-0 start-100 translate-middle bg-light text-dark rounded-pill thumb-md"><i className="iconoir-map-pin" /></div>
              </div>
              <Row className=" row-cols-3">
                <Col className="text-start">
                  <h6 className="mb-1">Order Created</h6>
                  <p className="mb-0 text-muted fs-12 fw-medium">15 Feb 2024, 11:30 AM</p>
                </Col>
                <Col className="text-center">
                  <h6 className="mb-1">On Delivery</h6>
                  <p className="mb-0 text-muted fs-12 fw-medium">18 Feb 2024, 05:15 PM</p>
                </Col>
                <Col className="text-end">
                  <h6 className="mb-1">Order Delivered</h6>
                  <p className="mb-0 text-muted fs-12 fw-medium">20 Feb 2024, 01:00 PM</p>
                </Col>
              </Row>
              <div className="bg-primary-subtle p-2 border-dashed border-primary rounded mt-3">
                <span className="text-primary fw-semibold">Note :</span><span className="text-primary fw-normal"> Ship all the ordered item together by monday and i send you an email please check. Thanks!</span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <h4 className="card-title">Order Summary</h4>
                </Col>
                <Col xs={'auto'}>
                  <span className="badge rounded text-warning bg-warning-subtle fs-12 p-1">Payment pending</span>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold">Items subtotal :</p>
                  <p className="text-body-emphasis fw-semibold">$1060</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold">Discount :</p>
                  <p className="text-danger fw-semibold">-$80</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold">Tax :</p>
                  <p className="text-body-emphasis fw-semibold">$180.70</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold">Subtotal :</p>
                  <p className="text-body-emphasis fw-semibold">$1160.70</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold mb-0">Shipping Cost :</p>
                  <p className="text-body-emphasis fw-semibold mb-0">$20</p>
                </div>
              </div>
              <hr className="hr-dashed" />
              <div className="d-flex justify-content-between">
                <h4 className="mb-0">Total :</h4>
                <h4 className="mb-0">$1180.70</h4>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'} className="card-title">Order Information</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <Link href='' className="text-secondary"><i className="fas fa-pen me-1" /> Edit</Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-profile-circle text-secondary fs-20 align-middle me-1" />Username :</p>
                  <p className="text-body-emphasis fw-semibold">@donFlo</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-people-tag text-secondary fs-20 align-middle me-1" />Full Name :</p>
                  <p className="text-body-emphasis fw-semibold">Don Flowers</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-mail text-secondary fs-20 align-middle me-1" />Email :</p>
                  <p className="text-body-emphasis fw-semibold">DonIFlowers@jourrapide.com</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-dollar-circle text-secondary fs-20 align-middle me-1" />Total Payment :</p>
                  <p className="text-body-emphasis fw-semibold"><span className="text-primary">$2450</span> ($30 for transportation)</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-calendar text-secondary fs-20 align-middle me-1" />Order Date :</p>
                  <p className="text-body-emphasis fw-semibold">31 Dec 2023</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-calendar text-secondary fs-20 align-middle me-1" />Delivery Date :</p>
                  <p className="text-body-emphasis fw-semibold">05 Jan 2024</p>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <p className="text-body fw-semibold"><i className="iconoir-delivery-truck text-secondary fs-20 align-middle me-1" />Courier :</p>
                  <p className="text-body-emphasis fw-semibold">FedEx Corporation</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-body fw-semibold"><i className="iconoir-map-pin text-secondary fs-20 align-middle me-1" />Address :</p>
                  <p className="text-body-emphasis fw-semibold"><Image src={baha_flag} alt='baha_flag' className="thumb-sm rounded-circle d-inline-block me-1" />&nbsp;718 Bingamon Branch Road <br /> Central Valley, NY 10917
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>

  )
}

export default OrderDetailsPage