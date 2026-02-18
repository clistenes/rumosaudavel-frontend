'use client'

import { useMemo } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Table, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { useDemo } from '@/context/DemoContext'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

type EmpresaAPI = {
  id: number
  nome: string
  cor?: string
}

const TodasEmpresas = () => {
  const { empresas: empresasDemo } = useDemo()
  const { data: empresasApi, loading: loadingApi } = useEmpresas({ perPage: 100 })

  const empresasReais: EmpresaAPI[] = useMemo(() => {
    const responseData = empresasApi?.data

    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const arrayData = (responseData as any).data
      return Array.isArray(arrayData) ? arrayData : []
    }

    if (Array.isArray(responseData)) {
      return responseData
    }

    return []
  }, [empresasApi])

  const empresas = useMemo(() => {
    if (isDemoMode) return empresasDemo
    return empresasReais
  }, [empresasDemo, empresasReais])

  if (!isDemoMode && loadingApi) {
    return (
      <>
        <PageTitle title='Todas as Empresas' subName='Empresas' />
        <Row>
          <div className='text-center py-5'>
            <Spinner animation='border' variant='primary' />
            <p className='mt-2'>Carregando empresas...</p>
          </div>
        </Row>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Todas as Empresas' subName='Empresas' />
      <Row>
        <ComponentContainerCard title='Empresas Cadastradas'>
          <div className='table-responsive'>
            <Table className='mb-0 table-centered'>
              <thead>
                <tr className='text-center'>
                  <th>Nome</th>
                  <th>Cor</th>
                  <th>Analíticos</th>
                  <th>Gráficos</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((item: any) => {
                  const empresaId = item.id
                  return (
                    <tr key={empresaId} className='text-center' style={{ borderLeft: `4px solid ${item.cor || item.color || '#000'}` }}>
                      <td className='text-start'>{item.nome}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            width: 20,
                            height: 20,
                            backgroundColor: item.cor || item.color || '#ccc',
                            borderRadius: 3,
                          }}
                        />
                      </td>
                      <td>
                        <Link href={`/adm/relatorios/analitico?empresa=${empresaId}`}>
                          <IconifyIcon icon='iconoir:page' className='fs-18 text-primary' />
                        </Link>
                      </td>
                      <td>
                        <Link href={`/adm/relatorios/grafico?empresa=${empresaId}`}>
                          <IconifyIcon icon='iconoir:stats-up-square' className='fs-18 text-primary' />
                        </Link>
                      </td>
                      <td>
                        <Link href={`/adm/editar-empresa/${empresaId}`} className='text-decoration-none'>
                          <IconifyIcon icon='iconoir:edit-pencil' className='fs-18 text-primary' />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </ComponentContainerCard>
      </Row>
    </>
  )
}

export default TodasEmpresas
