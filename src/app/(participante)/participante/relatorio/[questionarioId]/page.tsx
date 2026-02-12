'use client'

import { useState, useMemo } from 'react'
import { Card, Button, Badge, Row, Col, ProgressBar, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { QUESTIONARIOS_DEMO, PARTICIPANTES_DEMO } from '@/assets/data/demo-data'

export default function RelatorioQuestionario() {
  const params = useParams()
  const questionarioId = parseInt(params.questionarioId as string)
  
  const questionario = useMemo(() => {
    return QUESTIONARIOS_DEMO.find(q => q.id === questionarioId)
  }, [questionarioId])

  // Get current participant (José Antônio)
  const participante = PARTICIPANTES_DEMO[0]

  if (!questionario) {
    return (
      <>
        <PageTitle title="Relatório não encontrado" subName="Participante" />
        <Card>
          <Card.Body className="text-center py-5">
            <IconifyIcon icon="iconoir:page-not-found" style={{ fontSize: '64px' }} className="text-muted mb-3" />
            <h4>Questionário não encontrado</h4>
            <Link href="/participante">
              <Button variant="primary" className="mt-3">Voltar ao Dashboard</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  // Get current score
  const scoreAtual = questionario.id === 1 ? participante.phq9Score : 
                    questionario.id === 2 ? participante.gad7Score : 8

  // Determine risk level
  const faixaRisco = questionario.faixasRisco.find(f => scoreAtual >= f.min && scoreAtual <= f.max)
  const risco = faixaRisco || { risco: 'baixo', descricao: 'Não avaliado' }

  // Mock responses
  const respostas = [
    { pergunta: 'Pouco interesse ou prazer em fazer as coisas', resposta: 'Mais da metade dos dias', pontos: 2 },
    { pergunta: 'Sentir-se para baixo, deprimido ou sem perspectiva', resposta: 'Alguns dias', pontos: 1 },
    { pergunta: 'Dificuldade para dormir ou dormir demais', resposta: 'Quase todos os dias', pontos: 3 },
    { pergunta: 'Sentir-se cansado ou com pouca energia', resposta: 'Mais da metade dos dias', pontos: 2 },
    { pergunta: 'Falta de apetite ou comer demais', resposta: 'Alguns dias', pontos: 1 },
    { pergunta: 'Sentir-se mal consigo mesmo', resposta: 'Alguns dias', pontos: 1 },
    { pergunta: 'Dificuldade para se concentrar', resposta: 'Mais da metade dos dias', pontos: 2 },
    { pergunta: 'Movimentos lentos ou agitação', resposta: 'Nenhuma vez', pontos: 0 },
    { pergunta: 'Pensamentos de se ferir', resposta: 'Nenhuma vez', pontos: 0 },
  ]

  return (
    <>
      <PageTitle title={`Resultado - ${questionario.codigo}`} subName="Participante" />

      {/* Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-2">{questionario.nome}</h4>
              <p className="text-muted mb-0">{questionario.descricao}</p>
              <small className="text-muted">
                Respondido em: {new Date(participante.ultimaAvaliacao).toLocaleDateString('pt-BR')}
              </small>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link href="/participante">
                <Button variant="outline-secondary">Voltar ao Dashboard</Button>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Score Card */}
      <Row className="mb-4">
        <Col lg={4}>
          <Card className={`border-${risco.risco === 'alto' ? 'danger' : risco.risco === 'medio' ? 'warning' : 'success'} h-100`}>
            <Card.Body className="text-center">
              <h6 className="text-muted mb-3">Sua Pontuação</h6>
              <div className="position-relative d-inline-block mb-3">
                <svg width="150" height="150" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={risco.risco === 'alto' ? '#DC3545' : risco.risco === 'medio' ? '#FFC107' : '#28A745'}
                    strokeWidth="8"
                    strokeDasharray={`${(scoreAtual / questionario.escoreMaximo) * 283} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <h2 className="mb-0">{scoreAtual}</h2>
                  <small className="text-muted">/ {questionario.escoreMaximo}</small>
                </div>
              </div>
              <h5 className={`text-${risco.risco === 'alto' ? 'danger' : risco.risco === 'medio' ? 'warning' : 'success'}`}>
                Risco {risco.risco === 'alto' ? 'Alto' : risco.risco === 'medio' ? 'Médio' : 'Baixo'}
              </h5>
              <p className="small text-muted mb-0">{risco.descricao}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Faixas de Pontuação</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                {questionario.faixasRisco.map((faixa, index) => (
                  <Col md={6} key={index} className="mb-3">
                    <Card className={`border-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}>
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Badge bg={faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}>
                            {faixa.min}-{faixa.max} pts
                          </Badge>
                          <small className={`fw-bold text-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}>
                            {faixa.risco === 'alto' ? 'Alto' : faixa.risco === 'medio' ? 'Médio' : 'Baixo'}
                          </small>
                        </div>
                        <small className="text-muted">{faixa.descricao}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recommendations */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h6 className="mb-0">
            <IconifyIcon icon="iconoir:info-circle" className="me-2" />
            Recomendações
          </h6>
        </Card.Header>
        <Card.Body>
          {risco.risco === 'alto' ? (
            <div className="text-center py-4">
              <IconifyIcon icon="iconoir:warning-triangle" className="text-danger fs-1 mb-3" />
              <h5 className="text-danger">Atenção Especial Necessária</h5>
              <p className="text-muted">
                Sua pontuação indica que você pode estar passando por um momento difícil. 
                Recomendamos fortemente que converse com um profissional de saúde mental.
              </p>
              <Link href="/participante/contatos">
                <Button variant="danger">
                  <IconifyIcon icon="iconoir:phone" className="me-2" />
                  Falar com Profissional
                </Button>
              </Link>
            </div>
          ) : risco.risco === 'medio' ? (
            <div className="text-center py-4">
              <IconifyIcon icon="iconoir:heart" className="text-warning fs-1 mb-3" />
              <h5 className="text-warning">Cuide de Si Mesmo</h5>
              <p className="text-muted">
                Fique atento aos seus sinais. Pratique atividades que tragam bem-estar e, 
                se necessário, procure apoio profissional.
              </p>
              <Link href="/participante/contatos">
                <Button variant="warning">
                  <IconifyIcon icon="iconoir:phone" className="me-2" />
                  Canal de Apoio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <IconifyIcon icon="iconoir:check-circle" className="text-success fs-1 mb-3" />
              <h5 className="text-success">Continue Assim!</h5>
              <p className="text-muted">
                Você está indo bem! Continue cuidando da sua saúde mental 
                e mantendo hábitos saudáveis.
              </p>
              <Link href="/participante">
                <Button variant="success">
                  <IconifyIcon icon="iconoir:home" className="me-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Detailed Responses */}
      <Card>
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Detalhamento das Respostas</h6>
          <Badge bg="secondary">{respostas.length} questões</Badge>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Pergunta</th>
                  <th>Sua Resposta</th>
                  <th className="text-center">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {respostas.map((r, index) => (
                  <tr key={index}>
                    <td className="text-muted">{index + 1}</td>
                    <td>{r.pergunta}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        {r.resposta}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={r.pontos >= 2 ? 'warning' : r.pontos >= 1 ? 'info' : 'success'}>
                        {r.pontos}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
