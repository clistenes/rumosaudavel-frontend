import PageTitle from '@/components/PageTitle'
import React from 'react'
import { Row } from 'react-bootstrap'
import State from './components/State'

export const metadata = { title: 'Início' }

const Home = () => {
  return (
    <>
      <PageTitle title='Dashboard'  />
      <Row>
        <State />
      </Row>
    </>
  )
}
export default Home