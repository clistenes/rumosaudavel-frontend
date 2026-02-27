'use client'

import { useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, ProgressBar, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getParticipanteKey, listSubmissoesParticipante, resolveParticipanteFromSession } from '@/utils/demo-participante'

export default function ParticipanteDashboard() {
  const { data: session } = useSession()
  const { empresas, participantes, questionarios } = useDemo()

  const participante = useMemo(
    () => resolveParticipanteFromSession(session || null, participantes as any),
    [session, participantes]
  )

  const empresa = useMemo(() => {
    if (!participante) return null
    return (empresas as any[]).find((item) => Number(item.id) === Number((participante as any).empresaId)) || null
  }, [participante, empresas])

  const participanteKey = useMemo(
    () => getParticipanteKey(participante as any, session || null),
    [participante, session]
  )

  const submissoes = useMemo(() => listSubmissoesParticipante(participanteKey), [participanteKey])

  const statusByQuestionario = useMemo(() => {
    const map = new Map<number, { score: number; submittedAt: string }>()
    submissoes.forEach((item) => {
      map.set(Number(item.questionarioId), { score: Number(item.score || 0), submittedAt: item.submittedAt })
    })
    return map
  }, [submissoes])

  const questionariosComStatus = useMemo(() => {
    return (questionarios as any[]).map((item, index) => {
      const submissao = statusByQuestionario.get(Number(item.id))
      const status = submissao ? 'finalizado' : index < 2 ? 'disponivel' : 'pendente'
      return {
        ...item,
        status,
        score: submissao?.score,
        submittedAt: submissao?.submittedAt,
      }
    })
  }, [questionarios, statusByQuestionario])

  const stats = useMemo(() => {
    const total = questionariosComStatus.length
    const finalizados = questionariosComStatus.filter((item) => item.status === 'finalizado').length
    const disponiveis = questionariosComStatus.filter((item) => item.status === 'disponivel').length
    const progressoGeral = total > 0 ? Math.round((finalizados / total) * 100) : 0

    return { total, finalizados, disponiveis, progressoGeral }
  }, [questionariosComStatus])

  if (!participante) {
    return (
      <Alert variant='warning'>
        Nao foi possivel identificar o participante da sessao atual.
      </Alert>
    )
  }

  const phq9Atual = Number((participante as any).phq9Score || 0)
  const gad7Atual = Number((participante as any).gad7Score || 0)
  const riscoAtual = String((participante as any).riscoSaude || 'baixo')

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <Card className='bg-primary text-white'>
            <Card.Body>
              <Row className='align-items-center'>
                <Col md={8}>
                  <h4 className='mb-2'>Ola, {String((participante as any).nome || '').split(' ')[0]}!</h4>
                  <p className='mb-0 opacity-75'>
                    Acompanhe seus questionarios e resultados no programa da {empresa?.nomeCurto || empresa?.nome || 'empresa'}.
                  </p>
                </Col>
                <Col md={4} className='text-md-end mt-3 mt-md-0'>
                  <small className='d-block opacity-75'>Ultima avaliacao</small>
                  <strong>{(participante as any).ultimaAvaliacao || '-'}</strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {riscoAtual === 'alto' && (
        <Row className='mb-4'>
          <Col>
            <Alert variant='danger' className='d-flex align-items-center'>
              <IconifyIcon icon='iconoir:warning-triangle' className='fs-4 me-3' />
              <div className='flex-grow-1'>
                <h6 className='mb-1'>Indicador de risco elevado</h6>
                <p className='mb-0 small'>Recomendamos buscar apoio profissional pelos canais disponiveis.</p>
              </div>
              <Link href='/participante/contatos'>
                <Button variant='outline-danger' size='sm'>Canal de apoio</Button>
              </Link>
            </Alert>
          </Col>
        </Row>
      )}

      <Row className='mb-4'>
        <Col md={3}><Card className='h-100'><Card.Body><h3 className='mb-0'>{stats.disponiveis}</h3><small className='text-muted'>Disponiveis</small></Card.Body></Card></Col>
        <Col md={3}><Card className='h-100'><Card.Body><h3 className='mb-0'>{stats.finalizados}</h3><small className='text-muted'>Finalizados</small></Card.Body></Card></Col>
        <Col md={3}><Card className='h-100'><Card.Body><h3 className='mb-0'>{phq9Atual}</h3><small className='text-muted'>PHQ-9</small></Card.Body></Card></Col>
        <Col md={3}><Card className='h-100'><Card.Body><h3 className='mb-0'>{gad7Atual}</h3><small className='text-muted'>GAD-7</small></Card.Body></Card></Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className='mb-4'>
            <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>Meus Questionarios</h5>
              <Badge bg='primary'>{stats.progressoGeral}% completo</Badge>
            </Card.Header>
            <Card.Body>
              {questionariosComStatus.map((item: any) => (
                <Card key={item.id} className='mb-3 border-0 shadow-sm'>
                  <Card.Body>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <div className='d-flex align-items-center gap-2 mb-1'>
                          <strong>{item.codigo}</strong>
                          {item.status === 'finalizado' && <Badge bg='success'>Finalizado</Badge>}
                          {item.status === 'disponivel' && <Badge bg='warning'>Disponivel</Badge>}
                          {item.status === 'pendente' && <Badge bg='secondary'>Em breve</Badge>}
                        </div>
                        <small className='text-muted'>{item.nome}</small>
                      </Col>
                      <Col md={3}>
                        {item.status === 'finalizado' ? (
                          <div>
                            <div className='fw-bold'>Score: {item.score}</div>
                            <small className='text-muted'>{new Date(item.submittedAt || '').toLocaleDateString('pt-BR')}</small>
                          </div>
                        ) : (
                          <small className='text-muted'>{item.status === 'pendente' ? 'Liberacao futura' : 'Nao iniciado'}</small>
                        )}
                      </Col>
                      <Col md={3} className='text-md-end mt-3 mt-md-0'>
                        {item.status === 'finalizado' ? (
                          <Link href={`/participante/relatorio/${item.id}`}>
                            <Button variant='outline-success' size='sm' className='w-100'>Ver resultado</Button>
                          </Link>
                        ) : item.status === 'disponivel' ? (
                          <Link href={`/participante/questionario/${item.id}`}>
                            <Button variant='primary' size='sm' className='w-100'>Responder</Button>
                          </Link>
                        ) : (
                          <Button variant='secondary' size='sm' className='w-100' disabled>Em breve</Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className='mb-4'>
            <Card.Header className='bg-light'><h5 className='mb-0'>Acoes rapidas</h5></Card.Header>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item className='px-0'><Link href='/participante/questionarios' className='text-decoration-none'>Meus Questionarios</Link></ListGroup.Item>
                <ListGroup.Item className='px-0'><Link href='/participante/prontuario' className='text-decoration-none'>Meu Prontuario</Link></ListGroup.Item>
                <ListGroup.Item className='px-0'><Link href='/participante/contatos' className='text-decoration-none'>Canal de Apoio</Link></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className='bg-light'><h5 className='mb-0'>Progresso Geral</h5></Card.Header>
            <Card.Body>
              <ProgressBar now={stats.progressoGeral} label={`${stats.progressoGeral}%`} />
              <p className='text-muted small mt-2 mb-0'>{stats.finalizados} de {stats.total} questionarios finalizados</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
