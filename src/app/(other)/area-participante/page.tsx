'use client'

import { useState } from 'react'
import { Card, Button, Badge, ProgressBar, Row, Col, Alert, ListGroup } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'

interface Questionario {
  id: number
  titulo: string
  descricao: string
  status: 'pendente' | 'em_andamento' | 'concluido'
  progresso: number
  dataLimite: string
  tempoEstimado: number
  categoria: string
}

interface Notificacao {
  id: number
  titulo: string
  mensagem: string
  tipo: 'lembrete' | 'info' | 'sucesso'
  data: string
  lida: boolean
}

const questionarios: Questionario[] = [
  { id: 1, titulo: 'Avaliação PHQ-9', descricao: 'Avaliação de saúde mental - Questionário de 9 perguntas', status: 'pendente', progresso: 0, dataLimite: '15/02/2026', tempoEstimado: 5, categoria: 'Saúde Mental' },
  { id: 2, titulo: 'Avaliação GAD-7', descricao: 'Avaliação de ansiedade generalizada', status: 'em_andamento', progresso: 40, dataLimite: '15/02/2026', tempoEstimado: 5, categoria: 'Saúde Mental' },
  { id: 3, titulo: 'Satisfação no Trabalho', descricao: 'Pesquisa de clima organizacional', status: 'concluido', progresso: 100, dataLimite: '01/02/2026', tempoEstimado: 10, categoria: 'Engajamento' },
]

const notificacoes: Notificacao[] = [
  { id: 1, titulo: 'Lembrete: PHQ-9 pendente', mensagem: 'Você tem um questionário para responder até 15/02', tipo: 'lembrete', data: 'Hoje, 09:00', lida: false },
  { id: 2, titulo: 'Bem-vindo ao programa!', mensagem: 'Seu cadastro foi confirmado com sucesso.', tipo: 'sucesso', data: 'Ontem, 14:30', lida: true },
]

const dadosSaude = {
  phq9Ultimo: 8,
  gad7Ultimo: 6,
  tendencia: 'estavel',
  ultimaAvaliacao: '10/01/2026',
  proximaReavaliacao: '10/04/2026',
}

