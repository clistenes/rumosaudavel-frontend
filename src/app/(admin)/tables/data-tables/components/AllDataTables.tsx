'use client'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import ReactTable from '@/components/Table'
import type { CustomerType } from '@/types/data'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { Col, FormCheck, Row } from 'react-bootstrap'

const columns: ColumnDef<CustomerType>[] = [
  {
    id: 'select',
    header: () => <FormCheck id="customer-checkbox" />,
    cell: ({
      row: {
        original: { id },
      },
    }) => (
      <div style={{ width: 16 }}>
        <FormCheck id={`checkbox-${id}`} />
      </div>
    ),
  },
  {
    header: 'name',
    accessorKey: 'name',
  },
  {
    header: 'Ext.',
    accessorKey: 'spend',
  },
  {
    header: 'City',
    accessorKey: 'city',
  },
  {
    header: 'Date',
    cell: ({
      row: {
        original: { startDate },
      },
    }) => <>{new Date(startDate).toLocaleDateString()}</>,
  },
  {
    header: 'Completion',
    accessorKey: 'completion',
  },
]

const CustomerDetailTable = ({ customers }: { customers: CustomerType[] }) => {
  const pageSizeList = [2, 5, 10, 20, 50]

  return (
    <ComponentContainerCard title="Customers Details">
      <ReactTable<CustomerType>
        columns={columns}
        data={customers}
        rowsPerPageList={pageSizeList}
        pageSize={10}
        tableClass="datatable"
        theadClass="table-light"
        showPagination
      />
    </ComponentContainerCard>
  )
}

const ExportTable = ({ customers }: { customers: CustomerType[] }) => {
  const pageSizeList = [2, 5, 10, 20, 50]

  return (
    <ComponentContainerCard title="Export Table">
      <ReactTable<CustomerType>
        columns={columns}
        data={customers}
        rowsPerPageList={pageSizeList}
        pageSize={10}
        tableClass="datatable"
        theadClass="table-light"
        showPagination
      />
    </ComponentContainerCard>
  )
}

const AllDataTables = ({ customers }: { customers: CustomerType[] }) => {
  return (
    <>
      <Row className="justify-content-center">
        <Col xs={12}>
          <CustomerDetailTable customers={customers} />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12}>
          <ExportTable customers={customers} />
        </Col>
      </Row>
    </>
  )
}

export default AllDataTables
