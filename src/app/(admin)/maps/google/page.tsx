import type { Metadata } from 'next'
import AllGoogleMaps from './components/AllGoogleMaps'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Google Maps' }

const GoogleMaps = () => {
  return(
    <>
    <PageTitle title='Google' subName='Maps'/>
    <AllGoogleMaps />
    </>
  )
}

export default GoogleMaps
