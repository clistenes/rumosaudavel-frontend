import PageTitle from '@/components/PageTitle'
import React from 'react'
import State from './components/State'
import AllDocs from './components/AllDocs'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Files' }

const FilesPage = () => {
  return (
    <>
      <PageTitle title='Files' subName='Advanced UI' />
      <State />
      <AllDocs />
    </>

  )
}

export default FilesPage