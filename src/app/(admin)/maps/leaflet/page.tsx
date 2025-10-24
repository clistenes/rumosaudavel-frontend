import type { Metadata } from 'next'
import AllLeafletMaps from './components/AllLeafletMaps'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Leaflet Maps' }

import 'leaflet/dist/leaflet.css'

const LeafletMaps = () => {
  return (
    <>
      <PageTitle title='Leaflet' subName='Maps' />
      <AllLeafletMaps />
    </>
  )
}

export default LeafletMaps
