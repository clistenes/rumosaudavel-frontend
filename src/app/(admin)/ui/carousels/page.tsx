import type { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardBody, Carousel, CarouselItem, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Carousels' }

import cardImg1 from '@/assets/images/extra/card/img-1.jpg'
import cardImg2 from '@/assets/images/extra/card/img-2.jpg'
import cardImg3 from '@/assets/images/extra/card/img-3.jpg'
import cardImg4 from '@/assets/images/extra/card/img-4.jpg'
import cardImg5 from '@/assets/images/extra/card/img-5.jpg'
import cardImg6 from '@/assets/images/extra/card/img-6.jpg'
import PageTitle from '@/components/PageTitle'

const BasicCarousel = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={5} className="offset-lg-1 align-self-center">
            <div className="p-3">
              <span className="bg-pink-subtle p-1 rounded text-pink fw-medium">Basic Examples </span>
              <h1 className="my-4 font-weight-bold">
                Manage Your Work With <span className="text-primary">Dastone</span>.
              </h1>
              <p className="fs-14 text-muted">
                Dastone is a Bootstrap 5 admin dashboard, It is fully responsive and included awesome features to help build web applications fast and
                easy.
              </p>
              <button type="button" className="btn btn-primary">
                Get Started
              </button>
            </div>
          </Col>
          <Col lg={5} className="offset-lg-1 text-center">
            <Carousel controls={false} indicators={false} className="slide">
              <CarouselItem className="active">
                <Image src={cardImg2} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg1} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg3} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
            </Carousel>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const CarouselWithIndicator = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={5} className="text-center">
            <Carousel indicators={false} id="carouselExample" className="slide">
              <CarouselItem className="active">
                <Image src={cardImg4} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg5} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg6} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
            </Carousel>
          </Col>
          <Col lg={5} className="offset-lg-1 align-self-center">
            <div className="p-3">
              <span className="bg-pink-subtle p-1 rounded text-pink fw-medium">Indicators</span>
              <h1 className="my-4 font-weight-bold">
                Manage Your Work With <span className="text-primary">Dastone</span>.
              </h1>
              <p className="fs-14 text-muted">
                Dastone is a Bootstrap 5 admin dashboard, It is fully responsive and included awesome features to help build web applications fast and
                easy.
              </p>
              <button type="button" className="btn btn-primary">
                Get Started
              </button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const CarouselWithCaption = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={5} className="offset-lg-1 align-self-center">
            <div className="p-3">
              <span className="bg-pink-subtle p-1 rounded text-pink fw-medium">Captions </span>
              <h1 className="my-4 font-weight-bold">
                Manage Your Work With <span className="text-primary">Dastone</span>.
              </h1>
              <p className="fs-14 text-muted">
                Dastone is a Bootstrap 5 admin dashboard, It is fully responsive and included awesome features to help build web applications fast and
                easy.
              </p>
              <button type="button" className="btn btn-primary">
                Get Started
              </button>
            </div>
          </Col>
          <Col lg={5} className="offset-lg-1 text-center">
            <Carousel id="carouselExampleIndicators" className="slide">
              <CarouselItem className="active">
                <Image src={cardImg4} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg5} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg6} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
            </Carousel>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const CarouselWithCrossFadeEffect = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={5} className="text-center">
            <Carousel id="carouselExampleFade" fade indicators={false} className="slide">
              <CarouselItem className="active">
                <Image src={cardImg6} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg1} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg3} width={506} height={337} className="d-block w-100" alt="..." />
              </CarouselItem>
            </Carousel>
          </Col>
          <Col lg={5} className="offset-lg-1 align-self-center">
            <div className="p-3">
              <span className="bg-pink-subtle p-1 rounded text-pink fw-medium">Crossfade</span>
              <h1 className="my-4 font-weight-bold">
                Manage Your Work With <span className="text-primary">Dastone</span>.
              </h1>
              <p className="fs-14 text-muted">
                Dastone is a Bootstrap 5 admin dashboard, It is fully responsive and included awesome features to help build web applications fast and
                easy.
              </p>
              <button type="button" className="btn btn-primary">
                Get Started
              </button>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const DarkVariantCarousel = () => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={5} className="offset-lg-1 align-self-center">
            <div className="p-3">
              <span className="bg-pink-subtle p-1 rounded text-pink fw-medium">Dark variant </span>
              <h1 className="my-4 font-weight-bold">
                Manage Your Work With <span className="text-primary">Dastone</span>.
              </h1>
              <p className="fs-14 text-muted">
                Dastone is a Bootstrap 5 admin dashboard, It is fully responsive and included awesome features to help build web applications fast and
                easy.
              </p>
              <button type="button" className="btn btn-primary">
                Get Started
              </button>
            </div>
          </Col>
          <Col lg={5} className="offset-lg-1 text-center">
            <Carousel variant="dark" className="slide">
              <CarouselItem className="active" interval={10000}>
                <Image src={cardImg5} width={506} height={337} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem interval={2000}>
                <Image src={cardImg4} width={506} height={337} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <Image src={cardImg6} width={506} height={337} className="d-block w-100" alt="..." />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </CarouselItem>
            </Carousel>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}
const Carousels = () => {
  return (
    <>
    <PageTitle title='Carousels' subName='UI Ki' />
      <Row>
        <Col xs="12">
          <BasicCarousel />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <CarouselWithIndicator />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <CarouselWithCaption />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <CarouselWithCrossFadeEffect />
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <DarkVariantCarousel />
        </Col>
      </Row>
    </>
  )
}

export default Carousels
