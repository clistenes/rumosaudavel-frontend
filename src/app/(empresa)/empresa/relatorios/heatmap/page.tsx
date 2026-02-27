'use client'

import { useMemo } from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaParticipantes, getSetoresResumo } from '@/utils/demo-reports'
import { exportCsv } from '@/utils/demo-export'

const corHeatmap = (valor: number) => {
  if (valor <= 4) return '#28a745'
  if (valor <= 8) return '#ffc107'
  if (valor <= 12) return '#fd7e14'
  return '#dc3545'
}

export default function RelatorioHeatmapPage() {
  const { data: session } = useSession()
  const { participantes } = useDemo()
  const empresaId = Number(session?.user?.id_empresa || 0)

  const participantesEmpresa = useMemo(() => getEmpresaParticipantes(participantes as any, empresaId), [participantes, empresaId])
  const setores = useMemo(() => getSetoresResumo(participantesEmpresa as any), [participantesEmpresa])

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <h4 className='page-title'>Heatmap</h4>
          <p className='text-muted'>Mapa de calor por setor (PHQ-9 e GAD-7)</p>
        </Col>
        <Col className='text-end'>
          <Button
            size='sm'
            onClick={() => {
              exportCsv('empresa-relatorio-heatmap.csv', setores.map((setor) => ({
                setor: setor.setor,
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

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5 className='mb-3'>Heatmap de exposicao ao risco</h5>
              <div className='table-responsive'>
                <Table className='mb-0 text-center'>
                  <thead className='table-light'>
                    <tr>
                      <th className='text-start'>Setor</th>
                      <th>PHQ-9 medio</th>
                      <th>GAD-7 medio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {setores.map((setor) => (
                      <tr key={setor.setor}>
                        <td className='text-start'>{setor.setor}</td>
                        <td>
                          <div
                            className='rounded py-2 fw-bold'
                            style={{ backgroundColor: corHeatmap(setor.mediaPhq9), color: setor.mediaPhq9 <= 8 ? '#000' : '#fff' }}
                          >
                            {setor.mediaPhq9.toFixed(1)}
                          </div>
                        </td>
                        <td>
                          <div
                            className='rounded py-2 fw-bold'
                            style={{ backgroundColor: corHeatmap(setor.mediaGad7), color: setor.mediaGad7 <= 8 ? '#000' : '#fff' }}
                          >
                            {setor.mediaGad7.toFixed(1)}
                          </div>
                        </td>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
