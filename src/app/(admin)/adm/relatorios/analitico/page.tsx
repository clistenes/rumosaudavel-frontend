'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDemo } from '@/context/DemoContext'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Table, Form, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { exportCsv } from '@/utils/demo-export'

const normalizeProgramaEmpresas = (programa: any): number[] => {
  if (Array.isArray(programa?.empresasVinculadas) && programa.empresasVinculadas.length > 0) {
    return programa.empresasVinculadas.map((item: any) => Number(item.empresaId)).filter((id: number) => id > 0)
  }

  if (Array.isArray(programa?.empresasParticipantes) && programa.empresasParticipantes.length > 0) {
    return programa.empresasParticipantes.map((id: any) => Number(id)).filter((id: number) => id > 0)
  }

  return []
}

export default function DashboardAnalitico() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaIdParam = Number(searchParams.get('empresa') || 0)
  const { empresas, participantes, programas } = useDemo()

  const [filtroEmpresa, setFiltroEmpresa] = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')

  useEffect(() => {
    if (empresaIdParam > 0) {
      setFiltroEmpresa(String(empresaIdParam))
    }
  }, [empresaIdParam])

  if (!empresaIdParam) {
    return (
      <>
        <PageTitle title='Dashboard Analitico' subName='Relatorios' />
        <div className='alert alert-warning'>
          Esta tela deve ser acessada pela lista de empresas.
          <div className='mt-2'>
            <Link href='/adm/lista-empresas'>
              <Button variant='primary' size='sm'>Voltar para Lista de Empresas</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const empresasPermitidasPrograma = useMemo(() => {
    if (!filtroPrograma) return null
    const programa = (programas as any[]).find((item) => Number(item.id) === Number(filtroPrograma))
    if (!programa) return null
    return normalizeProgramaEmpresas(programa)
  }, [filtroPrograma, programas])

  const dadosFiltrados = useMemo(() => {
    let base = [...(participantes as any[])]

    if (filtroEmpresa) {
      base = base.filter((item) => Number(item.empresaId) === Number(filtroEmpresa))
    }

    if (empresasPermitidasPrograma && empresasPermitidasPrograma.length > 0) {
      base = base.filter((item) => empresasPermitidasPrograma.includes(Number(item.empresaId)))
    }

    return base
  }, [participantes, filtroEmpresa, empresasPermitidasPrograma])

  const estatisticas = useMemo(() => {
    const total = dadosFiltrados.length
    const ativos = dadosFiltrados.filter((item) => item.status === 'ativo').length
    const riscoAlto = dadosFiltrados.filter((item) => item.riscoSaude === 'alto').length
    const riscoMedio = dadosFiltrados.filter((item) => item.riscoSaude === 'medio').length
    const riscoBaixo = dadosFiltrados.filter((item) => item.riscoSaude === 'baixo').length
    const mediaPHQ9 = total > 0 ? dadosFiltrados.reduce((acc, item) => acc + Number(item.phq9Score || 0), 0) / total : 0
    const mediaGAD7 = total > 0 ? dadosFiltrados.reduce((acc, item) => acc + Number(item.gad7Score || 0), 0) / total : 0

    return { total, ativos, riscoAlto, riscoMedio, riscoBaixo, mediaPHQ9, mediaGAD7 }
  }, [dadosFiltrados])

  const participantesRisco = useMemo(() => {
    return dadosFiltrados
      .filter((item) => item.riscoSaude === 'alto' || item.riscoSaude === 'medio')
      .sort((a, b) => Number(b.phq9Score || 0) - Number(a.phq9Score || 0))
      .slice(0, 10)
  }, [dadosFiltrados])

  const getRiscoBadge = (risco: string) => {
    if (risco === 'alto') return { bg: 'danger', text: 'Alto' }
    if (risco === 'medio') return { bg: 'warning', text: 'Medio' }
    return { bg: 'success', text: 'Baixo' }
  }

  const getEmpresaNome = (empresaId: number) => {
    const empresa = (empresas as any[]).find((item) => Number(item.id) === Number(empresaId))
    return empresa?.nomeCurto || empresa?.nome || 'N/A'
  }

  const totalSafe = Math.max(estatisticas.total, 1)

  return (
    <>
      <PageTitle title='Dashboard Analitico' subName='Relatorios' />

      <Row className='mb-4'>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Empresa</Form.Label>
            <Form.Select value={filtroEmpresa} onChange={(event) => setFiltroEmpresa(event.target.value)}>
              <option value=''>Todas as empresas</option>
              {(empresas as any[]).map((empresa) => (
                <option key={empresa.id} value={empresa.id}>{empresa.nomeCurto || empresa.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Programa</Form.Label>
            <Form.Select value={filtroPrograma} onChange={(event) => setFiltroPrograma(event.target.value)}>
              <option value=''>Todos os programas</option>
              {(programas as any[]).map((programa) => (
                <option key={programa.id} value={programa.id}>{programa.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className='d-flex align-items-end'>
          <div className='d-flex w-100 gap-2'>
            <Button
              variant='outline-secondary'
              className='w-50'
              onClick={() => {
                setFiltroEmpresa(String(empresaIdParam))
                setFiltroPrograma('')
              }}
            >
              <IconifyIcon icon='iconoir:refresh' className='me-2' />
              Limpar
            </Button>
            <Button
              variant='primary'
              className='w-50'
              onClick={() => {
                exportCsv('relatorio-analitico-participantes.csv', participantesRisco.map((item) => ({
                  nome: item.nome,
                  empresa: getEmpresaNome(item.empresaId),
                  cargo: item.cargo,
                  phq9: Number(item.phq9Score || 0),
                  gad7: Number(item.gad7Score || 0),
                  risco: item.riscoSaude || 'baixo',
                })))
              }}
              disabled={!participantesRisco.length}
            >
              <IconifyIcon icon='iconoir:download' className='me-2' />
              Exportar
            </Button>
          </div>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={2}><ComponentContainerCard title='Total'><div className='text-center'><h3 className='text-primary mb-1'>{estatisticas.total}</h3><p className='text-muted small mb-0'>Participantes</p></div></ComponentContainerCard></Col>
        <Col md={2}><ComponentContainerCard title='Ativos'><div className='text-center'><h3 className='text-success mb-1'>{estatisticas.ativos}</h3><p className='text-muted small mb-0'>Ativos</p></div></ComponentContainerCard></Col>
        <Col md={2}><ComponentContainerCard title='PHQ-9 Medio'><div className='text-center'><h3 className='mb-1'>{estatisticas.mediaPHQ9.toFixed(1)}</h3><p className='text-muted small mb-0'>Depressao</p></div></ComponentContainerCard></Col>
        <Col md={2}><ComponentContainerCard title='GAD-7 Medio'><div className='text-center'><h3 className='mb-1'>{estatisticas.mediaGAD7.toFixed(1)}</h3><p className='text-muted small mb-0'>Ansiedade</p></div></ComponentContainerCard></Col>
        <Col md={2}><ComponentContainerCard title='Risco Alto'><div className='text-center'><h3 className='text-danger mb-1'>{estatisticas.riscoAlto}</h3><p className='text-muted small mb-0'>Casos</p></div></ComponentContainerCard></Col>
        <Col md={2}><ComponentContainerCard title='Risco Medio'><div className='text-center'><h3 className='text-warning mb-1'>{estatisticas.riscoMedio}</h3><p className='text-muted small mb-0'>Casos</p></div></ComponentContainerCard></Col>
      </Row>

      <Row className='mb-4'>
        <Col md={8}>
          <ComponentContainerCard title='Distribuicao de Risco por Empresa'>
            <div className='table-responsive'>
              <Table className='mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>Empresa</th>
                    <th className='text-center'>Participantes</th>
                    <th className='text-center'>Risco Alto</th>
                    <th className='text-center'>Risco Medio</th>
                    <th className='text-center'>Risco Baixo</th>
                    <th className='text-center'>PHQ-9</th>
                    <th className='text-center'>GAD-7</th>
                  </tr>
                </thead>
                <tbody>
                  {(empresas as any[])
                    .filter((empresa) => (!filtroEmpresa ? true : Number(empresa.id) === Number(filtroEmpresa)))
                    .map((empresa) => {
                      const partsEmpresa = dadosFiltrados.filter((item) => Number(item.empresaId) === Number(empresa.id))
                      const riscoAlto = partsEmpresa.filter((item) => item.riscoSaude === 'alto').length
                      const riscoMedio = partsEmpresa.filter((item) => item.riscoSaude === 'medio').length
                      const riscoBaixo = partsEmpresa.filter((item) => item.riscoSaude === 'baixo').length
                      const mediaPHQ9 = partsEmpresa.length > 0 ? partsEmpresa.reduce((acc, item) => acc + Number(item.phq9Score || 0), 0) / partsEmpresa.length : 0
                      const mediaGAD7 = partsEmpresa.length > 0 ? partsEmpresa.reduce((acc, item) => acc + Number(item.gad7Score || 0), 0) / partsEmpresa.length : 0

                      return (
                        <tr key={empresa.id}>
                          <td>{empresa.nomeCurto || empresa.nome}</td>
                          <td className='text-center'>{partsEmpresa.length}</td>
                          <td className='text-center'><Badge bg='danger'>{riscoAlto}</Badge></td>
                          <td className='text-center'><Badge bg='warning' text='dark'>{riscoMedio}</Badge></td>
                          <td className='text-center'><Badge bg='success'>{riscoBaixo}</Badge></td>
                          <td className='text-center'>{mediaPHQ9.toFixed(1)}</td>
                          <td className='text-center'>{mediaGAD7.toFixed(1)}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
              {!participantesRisco.length && (
                <div className='text-center text-muted py-4'>
                  Nenhum participante em risco com os filtros atuais.
                </div>
              )}
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title='Resumo de Riscos'>
            <div className='mb-3'>
              <div className='d-flex justify-content-between mb-1'><span className='text-danger'>Risco Alto</span><span className='fw-bold'>{estatisticas.riscoAlto} ({((estatisticas.riscoAlto / totalSafe) * 100).toFixed(1)}%)</span></div>
              <div className='progress' style={{ height: 10 }}><div className='progress-bar bg-danger' style={{ width: `${(estatisticas.riscoAlto / totalSafe) * 100}%` }} /></div>
            </div>
            <div className='mb-3'>
              <div className='d-flex justify-content-between mb-1'><span className='text-warning'>Risco Medio</span><span className='fw-bold'>{estatisticas.riscoMedio} ({((estatisticas.riscoMedio / totalSafe) * 100).toFixed(1)}%)</span></div>
              <div className='progress' style={{ height: 10 }}><div className='progress-bar bg-warning' style={{ width: `${(estatisticas.riscoMedio / totalSafe) * 100}%` }} /></div>
            </div>
            <div>
              <div className='d-flex justify-content-between mb-1'><span className='text-success'>Risco Baixo</span><span className='fw-bold'>{estatisticas.riscoBaixo} ({((estatisticas.riscoBaixo / totalSafe) * 100).toFixed(1)}%)</span></div>
              <div className='progress' style={{ height: 10 }}><div className='progress-bar bg-success' style={{ width: `${(estatisticas.riscoBaixo / totalSafe) * 100}%` }} /></div>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row>
        <Col>
          <ComponentContainerCard title='Participantes em Situacao de Risco'>
            <div className='table-responsive'>
              <Table className='mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>Nome</th>
                    <th>Empresa</th>
                    <th>Cargo</th>
                    <th className='text-center'>PHQ-9</th>
                    <th className='text-center'>GAD-7</th>
                    <th className='text-center'>Risco</th>
                    <th className='text-center'>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {participantesRisco.map((item) => {
                    const risco = getRiscoBadge(item.riscoSaude)
                    return (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{getEmpresaNome(item.empresaId)}</td>
                        <td>{item.cargo}</td>
                        <td className='text-center'><Badge bg={item.phq9Score >= 15 ? 'danger' : item.phq9Score >= 10 ? 'warning' : 'success'}>{item.phq9Score}</Badge></td>
                        <td className='text-center'><Badge bg={item.gad7Score >= 15 ? 'danger' : item.gad7Score >= 10 ? 'warning' : 'success'}>{item.gad7Score}</Badge></td>
                        <td className='text-center'><span className={`badge bg-${risco.bg}`}>{risco.text}</span></td>
                        <td className='text-center'>
                          <Button
                            variant='outline-primary'
                            size='sm'
                            className='me-1'
                            onClick={() => router.push(`/adm/relatorios/individual?empresa=${item.empresaId}&participante=${item.id}`)}
                          >
                            <IconifyIcon icon='iconoir:page' />
                          </Button>
                          <Button variant='outline-success' size='sm'>
                            <IconifyIcon icon='iconoir:envelope' />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
