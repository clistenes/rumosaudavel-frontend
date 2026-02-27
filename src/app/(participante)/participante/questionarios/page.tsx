'use client'

import { useMemo } from 'react'
import { Badge, Button, Card, Col, ProgressBar, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getParticipanteKey, listSubmissoesParticipante, resolveParticipanteFromSession } from '@/utils/demo-participante'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export default function QuestionariosPage() {
  const { data: session } = useSession()
  const { participantes, questionarios } = useDemo()

  const participante = useMemo(
    () => resolveParticipanteFromSession(session || null, participantes as any),
    [session, participantes]
  )
  const participanteKey = useMemo(
    () => getParticipanteKey(participante as any, session || null),
    [participante, session]
  )
  const submissoes = useMemo(
    () => listSubmissoesParticipante(participanteKey),
    [participanteKey]
  )

  const statusByQuestionario = useMemo(() => {
    const map = new Map<number, { score: number; submittedAt: string }>()
    submissoes.forEach((item) => {
      map.set(Number(item.questionarioId), { score: Number(item.score || 0), submittedAt: item.submittedAt })
    })
    return map
  }, [submissoes])

  return (
    <>
      <Row className='mb-4'>
        <Col>
          <h4 className='page-title'>Meus Questionarios</h4>
          <p className='text-muted'>Lista de questionarios disponiveis para voce</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {!questionarios.length && (
                <p className='text-muted mb-0'>Nenhum questionario disponivel no momento.</p>
              )}

              {(questionarios as any[]).map((questionario) => {
                const submissao = statusByQuestionario.get(Number(questionario.id))
                const finalizado = Boolean(submissao)
                const disponivel = !finalizado && Number(questionario.id) <= 2
                const pendente = !finalizado && !disponivel

                return (
                  <Card key={questionario.id} className='mb-3 border-0 shadow-sm'>
                    <Card.Body>
                      <Row className='align-items-center'>
                        <Col md={6}>
                          <div className='d-flex align-items-center gap-2 mb-1'>
                            <strong>{questionario.codigo}</strong>
                            {finalizado && <Badge bg='success'>Finalizado</Badge>}
                            {disponivel && <Badge bg='warning'>Disponivel</Badge>}
                            {pendente && <Badge bg='secondary'>Em breve</Badge>}
                          </div>
                          <h6 className='mb-1'>{questionario.nome}</h6>
                          <small className='text-muted d-block'>{questionario.descricao}</small>
                          <small className='text-muted'>
                            <IconifyIcon icon='iconoir:clock' className='me-1' />
                            {questionario.tempoEstimadoMinutos || 5} min
                          </small>
                        </Col>
                        <Col md={3}>
                          {finalizado ? (
                            <div>
                              <div className='fw-bold'>Score: {submissao?.score}</div>
                              <small className='text-muted'>
                                {new Date(submissao?.submittedAt || '').toLocaleDateString('pt-BR')}
                              </small>
                            </div>
                          ) : (
                            <div>
                              <small className='text-muted'>{pendente ? 'Liberacao futura' : 'Nao iniciado'}</small>
                              <ProgressBar now={0} className='mt-2' />
                            </div>
                          )}
                        </Col>
                        <Col md={3} className='text-md-end mt-3 mt-md-0'>
                          {finalizado ? (
                            <Link href={`/participante/relatorio/${questionario.id}`}>
                              <Button variant='outline-success' size='sm' className='w-100'>
                                Ver resultado
                              </Button>
                            </Link>
                          ) : disponivel ? (
                            <Link href={`/participante/questionario/${questionario.id}`}>
                              <Button variant='primary' size='sm' className='w-100'>
                                Responder
                              </Button>
                            </Link>
                          ) : (
                            <Button variant='secondary' size='sm' className='w-100' disabled>
                              Em breve
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
