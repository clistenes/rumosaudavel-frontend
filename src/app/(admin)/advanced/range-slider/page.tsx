import type { Metadata } from 'next'
import AllRangeSliders from './components/AllRangeSliders'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Range Slider' }

const RangeSlider = () => {
  return (
  <>
  <PageTitle title='UI-Slider' subName='Advanced UI' />
  <AllRangeSliders />
  </>
  )
}

export default RangeSlider
