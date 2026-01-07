import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import React from 'react'
import { Row, Table } from 'react-bootstrap'
import { empresasData } from './data'
import Image from 'next/image'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export const metadata = { title: 'Todas as Empresas' }
const TodasEmpresas = () => {
  return (
        <>
        <PageTitle title='Todas as Empresas' subName='Empresas'  />
        <Row>
          <ComponentContainerCard title="Empresas Cadastradas">
      <div className="table-responsive">
        <Table className="mb-0 table-centered">
          <thead className="">
            <tr className='text-center'>
              <th>Nome</th>
              <th>Termo Consentimento</th>
              <th>Analíticos</th>
              <th>Gráficos</th>
              <th>Cadastrados</th>
              <th>Respondentes</th>
              <th>Questionários Finalizados</th>
              <th>Link</th>
              <th></th>
   
            </tr>
          </thead>
          <tbody>
            {empresasData.map((item, idx) => (
              <tr key={idx} className="text-center" style={{ borderLeft: `4px solid var(--bs-${item.color})` }}>
                {/* bg-${item.color} bg-opacity-10*/}
                <td className="d-flex flex-column align-items-center justify-content-center">
                  {item.nome}
                  <Image src={item.logo} alt={item.nome}  height={40} className="me-2" />
                </td>
                <td>{item.termo}</td>
                <td>
                  <IconifyIcon icon="iconoir:page" className="fs-18 m-1 align-text-bottom text-primary" />
                </td>
                <td>
                  <IconifyIcon icon="iconoir:stats-up-square" className="fs-18 m-1 align-text-bottom text-primary" />
                </td>
                <td>{item.cadastrados}</td>
                <td>{item.respondentes}</td>
                <td>{item.questionarios_finalizados}</td>
                <td>
                  <IconifyIcon icon="iconoir:link" className="fs-18 m-1 align-text-bottom text-primary rounded" />
                </td>
                <td>
                  <IconifyIcon icon="iconoir:edit-pencil" className="fs-18 m-1 align-text-bottom text-primary" />

                </td>
             
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </ComponentContainerCard>
        </Row>
        </>
  )
}

export default TodasEmpresas