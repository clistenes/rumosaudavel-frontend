import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import BasicWizard from './components/BasicWizard'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Wizard' }

const Wizard = () => {
  return (
    <>
   <PageTitle title='Wizard' subName='Form'  /> 
    <Row className="justify-content-center">
      <Col xs={12}>
        <BasicWizard />
      </Col>
    </Row>
    </>
  )
}

export default Wizard
