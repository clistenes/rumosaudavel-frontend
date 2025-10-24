import type { Metadata } from 'next'
import AllApexCharts from './components/AllApexCharts'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Apex Charts' }

const ApexCharts = () => {
  return (
    <>
    <PageTitle title='Apex' subName='Charts' />
      <AllApexCharts />
    </>
  )
}

export default ApexCharts
