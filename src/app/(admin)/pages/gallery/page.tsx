import ComponentContainerCard from '@/components/ComponentContainerCard'
import type { Metadata } from 'next'
import { Card, CardHeader, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Gallery' }

import cardImg1 from '@/assets/images/extra/card/img-1.jpg'
import cardImg2 from '@/assets/images/extra/card/img-2.jpg'
import cardImg3 from '@/assets/images/extra/card/img-3.jpg'
import cardImg4 from '@/assets/images/extra/card/img-4.jpg'
import cardImg5 from '@/assets/images/extra/card/img-5.jpg'
import cardImg6 from '@/assets/images/extra/card/img-6.jpg'
import GlightBox from '@/components/GlightBox'
import Image from 'next/image'
import PageTitle from '@/components/PageTitle'

const Gallery = () => {
  const galleryImages = [cardImg1, cardImg2, cardImg3, cardImg4, cardImg5, cardImg6, cardImg2, cardImg1]
  return (
    <>
<PageTitle title='Gallery' subName='Pages'/>
    <Row className="justify-content-center">
      <Col xs={12}>
        <ComponentContainerCard title="Gallery">
          <Row id="grid" className="g-0 row-gap-1">
            {galleryImages.map((image, idx) => (
              <Col md={4} lg={3} className="picture-item" key={idx}>
                <GlightBox href={image.src} className="lightbox">
                  <Image src={image} alt="card-image" className="img-fluid" />
                </GlightBox>
              </Col>
            ))}
          </Row>
        </ComponentContainerCard>
      </Col>
    </Row>
    </>
  )
}

export default Gallery
