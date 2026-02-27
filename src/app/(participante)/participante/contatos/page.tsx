'use client'

import { useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { getParticipanteKey, listSubmissoesParticipante, resolveParticipanteFromSession } from '@/utils/demo-participante'

export default function ContatosApoio() {
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
  const pendentes = Math.max(0, (questionarios as any[]).length - submissoes.length)

  if (!participante) {
    return <Alert variant='warning'>Nao foi possivel identificar participante da sessao.</Alert>
  }

  const risco = String((participante as any).riscoSaude || 'baixo')
  const riscoVariant = risco === 'alto' ? 'danger' : risco === 'medio' ? 'warning' : 'success'

  const contatos = [
    {
      id: 'cvv',
      nome: 'CVV - Centro de Valorizacao da Vida',
      descricao: 'Apoio emocional 24h para momentos de crise',
      telefone: '188',
      disponibilidade: '24 horas',
      email: '',
      variant: 'danger',
      icon: 'iconoir:phone',
    },
    {
      id: 'empresa',
      nome: `Apoio interno ${empresa?.nomeCurto || 'da empresa'}`,
      descricao: `Contato com ${empresa?.contatoNome || 'responsavel de RH'} para apoio e encaminhamento`,
      telefone: empresa?.contatoTelefone || empresa?.telefone || '',
      disponibilidade: 'Horario comercial',
      email: empresa?.contatoEmail || empresa?.email || '',
      variant: 'primary',
      icon: 'iconoir:user-bag',
    },
    {
      id: 'rumo',
      nome: 'Canal Rumo Saudavel',
      descricao: 'Suporte especializado para participantes do programa',
      telefone: '0800-123-4567',
      disponibilidade: 'Seg-Sex 7h-22h',
      email: 'apoio@rumosaudavel.com.br',
      variant: 'success',
      icon: 'iconoir:heart',
    },
  ]

  const dicas = [
    'Mantenha rotina regular de sono e descanso.',
    'Faca pausas curtas durante a jornada de trabalho.',
    'Procure uma pessoa de confianca para conversar.',
    'Se os sintomas persistirem, busque apoio profissional.',
  ]

  return (
    <>
      <PageTitle title='Canal de Apoio' subName='Participante' />

      <Card className='bg-primary text-white mb-4'>
        <Card.Body>
          <Row className='align-items-center'>
            <Col md={8}>
              <h4 className='mb-2'>Suporte para voce</h4>
              <p className='mb-0 opacity-75'>
                Use os contatos abaixo quando precisar de orientacao ou apoio imediato.
              </p>
            </Col>
            <Col md={4} className='text-md-end mt-3 mt-md-0'>
              <Badge bg='light' text='dark'>Risco {risco.toUpperCase()}</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Alert variant={riscoVariant} className='mb-4'>
        <IconifyIcon icon='iconoir:warning-triangle' className='me-2' />
        {risco === 'alto'
          ? 'Seu status atual recomenda contato rapido com um profissional.'
          : risco === 'medio'
            ? 'Mantenha monitoramento e considere apoio preventivo.'
            : 'Continue cuidando do seu bem-estar e mantendo a rotina de acompanhamento.'}
      </Alert>

      <Row className='mb-4'>
        {contatos.map((contato) => (
          <Col md={4} key={contato.id} className='mb-3'>
            <Card className={`h-100 border-${contato.variant}`}>
              <Card.Body>
                <div className='d-flex align-items-start mb-3'>
                  <div className={`bg-${contato.variant} bg-opacity-10 p-2 rounded me-3`}>
                    <IconifyIcon icon={contato.icon} className={`text-${contato.variant}`} />
                  </div>
                  <div>
                    <h6 className='mb-1'>{contato.nome}</h6>
                    <small className='text-muted'>{contato.descricao}</small>
                  </div>
                </div>

                <ListGroup variant='flush'>
                  <ListGroup.Item className='px-0 py-2'>
                    <IconifyIcon icon='iconoir:phone' className='me-2 text-muted' />
                    <strong>{contato.telefone || '-'}</strong>
                  </ListGroup.Item>
                  {contato.email && (
                    <ListGroup.Item className='px-0 py-2'>
                      <IconifyIcon icon='iconoir:mail' className='me-2 text-muted' />
                      {contato.email}
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className='px-0 py-2'>
                    <IconifyIcon icon='iconoir:clock' className='me-2 text-muted' />
                    {contato.disponibilidade}
                  </ListGroup.Item>
                </ListGroup>

                <div className='mt-3'>
                  <Button
                    variant={contato.variant as any}
                    className='w-100'
                    href={contato.telefone ? `tel:${contato.telefone.replace(/\D/g, '')}` : undefined}
                    disabled={!contato.telefone}
                  >
                    Ligar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header className='bg-light'>
              <h6 className='mb-0'>Dicas rapidas</h6>
            </Card.Header>
            <Card.Body>
              <ul className='mb-0'>
                {dicas.map((dica) => (
                  <li key={dica} className='mb-2'>{dica}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header className='bg-light'>
              <h6 className='mb-0'>Seu acompanhamento</h6>
            </Card.Header>
            <Card.Body>
              <p className='mb-2'><strong>{submissoes.length}</strong> questionarios respondidos</p>
              <p className='mb-3'><strong>{pendentes}</strong> pendentes</p>
              <div className='d-grid gap-2'>
                <Link href='/participante/questionarios'>
                  <Button variant='primary' className='w-100'>Ir para questionarios</Button>
                </Link>
                <Link href='/participante/prontuario'>
                  <Button variant='outline-primary' className='w-100'>Ver prontuario</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
