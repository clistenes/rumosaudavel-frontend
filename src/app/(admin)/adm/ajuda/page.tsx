// 'use client'
import PageTitle from '@/components/PageTitle'
import React, { use } from 'react'
import { Row } from 'react-bootstrap'
import  TutorialTabs  from './components/TutorialTabs'



export const metadata = { title: 'Tutoriais' }

const Tutoriais = () => {
  return (
    <>
      <PageTitle title='Tutoriais'  />
      <Row>
        <TutorialTabs />
      </Row>
    </>
  )
}
export default Tutoriais