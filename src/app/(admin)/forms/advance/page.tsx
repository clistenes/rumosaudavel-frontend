import type { Metadata } from 'next'

import AllAdvanceElements from './components/AllAdvanceElements'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Advance' }

const FormAdvance = () => {
  return( 
    <>
    <PageTitle title='Advanced' subName='Forms' />
    <AllAdvanceElements />
    </>
  )
}

export default FormAdvance
