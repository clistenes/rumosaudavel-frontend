import PageTitle from '@/components/PageTitle'
import React from 'react'
import State from './components/State'
import CustomersGrowth from './components/CustomersGrowth'
import State2 from './components/State2'
import CustomerDetails from './components/CustomerDetails'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers' }

const CustomersPage = () => {
  return (
    <>
      <PageTitle title='Customers' subName='Analytics' />
      <Row>
        <State />
      </Row>
      <Row>
        <Col md={12} lg={8}>
          <CustomersGrowth />
        </Col>
        <Col md={12} lg={4}>
          <State2 />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <CustomerDetails />
        </Col>
      </Row>
    </>

  )
}

export default CustomersPage