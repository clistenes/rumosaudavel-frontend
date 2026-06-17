'use client'
import type { ApexOptions } from 'apexcharts'
import React from 'react'
import dynamic from 'next/dynamic'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const CustomersGrowth = () => {
   const growthChartOpts: ApexOptions = {
    series: [
      {
        name: 'New Customers ',
        data: [0, 20, 15, 19, 14, 25, 30],
      },
      {
        name: 'Returning Customers',
        data: [0, 8, 7, 13, 26, 16, 25],
      },
    ],
    chart: {
      fontFamily: "inherit",
      height: 155,
      type: "line",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
    grid: {
      show: true,
      strokeDashArray: 3,
    },
    stroke: {
      curve: "smooth",
      colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
      width: 2,
    },
    markers: {
      colors: ["var(--bs-primary)", "var(--bs-primary-bg-subtle)"],
      strokeColors: "transparent",
    },
    tooltip: {
      x: {
        show: false,
      },
      followCursor: true,
    },
   }
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Customers Growth</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                This Year<i className="las la-angle-down ms-1" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Today</DropdownItem>
                <DropdownItem>Last Week</DropdownItem>
                <DropdownItem>Last Month</DropdownItem>
                <DropdownItem>This Year</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <ReactApexChart height={155} series={growthChartOpts.series} className="apex-charts mb-3"  options={growthChartOpts} type="line" />
      </CardBody>
    </Card>
  )
}

export default CustomersGrowth
