import React from 'react'
import OrdersTable from './components/OrdersTable'
import { getAllProducts } from '@/helpers/data'
import PageTitle from '@/components/PageTitle'
import Link from 'next/link'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders' }

const OrdersPage = async () => {
  const ordersData = await getAllProducts()
  return (
    <>
      <PageTitle title='Orders' subName='Ecommerce' />
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle>Orders</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <button className="btn btn-primary"><i className="fas fa-plus me-1" /> Add Order</button>
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
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      ordersData.slice(0,10).map((item, idx) => (
                        <tr key={idx}>
                          <td><Link href="/ecommerce/order-details">#{item.id}</Link></td>
                          <td>
                            <p className="d-inline-block align-middle mb-0">
                              <span className="d-block align-middle mb-0 product-name text-body">{item.name}</span>
                              <span className="text-muted font-13">{item.description}</span>
                            </p>
                          </td>
                          <td>{item.createdAt.toLocaleString('en-us', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                          <td>{item.paymentType}</td>
                          <td>
                            <span className={`badge bg-${item.status == 'Published' ? 'success' : item.status == 'Inactive' ? 'secondary' : item.status == 'In Stock' ? 'primary' : 'danger'}-subtle text-${item.status == 'Published' ? 'success' : item.status == 'Inactive' ? 'secondary' : item.status == 'In Stock' ? 'primary' : 'danger'}`}>{item.status == 'Inactive' ? <i className='fas fa-clock me-1' /> : <i className="fas fa-check me-1" />}  {item.status}</span>
                          </td>
                          <td>${item.price}</td>
                          <td className="text-end">
                            <a href="#"><i className="las la-pen text-secondary fs-18" /></a>
                            <a href="#"><i className="las la-trash-alt text-secondary fs-18" /></a>
                          </td>
                        </tr>
                      ))
                    }
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

export default OrdersPage