import PageTitle from '@/components/PageTitle'
import React from 'react'
import RevenueChart from './components/RevenueChart'
import State from './components/State'
import TotalRevenue from './components/TotalRevenue'
import EarningReportsChart from './components/EarningReportsChart'
import EarningReports from './components/EarningReports'
import PopularProducts from './components/PopularProducts'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sales' }

const SalesPage = () => {
  return (
    <>
      <PageTitle title='Sales' subName='Dashboard' />
      <Row>
        <Col lg={9}>
          <RevenueChart />
          <State />
        </Col>
        <Col lg={3}>
          <TotalRevenue />
          <EarningReportsChart />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <EarningReports />
        </Col>
        <Col lg={6}>
         <PopularProducts />
        </Col>
      </Row>
    </>

  )
}

export default SalesPage