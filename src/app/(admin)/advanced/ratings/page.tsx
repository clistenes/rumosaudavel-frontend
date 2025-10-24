import type { Metadata } from 'next'
import AllRatings from './components/AllRatings'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Ratings' }

const Ratings = () => {
  return (
    <>
      <PageTitle title='Ratings' subName='Advanced UI' />
      <AllRatings />
    </>
  )
}

export default Ratings
