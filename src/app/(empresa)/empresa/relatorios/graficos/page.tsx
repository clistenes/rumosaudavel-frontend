'use client'

import { useMemo } from 'react'
import { Button, Card, Col, ProgressBar, Row } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaParticipantes, getEmpresaResumo } from '@/utils/demo-reports'
import { exportCsv } from '@/utils/demo-export'

export default function RelatorioGraficosPage() {
  const { data: session } = useSession()
  const { participantes } = useDemo()
  const empresaId = Number(session?.user?.id_empresa || 0)

  const participantesEmpresa = useMemo(() => getEmpresaParticipantes(participantes as any, empresaId), [participantes, empresaId])
  const resumo = useMemo(() => getEmpresaResumo(participantesEmpresa as any), [participantesEmpresa])
  const total = resumo.total || 1

  const dados = [
    { label: 'Baixo risco', valor: resumo.baixo, variant: 'success' as const },
    { label: 'Medio risco', valor: resumo.medio, variant: 'warning' as const },
    { label: 'Alto risco', valor: resumo.alto, variant: 'danger' as const },
  ]

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <h4 className='page-title'>Graficos</h4>
          <p className='text-muted'>Distribuicao de risco dos participantes</p>
        </Col>
        <Col className='text-end'>
          <Button
            size='sm'
            onClick={() => {
              exportCsv('empresa-relatorio-graficos.csv', dados.map((item) => ({
                classificacao: item.label,
                quantidade: item.valor,
                percentual: `${Math.round((item.valor / total) * 100)}%`,
              })))
            }}
            disabled={!resumo.total}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      {!resumo.total && (
        <div className='alert alert-info'>Nenhum participante encontrado para gerar os graficos.</div>
      )}

      <Row className='mb-4'>
        {dados.map((item) => (
          <Col md={4} key={item.label}>
            <Card>
              <Card.Body className='text-center'>
                <h3 className={`text-${item.variant} mb-1`}>{Math.round((item.valor / total) * 100)}%</h3>
                <small>{item.label}</small>
                <ProgressBar now={(item.valor / total) * 100} variant={item.variant} className='mt-3' />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5 className='mb-3'>Indicadores medios</h5>
              <p className='mb-2'>PHQ-9 medio: <strong>{resumo.mediaPhq9.toFixed(1)}</strong></p>
              <p className='mb-0'>GAD-7 medio: <strong>{resumo.mediaGad7.toFixed(1)}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
