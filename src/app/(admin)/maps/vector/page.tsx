import type { Metadata } from 'next'
import AllVectorMaps from './components/AllVectorMaps'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Vector Maps' }

const VectorMaps = () => {
  return (
    <>
      <PageTitle title='Vector' subName='Maps' />
      <AllVectorMaps />
    </>
  )
}

export default VectorMaps
