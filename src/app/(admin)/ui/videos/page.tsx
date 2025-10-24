import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import type { Metadata } from 'next'
import { Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Videos' }

const Videos = () => {
  return (
    <>
    <PageTitle title='Videos' subName='UI Ki' />
      <Row className="justify-content-center">
        <Col md={6}>
          <ComponentContainerCard title="Ratio Video 16:9">
            <div className="ratio ratio-16x9">
              <iframe src="https://www.youtube.com/embed/-GfNEDs3ERw" title="YouTube video" allowFullScreen />
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={6}>
          <ComponentContainerCard title="Ratio Video 21:9">
            <div className="ratio ratio-21x9">
              <iframe src="https://www.youtube.com/embed/-GfNEDs3ERw" title="YouTube video" allowFullScreen />
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <ComponentContainerCard title="Ratio Video 4:3">
            <div className="ratio ratio-4x3">
              <iframe src="https://www.youtube.com/embed/-GfNEDs3ERw" title="YouTube video" allowFullScreen />
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={6}>
          <ComponentContainerCard title="Ratio Video 1:1">
            <div className="ratio ratio-1x1">
              <iframe src="https://www.youtube.com/embed/-GfNEDs3ERw" title="YouTube video" allowFullScreen />
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default Videos
