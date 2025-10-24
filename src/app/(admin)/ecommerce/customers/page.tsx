import PageTitle from '@/components/PageTitle'
import { getAllCustomers } from '@/helpers/data'
import React from 'react'
import CustomerTable from './components/CustomerTable'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers' }

const CustomersPage = async () => {
  const CustomersData = await getAllCustomers()
  return (
    <>
      <PageTitle title='Customers' subName='Ecommerce' />
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader>
              <Row className=" align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Customers</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <form className="row g-2">
                    <Col xs={'auto'}>
                      <a className="btn bg-primary-subtle text-primary dropdown-toggle d-flex align-items-center arrow-none" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false" data-bs-auto-close="outside">
                        <i className="iconoir-filter-alt me-1" /> Filter
                      </a>
                      <div className="dropdown-menu dropdown-menu-start">
                        <div className="p-2">
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-all" />
                            <label className="form-check-label" htmlFor="filter-all">
                              All
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-one" />
                            <label className="form-check-label" htmlFor="filter-one">
                              New
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-two" />
                            <label className="form-check-label" htmlFor="filter-two">
                              VIP
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-three" />
                            <label className="form-check-label" htmlFor="filter-three">
                              Repeat
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-four" />
                            <label className="form-check-label" htmlFor="filter-four">
                              Referral
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-five" />
                            <label className="form-check-label" htmlFor="filter-five">
                              Inactive
                            </label>
                          </div>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-six" />
                            <label className="form-check-label" htmlFor="filter-six">
                              Loyal
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={'auto'}>
                      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addBoard"><i className="fa-solid fa-plus me-1" /> Add Product</button>
                    </Col>
                  </form>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div className="table-responsive">
                <CustomerTable customers={CustomersData} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CustomersPage