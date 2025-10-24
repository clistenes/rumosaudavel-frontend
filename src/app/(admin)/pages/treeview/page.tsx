import type { Metadata } from 'next'
import AllTreeView from './components/AllTreeView'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Treeview' }

const TreeView = () => {
  return (
    <>
      <PageTitle title='Treeview' subName='Pages' />
      <AllTreeView />
    </>
  )
}

export default TreeView
