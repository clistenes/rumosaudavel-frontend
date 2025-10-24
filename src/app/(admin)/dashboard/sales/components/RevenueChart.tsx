'use client'
import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const RevenueChart = () => {
   const revenueChartOpts: ApexOptions = {
    chart: {
      height: 345,
      type: 'bar',
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
          horizontal: false,
          columnWidth: '30%',
      },
    },
    colors: ['#6f6af8'],
    dataLabels: {
        enabled: false
    },
    
    
    stroke: {
        show: true,
        width: 2,
    },
    series: [{
        name: 'Income',
        data: [0, 160, 100, 210, 145, 400, 155, 210, 120, 275, 110, 200, 100, 90, 220, 100, 180, 140, 315, 130, 105, 165, 120, 160, 100, 210, 145, 400, 155, 210, 120]
    }],
    labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
     "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", 
     "24", "25", "26", "27", "28", "29", "30", "31",],
    
    yaxis: {
      labels: {      
        offsetX: -12,
        offsetY: 0,      
      }
    },
    grid: {
      borderColor: '#e0e6ed',
      strokeDashArray: 3,
      xaxis: {
          lines: {
              show: false
          }
      },   
      yaxis: {
          lines: {
              show: true,
          }
      },
    }, 
    legend: {
     show: false
    },
    tooltip: {
      marker: {
        show: true,
      },
      x: {
        show: false,
      }
    },
    xaxis: {
        labels: {
            formatter: function (value) {
                return "$" + value ;
            }
        },
    },
    fill: {
      opacity: 1,
    },
   }
  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col>
            <CardTitle as={'h4'}>Revenue Status</CardTitle>
          </Col>
          <Col xs={'auto'}>
            <Dropdown>
              <DropdownToggle className="btn btn-sm btn-outline-light " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                This Month<i className="las la-angle-down ms-1" />
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
        <div>
          <ReactApexChart height={345} series={revenueChartOpts.series} className="apex-charts" options={revenueChartOpts} type="bar" />
        </div>
      </CardBody>
    </Card>
  )
}

export default RevenueChart