import React from 'react'
import { browserAndTrafficData } from '../data'
import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'

const BrowserAndTrafficReports = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Browser Used &amp; Traffic Reports</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive browser_users">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-top-0">Browser</th>
                <th className="border-top-0">Sessions</th>
                <th className="border-top-0">Bounce Rate</th>
                <th className="border-top-0">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {
                browserAndTrafficData.map((item, idx) => (
                  <tr key={idx}>
                    <td><Image src={item.browserLogo} alt='logo' height={16} className="me-2" />{item.name}</td>
                    <td>{item.sessions.amount}<small className="text-muted">({item.sessions.percentage}%)</small></td>
                    <td>{item.bounceRate}%</td>
                    <td>{item.transactions.amount}<small className="text-muted">({item.transactions.percentage}%)</small></td>
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

export default BrowserAndTrafficReports