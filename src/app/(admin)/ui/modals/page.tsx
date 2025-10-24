import type { Metadata } from 'next'
import AllModals from './components/AllModals'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Modals' }

const Modals = () => {
  return (
    <>
      <PageTitle title='Modals' subName='UI Ki' />
      <AllModals />
    </>
  )
}

export default Modals
