import type { Metadata } from 'next'
import AllToastCharts from './components/AllToastCharts'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Toast Charts' }

const ToastChart = () => {
  return (
    <>
    <PageTitle title='ToastUI' subName='Charts' />
      <AllToastCharts />
    </>
  )
}

export default ToastChart
