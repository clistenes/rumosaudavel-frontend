import PageTitle from '@/components/PageTitle'
import React from 'react'
import MetricsChart from './components/MetricsChart'
import TopCountry from './components/TopCountry'
import { socialMediaData, visitsDetailsData } from './data'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Table } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reports' }

const reportsPage = () => {
  return (
    <>
      <PageTitle title='Reports' subName='Analytics' />
      <Row>
        <Col md={12} lg={7}>
          <MetricsChart />
        </Col>
        <Col md={12} lg={5}>
          <TopCountry />
        </Col>
      </Row>
      <Row>
        <Col ld={6}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Visits Details</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>URL</th>
                      <th className="text-end">Views</th>
                      <th className="text-end">Uniques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      visitsDetailsData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.url}</td>
                          <td className="text-end">{item.visitors}</td>
                          <td className="text-end">{item.unique_visitors}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>By Social Media</CardTitle>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Source</th>
                      <th className="text-end">Views</th>
                      <th className="text-end">Uniques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      socialMediaData.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.platform}</td>
                          <td className="text-end">{item.visitors}</td>
                          <td className="text-end">{item.unique_visitors}</td>
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

export default reportsPage