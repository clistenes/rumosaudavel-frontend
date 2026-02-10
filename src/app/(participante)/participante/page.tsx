'use client'

import { useState } from 'react'
import { Card, Col, Row, Button, Badge, ProgressBar } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Questionario {
  id: number
  nome: string
  descricao: string
  status: 'pendente' | 'em_andamento' | 'finalizado'
  progresso: number
  totalPerguntas: number
  respondidas: number
}

const questionariosDemo: Questionario[] = [
  {
    id: 1,
    nome: 'Avaliação de Saúde Mental',
    descricao: 'Questionário para avaliar o bem-estar psicológico e emocional no ambiente de trabalho.',
    status: 'pendente',
    progresso: 0,
    totalPerguntas: 25,
    respondidas: 0,
  },
  {
    id: 2,
    nome: 'Bem-estar no Trabalho',
    descricao: 'Avaliação das condições físicas e psicológicas do ambiente organizacional.',
    status: 'em_andamento',
    progresso: 40,
    totalPerguntas: 20,
    respondidas: 8,
  },
  {
    id: 3,
    nome: 'Avaliação de Riscos',
    descricao: 'Análise de fatores de risco psicossociais presentes na rotina de trabalho.',
    status: 'finalizado',
    progresso: 100,
    totalPerguntas: 30,
    respondidas: 30,
  },
]

export default function ParticipanteDashboard() {
  const [questionarios] = useState<Questionario[]>(questionariosDemo)

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; icon: string; text: string } } = {
      pendente: { bg: 'warning', icon: 'iconoir:clock', text: 'Pendente' },
      em_andamento: { bg: 'info', icon: 'iconoir:play', text: 'Em Andamento' },
      finalizado: { bg: 'success', icon: 'iconoir:check', text: 'Finalizado' },
    }
    const config = badges[status] || badges.pendente
    return (
      <Badge bg={config.bg} className="d-flex align-items-center gap-1">
        <IconifyIcon icon={config.icon} />
        {config.text}
      </Badge>
    )
  }

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="page-title mb-1">Área do Participante</h4>
              <p className="text-muted mb-0">Bem-vindo à sua área de questionários</p>
            </div>
            <Link href="/participante/boas-vindas">
              <Button variant="outline-primary">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Ver Boas-vindas
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {/* Cards de Resumo */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="bg-warning bg-opacity-10 border-warning h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:clock" style={{ fontSize: '40px' }} className="text-warning" />
              </div>
              <div>
                <h3 className="mb-0">1</h3>
                <p className="text-muted mb-0">Pendente</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-info bg-opacity-10 border-info h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:play" style={{ fontSize: '40px' }} className="text-info" />
              </div>
              <div>
                <h3 className="mb-0">1</h3>
                <p className="text-muted mb-0">Em Andamento</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-success bg-opacity-10 border-success h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <IconifyIcon icon="iconoir:check" style={{ fontSize: '40px' }} className="text-success" />
              </div>
              <div>
                <h3 className="mb-0">1</h3>
                <p className="text-muted mb-0">Finalizado</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de Questionários */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Meus Questionários</h5>
            </Card.Header>
            <Card.Body>
              {questionarios.map((q) => (
                <Card key={q.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <div className="d-flex align-items-center mb-2">
                          {getStatusBadge(q.status)}
                        </div>
                        <h5 className="mb-1">{q.nome}</h5>
                        <p className="text-muted small mb-0">{q.descricao}</p>
                      </Col>
                      <Col md={4}>
                        <div className="mb-2">
                          <small className="text-muted">
                            {q.respondidas} de {q.totalPerguntas} perguntas
                          </small>
                        </div>
                        <ProgressBar 
                          now={q.progresso} 
                          variant={q.status === 'finalizado' ? 'success' : 'primary'}
                          style={{ height: '8px' }}
                        />
                      </Col>
                      <Col md={2} className="text-end">
                        {q.status === 'pendente' && (
                          <Link href={`/participante/questionario/${q.id}`}>
                            <Button variant="primary" size="sm" className="w-100">
                              <IconifyIcon icon="iconoir:play" className="me-1" />
                              Iniciar
                            </Button>
                          </Link>
                        )}
                        {q.status === 'em_andamento' && (
                          <Link href={`/participante/questionario/${q.id}`}>
                            <Button variant="info" size="sm" className="w-100">
                              <IconifyIcon icon="iconoir:play" className="me-1" />
                              Continuar
                            </Button>
                          </Link>
                        )}
                        {q.status === 'finalizado' && (
                          <Button variant="success" size="sm" className="w-100" disabled>
                            <IconifyIcon icon="iconoir:check" className="me-1" />
                            Concluído
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
      </Row>

      {/* Demo Section */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h6 className="mb-3">Funcionalidades de Demonstração:</h6>
              <div className="d-flex gap-2 flex-wrap">
                <Link href="/participante/demo-questionario-dependente">
                  <Button variant="outline-primary" size="sm">
                    <IconifyIcon icon="iconoir:branch" className="me-1" />
                    Demo: Perguntas Dependentes
                  </Button>
                </Link>
                <Link href="/participante/cadastro">
                  <Button variant="outline-secondary" size="sm">
                    <IconifyIcon icon="iconoir:user-plus" className="me-1" />
                    Demo: Cadastro
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
