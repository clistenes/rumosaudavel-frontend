'use client'

import { useMemo, useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaAtual, getEmpresaParticipantes } from '@/utils/demo-reports'
import { Alert, Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { exportCsv } from '@/utils/demo-export'

const getCorRisco = (risco: string) => {
  if (risco === 'alto') return '#dc3545'
  if (risco === 'medio') return '#ffc107'
  return '#28a745'
}

const getBadgeGravidade = (pontuacao: number, thresholds: { medio: number; alto: number }) => {
  if (pontuacao >= thresholds.alto) return { bg: 'danger', label: 'Alta' }
  if (pontuacao >= thresholds.medio) return { bg: 'warning', label: 'Moderada' }
  return { bg: 'success', label: 'Baixa' }
}

export default function RelatorioIndividual() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaId = Number(searchParams.get('empresa') || 0)
  const participanteParam = Number(searchParams.get('participante') || 0)

  const { empresas, participantes } = useDemo()
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatorio Individual' subName='Relatorios' />
        <Alert variant='warning'>
          Esta tela deve ser acessada pela lista de empresas.
          <div className='mt-2'>
            <Link href='/adm/lista-empresas'>
              <Button variant='primary' size='sm'>Voltar para Lista de Empresas</Button>
            </Link>
          </div>
        </Alert>
      </>
    )
  }

  const empresa = getEmpresaAtual(empresas as any, empresaId)
  const participantesEmpresa = getEmpresaParticipantes(participantes as any, empresaId) as any[]

  const participanteAtual = useMemo(() => {
    if (participanteParam > 0) {
      const found = participantesEmpresa.find((item) => Number(item.id) === participanteParam)
      if (found) return found
    }
    return participantesEmpresa[0] || null
  }, [participantesEmpresa, participanteParam])

  if (!participanteAtual) {
    return (
      <>
        <PageTitle title='Relatorio Individual' subName='Relatorios' />
        <Alert variant='info'>Nao ha participantes para a empresa selecionada.</Alert>
      </>
    )
  }

  const phq9 = Number(participanteAtual.phq9Score || 0)
  const gad7 = Number(participanteAtual.gad7Score || 0)
  const risco = participanteAtual.riscoSaude || (phq9 >= 15 || gad7 >= 15 ? 'alto' : phq9 >= 10 || gad7 >= 10 ? 'medio' : 'baixo')
  const pontuacaoTotal = Math.round(((phq9 / 27) * 60) + ((gad7 / 21) * 40))

  const resultadosPorDimensao = [
    { dimensao: 'Ambiente de trabalho', valorBase: (30 - phq9) / 6, peso: 20 },
    { dimensao: 'Relacionamentos', valorBase: (25 - gad7) / 5, peso: 15 },
    { dimensao: 'Reconhecimento', valorBase: (22 - phq9) / 5, peso: 25 },
    { dimensao: 'Desenvolvimento', valorBase: (24 - gad7) / 5, peso: 20 },
    { dimensao: 'Comunicacao', valorBase: (20 - Math.max(phq9, gad7)) / 4, peso: 20 },
  ].map((item) => {
    const pontuacao = Math.max(1, Math.min(5, Number(item.valorBase.toFixed(1))))
    const riscoDim = pontuacao >= 4 ? 'baixo' : pontuacao >= 3 ? 'medio' : 'alto'
    return { ...item, pontuacao, risco: riscoDim }
  })

  const badgePhq = getBadgeGravidade(phq9, { medio: 10, alto: 15 })
  const badgeGad = getBadgeGravidade(gad7, { medio: 10, alto: 15 })

  const recomendacoes = [
    risco === 'alto' ? 'Encaminhar para acompanhamento especializado em ate 48h.' : 'Manter monitoramento regular das respostas.',
    phq9 >= 10 ? 'Priorizar plano de apoio para sintomas depressivos.' : 'Estimular manutencao de rotina saudavel.',
    gad7 >= 10 ? 'Aplicar estrategia de manejo de ansiedade com apoio do gestor.' : 'Reforcar praticas de bem-estar e pausa ativa.',
    'Registrar devolutiva com RH e acompanhar evolucao no proximo ciclo.',
  ]

  return (
    <>
      <PageTitle title='Relatorio Individual' subName='Relatorios' />

      <Row className='mb-3'>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Empresa</Form.Label>
            <Form.Control value={empresa?.nomeCurto || empresa?.nome || ''} disabled />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Participante</Form.Label>
            <Form.Select
              value={participanteAtual.id}
              onChange={(event) => {
                const nextId = Number(event.target.value)
                router.replace(`/adm/relatorios/individual?empresa=${empresaId}&participante=${nextId}`)
              }}
            >
              {participantesEmpresa.map((item) => (
                <option key={item.id} value={item.id}>{item.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col>
          <Card className='bg-light'>
            <Card.Body>
              <div className='d-flex justify-content-between align-items-start'>
                <div>
                  <h4 className='mb-1'>{participanteAtual.nome}</h4>
                  <p className='text-muted mb-1'>{participanteAtual.email}</p>
                  <p className='text-muted mb-0'>{participanteAtual.cargo} | {participanteAtual.departamento || 'Geral'}</p>
                </div>
                <div className='text-end'>
                  <p className='text-muted small mb-1'>Ultima avaliacao</p>
                  <strong>{participanteAtual.ultimaAvaliacao || '-'}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={4}>
          <ComponentContainerCard title='Pontuacao Total'>
            <div className='text-center'>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: getCorRisco(risco),
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {pontuacaoTotal}
              </div>
              <Badge bg={risco === 'alto' ? 'danger' : risco === 'medio' ? 'warning' : 'success'}>
                Risco {String(risco).toUpperCase()}
              </Badge>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title='PHQ-9'>
            <div className='text-center'>
              <h2 className='mb-2'>{phq9}/27</h2>
              <Badge bg={badgePhq.bg}>{badgePhq.label}</Badge>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title='GAD-7'>
            <div className='text-center'>
              <h2 className='mb-2'>{gad7}/21</h2>
              <Badge bg={badgeGad.bg}>{badgeGad.label}</Badge>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={8}>
          <ComponentContainerCard title='Resultados por Dimensao'>
            <div className='table-responsive'>
              <Table className='mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>Dimensao</th>
                    <th className='text-center'>Pontuacao</th>
                    <th className='text-center'>Peso</th>
                    <th className='text-center'>Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosPorDimensao.map((item) => (
                    <tr key={item.dimensao}>
                      <td>{item.dimensao}</td>
                      <td className='text-center fw-bold'>{item.pontuacao.toFixed(1)} / 5</td>
                      <td className='text-center'>{item.peso}%</td>
                      <td className='text-center'>
                        <Badge bg={item.risco === 'alto' ? 'danger' : item.risco === 'medio' ? 'warning' : 'success'}>
                          {item.risco.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title='Recomendacoes'>
            <ul className='list-unstyled mb-0'>
              {recomendacoes.map((item) => (
                <li key={item} className='mb-2 d-flex'>
                  <IconifyIcon icon='iconoir:check-circle' className='text-success me-2 mt-1' />
                  <span className='small'>{item}</span>
                </li>
              ))}
            </ul>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row>
        <Col>
          <Alert variant={risco === 'alto' ? 'danger' : risco === 'medio' ? 'warning' : 'success'}>
            <Alert.Heading>
              <IconifyIcon icon='iconoir:warning-triangle' className='me-2' />
              {risco === 'alto' ? 'Atencao Necessaria' : 'Acompanhamento Recomendado'}
            </Alert.Heading>
            <p className='mb-3'>
              Resultado atual do participante indica risco <strong>{risco}</strong> com PHQ-9 {phq9} e GAD-7 {gad7}.
            </p>
            <div className='d-flex justify-content-end gap-2'>
              <Button variant='outline-primary' size='sm' onClick={() => setMostrarDetalhes((state) => !state)}>
                <IconifyIcon icon='iconoir:eye' className='me-1' />
                {mostrarDetalhes ? 'Ocultar detalhes' : 'Ver detalhes'}
              </Button>
              <Button
                variant='primary'
                size='sm'
                onClick={() => {
                  exportCsv(`relatorio-individual-${participanteAtual.id}.csv`, [{
                    participante: participanteAtual.nome,
                    empresa: empresa?.nomeCurto || empresa?.nome || '',
                    cargo: participanteAtual.cargo || '',
                    setor: participanteAtual.departamento || 'Geral',
                    ultima_avaliacao: participanteAtual.ultimaAvaliacao || '',
                    risco: risco,
                    phq9: phq9,
                    gad7: gad7,
                    pontuacao_total: pontuacaoTotal,
                    alertas_pendentes: Number(participanteAtual.alertasPendentes || 0),
                  }])
                }}
              >
                <IconifyIcon icon='iconoir:download' className='me-1' />
                Exportar CSV
              </Button>
            </div>
            {mostrarDetalhes && (
              <div className='mt-3 border-top pt-3 small'>
                Alertas pendentes: {Number(participanteAtual.alertasPendentes || 0)} | Ultima avaliacao: {participanteAtual.ultimaAvaliacao || '-'}
              </div>
            )}
          </Alert>
        </Col>
      </Row>
    </>
  )
}
