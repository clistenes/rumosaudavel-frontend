'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Table } from 'react-bootstrap'

const SessionsDeviceCard = () => {
  const sessionsChartOpts: ApexOptions = {
    chart: {
      height: 250,
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
            <CardTitle as={'h4'}>Sessions Device</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
        <div className="text-center">
          <ReactApexChart height={225} series={sessionsChartOpts.series} options={sessionsChartOpts} type="donut" />
          <h6 className="bg-light py-2 px-2 mb-0 rounded mt-3">
            <i data-feather="calendar" className="align-self-center icon-xs me-1" />
            01 January 2020 to 31 December 2020
          </h6>
        </div>
        <div className="table-responsive mt-2">
          <Table className="mb-0">
            <thead>
              <tr>
                <th>Device</th>
                <th className="text-end">Sassions</th>
                <th className="text-end">Day</th>
                <th className="text-end">Week</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dasktops</td>
                <td className="text-end">1843</td>
                <td className="text-end">-3</td>
                <td className="text-end">-12</td>
              </tr>
              <tr>
                <td>Tablets</td>
                <td className="text-end">2543</td>
                <td className="text-end">-5</td>
                <td className="text-end">-2</td>
              </tr>
              <tr>
                <td>Mobiles</td>
                <td className="text-end">3654</td>
                <td className="text-end">-5</td>
                <td className="text-end">-6</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )
}

export default SessionsDeviceCard