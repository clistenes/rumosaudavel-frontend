'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const EarningReportsChart = () => {
  const earningChartOpts: ApexOptions = {
    chart: {
      height: 290,
      type: 'donut',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '80%'
        }
      }
    },
    dataLabels: {
      enabled: false,
    },

    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },

    series: [50, 25, 25,],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '13px',
      fontFamily: "Be Vietnam Pro, sans-serif",
      offsetX: 0,
      offsetY: 0,
    },
    labels: ["Currenet", "New", "Retargeted"],
    colors: ["#6f6af8", "#08b0e7", "#f4a14d"],

    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          donut: {
            customScale: 0.2
          }
        },
        chart: {
          height: 240
        },
        legend: {
          show: false
        },
      }
    }],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " %"
        }
      }
    }
  }
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Earning Reports</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                This Week<i className="las la-angle-down ms-1" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Today</DropdownItem>
                <DropdownItem>Last Week</DropdownItem>
                <DropdownItem>Last Mont</DropdownItem>
                <DropdownItem>This Year</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <div className="text-center">
          <div id="sessions_device" className="apex-charts" />
          <ReactApexChart height={248} series={earningChartOpts.series} className="chart-gutters" options={earningChartOpts} type="donut" />
          <h6 className="bg-light py-3 px-2 mb-0 mt-2 rounded">
            <i className="las la-calendar align-self-center me-1" />
            01 January 2020 to 31 December 2020
          </h6>
        </div>
      </CardBody>
    </Card>
  )
}

export default EarningReportsChart