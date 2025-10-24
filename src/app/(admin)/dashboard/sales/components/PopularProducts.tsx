import React from 'react'
import { popularProductData } from '../data'
import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'

const PopularProducts = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Most Populer Products</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-top-0">Product</th>
                <th className="border-top-0">Price</th>
                <th className="border-top-0">Sell</th>
                <th className="border-top-0">Status</th>
                <th className="border-top-0">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                popularProductData.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <Image src={item.image} height={30} className="me-2 align-self-center rounded" alt="..." />
                        </div>
                        <div className="flex-grow-1 ms-2 text-truncate">
                          <h6 className="m-0">{item.productName}</h6>
                          <a href="#" className="fs-12 text-primary">ID: {item.productId}</a>
                        </div>
                      </div>
                    </td>
                    <td>${item.price} <del className="text-muted fs-10">${item.originalPrice}</del></td>
                    <td>{item.stock} <small className="text-muted">({item.sold})</small></td>
                    <td><span className={`badge bg-soft-${item.availability == 'Stock' ? 'success' : 'danger'} text-${item.availability == 'Stock' ? 'success' : 'danger'} px-2`}>{item.availability}</span></td>
                    <td>
                      <a href="#"><i className="las la-pen text-secondary fs-16" /></a>
                      <a href="#"><i className="las la-trash-alt text-secondary fs-16" /></a>
                    </td>
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

export default PopularProducts