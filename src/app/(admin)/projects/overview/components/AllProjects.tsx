import React from 'react'
import { allProjectData } from '../data'
import Image from 'next/image'
import { Card, CardBody, CardHeader, CardTitle, Col, ProgressBar, Row, Table } from 'react-bootstrap'

const AllProjects = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>All Projects</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <a href="#" className="text-primary">View All</a>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="table-responsive">
          <Table className="table-hover mb-0">
            <thead className="thead-light">
              <tr>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {
                allProjectData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.project}</td>
                    <td className="d-flex">
                      <Image src={item.image} alt='avatar' className="thumb-sm rounded me-2" />
                      {item.manager}
                    </td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td><span className={`badge badge-md badge-boxed text-${item.status == 'Pending' ? 'warning' : item.status == 'Complete' ? 'danger' : 'success'} bg-soft-${item.status == 'Pending' ? 'warning' : item.status == 'Complete' ? 'danger' : 'success'}`}>{item.status}</span></td>
                    <td className=''>
                      <div className="d-flex align-items-center">
                        <ProgressBar variant={item.status == 'Pending' ? 'warning' : item.status == 'Complete' ? 'danger' : 'success'} className="w-100" now={item.progress} style={{ height: 3, backgroundColor: 'danger' }} />
                        <small className="ms-2 fs-10">{item.progress}%</small>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default AllProjects