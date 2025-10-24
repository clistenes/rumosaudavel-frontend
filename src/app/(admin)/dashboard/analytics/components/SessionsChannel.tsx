'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

const SessionsChannel = () => {
  const sessionsChannelChartOpts: ApexOptions = {
    chart: {
      height: 315,
      type: 'area',
      width: '100%',
      stacked: true,
      toolbar: {
        show: false,
        autoSelected: 'zoom'
      },
    },
    colors: ['#2a77f4', 'rgba(42, 118, 244, .4)'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: [0, 0],
      dashArray: [0, 4],
      lineCap: 'round',
    },
    grid: {
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
      name: 'New Visits',
      data: [0, 40, 90, 40, 50, 30, 35, 20, 10, 0, 0, 0]
    }, {
      name: 'Unique Visits',
      data: [20, 80, 120, 60, 70, 50, 55, 40, 50, 30, 35, 0]
    }],

    xaxis: {
      type: 'category',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [100]
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
            <CardTitle as={'h4'}>Sessions By Channel</CardTitle>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <ReactApexChart height={315} series={sessionsChannelChartOpts.series} options={sessionsChannelChartOpts} type="area" />
      </CardBody>
    </Card>
  )
}

export default SessionsChannel