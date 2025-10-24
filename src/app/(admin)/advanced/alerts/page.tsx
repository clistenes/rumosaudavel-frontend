import type { Metadata } from 'next'
import AllSweetAlerts from './components/AllSweetAlerts'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Sweet Alerts' }

const Alerts = () => {
  return (
    <>
    <PageTitle title='Sweetalerts' subName='Advanced UI' />
    <AllSweetAlerts />    
    </>
)
}

export default Alerts
