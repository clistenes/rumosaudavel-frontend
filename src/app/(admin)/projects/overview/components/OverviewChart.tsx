'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const OverviewChart = () => {
  const overviewChartOpts: ApexOptions = {
    chart: {
      height: 210,
      type: 'area',
      stacked: true,
      toolbar: {
        show: false,
        autoSelected: 'zoom'
      },
  },
  colors: ['#2a77f4'],
  dataLabels: {
      enabled: false
  },
  stroke: {
      curve: 'smooth',
      width: [2, 2],
      dashArray: [0, 4],
      lineCap: 'round'
  },
  grid: {
    borderColor: "#45404a2e",
    padding: {
      left: 0,
      right: 0
    },
    strokeDashArray: 3,
  },
  markers: {
    size: 0,
    hover: {
      size: 0
    }
  },
  series: [{
      name: 'Unique Visits',
      data: [10,10,50,20,70,20,80,30,75,40,60,60]
  }],

  xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: true,
        color: '#45404a2e',
      },  
      axisTicks: {
        show: true,
        color: '#45404a2e',
      },                  
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  
  tooltip: {
      x: {
          format: 'dd/MM/yy HH:mm'
      },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right'
  },
  }
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Overview</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle as={'a'} href="#" className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className="fa-solid fa-ellipsis text-muted" />
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
        <div className="text-center">
          <div id="overview" className="apex-charts" />
          <ReactApexChart height={210} series={overviewChartOpts.series} options={overviewChartOpts} type="area" />
          <h6 className="text-primary bg-soft-primary rounded p-3 mb-0">
            <i data-feather="calendar" className="align-self-center icon-xs me-1" />
            01 January 2024 to 01 January 2025
          </h6>
        </div>
      </CardBody>
    </Card>
  )
}

export default OverviewChart