'use client'

import { useState, useEffect } from 'react'
import { Card, Button, ProgressBar, Badge, Alert, Form } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Pergunta {
  id: number
  nome: string
  nome_site: string
  tipo: 'me' | 'sn' | 'dissertativa'
  grupo: string
  dimensao: string
  alternativas?: { id: number; texto: string; pontuacao: number }[]
}

interface Resposta {
  perguntaId: number
  valor: string | number
}

const perguntasDemo: Pergunta[] = [
  {
    id: 1,
    nome: 'Satisfação Geral',
    nome_site: 'Como você avalia sua satisfação geral com o trabalho?',
    tipo: 'me',
    grupo: 'Satisfação',
    dimensao: 'Ambiente de Trabalho',
    alternativas: [
      { id: 1, texto: 'Muito Insatisfeito', pontuacao: 1 },
      { id: 2, texto: 'Insatisfeito', pontuacao: 2 },
      { id: 3, texto: 'Neutro', pontuacao: 3 },
      { id: 4, texto: 'Satisfeito', pontuacao: 4 },
      { id: 5, texto: 'Muito Satisfeito', pontuacao: 5 },
    ]
  },
  {
    id: 2,
    nome: 'Carga Horária',
    nome_site: 'Você considera sua carga horária de trabalho adequada?',
    tipo: 'sn',
    grupo: 'Condições de Trabalho',
    dimensao: 'Jornada',
  },
  {
    id: 3,
    nome: 'Comentários',
    nome_site: 'Deixe seus comentários ou sugestões:',
    tipo: 'dissertativa',
    grupo: 'Feedback',
    dimensao: 'Geral',
  },
  {
    id: 4,
    nome: 'Relacionamento',
    nome_site: 'Como você avalia o relacionamento com seus colegas?',
    tipo: 'me',
    grupo: 'Relacionamentos',
    dimensao: 'Ambiente de Trabalho',
    alternativas: [
      { id: 1, texto: 'Muito Ruim', pontuacao: 1 },
      { id: 2, texto: 'Ruim', pontuacao: 2 },
      { id: 3, texto: 'Regular', pontuacao: 3 },
      { id: 4, texto: 'Bom', pontuacao: 4 },
      { id: 5, texto: 'Excelente', pontuacao: 5 },
    ]
  },
  {
    id: 5,
    nome: 'Reconhecimento',
    nome_site: 'Você se sente reconhecido pelo seu trabalho?',
    tipo: 'sn',
    grupo: 'Motivação',
    dimensao: 'Clima Organizacional',
  },
]

export default function ResponderQuestionario() {
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  const [dimensaoAtual, setDimensaoAtual] = useState('')

  const totalPerguntas = perguntasDemo.length
  const progresso = Math.round((respostas.length / totalPerguntas) * 100)
  const pergunta = perguntasDemo[perguntaAtual]

  // Agrupar perguntas por dimensão
  const dimensoes = [...new Set(perguntasDemo.map(p => p.dimensao))]
  
  useEffect(() => {
    if (pergunta) {
      setDimensaoAtual(pergunta.dimensao)
    }
  }, [perguntaAtual])

  const handleResposta = (valor: string | number) => {
    const novaResposta: Resposta = {
      perguntaId: pergunta.id,
      valor
    }
    
    setRespostas(prev => {
      const existente = prev.findIndex(r => r.perguntaId === pergunta.id)
      if (existente >= 0) {
        const novo = [...prev]
        novo[existente] = novaResposta
        return novo
      }
      return [...prev, novaResposta]
    })
  }

  const getRespostaAtual = () => {
    const resp = respostas.find(r => r.perguntaId === pergunta.id)
    return resp?.valor || ''
  }

  const handleProxima = () => {
    if (perguntaAtual < totalPerguntas - 1) {
      setPerguntaAtual(prev => prev + 1)
    } else {
      setFinalizado(true)
    }
  }

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(prev => prev - 1)
    }
  }

  const renderPergunta = () => {
    switch (pergunta.tipo) {
      case 'me':
        return (
          <div className="mt-4">
            {pergunta.alternativas?.map((alt) => (
              <Form.Check
                key={alt.id}
                type="radio"
                name={`pergunta-${pergunta.id}`}
                id={`alt-${alt.id}`}
                label={alt.texto}
                checked={getRespostaAtual() === alt.id}
                onChange={() => handleResposta(alt.id)}
                className="mb-3 p-3 border rounded hover-shadow"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        )
      
      case 'sn':
        return (
          <div className="mt-4 d-flex gap-3">
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
        )
      
      case 'dissertativa':
        return (
          <Form.Group className="mt-4">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Digite sua resposta aqui..."
              value={getRespostaAtual()}
              onChange={(e) => handleResposta(e.target.value)}
            />
          </Form.Group>
        )
      
      default:
        return null
    }
  }

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
                <p className="lead text-muted mb-4">
                  Obrigado por participar. Suas respostas foram registradas com sucesso.
                </p>
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
          {/* Barra de Progresso */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">
                  Pergunta {perguntaAtual + 1} de {totalPerguntas}
                </span>
                <Badge bg="primary">{progresso}% Completo</Badge>
              </div>
              <ProgressBar 
                now={progresso} 
                variant="success" 
                style={{ height: '10px' }}
              />
              
              {/* Dimensões */}
              <div className="mt-3 d-flex gap-2 flex-wrap">
                {dimensoes.map((dim) => (
                  <Badge 
                    key={dim}
                    bg={dim === dimensaoAtual ? 'primary' : 'secondary'}
                    className="px-3 py-2"
                  >
                    {dim}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Pergunta Atual */}
          <Card className="shadow">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg="info">{pergunta.grupo}</Badge>
                <span className="text-muted small">{pergunta.dimensao}</span>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <h4 className="mb-1">{pergunta.nome_site}</h4>
              <p className="text-muted small">{pergunta.nome}</p>
              
              {renderPergunta()}

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <Button
                  variant="outline-secondary"
                  onClick={handleAnterior}
                  disabled={perguntaAtual === 0}
                >
                  <IconifyIcon icon="iconoir:navigate-left" className="me-2" />
                  Anterior
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleProxima}
                  disabled={!getRespostaAtual()}
                >
                  {perguntaAtual === totalPerguntas - 1 ? (
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

          {/* Navegação Rápida */}
          <Card className="mt-3 shadow-sm">
            <Card.Body>
              <h6 className="mb-3">Navegação Rápida:</h6>
              <div className="d-flex gap-2 flex-wrap">
                {perguntasDemo.map((p, idx) => {
                  const respondida = respostas.some(r => r.perguntaId === p.id)
                  return (
                    <Button
                      key={p.id}
                      variant={idx === perguntaAtual ? 'primary' : respondida ? 'success' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setPerguntaAtual(idx)}
                      className="position-relative"
                    >
                      {idx + 1}
                      {respondida && (
                        <span 
                          className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                          style={{ width: '8px', height: '8px' }}
                        />
                      )}
                    </Button>
                  )
                })}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
