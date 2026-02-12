'use client'

import { useState, useMemo } from 'react'
import { Card, Button, ProgressBar, Badge, Form, Row, Col, Alert } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { QUESTIONARIOS_DEMO } from '@/assets/data/demo-data'
import { useNotificationContext } from '@/context/useNotificationContext'

interface Resposta {
  perguntaId: number
  valor: number
}

export default function QuestionarioPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const questionarioId = parseInt(params.id as string)
  
  const questionario = useMemo(() => {
    return QUESTIONARIOS_DEMO.find(q => q.id === questionarioId)
  }, [questionarioId])

  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState(0)

  if (!questionario) {
    return (
      <>
        <PageTitle title="Questionário não encontrado" subName="Participante" />
        <Card>
          <Card.Body className="text-center py-5">
            <IconifyIcon icon="iconoir:clipboard-xmark" style={{ fontSize: '64px' }} className="text-muted mb-3" />
            <h4>Questionário não encontrado</h4>
            <Link href="/participante">
              <Button variant="primary" className="mt-3">Voltar</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  // Demo questions
  const perguntas = [
    { id: 1, texto: 'Nos últimos 2 meses, com que frequência você se sentiu sem interesse ou prazer em fazer as coisas?' },
    { id: 2, texto: 'Nos últimos 2 meses, com que frequência você se sentiu para baixo, deprimido(a) ou sem perspectiva?' },
    { id: 3, texto: 'Nos últimos 2 meses, com que frequência você teve dificuldade para pegar no sono ou permanecer dormindo?' },
    { id: 4, texto: 'Nos últimos 2 meses, com que frequência você se sentiu cansado(a) ou com pouca energia?' },
    { id: 5, texto: 'Nos últimos 2 meses, com que frequência você teve falta de apetite ou comeu demais?' },
  ]

  const opcoes = [
    { valor: 0, label: 'Nenhuma vez', descricao: 'Nos últimos 2 meses' },
    { valor: 1, label: 'Alguns dias', descricao: 'Nos últimos 2 meses' },
    { valor: 2, label: 'Mais da metade dos dias', descricao: 'Nos últimos 2 meses' },
    { valor: 3, label: 'Quase todos os dias', descricao: 'Nos últimos 2 meses' },
  ]

  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100

  const handleResposta = (valor: number) => {
    const novasRespostas = [...respostas]
    const index = novasRespostas.findIndex(r => r.perguntaId === perguntas[perguntaAtual].id)
    
    if (index >= 0) {
      novasRespostas[index].valor = valor
    } else {
      novasRespostas.push({ perguntaId: perguntas[perguntaAtual].id, valor })
    }
    
    setRespostas(novasRespostas)
  }

  const handleProxima = () => {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      // Finalizar
      const scoreTotal = respostas.reduce((acc, r) => acc + r.valor, 0)
      showNotification({ 
        message: `Questionário finalizado! Score: ${scoreTotal}`, 
        variant: 'success' 
      })
      router.push(`/participante/relatorio/${questionarioId}`)
    }
  }

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const respostaAtual = respostas.find(r => r.perguntaId === perguntas[perguntaAtual].id)?.valor

  return (
    <>
      <PageTitle title={questionario.codigo} subName="Questionário" />

      {/* Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-1">{questionario.nome}</h5>
              <p className="text-muted small mb-0">{questionario.descricao}</p>
            </Col>
            <Col xs="auto">
              <Badge bg="primary">
                {perguntaAtual + 1} de {perguntas.length}
              </Badge>
            </Col>
          </Row>
          <ProgressBar now={progresso} variant="primary" className="mt-3" style={{ height: '8px' }} />
        </Card.Body>
      </Card>

      {/* Privacy Notice */}
      <Alert variant="info" className="mb-4">
        <IconifyIcon icon="iconoir:lock" className="me-2" />
        <strong>Suas respostas são confidenciais.</strong> Os dados são criptografados e apenas profissionais 
        de saúde mental autorizados têm acesso, sempre visando o seu bem-estar.
      </Alert>

      {/* Question */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <h5 className="mb-4">
            <Badge bg="primary" className="me-2">{perguntaAtual + 1}</Badge>
            {perguntas[perguntaAtual].texto}
          </h5>

          <div className="d-flex flex-column gap-3">
            {opcoes.map((opcao) => (
              <Button
                key={opcao.valor}
                variant={respostaAtual === opcao.valor ? 'primary' : 'outline-primary'}
                className="text-start p-3"
                onClick={() => handleResposta(opcao.valor)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{opcao.label}</strong>
                    <small className="d-block text-muted">{opcao.descricao}</small>
                  </div>
                  {respostaAtual === opcao.valor && (
                    <IconifyIcon icon="iconoir:check" className="fs-4" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Navigation */}
      <div className="d-flex justify-content-between">
        <Button 
          variant="outline-secondary" 
          onClick={handleAnterior}
          disabled={perguntaAtual === 0}
        >
          <IconifyIcon icon="iconoir:nav-arrow-left" className="me-1" />
          Anterior
        </Button>

        <Button 
          variant="primary" 
          onClick={handleProxima}
          disabled={respostaAtual === undefined}
        >
          {perguntaAtual < perguntas.length - 1 ? (
            <>
              Próxima
              <IconifyIcon icon="iconoir:nav-arrow-right" className="ms-1" />
            </>
          ) : (
            <>
              Finalizar
              <IconifyIcon icon="iconoir:check" className="ms-1" />
            </>
          )}
        </Button>
      </div>
    </>
  )
}