export default function AreaParticipantePage() {
  const [showWelcome, setShowWelcome] = useState(true)

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pendente: 'warning',
      em_andamento: 'info',
      concluido: 'success',
    }
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
    }
    return <Badge bg={colors[status]}>{labels[status]}</Badge>
  }

  return (
    <>
      <PageTitle title="Área do Participante" subName="Bem-vindo, João Silva" />

      {showWelcome && (
        <Alert variant="info" dismissible onClose={() => setShowWelcome(false)} className="mb-4">
          <Alert.Heading>
            <IconifyIcon icon="fa:hand-sparkles" className="me-2" />
            Bem-vindo ao Programa de Bem-estar!
          </Alert.Heading>
          <p className="mb-0">
            Complete seus questionários para ajudarmos a cuidar melhor da sua saúde mental. 
            Todos os dados são confidenciais e protegidos.
          </p>
        </Alert>
      )}

      <Row>
        <Col xl={4}>
          <Card className="bg-primary text-white mb-4">
            <Card.Body>
              <h6 className="mb-3">Resumo da sua Saúde Mental</h6>
              <Row className="text-center">
                <Col xs={6}>
                  <div className="bg-white bg-opacity-20 rounded p-2">
                    <h4 className="mb-0">{dadosSaude.phq9Ultimo}</h4>
                    <small>PHQ-9</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="bg-white bg-opacity-20 rounded p-2">
                    <h4 className="mb-0">{dadosSaude.gad7Ultimo}</h4>
                    <small>GAD-7</small>
                  </div>
                </Col>
              </Row>
              <hr className="my-3 border-white opacity-25" />
              <div className="small">
                <p className="mb-1">
                  <IconifyIcon icon="fa:calendar-check" className="me-1" />
                  Última avaliação: {dadosSaude.ultimaAvaliacao}
                </p>
                <p className="mb-0">
                  <IconifyIcon icon="fa:calendar-alt" className="me-1" />
                  Próxima reavaliação: {dadosSaude.proximaReavaliacao}
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Notificações</strong>
              <Badge bg="danger">{notificacoes.filter(n => !n.lida).length}</Badge>
            </Card.Header>
            <ListGroup variant="flush">
              {notificacoes.map((notif) => (
                <ListGroup.Item key={notif.id} className={notif.lida ? '' : 'bg-light'}>
                  <div className="d-flex gap-2">
                    <IconifyIcon 
                      icon={`fa:${notif.tipo === 'lembrete' ? 'bell' : notif.tipo === 'sucesso' ? 'check-circle' : 'info-circle'}`}
                      className={`mt-1 text-${notif.tipo === 'lembrete' ? 'warning' : notif.tipo === 'sucesso' ? 'success' : 'info'}`}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <small className="fw-medium">{notif.titulo}</small>
                        {!notif.lida && <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }} />}
                      </div>
                      <p className="small text-muted mb-0">{notif.mensagem}</p>
                      <small className="text-muted">{notif.data}</small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          <Card>
            <Card.Body className="text-center">
              <IconifyIcon icon="fa:headset" className="display-4 text-primary mb-2" />
              <h6>Precisa de ajuda?</h6>
              <p className="small text-muted">
                Estamos aqui para apoiar você. Entre em contato com nossa equipe.
              </p>
              <Link href="/participante/contatos" className="btn btn-outline-primary btn-sm">
                Falar com Especialista
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Meus Questionários</strong>
              <Badge bg="warning">
                {questionarios.filter(q => q.status !== 'concluido').length} pendentes
              </Badge>
            </Card.Header>
            <Card.Body>
              {questionarios.map((q) => (
                <div key={q.id} className="mb-3 pb-3 border-bottom last-border-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{q.titulo}</h6>
                      <p className="small text-muted mb-1">{q.descricao}</p>
                      <div className="d-flex gap-2 align-items-center">
                        <Badge bg="secondary">{q.categoria}</Badge>
                        {getStatusBadge(q.status)}
                        <small className="text-muted">
                          <IconifyIcon icon="fa:clock" className="me-1" />
                          ~{q.tempoEstimado} min
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      {q.status === 'concluido' ? (
                        <Button variant="outline-success" size="sm">
                          <IconifyIcon icon="fa:eye" className="me-1" />
                          Ver Resultado
                        </Button>
                      ) : (
                        <Link href={`/participante/questionario/${q.id}`} className="btn btn-primary btn-sm">
                          <IconifyIcon icon={q.status === 'em_andamento' ? 'fa:play' : 'fa:edit'} className="me-1" />
                          {q.status === 'em_andamento' ? 'Continuar' : 'Responder'}
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {q.status !== 'concluido' && (
                    <>
                      <ProgressBar 
                        now={q.progresso} 
                        variant={q.progresso > 0 ? 'info' : 'secondary'}
                        className="mb-2"
                        style={{ height: '8px' }}
                      />
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">{q.progresso}% completo</span>
                        <span className="text-muted">Vence em: {q.dataLimite}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>

          <Row>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h6 className="mb-3">
                    <IconifyIcon icon="fa:chart-line" className="me-2 text-primary" />
                    Sua Evolução
                  </h6>
                  <div className="text-center py-4">
                    <div className="mb-3">
                      <IconifyIcon icon="fa:smile" className="display-3 text-success" />
                    </div>
                    <h5>Tendência Estável</h5>
                    <p className="text-muted small mb-0">
                      Seus índices têm se mantido estáveis nas últimas avaliações.
                      Continue cuidando da sua saúde mental!
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h6 className="mb-3">
                    <IconifyIcon icon="fa:calendar-check" className="me-2 text-success" />
                    Próximos Passos
                  </h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                          <small className="text-white">1</small>
                        </div>
                        <span className="small">Completar PHQ-9</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                          <small className="text-white">2</small>
                        </div>
                        <span className="small">Finalizar GAD-7</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <div className="d-flex align-items-center">
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '24px', height: '24px' }}>
                          <small className="text-white">3</small>
                        </div>
                        <span className="small text-muted">Aguardar reavaliação</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
