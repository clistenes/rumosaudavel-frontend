'use client'

import { useState, useMemo } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Table, Spinner } from 'react-bootstrap'
import { empresasData as empresasDataDemo } from './data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useEmpresas } from '@/hooks/api/useEmpresas'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

interface EmpresaAPI {
  id: number
  nome: string
  cor?: string
}

interface EmpresaDemo {
  nome: string
  logo: any
  termo: string
  cadastrados: number
  respondentes: number
  questionarios_finalizados: number
  color: string
}

const TodasEmpresas = () => {
  const { data: empresasApi, loading: loadingApi, error } = useEmpresas({ perPage: 100 })
  const [demoData] = useState<EmpresaDemo[]>(empresasDataDemo)
  
  console.log('🔍 [dados-empresas] empresasApi:', empresasApi)
  
  // O serviço retorna: { success, data: { data: [...], meta: {...} } }
  const empresasReais: EmpresaAPI[] = useMemo(() => {
    // empresasApi.data = { data: [...], meta: {...} }
    const responseData = empresasApi?.data
    
    // Se for objeto com 'data' (formato PaginatedResponse)
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const arrayData = (responseData as any).data
      console.log('🔍 [dados-empresas] arrayData (wrapped):', arrayData)
      return Array.isArray(arrayData) ? arrayData : []
    }
    
    // Se for array direto
    if (Array.isArray(responseData)) {
      console.log('🔍 [dados-empresas] arrayData (direct):', responseData)
      return responseData
    }
    
    return []
  }, [empresasApi])

  const empresas = useMemo(() => {
    console.log('🔍 [dados-empresas] isDemoMode:', isDemoMode, 'empresasReais:', empresasReais)
    if (isDemoMode) {
      return demoData
    }
    return empresasReais
  }, [isDemoMode, demoData, empresasReais])

  if (!isDemoMode && loadingApi) {
    return (
      <>
        <PageTitle title='Todas as Empresas' subName='Empresas' />
        <Row>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Carregando empresas...</p>
          </div>
        </Row>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Todas as Empresas' subName='Empresas' />
      <Row>
        <ComponentContainerCard title="Empresas Cadastradas">
          <div className="table-responsive">
            <Table className="mb-0 table-centered">
              <thead className="">
                <tr className='text-center'>
                  <th>Nome</th>
                  <th>Cor</th>
                  <th>Analíticos</th>
                  <th>Gráficos</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((item: any) => (
                  <tr key={item.id} className="text-center" style={{ borderLeft: `4px solid ${isDemoMode ? `var(--bs-${item.color})` : (item.cor || '#000')}` }}>
                    <td className="text-start">{item.nome}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-block', 
                        width: 20, 
                        height: 20, 
                        backgroundColor: item.cor || item.color || '#ccc',
                        borderRadius: 3 
                      }} />
                    </td>
                    <td>
                      <Link href={`/adm/relatorios/analitico?empresa=${item.id}`}>
                        <IconifyIcon icon="iconoir:page" className="fs-18 text-primary" />
                      </Link>
                    </td>
                    <td>
                      <Link href={`/adm/relatorios/grafico?empresa=${item.id}`}>
                        <IconifyIcon icon="iconoir:stats-up-square" className="fs-18 text-primary" />
                      </Link>
                    </td>
                    <td>
                      <Link href={`/empresas/editar-empresa?id=${item.id}`} className="text-decoration-none">
                        <IconifyIcon icon="iconoir:edit-pencil" className="fs-18 text-primary" />
                      </Link>
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