import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'
import AllEditors from './components/AllEditors'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Editors' }

const Editors = () => {
  return (
    <>
    <PageTitle title='Editors' subName='Form' />
    <Row className="justify-content-center">
      <Col xs={12}>
        <AllEditors />
      </Col>
    </Row>
    </>
  )
}

export default Editors
