'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Form, ProgressBar, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useDemo } from '@/context/DemoContext'
import {
  DemoResposta,
  deleteSubmissaoQuestionario,
  getParticipanteKey,
  getSubmissaoByQuestionario,
  normalizeRisco,
  resolveParticipanteFromSession,
  saveSubmissaoQuestionario,
} from '@/utils/demo-participante'

type Pergunta = {
  id: number
  texto: string
}

const perguntasByQuestionario: Record<number, Pergunta[]> = {
  1: [
    { id: 1, texto: 'Pouco interesse ou prazer em fazer as coisas' },
    { id: 2, texto: 'Sentir-se para baixo, deprimido(a) ou sem perspectiva' },
    { id: 3, texto: 'Dificuldade para dormir ou dormir demais' },
    { id: 4, texto: 'Sentir-se cansado(a) ou com pouca energia' },
    { id: 5, texto: 'Falta de apetite ou comer demais' },
    { id: 6, texto: 'Sentir-se mal consigo mesmo(a)' },
    { id: 7, texto: 'Dificuldade para se concentrar' },
    { id: 8, texto: 'Lentidao ou agitacao perceptivel' },
    { id: 9, texto: 'Pensamentos de autolesao' },
  ],
  2: [
    { id: 1, texto: 'Sentir-se nervoso(a), ansioso(a) ou tenso(a)' },
    { id: 2, texto: 'Nao conseguir parar de se preocupar' },
    { id: 3, texto: 'Preocupar-se excessivamente com varias coisas' },
    { id: 4, texto: 'Dificuldade para relaxar' },
    { id: 5, texto: 'Inquietacao ou dificuldade para ficar parado(a)' },
    { id: 6, texto: 'Irritabilidade frequente' },
    { id: 7, texto: 'Medo de que algo ruim aconteca' },
  ],
}

const opcoesPadrao = [
  { valor: 0, label: 'Nenhuma vez' },
  { valor: 1, label: 'Alguns dias' },
  { valor: 2, label: 'Mais da metade dos dias' },
  { valor: 3, label: 'Quase todos os dias' },
]

export default function QuestionarioPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { showNotification } = useNotificationContext()
  const { questionarios, participantes, updateParticipante } = useDemo()

  const questionarioId = Number(params.id || 0)
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

  const perguntas = useMemo(() => {
    const fallback = Array.from({ length: 5 }).map((_, index) => ({ id: index + 1, texto: `Pergunta ${index + 1}` }))
    return perguntasByQuestionario[questionarioId] || fallback
  }, [questionarioId])

  const [respostas, setRespostas] = useState<DemoResposta[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const resetMode = searchParams.get('reset') === '1'

  useEffect(() => {
    if (!participante || !questionarioId) return

    if (resetMode) {
      deleteSubmissaoQuestionario(participanteKey, questionarioId)
      setRespostas([])
      setPerguntaAtual(0)
      return
    }

    const submissaoExistente = getSubmissaoByQuestionario(participanteKey, questionarioId)
    if (!submissaoExistente) return

    setRespostas(submissaoExistente.respostas || [])
    const perguntaPendenteIndex = perguntas.findIndex(
      (pergunta) => !(submissaoExistente.respostas || []).some((resposta) => resposta.perguntaId === pergunta.id)
    )
    setPerguntaAtual(perguntaPendenteIndex >= 0 ? perguntaPendenteIndex : 0)
  }, [participante, participanteKey, questionarioId, perguntas, resetMode])

  if (!questionario || !participante) {
    return (
      <>
        <PageTitle title='Questionario nao encontrado' subName='Participante' />
        <Alert variant='warning'>Nao foi possivel carregar este questionario no modo demo.</Alert>
        <Link href='/participante/questionarios'>
          <Button variant='primary'>Voltar</Button>
        </Link>
      </>
    )
  }

  const progresso = Math.round((respostas.length / perguntas.length) * 100)

  const respostaAtual = respostas.find((item) => item.perguntaId === perguntas[perguntaAtual].id)

  const definirResposta = (valor: number, label: string) => {
    setRespostas((prev) => {
      const next = prev.filter((item) => item.perguntaId !== perguntas[perguntaAtual].id)
      next.push({
        perguntaId: perguntas[perguntaAtual].id,
        pergunta: perguntas[perguntaAtual].texto,
        resposta: label,
        valor,
      })
      return next
    })
  }

  const salvarFinal = () => {
    const score = respostas.reduce((acc, item) => acc + Number(item.valor || 0), 0)
    const submittedAt = new Date().toISOString()

    saveSubmissaoQuestionario({
      participanteKey,
      participanteId: Number((participante as any).id),
      questionarioId,
      score,
      respostas,
      submittedAt,
    })

    const phqAtual = questionarioId === 1 ? score : Number((participante as any).phq9Score || 0)
    const gadAtual = questionarioId === 2 ? score : Number((participante as any).gad7Score || 0)

    updateParticipante(Number((participante as any).id), {
      ...(questionarioId === 1 ? { phq9Score: score } : {}),
      ...(questionarioId === 2 ? { gad7Score: score } : {}),
      riscoSaude: normalizeRisco(phqAtual, gadAtual),
      ultimaAvaliacao: submittedAt.split('T')[0],
    })

    showNotification({ message: `Questionario finalizado. Score ${score}.`, variant: 'success' })
    router.push(`/participante/relatorio/${questionarioId}`)
  }

  return (
    <>
      <PageTitle title={questionario.codigo || 'Questionario'} subName='Participante' />

      <Card className='mb-4'>
        <Card.Body>
          <Row className='align-items-center'>
            <Col>
              <h5 className='mb-1'>{questionario.nome}</h5>
              <small className='text-muted'>{questionario.descricao}</small>
            </Col>
            <Col xs='auto'>
              <Badge bg='primary'>{perguntaAtual + 1} de {perguntas.length}</Badge>
            </Col>
          </Row>
          <ProgressBar now={progresso} className='mt-3' />
        </Card.Body>
      </Card>

      <Alert variant='info'>
        Suas respostas sao confidenciais e usadas somente para acompanhamento no programa.
      </Alert>

      <Card className='mb-4'>
        <Card.Body>
          <h5 className='mb-4'>
            <Badge bg='secondary' className='me-2'>{perguntaAtual + 1}</Badge>
            {perguntas[perguntaAtual].texto}
          </h5>

          <div className='d-flex flex-column gap-2'>
            {opcoesPadrao.map((opcao) => (
              <Form.Check
                key={opcao.valor}
                id={`opcao-${opcao.valor}`}
                type='radio'
                name={`pergunta-${perguntas[perguntaAtual].id}`}
                className='border rounded p-3'
                label={opcao.label}
                checked={Number(respostaAtual?.valor) === opcao.valor}
                onChange={() => definirResposta(opcao.valor, opcao.label)}
              />
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className='d-flex justify-content-between'>
        <Button variant='outline-secondary' onClick={() => setPerguntaAtual((prev) => Math.max(0, prev - 1))} disabled={perguntaAtual === 0}>
          Anterior
        </Button>

        {perguntaAtual < perguntas.length - 1 ? (
          <Button
            variant='primary'
            onClick={() => setPerguntaAtual((prev) => prev + 1)}
            disabled={!respostaAtual}
          >
            Proxima
          </Button>
        ) : (
          <Button variant='success' onClick={salvarFinal} disabled={respostas.length !== perguntas.length}>
            Finalizar
          </Button>
        )}
      </div>
    </>
  )
}
