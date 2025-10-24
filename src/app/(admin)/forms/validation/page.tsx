import type { Metadata } from 'next'
import AllFormValidations from './components/AllFormValidations'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Validation' }

const Validation = () => {
  return (
    <>
    <PageTitle title='Validation' subName='Forms' />
      <AllFormValidations />
    </>
  )
}

export default Validation
