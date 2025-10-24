'use client'
import React from 'react'
import { audioDocsData, docsData, imgDocsData } from '../data'
import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Row, TabContainer, TabContent, Table, TabPane } from 'react-bootstrap'

const AllDocs = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={12}>
        <TabContainer defaultActiveKey={'documents'}>
          <div className="clearfix">
            <Dropdown>
              <div className="btn-group float-end ms-2">
                <button type="button" className="btn btn-secondary me-0 overflow-hidden">
                  Upload File
                  <input type="file" name="file" className="overflow-hidden position-absolute top-0 start-0 opacity-0" />
                </button>
                <DropdownToggle as={'button'} type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="las la-angle-down" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem><i className="las la-file-upload fs-16 me-1 align-text-bottom" /> Upload File</DropdownItem>
                  <DropdownItem><i className="las la-cloud-upload-alt fs-16 me-1 align-text-bottom" />Upload Folder</DropdownItem>
                </DropdownMenu>
              </div>
            </Dropdown>
            <Nav className="nav-tabs my-4" role="tablist">
              <NavItem>
                <NavLink eventKey={'documents'} className="fw-semibold active py-2" data-bs-toggle="tab" href="#documents" role="tab" aria-selected="true"><i className="fa-regular fa-folder-open me-1" /> Documents <span className="badge rounded text-blue bg-blue-subtle ms-1">32</span></NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'images'} className="fw-semibold py-2" data-bs-toggle="tab" href="#images" role="tab" aria-selected="false"><i className="fa-regular fa-image me-1" /> Images <span className="badge rounded text-blue bg-blue-subtle ms-1">85</span></NavLink>
              </NavItem>
              <NavItem>
                <NavLink eventKey={'audio'} className="fw-semibold py-2" data-bs-toggle="tab" href="#audio" role="tab" aria-selected="false"><i className="fa-solid fa-headphones me-1" /> Audio <span className="badge rounded text-blue bg-blue-subtle ms-1">21</span></NavLink>
              </NavItem>
            </Nav>
          </div>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <CardTitle as={'h4'}>Files</CardTitle>
                </Col>
                <Col xs={'auto'}>
                  <Dropdown>
                    <a href="#" className="text-body text-decoration-underline">
                      View All
                    </a>
                  </Dropdown>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <TabContent>
                <TabPane  eventKey="documents" role="tabpanel">
                  <div className="table-responsive browser_users">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-top-0">Name</th>
                          <th className="border-top-0 text-end">Last Modified</th>
                          <th className="border-top-0 text-end">Size</th>
                          <th className="border-top-0 text-end">Members</th>
                          <th className="border-top-0 text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          docsData.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="d-inline-flex justify-content-center align-items-center thumb-md bg-blue-subtle rounded mx-auto me-1">
                                  <i className="fa-solid fa-file-pdf fs-18 align-self-center mb-0 text-blue" />
                                </div>
                                <a href="#" className="text-body">{item.name}</a>
                              </td>
                              <td className="text-end">{item.date}</td>
                              <td className="text-end"> {item.size}</td>
                              <td className="text-end">
                                {
                                  item.shared_with ?
                                    <div className="img-group d-flex justify-content-end">
                                      {
                                        item.shared_with.map((img) => (

                                          <a className="user-avatar position-relative d-inline-block" href="#">
                                            <Image src={img} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                                          </a>
                                        ))
                                      }
                                    </div>
                                    :
                                    <>-</>
                                }
                              </td>
                              <td className="text-end">
                                <a href="#"><i className="las la-download text-secondary fs-18" /></a>&nbsp;
                                <a href="#"><i className="las la-pen text-secondary fs-18" /></a>&nbsp;
                                <a href="#"><i className="las la-trash-alt text-secondary fs-18" /></a>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  </div>
                </TabPane>
                <TabPane eventKey="images" role="tabpanel">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-top-0">Name</th>
                          <th className="border-top-0 text-end">Last Modified</th>
                          <th className="border-top-0 text-end">Size</th>
                          <th className="border-top-0 text-end">Members</th>
                          <th className="border-top-0 text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          imgDocsData.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="d-inline-flex justify-content-center align-items-center thumb-md bg-danger-subtle rounded mx-auto me-1">
                                  <i className="fa-solid fa-image fs-18 align-self-center mb-0 text-danger" />
                                </div>
                                <a href="#" className="text-body">{item.fileName}</a>
                              </td>
                              <td className="text-end">{item.date}</td>
                              <td className="text-end"> {item.size}</td>
                              <td className="text-end">
                                <div className="img-group d-flex justify-content-end">
                                  {
                                    item.sharedWith?.map((img) => (
                                      <a className="user-avatar position-relative d-inline-block" href="#">
                                        <Image src={img} alt="avatar" className="thumb-md shadow-sm rounded-circle" />
                                      </a>
                                    ))
                                  }
                                </div>
                              </td>
                              <td className="text-end">
                                <a href="#"><i className="las la-download text-secondary fs-18" /></a>
                                <a href="#"><i className="las la-pen text-secondary fs-18" /></a>
                                <a href="#"><i className="las la-trash-alt text-secondary fs-18" /></a>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  </div>
                </TabPane>
                <TabPane eventKey="audio" role="tabpanel">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-top-0">Name</th>
                          <th className="border-top-0 text-end">Last Modified</th>
                          <th className="border-top-0 text-end">Size</th>
                          <th className="border-top-0 text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          audioDocsData.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="d-inline-flex justify-content-center align-items-center thumb-md bg-secondary-subtle rounded mx-auto me-1">
                                  <i className="fa-solid fa-microphone fs-18 align-self-center mb-0 text-secondary" />
                                </div>
                                <a href="#" className="text-body">{item.fileName}</a>
                              </td>
                              <td className="text-end">{item.date}</td>
                              <td className="text-end"> {item.size}</td>
                              <td className="text-end">
                                <a href="#"><i className="las la-download text-secondary fs-18" /></a>
                                <a href="#"><i className="las la-pen text-secondary fs-18" /></a>
                                <a href="#"><i className="las la-trash-alt text-secondary fs-18" /></a>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </Table>
                  </div>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </TabContainer>
      </Col>
    </Row>
  )
}

export default AllDocs