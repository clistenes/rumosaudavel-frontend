import type { Metadata } from 'next'
import AllClipboards from './components/AllClipboards'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Clipboard' }

const Clipboard = () => {
  return (
    <>
      <PageTitle title='Clipboard' subName='Advanced UI' />
      <AllClipboards />
    </>
  )
}

export default Clipboard
