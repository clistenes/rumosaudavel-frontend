import type { Metadata } from 'next'
import AllJustGageCharts from './components/AllJustGageCharts'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'JustGage charts' }

const JustGage = () => {
  return (
    <>
      <PageTitle title='Justgage' subName='Charts' />
      <AllJustGageCharts />
    </>
  )
}

export default JustGage
