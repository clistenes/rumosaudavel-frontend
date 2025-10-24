'use client'
import Image from 'next/image'
import React from 'react'
import moneyBeg from '@/assets/images/extra/money-beg.png'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const TotalRevenue = () => {
  const revenueChartOpts: ApexOptions = {
    chart: {
      type: 'area',
      height: 50,
      sparkline: {
        enabled: true
      },
    },
    stroke: {
      curve: 'smooth',
      width: 1.5
    },
    fill: {
      opacity: 1,
      gradient: {
        shade: '#e3ebf6',
        type: "horizontal",
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0.5,
        stops: [0, 80, 100],
        colorStops: []
      },
    },
    series: [{
      data: [4, 8, 5, 10, 4, 16, 5, 11, 6, 11, 30, 10, 13, 4, 6, 3, 6]
    }],
    yaxis: {
      min: 0
    },
    colors: ['#6f6af8'],
  }
  return (
    <Card className="overflow-hidden">
      <CardBody>
        <Row>
          <Col>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <Image src={moneyBeg} height={40} className="me-2 align-self-center rounded" alt="..." />
              </div>
              <div className="flex-grow-1 ms-2 text-truncate">
                <h6 className="m-0 fs-20">$1850.00</h6>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </Col>
          <Col xs={'auto'} className="align-self-center">
            <p className="mb-0"><span className="text-success"><i className="mdi mdi-trending-up" />4.8%</span> Then Last Month</p>
          </Col>
        </Row>
      </CardBody>
      <Row>
        <Col xs={12}>
          <div className="apexchart-wrapper">
            <ReactApexChart height={50} series={revenueChartOpts.series} className="chart-gutters" options={revenueChartOpts} type="area" />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default TotalRevenue