'use client'
import React from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
import { activityData } from '../data'
import Link from 'next/link'
import Image from 'next/image'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'

const ActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Activity</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                All<i className="las la-angle-down ms-1" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Purchases</DropdownItem>
                <DropdownItem>Emails</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <SimplebarReactClient className="analytic-dash-activity" data-simplebar style={{ height: 320 }}>
          <div className="activity">
            {
              activityData.map((item, idx) => (
                <div className="activity-info" key={idx}>
                  <div className="icon-info-activity">
                    {
                      item.icon &&
                      <i className={`${item.icon}  bg-primary-subtle text-primary`} />
                    }
                    {
                      item?.avatar &&
                      <Image src={item?.avatar} width={36} height={36} alt='avatar' className="rounded-circle thumb-md" />
                    }
                  </div>
                  <div className="activity-info-text">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text-muted mb-0 fs-13 w-75"><span>{item.user}</span>
                        {item.activity}
                      </p>
                      <small className="text-muted">{item.time}</small>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </SimplebarReactClient>
      </CardBody>
    </Card>
  )
}

export default ActivityCard