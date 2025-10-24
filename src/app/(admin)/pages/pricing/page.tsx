import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { getAllPricingPlans } from '@/helpers/data'
import clsx from 'clsx'
import type { Metadata } from 'next'
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap'

export const metadata: Metadata = { title: 'Pricing' }

const PricingPlans = async () => {
  const allPricingPlans = await getAllPricingPlans()
  return (
    <>
      <PageTitle title='Pricing' subName='Pages' />
      <Row className="justify-content-center">
        {allPricingPlans.map((plan, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card>
              <CardBody>
                <div className="text-center">
                  {plan.isPopular && <span className="badge bg-pink-subtle text-pink mt-0 py-1 px-2 mx-auto">Popular</span>}
                  <h6 className="pt-3 pb-2 m-0 fs-18 fw-medium">{plan.name}</h6>
                  <p className="text-muted pt-2 mb-0">{plan.description}</p>
                  <div className="pt-3">
                    <h2 className="d-inline-block ">
                      {currency}
                      {plan.price.toFixed(2)}
                    </h2>
                    <small className="font-12 text-muted">/month</small>
                  </div>
                  <hr className="hr-dashed" />
                  <ul className="list-unstyled pricing-content text-start pt-3 border-0 mb-0">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.isPopular ? 'primary' : 'dark'} className="py-2 px-5 mt-3 w-100">
                    <span>Get Started</span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center">
        {allPricingPlans.map((plan, idx) => (
          <>
            <Col md={6} lg={3} key={idx}>
              <Card>
                <CardBody className='p-4 bg-soft-blue text-center rounded-top'>
                  <i className={clsx('d-inline-block mt-2 display-4 mb-4', plan.icon, plan.iconVariant)} />
                </CardBody>
                <CardBody className="mt-n5">
                  <div className="text-center">
                    <div className="py-2 px-3 shadow-sm d-inline-block rounded-pill card-bg">
                      <h1 className="d-inline-block fw-bold mb-0">
                        {currency}
                        {plan.price.toFixed(2)}
                      </h1>
                      <small className="font-12 text-muted">/month</small>
                    </div>
                    <h6 className="pt-3 pb-2 m-0 fs-18 fw-medium">{plan.name}</h6>
                    <ul className="list-unstyled pricing-content text-center pt-2 border-0 mb-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <hr className="hr-dashed" />
                    <Button variant="dark" className="py-2 px-3 mt-2">
                      <span>Get Started</span>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
           
          </>
        ))}
      </Row>
    </>
  )
}

export default PricingPlans
