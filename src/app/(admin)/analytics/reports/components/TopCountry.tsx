'use client'
import Image from 'next/image'
import React from 'react'
import us_flag from '@/assets/images/flags/us_flag.jpg'
import germany_flag from '@/assets/images/flags/germany_flag.jpg'
import spain_flag from '@/assets/images/flags/spain_flag.jpg'
import { WorldVectorMap } from '@/components/VectorMap'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

const TopCountry = () => {
  const options = {
    map: 'world',
    mapBgColor: '#F7F8F9',
    zoomOnScroll: false,
    zoomButtons: false,
    markers: [
      {
        name: 'Greenland',
        coords: [72, -42],
      },
      {
        name: 'Canada',
        coords: [56.1304, -106.3468],
      },
      {
        name: 'Brazil',
        coords: [-14.235, -51.9253],
      },
      {
        name: 'Egypt',
        coords: [26.8206, 30.8025],
      },
      {
        name: 'Russia',
        coords: [61, 105],
      },
      {
        name: 'China',
        coords: [35.8617, 104.1954],
      },
      {
        name: 'United States',
        coords: [37.0902, -95.7129],
      },
      {
        name: 'Norway',
        coords: [60.472024, 8.468946],
      },
      {
        name: 'Ukraine',
        coords: [48.379433, 31.16558],
      },
    ],
    lines: [
      {
        from: 'Canada',
        to: 'Egypt',
      },
      {
        from: 'Russia',
        to: 'Egypt',
      },
      {
        from: 'Greenland',
        to: 'Egypt',
      },
      {
        from: 'Brazil',
        to: 'Egypt',
      },
      {
        from: 'United States',
        to: 'Egypt',
      },
      {
        from: 'China',
        to: 'Egypt',
      },
      {
        from: 'Norway',
        to: 'Egypt',
      },
      {
        from: 'Ukraine',
        to: 'Egypt',
      },
    ],
    labels: {
      markers: {
        render: (marker: any) => marker.name,
      },
    },
    lineStyle: {
      animation: true,
      strokeDasharray: '6 3 6',
    },
    regionStyle: {
      initial: {
        fill: 'rgba(169,183,197, 0.3)',
        fillOpacity: 1,
      },
    },
    markerStyle: {
      initial: {
        r: 5, 
        fill: '#16cdc7', 
        fillOpacity: 1, 
        stroke: '#FFF', 
        strokeWidth: 1, 
        strokeOpacity: 0.65, 
      },
      hover: {
        stroke: 'black',
        cursor: 'pointer',
        strokeWidth: 2,
      },
      selected: {
        fill: 'blue',
      },
      selectedHover: {
        fill: 'red',
      },
    },
  }
  return (
    <Card>
      <CardHeader>
        <Row className=" align-items-center">
          <Col>
            <CardTitle as={'h4'}>Top Country</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md={4}>
            <div className="d-flex align-items-center py-3">
              <Image src={us_flag} className="thumb-sm align-self-center rounded-circle" alt="..." />
              <div className="flex-grow-1 ms-2">
                <h5 className="m-0">35,365</h5>
                <p className="text-muted mb-0">USA</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center py-3">
              <Image src={germany_flag} className="thumb-sm align-self-center rounded-circle" alt="..." />
              <div className="flex-grow-1 ms-2">
                <h5 className="m-0">24,865</h5>
                <p className="text-muted mb-0">Germany</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center py-3">
              <Image src={spain_flag} className="thumb-sm align-self-center rounded-circle" alt="..." />
              <div className="flex-grow-1 ms-2">
                <h5 className="m-0">18,369</h5>
                <p className="text-muted mb-0">Spain</p>
              </div>
            </div>
          </Col>
        </Row>
        <WorldVectorMap height="300px" width="100%" options={options} />
      </CardBody>
    </Card>
  )
}

export default TopCountry