'use client'

import { useMemo } from 'react'
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaAtual, getEmpresaParticipantes, getEmpresaResumo, getSetoresResumo } from '@/utils/demo-reports'
import { exportCsv } from '@/utils/demo-export'

export default function RelatorioGeralPage() {
  const { data: session } = useSession()
  const { empresas, participantes } = useDemo()
  const empresaId = Number(session?.user?.id_empresa || 0)

  const empresa = useMemo(() => getEmpresaAtual(empresas as any, empresaId), [empresas, empresaId])
  const participantesEmpresa = useMemo(() => getEmpresaParticipantes(participantes as any, empresaId), [participantes, empresaId])
  const resumo = useMemo(() => getEmpresaResumo(participantesEmpresa as any), [participantesEmpresa])
  const setores = useMemo(() => getSetoresResumo(participantesEmpresa as any), [participantesEmpresa])

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <h4 className='page-title'>Relatorio Geral</h4>
          <p className='text-muted'>Visao geral dos resultados {empresa ? `- ${empresa.nomeCurto || empresa.nome}` : ''}</p>
        </Col>
        <Col className='text-end'>
          <Button
            size='sm'
            onClick={() => {
              exportCsv('empresa-relatorio-geral.csv', setores.map((setor) => ({
                setor: setor.setor,
                total: setor.total,
                baixo: setor.baixo,
                medio: setor.medio,
                alto: setor.alto,
                phq9_medio: setor.mediaPhq9.toFixed(1),
                gad7_medio: setor.mediaGad7.toFixed(1),
              })))
            }}
            disabled={!setores.length}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={3}>
          <Card><Card.Body className='text-center'><h3 className='mb-0 text-primary'>{resumo.total}</h3><small>Total</small></Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card><Card.Body className='text-center'><h3 className='mb-0 text-success'>{resumo.ativos}</h3><small>Ativos</small></Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card><Card.Body className='text-center'><h3 className='mb-0 text-warning'>{resumo.mediaPhq9.toFixed(1)}</h3><small>PHQ-9 medio</small></Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card><Card.Body className='text-center'><h3 className='mb-0 text-info'>{resumo.mediaGad7.toFixed(1)}</h3><small>GAD-7 medio</small></Card.Body></Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5 className='mb-3'>Distribuicao por setor</h5>
              <div className='table-responsive'>
                <Table className='mb-0'>
                  <thead className='table-light'>
                    <tr>
                      <th>Setor</th>
                      <th className='text-center'>Total</th>
                      <th className='text-center'>Baixo</th>
                      <th className='text-center'>Medio</th>
                      <th className='text-center'>Alto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setores.map((setor) => (
                      <tr key={setor.setor}>
                        <td>{setor.setor}</td>
                        <td className='text-center'>{setor.total}</td>
                        <td className='text-center'><Badge bg='success'>{setor.baixo}</Badge></td>
                        <td className='text-center'><Badge bg='warning' text='dark'>{setor.medio}</Badge></td>
                        <td className='text-center'><Badge bg='danger'>{setor.alto}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {!setores.length && (
                  <div className='text-center text-muted py-4'>
                    Nenhum dado disponivel para esta empresa.
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5 className='mb-3'>Risco consolidado</h5>
              <p className='mb-2'>Baixo: <strong className='text-success'>{resumo.baixo}</strong></p>
              <p className='mb-2'>Medio: <strong className='text-warning'>{resumo.medio}</strong></p>
              <p className='mb-0'>Alto: <strong className='text-danger'>{resumo.alto}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
