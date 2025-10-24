import React from 'react'
import { orderDetailsData } from './data'
import Image from 'next/image'
import PageTitle from '@/components/PageTitle'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Refunds' }

const RefundsPage = () => {
  return (
    <>
      <PageTitle title='Refunds' subName='Ecommerce' />
      <Row>
        <Col lg={8}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Refund Request</CardTitle>
                  <p className="mb-0 text-muted mt-1">Orders #234755</p>
                </Col>
                <Col xs={'auto'}>
                  <Link href="/ecommerce/order-details" className="text-secondary"><i className="fa-solid fa-circle-info me-1" /> Order Detail</Link>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Items</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Quantity</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderDetailsData.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <Image src={item.image} alt='product' height={40} className="rounded me-2" />
                            <p className="d-inline-block align-middle mb-0">
                              <span className="d-block align-middle mb-0 product-name text-body">{item.productName}</span>
                              <span className="text-muted font-13">{item.description}</span>
                            </p>
                          </td>
                          <td className="text-end">${item.price}</td>
                          <td className="text-end">{item.quantity}</td>
                          <td className="text-end">${item.total}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Order Summary</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <span className="badge rounded text-success bg-success-subtle fs-12 p-1">Payment Completed</span>
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
            <CardBody>
              <form>
                <div className="form-groupmb-3">
                  <label htmlFor="Amount" className="form-label">Amount</label>
                  <input type="text" className="form-control" id="Amount" placeholder="Amount" />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label mt-2" htmlFor="customer-message">Message</label>
                  <textarea className="form-control" rows={3} id="customer-message" placeholder="writing here.." defaultValue={""} />
                </div>
                <button type="submit" className="btn btn-primary">Refund</button>&nbsp;
                <button type="button" className="btn btn-danger">Decline</button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>

  )
}

export default RefundsPage