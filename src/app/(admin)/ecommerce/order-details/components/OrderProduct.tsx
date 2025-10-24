import React from 'react'
import { orderDetailsData } from '../data'
import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'

const OrderProduct = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Orders #234755</CardTitle>
            <p className="mb-0 text-muted mt-1">15 March 2024 at 09:45 am from draft orders</p>
          </Col>
          <Col xs={'auto'}>
            <button className="btn btn-primary"><i className="fas fa-plus me-1" /> Add Item</button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Item</th>
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
  )
}

export default OrderProduct