import type { Metadata } from 'next'
import AllChartJsCharts from './components/AllChartJsCharts'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'ChartJs Charts' }

const ChartJs = () => {
  return (
    <>
    <PageTitle title='ChartJs' subName='Charts' />
      <AllChartJsCharts />
    </>
  )
}

export default ChartJs
