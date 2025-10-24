import { customers } from '@/assets/data/Product'
import Image from 'next/image'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'

const CustomerDetails = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Customers Details</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Ext.</th>
                <th>City</th>
                <th data-type="date" data-format="YYYY/DD/MM">Start Date</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {
                customers.map((customer, idx) => (
                  <tr key={idx}>
                    <td className="d-flex align-items-center">
                      <Image src={customer.avatar} alt='avatar' className="thumb-md rounded-circle me-1" />
                      {customer.name}
                    </td>
                    <td>{customer.order}</td>
                    <td>{customer.city}</td>
                    <td>{new Date(customer.startDate).toLocaleDateString()}</td>
                    <td>{customer.completion}%</td>
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

export default CustomerDetails