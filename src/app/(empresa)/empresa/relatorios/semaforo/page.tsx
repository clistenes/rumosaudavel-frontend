'use client'

import { useMemo } from 'react'
import { Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaParticipantes, getSetoresResumo } from '@/utils/demo-reports'
import { exportCsv } from '@/utils/demo-export'

export default function RelatorioSemaforoPage() {
  const { data: session } = useSession()
  const { participantes } = useDemo()
  const empresaId = Number(session?.user?.id_empresa || 0)

  const participantesEmpresa = useMemo(() => getEmpresaParticipantes(participantes as any, empresaId), [participantes, empresaId])
  const setores = useMemo(() => getSetoresResumo(participantesEmpresa as any), [participantesEmpresa])

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <h4 className='page-title'>Relatorio Semaforo</h4>
          <p className='text-muted'>Indicadores de risco por setor</p>
        </Col>
        <Col className='text-end'>
          <Button
            size='sm'
            onClick={() => {
              exportCsv('empresa-relatorio-semaforo.csv', setores.map((setor) => ({
                setor: setor.setor,
                baixo: setor.baixo,
                medio: setor.medio,
                alto: setor.alto,
                total: setor.total,
              })))
            }}
            disabled={!setores.length}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5 className='mb-3'>Semaforo de risco</h5>
              <div className='table-responsive'>
                <Table className='mb-0'>
                  <thead className='table-light'>
                    <tr>
                      <th>Setor</th>
                      <th className='text-center'>Baixo</th>
                      <th className='text-center'>Medio</th>
                      <th className='text-center'>Alto</th>
                      <th className='text-center'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setores.map((setor) => (
                      <tr key={setor.setor}>
                        <td>{setor.setor}</td>
                        <td className='text-center'><Badge bg='success'>{setor.baixo}</Badge></td>
                        <td className='text-center'><Badge bg='warning' text='dark'>{setor.medio}</Badge></td>
                        <td className='text-center'><Badge bg='danger'>{setor.alto}</Badge></td>
                        <td className='text-center'>{setor.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {!setores.length && (
                  <div className='text-center text-muted py-4'>
                    Nenhum dado de setor disponivel.
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
