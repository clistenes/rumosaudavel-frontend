'use client'

import { useState, useEffect } from 'react'
import { Card, Button, ProgressBar, Badge, Form, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Pergunta {
  id: number
  nome_site: string
  tipo: 'me' | 'sn' | 'dissertativa'
  grupo: string
  dependeDe?: number
  mostrarQuando?: 'sim' | 'nao'
}

const perguntasComDependencia: Pergunta[] = [
  {
    id: 1,
    nome_site: 'Você trabalha no setor administrativo?',
    tipo: 'sn',
    grupo: 'Informações Gerais',
  },
  {
    id: 2,
    nome_site: 'Como você avalia a carga de trabalho administrativo?',
    tipo: 'me',
    grupo: 'Avaliação',
    dependeDe: 1,
    mostrarQuando: 'sim',
  },
  {
    id: 3,
    nome_site: 'Você realiza atividades operacionais?',
    tipo: 'sn',
    grupo: 'Informações Gerais',
  },
  {
    id: 4,
    nome_site: 'Como você avalia as condições de segurança operacional?',
    tipo: 'me',
    grupo: 'Avaliação',
    dependeDe: 3,
    mostrarQuando: 'sim',
  },
  {
    id: 5,
    nome_site: 'Você recomendaria esta empresa como bom lugar para trabalhar?',
    tipo: 'sn',
    grupo: 'Feedback',
  },
  {
    id: 6,
    nome_site: 'O que nos motivou a sua recomendação?',
    tipo: 'dissertativa',
    grupo: 'Feedback',
    dependeDe: 5,
    mostrarQuando: 'sim',
  },
]

export default function QuestionarioDependente() {
  const [respostas, setRespostas] = useState<Record<number, string | number>>({})
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  // Filtrar perguntas visíveis baseado nas dependências
  const perguntasVisiveis = perguntasComDependencia.filter((p) => {
    if (!p.dependeDe) return true
    const respostaPai = respostas[p.dependeDe]
    return respostaPai === p.mostrarQuando
  })

  const pergunta = perguntasVisiveis[perguntaAtual]
  const progresso = Math.round((Object.keys(respostas).length / perguntasVisiveis.length) * 100)

  const handleResposta = (valor: string | number) => {
    setRespostas((prev) => ({
      ...prev,
      [pergunta.id]: valor,
    }))
  }

  const handleProxima = () => {
    if (perguntaAtual < perguntasVisiveis.length - 1) {
      setPerguntaAtual((prev) => prev + 1)
    } else {
      setFinalizado(true)
    }
  }

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual((prev) => prev - 1)
    }
  }

  const getRespostaAtual = () => respostas[pergunta?.id] || ''

  if (finalizado) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <IconifyIcon
                  icon="iconoir:check-circle"
                  className="text-success mb-3"
                  style={{ fontSize: '80px' }}
                />
                <h2 className="mb-3">Questionário Finalizado!</h2>
                <p className="text-muted mb-4">
                  Obrigado por participar. Suas respostas foram registradas.
                </p>
                <div className="text-start bg-light p-3 rounded mb-4">
                  <h6>Resumo das Respostas:</h6>
                  <ul className="list-unstyled mb-0">
                    {Object.entries(respostas).map(([id, resp]) => {
                      const pergunta = perguntasComDependencia.find((p) => p.id === parseInt(id))
                      return (
                        <li key={id} className="mb-2">
                          <strong>{pergunta?.nome_site}:</strong>{' '}
                          {resp === 'sim' ? 'Sim' : resp === 'nao' ? 'Não' : resp}
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <Button variant="primary" size="lg">
                  <IconifyIcon icon="iconoir:home" className="me-2" />
                  Voltar ao Início
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Alerta sobre perguntas dependentes */}
          <Alert variant="info" className="mb-3">
            <IconifyIcon icon="iconoir:info-circle" className="me-2" />
            <strong>Demonstração:</strong> Este questionário possui perguntas condicionais 
            que aparecem baseadas em suas respostas anteriores.
          </Alert>

          {/* Barra de Progresso */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">
                  Pergunta {perguntaAtual + 1} de {perguntasVisiveis.length}
                </span>
                <Badge bg="primary">{progresso}% Completo</Badge>
              </div>
              <ProgressBar now={progresso} variant="success" style={{ height: '10px' }} />
              {pergunta?.dependeDe && (
                <Badge bg="warning" text="dark" className="mt-2">
                  <IconifyIcon icon="iconoir:branch" className="me-1" />
                  Pergunta Condicional
                </Badge>
              )}
            </Card.Body>
          </Card>

          {/* Pergunta Atual */}
          <Card className="shadow">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg="info">{pergunta?.grupo}</Badge>
                {pergunta?.tipo === 'sn' && <Badge bg="secondary">Sim/Não</Badge>}
                {pergunta?.tipo === 'me' && <Badge bg="secondary">Múltipla Escolha</Badge>}
                {pergunta?.tipo === 'dissertativa' && <Badge bg="secondary">Dissertativa</Badge>}
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <h4 className="mb-4">{pergunta?.nome_site}</h4>

              {/* Renderização baseada no tipo */}
              {pergunta?.tipo === 'sn' && (
                <div className="d-flex gap-3">
                  <Button
                    variant={getRespostaAtual() === 'sim' ? 'success' : 'outline-success'}
                    size="lg"
                    className="flex-fill py-3"
                    onClick={() => handleResposta('sim')}
                  >
                    <IconifyIcon icon="iconoir:check" className="me-2" />
                    Sim
                  </Button>
                  <Button
                    variant={getRespostaAtual() === 'nao' ? 'danger' : 'outline-danger'}
                    size="lg"
                    className="flex-fill py-3"
                    onClick={() => handleResposta('nao')}
                  >
                    <IconifyIcon icon="iconoir:xmark" className="me-2" />
                    Não
                  </Button>
                </div>
              )}

              {pergunta?.tipo === 'me' && (
                <div className="mt-4">
                  {['Muito Ruim', 'Ruim', 'Regular', 'Bom', 'Muito Bom'].map((opcao, idx) => (
                    <Form.Check
                      key={idx}
                      type="radio"
                      name={`pergunta-${pergunta.id}`}
                      id={`alt-${idx}`}
                      label={opcao}
                      checked={getRespostaAtual() === idx + 1}
                      onChange={() => handleResposta(idx + 1)}
                      className="mb-3 p-3 border rounded"
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              )}

              {pergunta?.tipo === 'dissertativa' && (
                <Form.Group className="mt-4">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Digite sua resposta aqui..."
                    value={getRespostaAtual()}
                    onChange={(e) => handleResposta(e.target.value)}
                  />
                </Form.Group>
              )}

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <Button
                  variant="outline-secondary"
                  onClick={handleAnterior}
                  disabled={perguntaAtual === 0}
                >
                  <IconifyIcon icon="iconoir:navigate-left" className="me-2" />
                  Anterior
                </Button>

                <Button variant="primary" onClick={handleProxima} disabled={!getRespostaAtual()}>
                  {perguntaAtual === perguntasVisiveis.length - 1 ? (
                    <>
                      Finalizar
                      <IconifyIcon icon="iconoir:check" className="ms-2" />
                    </>
                  ) : (
                    <>
                      Próxima
                      <IconifyIcon icon="iconoir:navigate-right" className="ms-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Debug: Mostrar estado */}
          <Card className="mt-3 shadow-sm bg-light">
            <Card.Body>
              <h6 className="text-muted mb-2">Debug - Estado das Respostas:</h6>
              <pre className="small mb-0" style={{ maxHeight: '150px', overflow: 'auto' }}>
                {JSON.stringify(respostas, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
