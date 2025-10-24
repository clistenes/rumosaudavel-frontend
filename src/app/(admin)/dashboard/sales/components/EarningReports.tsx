import React from 'react'
import { earningReportData } from '../data'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'

const EarningReports = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Earnings Reports</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="border-top-0">Date</th>
                <th className="border-top-0">Item Count</th>
                <th className="border-top-0">Text</th>
                <th className="border-top-0">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {
                earningReportData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td>{item.itemCount}</td>
                    <td className={`${item.textType && 'text-danger'} `}>{item.text}</td>
                    <td>{item.earnings}</td>
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

export default EarningReports