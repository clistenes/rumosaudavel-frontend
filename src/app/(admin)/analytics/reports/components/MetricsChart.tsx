'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const MetricsChart = () => {
  const metricsChartOpts: ApexOptions = {
    series: [
      {
        name: "2024",
        data: [ 2.7, 2.2, 1.3, 2.5, 1, 2.5, 1.2, 1.2, 2.7, 1, 3.6, 2.1,],
      },
      {
        name: "2023",
        data: [ -2.3, -1.9, -1, -2.1, -1.3, -2.2, -1.1, -2.3, -2.8, -1.1, -2.5, -1.5,],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      type: "bar",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
      height: 350,
      stacked: true,
      offsetX: -15,
    },
    colors: ["var(--bs-primary)", "var(--bs-secondary)"],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "80%",
        columnWidth: "12%",
        borderRadius: 3,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      padding: {
        top: 0,
        bottom: 0,
        right: 0,
      },
      borderColor: "rgba(0,0,0,0.05)",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -5,
      max: 5,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  }
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Metrics</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle as={'a'}  className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
        <ReactApexChart height={350} series={metricsChartOpts.series} className="apex-charts pill-bar" options={metricsChartOpts} type="bar" />
      </CardBody>
    </Card>
  )
}

export default MetricsChart