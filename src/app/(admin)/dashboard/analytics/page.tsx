import PageTitle from '@/components/PageTitle'
import React from 'react'
import State from './components/State'
import AudienceCard from './components/AudienceCard'
import SessionsDeviceCard from './components/SessionsDeviceCard'
import PagesUsers from './components/PagesUsers'
import SessionsChannel from './components/SessionsChannel'
import ActivityCard from './components/ActivityCard'
import Visits from './components/Visits'
import BrowserAndTrafficReports from './components/BrowserAndTrafficReports'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'


export const metadata: Metadata = { title: 'Analytics' }

const DashboardPage = () => {
  return (
    <>
      <PageTitle title='Dashboard' subName='Dashboard'/>
      <Row>
        <Col lg={9}>
          <State />
          <AudienceCard />
        </Col>
        <Col lg={3}>
          <SessionsDeviceCard />
        </Col>
      </Row>
      <Row>
        <PagesUsers />
        <Col lg={4}>
          <SessionsChannel />
        </Col>
        <Col lg={4}>
          <ActivityCard />
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          <Visits />
        </Col>
        <Col lg={6}>
          <BrowserAndTrafficReports />
        </Col>
      </Row>
    </>
  )
}

export default DashboardPage