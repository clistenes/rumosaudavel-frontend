'use client'

import { useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, Row, Table } from 'react-bootstrap'
import Link from 'next/link'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useSession } from 'next-auth/react'
import { useDemo } from '@/context/DemoContext'
import { getParticipanteKey, listSubmissoesParticipante, resolveParticipanteFromSession } from '@/utils/demo-participante'

export default function ProntuarioParticipante() {
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

  const historico = useMemo(() => {
    const base = listSubmissoesParticipante(participanteKey)
    return base.map((item) => {
      const questionario = (questionarios as any[]).find((q) => Number(q.id) === Number(item.questionarioId))
      const risco = questionario?.faixasRisco?.find((faixa: any) => item.score >= faixa.min && item.score <= faixa.max)?.risco || 'baixo'
      return {
        data: item.submittedAt,
        questionarioId: Number(item.questionarioId),
        questionario: questionario?.codigo || `Q${item.questionarioId}`,
        score: item.score,
        risco,
      }
    })
  }, [participanteKey, questionarios])

  if (!participante) {
    return <Alert variant='warning'>Nao foi possivel identificar participante da sessao.</Alert>
  }

  const getRiscoBadge = (risco: string) => (
    <Badge bg={risco === 'alto' ? 'danger' : risco === 'medio' ? 'warning' : 'success'}>
      {risco === 'alto' ? 'Alto' : risco === 'medio' ? 'Medio' : 'Baixo'}
    </Badge>
  )

  return (
    <>
      <PageTitle title='Meu Prontuario' subName='Participante' />

      <Card className='bg-primary text-white mb-4'>
        <Card.Body>
          <Row className='align-items-center'>
            <Col md={8}>
              <h4 className='mb-2'>{(participante as any).nome}</h4>
              <p className='mb-0 opacity-75'>{(participante as any).cargo} | {(participante as any).departamento || 'Geral'}</p>
              <small className='opacity-75'>{empresa?.nomeCurto || empresa?.nome}</small>
            </Col>
            <Col md={4} className='text-md-end mt-3 mt-md-0'>
              {getRiscoBadge(String((participante as any).riscoSaude || 'baixo'))}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {String((participante as any).riscoSaude || '') === 'alto' && (
        <Alert variant='danger' className='mb-4'>
          <IconifyIcon icon='iconoir:warning-triangle' className='me-2' />
          Indicador de risco alto detectado. Procure apoio profissional.
          <Link href='/participante/contatos' className='ms-2 alert-link'>Ver contatos</Link>
        </Alert>
      )}

      <Row className='mb-4'>
        <Col md={6}>
          <Card className='h-100'>
            <Card.Header className='bg-light'><h6 className='mb-0'>Dados pessoais</h6></Card.Header>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item className='px-0 d-flex justify-content-between'><span className='text-muted'>Email</span><span>{(participante as any).email}</span></ListGroup.Item>
                <ListGroup.Item className='px-0 d-flex justify-content-between'><span className='text-muted'>CPF</span><span>{(participante as any).cpf}</span></ListGroup.Item>
                <ListGroup.Item className='px-0 d-flex justify-content-between'><span className='text-muted'>Cidade</span><span>{(participante as any).cidade}, {(participante as any).estado}</span></ListGroup.Item>
                <ListGroup.Item className='px-0 d-flex justify-content-between'><span className='text-muted'>Admissao</span><span>{(participante as any).dataAdmissao}</span></ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className='h-100'>
            <Card.Header className='bg-light'><h6 className='mb-0'>Indicadores atuais</h6></Card.Header>
            <Card.Body>
              <Row className='text-center mb-3'>
                <Col xs={6}><Card><Card.Body><h4>{Number((participante as any).phq9Score || 0)}</h4><small className='text-muted'>PHQ-9</small></Card.Body></Card></Col>
                <Col xs={6}><Card><Card.Body><h4>{Number((participante as any).gad7Score || 0)}</h4><small className='text-muted'>GAD-7</small></Card.Body></Card></Col>
              </Row>
              <div className='small text-muted'>Ultima avaliacao: {(participante as any).ultimaAvaliacao || '-'}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
          <h6 className='mb-0'>Historico de avaliacoes</h6>
          <Badge bg='secondary'>{historico.length} registros</Badge>
        </Card.Header>
        <Card.Body>
          <div className='table-responsive'>
            <Table hover className='mb-0'>
              <thead className='table-light'>
                <tr>
                  <th>Data</th>
                  <th>Questionario</th>
                  <th className='text-center'>Score</th>
                  <th className='text-center'>Risco</th>
                  <th className='text-center'>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((registro, index) => (
                  <tr key={`${registro.questionario}-${index}`}>
                    <td>{new Date(registro.data).toLocaleDateString('pt-BR')}</td>
                    <td>{registro.questionario}</td>
                    <td className='text-center'><Badge bg='info'>{registro.score}</Badge></td>
                    <td className='text-center'>{getRiscoBadge(registro.risco)}</td>
                    <td className='text-center'>
                      <Link href={`/participante/relatorio/${registro.questionarioId}`}>
                        <Button variant='outline-primary' size='sm'>Ver</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!historico.length && (
              <div className='text-center text-muted py-4'>
                Nenhum questionario respondido ate o momento.
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
