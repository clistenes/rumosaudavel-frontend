import type { Metadata } from 'next'
import AllDataTables from './components/AllDataTables'
import { getAllCustomers } from '@/helpers/data'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = { title: 'Data Tables' }

const DataTables = async () => {
  const customers = await getAllCustomers()
  return (
    <>
    <PageTitle title='Datatable' subName='Tables'/>
      <AllDataTables customers={customers} />
    </>
  )
}

export default DataTables
