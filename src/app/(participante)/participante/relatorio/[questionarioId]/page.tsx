'use client'

import { useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { getParticipanteKey, getRiscoByScore, getSubmissaoByQuestionario, resolveParticipanteFromSession } from '@/utils/demo-participante'

export default function RelatorioQuestionario() {
  const params = useParams()
  const { data: session } = useSession()
  const { questionarios, participantes } = useDemo()

  const questionarioId = Number(params.questionarioId || 0)
  const questionario = useMemo(
    () => (questionarios as any[]).find((item) => Number(item.id) === questionarioId) || null,
    [questionarios, questionarioId]
  )

  const participante = useMemo(
    () => resolveParticipanteFromSession(session || null, participantes as any),
    [session, participantes]
  )

  const participanteKey = useMemo(
    () => getParticipanteKey(participante as any, session || null),
    [participante, session]
  )

  const submissao = useMemo(
    () => getSubmissaoByQuestionario(participanteKey, questionarioId),
    [participanteKey, questionarioId]
  )

  if (!questionario || !participante) {
    return (
      <>
        <PageTitle title='Relatorio nao encontrado' subName='Participante' />
        <Alert variant='warning'>Nao foi possivel carregar o relatorio deste questionario.</Alert>
      </>
    )
  }

  if (!submissao) {
    return (
      <>
        <PageTitle title={`Resultado - ${questionario.codigo}`} subName='Participante' />
        <Alert variant='info'>Este questionario ainda nao foi respondido.</Alert>
        <Link href={`/participante/questionario/${questionarioId}`}>
          <Button variant='primary'>Responder agora</Button>
        </Link>
      </>
    )
  }

  const scoreAtual = Number(submissao.score || 0)
  const risco = getRiscoByScore((questionario as any).faixasRisco || [], scoreAtual) || {
    risco: 'baixo',
    descricao: 'Sem classificacao',
    min: 0,
    max: scoreAtual,
  }

  const riscoLabel = risco.risco === 'alto' ? 'Alto' : risco.risco === 'medio' ? 'Medio' : 'Baixo'
  const riscoVariant = risco.risco === 'alto' ? 'danger' : risco.risco === 'medio' ? 'warning' : 'success'

  return (
    <>
      <PageTitle title={`Resultado - ${questionario.codigo}`} subName='Participante' />

      <Card className='mb-4'>
        <Card.Body>
          <Row className='align-items-center'>
            <Col md={8}>
              <h4 className='mb-2'>{questionario.nome}</h4>
              <p className='text-muted mb-1'>{questionario.descricao}</p>
              <small className='text-muted'>Respondido em: {new Date(submissao.submittedAt).toLocaleDateString('pt-BR')}</small>
            </Col>
            <Col md={4} className='text-md-end mt-3 mt-md-0'>
              <div className='d-flex gap-2 justify-content-md-end'>
                <Link href={`/participante/questionario/${questionarioId}?reset=1`}>
                  <Button variant='outline-primary'>Refazer</Button>
                </Link>
                <Link href='/participante'>
                  <Button variant='outline-secondary'>Dashboard</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className='mb-4'>
        <Col md={4}>
          <Card className={`border-${riscoVariant} h-100`}>
            <Card.Body className='text-center'>
              <h6 className='text-muted mb-2'>Pontuacao final</h6>
              <h2 className='mb-1'>{scoreAtual}</h2>
              <small className='text-muted'>/ {(questionario as any).escoreMaximo || 0}</small>
              <div className='mt-3'>
                <Badge bg={riscoVariant}>Risco {riscoLabel}</Badge>
              </div>
              <p className='small text-muted mt-2 mb-0'>{risco.descricao}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className='h-100'>
            <Card.Header className='bg-light'><h6 className='mb-0'>Faixas de classificacao</h6></Card.Header>
            <Card.Body>
              <Row>
                {((questionario as any).faixasRisco || []).map((faixa: any, index: number) => {
                  const active = scoreAtual >= faixa.min && scoreAtual <= faixa.max
                  return (
                    <Col md={6} key={index} className='mb-3'>
                      <Card className={`border-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}>
                        <Card.Body className='p-3'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <Badge bg={faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}>
                              {faixa.min}-{faixa.max}
                            </Badge>
                            {active && <Badge bg='dark'>Atual</Badge>}
                          </div>
                          <small className='text-muted d-block mt-2'>{faixa.descricao}</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
          <h6 className='mb-0'>Detalhamento das respostas</h6>
          <Badge bg='secondary'>{submissao.respostas.length} questoes</Badge>
        </Card.Header>
        <Card.Body>
          <div className='table-responsive'>
            <Table hover className='mb-0'>
              <thead className='table-light'>
                <tr>
                  <th>#</th>
                  <th>Pergunta</th>
                  <th>Resposta</th>
                  <th className='text-center'>Pontos</th>
                </tr>
              </thead>
              <tbody>
                {submissao.respostas.map((item, index) => (
                  <tr key={item.perguntaId}>
                    <td>{index + 1}</td>
                    <td>{item.pergunta}</td>
                    <td>{item.resposta}</td>
                    <td className='text-center'>
                      <Badge bg={item.valor >= 2 ? 'warning' : item.valor >= 1 ? 'info' : 'success'}>{item.valor}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <div className='mt-4'>
        {risco.risco === 'alto' && (
          <Alert variant='danger'>
            <IconifyIcon icon='iconoir:warning-triangle' className='me-2' />
            Recomendamos contato imediato com os canais de apoio.
            <Link href='/participante/contatos' className='ms-2 alert-link'>Ver contatos</Link>
          </Alert>
        )}
      </div>
    </>
  )
}
