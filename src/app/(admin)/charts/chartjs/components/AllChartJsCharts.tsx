'use client'
import { Col, Row } from 'react-bootstrap'
import { Bar, Doughnut, Line, Pie, PolarArea, Radar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement, Title, BarElement, RadialLinearScale, Filler } from "chart.js";
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { barData, barOpts, doughnutData, doughnutOpts, lineData, lineOpts, pieData, pieOpts, polarData, polarOpts, radarData, radarOpts } from '../data'

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, Filler, RadialLinearScale, CategoryScale, PointElement, Title,BarElement, LineElement);


const AllChartJsCharts = () => {

  return (
    <>
      <Row className="justify-content-center">
        <Col md={6} lg={8}>
          <ComponentContainerCard title="Line Chart">
            <Line data={lineData} options={lineOpts} width={300} height={300} />
          </ComponentContainerCard>
        </Col>
        <Col md={6} lg={4}>
          <ComponentContainerCard title="Donut Chart">
            <Doughnut options={doughnutOpts} data={doughnutData} id="doughnut" height={300} />
          </ComponentContainerCard>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={8}>
          <ComponentContainerCard title="Bar Chart">
            <Bar options={barOpts} data={barData} id="bar" height={300} />
          </ComponentContainerCard>
        </Col>
        <Col md={6} lg={4}>
          <ComponentContainerCard title="Polar Chart">
            <PolarArea data={polarData} options={polarOpts} id="polarArea" height={300} />
          </ComponentContainerCard>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} lg={6}>
          <ComponentContainerCard title="Pie Chart">
            <Pie data={pieData} options={pieOpts} id="pie" height={300} />
          </ComponentContainerCard>
        </Col>
        {/* <Col md={6} lg={6}>
          <ComponentContainerCard title="Radar Chart">
            <Radar data={radarData} options={radarOpts} id="radar" height={300} />
          </ComponentContainerCard>
        </Col> */}
      </Row>
    </>
  )
}

export default AllChartJsCharts