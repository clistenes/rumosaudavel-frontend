'use client'

import { useMemo, useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaAtual, getEmpresaParticipantes, getSetoresResumo } from '@/utils/demo-reports'
import { Badge, Button, Col, Row, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { exportCsv } from '@/utils/demo-export'

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)))

const getCorCelula = (valor: number) => {
  if (valor <= 30) return '#28a745'
  if (valor <= 60) return '#ffc107'
  if (valor <= 80) return '#fd7e14'
  return '#dc3545'
}

export default function RelatorioSemaforoHeatmap() {
  const searchParams = useSearchParams()
  const empresaId = Number(searchParams.get('empresa') || 0)
  const { empresas, participantes } = useDemo()
  const [visualizacao, setVisualizacao] = useState<'semaforo' | 'heatmap'>('semaforo')

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatorio Semaforo e Heatmap' subName='Relatorios' />
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

  const empresa = getEmpresaAtual(empresas as any, empresaId)
  const participantesEmpresa = getEmpresaParticipantes(participantes as any, empresaId)
  const setores = getSetoresResumo(participantesEmpresa as any)

  const dadosSemaforo = setores.map((setor) => ({
    dimensao: setor.setor,
    baixoRisco: setor.baixo,
    medioRisco: setor.medio,
    altoRisco: setor.alto,
    total: setor.total,
  }))

  const fatoresHeatmap = useMemo(() => {
    const colunas = setores.map((setor) => ({
      key: setor.setor,
      phq: setor.mediaPhq9,
      gad: setor.mediaGad7,
    }))

    const calcPorSetor = (formula: (phq: number, gad: number) => number) => {
      const valores: Record<string, number> = {}
      colunas.forEach((coluna) => {
        valores[coluna.key] = clamp(formula(coluna.phq, coluna.gad))
      })
      return valores
    }

    return [
      { nome: 'Exigencias do trabalho', valores: calcPorSetor((phq, gad) => phq * 6 + gad * 4) },
      { nome: 'Controle do trabalho', valores: calcPorSetor((phq, gad) => 100 - (phq * 4 + gad * 3)) },
      { nome: 'Apoio social', valores: calcPorSetor((phq, gad) => 100 - (phq * 3 + gad * 2)) },
      { nome: 'Recompensas', valores: calcPorSetor((phq, gad) => 100 - (phq * 5 + gad * 2)) },
      { nome: 'Injustica', valores: calcPorSetor((phq, gad) => phq * 4 + gad * 4) },
      { nome: 'Valores', valores: calcPorSetor((phq, gad) => 100 - (phq * 2 + gad * 3)) },
    ]
  }, [setores])

  return (
    <>
      <PageTitle title='Relatorio Semaforo e Heatmap' subName='Relatorios' />

      <Row className='mb-4'>
        <Col className='d-flex justify-content-between align-items-center'>
          <div>
            <div className='fw-bold'>{empresa?.nomeCurto || empresa?.nome}</div>
            <small className='text-muted'>Analise por setores da empresa</small>
          </div>
          <div className='btn-group'>
            <Button
              variant={visualizacao === 'semaforo' ? 'primary' : 'outline-primary'}
              onClick={() => setVisualizacao('semaforo')}
            >
              <IconifyIcon icon='iconoir:traffic-lights' className='me-2' />
              Semaforo
            </Button>
            <Button
              variant={visualizacao === 'heatmap' ? 'primary' : 'outline-primary'}
              onClick={() => setVisualizacao('heatmap')}
            >
              <IconifyIcon icon='iconoir:grid-table' className='me-2' />
              Heatmap
            </Button>
          </div>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col className='d-flex justify-content-end'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => {
              if (visualizacao === 'semaforo') {
                exportCsv('relatorio-semaforo.csv', dadosSemaforo.map((item) => ({
                  setor: item.dimensao,
                  baixo: item.baixoRisco,
                  medio: item.medioRisco,
                  alto: item.altoRisco,
                  total: item.total,
                })))
                return
              }

              exportCsv('relatorio-heatmap.csv', fatoresHeatmap.map((linha) => {
                const row: Record<string, string | number> = { fator: linha.nome }
                setores.forEach((setor) => {
                  row[setor.setor] = linha.valores[setor.setor] || 0
                })
                return row
              }))
            }}
            disabled={!setores.length}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col>
          <div className='d-flex gap-4 justify-content-center'>
            <div className='d-flex align-items-center'><div style={{ width: 18, height: 18, backgroundColor: '#28a745', borderRadius: 4, marginRight: 8 }} />Baixo</div>
            <div className='d-flex align-items-center'><div style={{ width: 18, height: 18, backgroundColor: '#ffc107', borderRadius: 4, marginRight: 8 }} />Medio</div>
            <div className='d-flex align-items-center'><div style={{ width: 18, height: 18, backgroundColor: '#fd7e14', borderRadius: 4, marginRight: 8 }} />Alto</div>
            <div className='d-flex align-items-center'><div style={{ width: 18, height: 18, backgroundColor: '#dc3545', borderRadius: 4, marginRight: 8 }} />Critico</div>
          </div>
        </Col>
      </Row>

      {visualizacao === 'semaforo' ? (
        <Row>
          <Col>
            <ComponentContainerCard title='Distribuicao de risco por setor'>
              <div className='table-responsive'>
                <Table className='mb-0'>
                  <thead className='table-light'>
                    <tr>
                      <th>Setor</th>
                      <th className='text-center'><Badge bg='success'>Baixo</Badge></th>
                      <th className='text-center'><Badge bg='warning' text='dark'>Medio</Badge></th>
                      <th className='text-center'><Badge bg='danger'>Alto</Badge></th>
                      <th className='text-center'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosSemaforo.map((item) => (
                      <tr key={item.dimensao}>
                        <td className='fw-bold'>{item.dimensao}</td>
                        <td className='text-center'>{item.baixoRisco}</td>
                        <td className='text-center'>{item.medioRisco}</td>
                        <td className='text-center'>{item.altoRisco}</td>
                        <td className='text-center fw-bold'>{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {!dadosSemaforo.length && (
                  <div className='text-center text-muted py-4'>
                    Nenhum dado de setor disponivel para semaforo.
                  </div>
                )}
              </div>
            </ComponentContainerCard>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <ComponentContainerCard title='Exposicao a risco por fator e setor'>
              <div className='table-responsive'>
                <Table className='mb-0 text-center'>
                  <thead className='table-light'>
                    <tr>
                      <th className='text-start'>Fator</th>
                      {setores.map((setor) => (
                        <th key={setor.setor}>{setor.setor}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fatoresHeatmap.map((linha) => (
                      <tr key={linha.nome}>
                        <td className='text-start fw-bold'>{linha.nome}</td>
                        {setores.map((setor) => {
                          const valor = linha.valores[setor.setor] || 0
                          return (
                            <td key={setor.setor}>
                              <div
                                style={{
                                  backgroundColor: getCorCelula(valor),
                                  color: valor <= 60 ? '#000' : '#fff',
                                  padding: '10px 12px',
                                  borderRadius: 8,
                                  fontWeight: 700,
                                }}
                              >
                                {valor}%
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {!setores.length && (
                  <div className='text-center text-muted py-4'>
                    Nenhum dado de setor disponivel para heatmap.
                  </div>
                )}
              </div>
            </ComponentContainerCard>
          </Col>
        </Row>
      )}
    </>
  )
}
