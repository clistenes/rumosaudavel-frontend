import PageTitle from '@/components/PageTitle'
import React from 'react'
import State from './components/State'
import TasksPerformance from './components/TasksPerformance'
import OverviewChart from './components/OverviewChart'
import AppBox from './components/AppBox'
import ActivityCard from './components/ActivityCard'
import AllProjects from './components/AllProjects'
import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Overview' }

const OverviewPage = () => {
  return (
    <>
      <PageTitle title='Overview' subName='Projects' />
      <State />
      <Row>
        <Col lg={4}>
          <TasksPerformance />
        </Col>
        <Col lg={8}>
          <OverviewChart />
        </Col>
      </Row>
      <AppBox />
      <Row>
        <Col lg={4}>
          <ActivityCard />
        </Col>
        <Col lg={8}>
          <AllProjects />
        </Col>
      </Row>
    </>

  )
}

export default OverviewPage