'use client'

import { useState, useMemo } from 'react'
import { Card, Col, Row, Button, Badge, ProgressBar, Alert, ListGroup } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { QUESTIONARIOS_DEMO, PARTICIPANTES_DEMO, EMPRESAS_DEMO, ALERTAS_DEMO } from '@/assets/data/demo-data'

interface QuestionarioStatus {
  id: number
  status: 'pendente' | 'disponivel' | 'finalizado' | 'bloqueado'
  progresso: number
  dataResposta?: string
  score?: number
}

export default function ParticipanteDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  
  // Get current participant from session or default to first participant (José Antônio)
  const participanteId = useMemo(() => {
    // In real app, this would come from session
    return 1 // José Antônio Pereira - high risk demo user
  }, [session])

  const participante = useMemo(() => {
    return PARTICIPANTES_DEMO.find(p => p.id === participanteId) || PARTICIPANTES_DEMO[0]
  }, [participanteId])

  const empresa = useMemo(() => {
    return EMPRESAS_DEMO.find(e => e.id === participante.empresaId) || EMPRESAS_DEMO[0]
  }, [participante])

  // Simulate questionnaire statuses
  const questionariosStatus: QuestionarioStatus[] = useMemo(() => {
    return [
      { 
        id: 1, 
        status: 'finalizado', 
        progresso: 100, 
        dataResposta: participante.ultimaAvaliacao,
        score: participante.phq9Score 
      }, // PHQ-9
      { 
        id: 2, 
        status: 'finalizado', 
        progresso: 100, 
        dataResposta: participante.ultimaAvaliacao,
        score: participante.gad7Score 
      }, // GAD-7
      { id: 3, status: 'disponivel', progresso: 0 }, // PSS-10
      { id: 4, status: 'pendente', progresso: 0 }, // Burnout
      { id: 5, status: 'bloqueado', progresso: 0 }, // ISI - needs other questionnaires first
    ]
  }, [participante])

  // Combine questionnaire data with status
  const questionarios = useMemo(() => {
    return QUESTIONARIOS_DEMO.map(q => {
      const status = questionariosStatus.find(s => s.id === q.id)
      return {
        ...q,
        status: status?.status || 'pendente',
        progresso: status?.progresso || 0,
        dataResposta: status?.dataResposta,
        score: status?.score
      }
    })
  }, [questionariosStatus])

  // Calculate stats
  const stats = useMemo(() => {
    const total = questionarios.length
    const finalizados = questionarios.filter(q => q.status === 'finalizado').length
    const disponiveis = questionarios.filter(q => q.status === 'disponivel' || q.status === 'pendente').length
    const progressoGeral = total > 0 ? (finalizados / total) * 100 : 0
    
    return { total, finalizados, disponiveis, progressoGeral }
  }, [questionarios])

  // Get risk level description
  const getRiskInfo = (phq9: number, gad7: number) => {
    const maxScore = Math.max(phq9, gad7)
    if (maxScore >= 15) return { 
      nivel: 'Alto', 
      color: 'danger', 
      mensagem: 'É importante buscar apoio profissional. Você não está sozinho(a).',
      acao: 'Falar com psicólogo'
    }
    if (maxScore >= 10) return { 
      nivel: 'Moderado', 
      color: 'warning', 
      mensagem: 'Fique atento aos seus sinais. Cuidar da saúde mental é essencial.',
      acao: 'Dicas de bem-estar'
    }
    return { 
      nivel: 'Baixo', 
      color: 'success', 
      mensagem: 'Você está indo bem! Continue cuidando da sua saúde mental.',
      acao: 'Manter rotina'
    }
  }

  const riskInfo = getRiskInfo(participante.phq9Score, participante.gad7Score)

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; icon: string; text: string } } = {
      pendente: { bg: 'secondary', icon: 'iconoir:clock', text: 'Em breve' },
      disponivel: { bg: 'warning', icon: 'iconoir:play', text: 'Disponível' },
      finalizado: { bg: 'success', icon: 'iconoir:check', text: 'Finalizado' },
      bloqueado: { bg: 'dark', icon: 'iconoir:lock', text: 'Bloqueado' },
    }
    const config = badges[status] || badges.pendente
    return (
      <Badge bg={config.bg} className="d-flex align-items-center gap-1 w-fit-content">
        <IconifyIcon icon={config.icon} />
        {config.text}
      </Badge>
    )
  }

  const handleStartQuestionario = (id: number, status: string) => {
    if (status === 'bloqueado') {
      alert('Complete os questionários anteriores para desbloquear este.')
      return
    }
    router.push(`/participante/questionario/${id}`)
  }

  return (
    <>
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h4 className="mb-2">Olá, {participante.nome.split(' ')[0]}! 👋</h4>
                  <p className="mb-0 opacity-75">
                    Bem-vindo(a) ao Programa de Saúde Mental da {empresa.nomeCurto}. 
                    Acompanhe seus questionários e resultados aqui.
                  </p>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <small className="d-block opacity-75">Última avaliação</small>
                  <strong>{new Date(participante.ultimaAvaliacao).toLocaleDateString('pt-BR')}</strong>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alert for High Risk */}
      {participante.alertasPendentes > 0 && (
        <Row className="mb-4">
          <Col>
            <Alert variant={riskInfo.color} className="d-flex align-items-center">
              <IconifyIcon icon="iconoir:warning-triangle" className="fs-4 me-3" />
              <div className="flex-grow-1">
                <h6 className="alert-heading mb-1">
                  Nível de Risco {riskInfo.nivel} Detectado
                </h6>
                <p className="mb-0 small">{riskInfo.mensagem}</p>
              </div>
              <Link href="/participante/contatos">
                <Button variant={`outline-${riskInfo.color}`} size="sm">
                  <IconifyIcon icon="iconoir:phone" className="me-1" />
                  {riskInfo.acao}
                </Button>
              </Link>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-warning bg-opacity-10 border-warning h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:clipboard" style={{ fontSize: '32px' }} className="text-warning" />
              </div>
              <div>
                <h3 className="mb-0">{stats.disponiveis}</h3>
                <p className="text-muted mb-0 small">Disponíveis</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success bg-opacity-10 border-success h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:check-circle" style={{ fontSize: '32px' }} className="text-success" />
              </div>
              <div>
                <h3 className="mb-0">{stats.finalizados}</h3>
                <p className="text-muted mb-0 small">Finalizados</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info bg-opacity-10 border-info h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:stats-report" style={{ fontSize: '32px' }} className="text-info" />
              </div>
              <div>
                <h3 className="mb-0">{participante.phq9Score}</h3>
                <p className="text-muted mb-0 small">PHQ-9</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-primary bg-opacity-10 border-primary h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:stats-up-square" style={{ fontSize: '32px' }} className="text-primary" />
              </div>
              <div>
                <h3 className="mb-0">{participante.gad7Score}</h3>
                <p className="text-muted mb-0 small">GAD-7</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Questionnaires List */}
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Meus Questionários</h5>
              <Badge bg="primary">{stats.progressoGeral.toFixed(0)}% Completo</Badge>
            </Card.Header>
            <Card.Body>
              {questionarios.map((q) => (
                <Card key={q.id} className={`mb-3 border-0 shadow-sm ${q.status === 'bloqueado' ? 'opacity-75' : ''}`}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <div className="d-flex align-items-center mb-2">
                          {getStatusBadge(q.status)}
                        </div>
                        <h6 className="mb-1">{q.codigo}</h6>
                        <p className="text-muted small mb-0">{q.descricao}</p>
                        <small className="text-muted">
                          <IconifyIcon icon="iconoir:clock" className="me-1" />
                          {q.tempoEstimadoMinutos} minutos
                        </small>
                      </Col>
                      <Col md={3}>
                        {q.status === 'finalizado' && q.score !== undefined ? (
                          <div className="text-center">
                            <h4 className={`mb-0 text-${q.score >= 15 ? 'danger' : q.score >= 10 ? 'warning' : 'success'}`}>
                              {q.score}
                            </h4>
                            <small className="text-muted">Pontuação</small>
                          </div>
                        ) : (
                          <div className="text-center">
                            <small className="text-muted">{q.numeroQuestoes} questões</small>
                            {q.progresso > 0 && (
                              <ProgressBar 
                                now={q.progresso} 
                                variant="primary"
                                style={{ height: '6px' }}
                                className="mt-1"
                              />
                            )}
                          </div>
                        )}
                      </Col>
                      <Col md={4} className="text-end">
                        {q.status === 'disponivel' && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="w-100"
                            onClick={() => handleStartQuestionario(q.id, q.status)}
                          >
                            <IconifyIcon icon="iconoir:play" className="me-1" />
                            Iniciar
                          </Button>
                        )}
                        {q.status === 'finalizado' && (
                          <Link href={`/participante/relatorio/${q.id}`}>
                            <Button variant="outline-success" size="sm" className="w-100">
                              <IconifyIcon icon="iconoir:page" className="me-1" />
                              Ver Resultado
                            </Button>
                          </Link>
                        )}
                        {q.status === 'pendente' && (
                          <Button variant="secondary" size="sm" className="w-100" disabled>
                            <IconifyIcon icon="iconoir:clock" className="me-1" />
                            Disponível em breve
                          </Button>
                        )}
                        {q.status === 'bloqueado' && (
                          <Button variant="dark" size="sm" className="w-100" disabled>
                            <IconifyIcon icon="iconoir:lock" className="me-1" />
                            Bloqueado
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Ações Rápidas</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <Link href="/participante/prontuario" className="text-decoration-none">
                    <div className="d-flex align-items-center py-2">
                      <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                        <IconifyIcon icon="iconoir:page" className="text-info" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">Meu Prontuário</h6>
                        <small className="text-muted">Histórico completo</small>
                      </div>
                      <IconifyIcon icon="iconoir:nav-arrow-right" className="text-muted" />
                    </div>
                  </Link>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <Link href="/participante/contatos" className="text-decoration-none">
                    <div className="d-flex align-items-center py-2">
                      <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                        <IconifyIcon icon="iconoir:phone" className="text-success" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">Canal de Apoio</h6>
                        <small className="text-muted">Fale com um profissional</small>
                      </div>
                      <IconifyIcon icon="iconoir:nav-arrow-right" className="text-muted" />
                    </div>
                  </Link>
                </ListGroup.Item>
                
                <ListGroup.Item className="px-0">
                  <Link href="/participante/boas-vindas" className="text-decoration-none">
                    <div className="d-flex align-items-center py-2">
                      <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                        <IconifyIcon icon="iconoir:info-circle" className="text-warning" />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0">Sobre o Programa</h6>
                        <small className="text-muted">Informações importantes</small>
                      </div>
                      <IconifyIcon icon="iconoir:nav-arrow-right" className="text-muted" />
                    </div>
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Progress Overview */}
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Progresso Geral</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" strokeWidth="10" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#0d6efd" 
                      strokeWidth="10"
                      strokeDasharray={`${stats.progressoGeral * 2.83} ${100 * 2.83}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <h3 className="mb-0">{stats.progressoGeral.toFixed(0)}%</h3>
                  </div>
                </div>
              </div>
              <p className="text-center text-muted small mb-0">
                {stats.finalizados} de {stats.total} questionários finalizados
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
