import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { getAllProducts } from '@/helpers/data'
import { getProductStatusIcon, getProductStatusVariant } from '@/utils/variants-icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ProductTable from './components/ProductTable'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

const ProductsPage = async () => {

  const productData = await getAllProducts()

  return (
    <div>
      <PageTitle title='Products' subName='Ecommerce' />
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle>Products</CardTitle>
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
                              Fashion
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-two" />
                            <label className="form-check-label" htmlFor="filter-two">
                              Plants
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-three" />
                            <label className="form-check-label" htmlFor="filter-three">
                              Toys
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-four" />
                            <label className="form-check-label" htmlFor="filter-four">
                              Gadgets
                            </label>
                          </div>
                          <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-five" />
                            <label className="form-check-label" htmlFor="filter-five">
                              Food
                            </label>
                          </div>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" defaultChecked id="filter-six" />
                            <label className="form-check-label" htmlFor="filter-six">
                              Drinks
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
                  <ProductTable products={productData} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>

  )
}

export default ProductsPage