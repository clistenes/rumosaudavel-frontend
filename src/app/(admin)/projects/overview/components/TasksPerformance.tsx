'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const TasksPerformance = () => {
  const tasksPerformanceChartOpts: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 260,
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 5,
        color: '#45404a2e',
        opacity: 0.35
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: -10,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '50%',
          background: 'transparent',
        },
        track: {
          show: false,
        },
        dataLabels: {
          name: {
            fontSize: '18px',
          },
          value: {
            fontSize: '16px',
            color: '#50649c',
          },

        }
      },
    },
    colors: ["#2a76f4", "rgba(42, 118, 244, .5)", "rgba(42, 118, 244, .18)"],
    stroke: {
      lineCap: 'round'
    },
    series: [71, 63, 100],
    labels: ['Completed', 'Active', 'Assigned'],
    legend: {
      show: true,
      floating: true,
      position: 'left',
      offsetX: -10,
      offsetY: 0,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: true,
          floating: true,
          position: 'left',
          offsetX: 10,
          offsetY: 0,
        }
      }
    }]
  }

  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Tasks Performance</CardTitle>
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
          <ReactApexChart height={240} series={tasksPerformanceChartOpts.series} options={tasksPerformanceChartOpts} type="radialBar" />
          <h6 className="text-primary bg-soft-primary rounded p-3 mb-0">
            <i data-feather="calendar" className="align-self-center icon-xs me-1" />
            01 January 2024 to 31 June 2025
          </h6>
        </div>
      </CardBody>
    </Card>
  )
}

export default TasksPerformance