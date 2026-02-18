'use client'

import { useMemo, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

type AlternativaForm = {
  alternativa: string
  pontuacao: number
  tipo: string
  comentario: string
}

export default function NovaPerguntaPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { questionarios, perguntas, addPergunta, addAlternativa } = useDemo()

  const questionarioId = Number(params.questionarioId)

  const questionario = useMemo(
    () => questionarios.find((q: any) => q.id === questionarioId),
    [questionarios, questionarioId]
  )

  const [nome, setNome] = useState('')
  const [nomeCurto, setNomeCurto] = useState('')
  const [explicacao, setExplicacao] = useState('')
  const [tipo, setTipo] = useState<'me' | 'sn' | 'dissertativa'>('me')
  const [escolhaHipotese, setEscolhaHipotese] = useState<'1' | 'n'>('1')
  const [sPontuacao, setSPontuacao] = useState(1)
  const [sTipo, setSTipo] = useState('positivo')
  const [sComentario, setSComentario] = useState('')
  const [nPontuacao, setNPontuacao] = useState(0)
  const [nTipo, setNTipo] = useState('negativo')
  const [nComentario, setNComentario] = useState('')
  const [alternativas, setAlternativas] = useState<AlternativaForm[]>([
    { alternativa: '', pontuacao: 0, tipo: 'neutro', comentario: '' },
    { alternativa: '', pontuacao: 1, tipo: 'positivo', comentario: '' },
  ])

  if (!questionario) {
    return (
      <>
        <PageTitle title='Questionário não encontrado' subName='Administração' />
        <Card>
          <Card.Body className='text-center py-5'>
            <p className='text-muted'>Não foi possível carregar o questionário.</p>
            <Link href='/adm/lista-questionarios'>
              <Button>Voltar</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  const handleAddAlternativa = () => {
    setAlternativas((prev) => [...prev, { alternativa: '', pontuacao: 0, tipo: 'neutro', comentario: '' }])
  }

  const handleRemoveAlternativa = (index: number) => {
    setAlternativas((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateAlternativa = (index: number, field: keyof AlternativaForm, value: string) => {
    setAlternativas((prev) => {
      const updated = [...prev]
      if (field === 'pontuacao') {
        updated[index] = { ...updated[index], pontuacao: Number(value) || 0 }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const handleSalvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!nome.trim()) {
      showNotification({ message: 'Informe o texto da pergunta.', variant: 'warning' })
      return
    }

    if (tipo === 'me' && alternativas.filter((alt) => alt.alternativa.trim()).length < 2) {
      showNotification({
        message: 'Pergunta de múltipla escolha precisa de ao menos 2 alternativas.',
        variant: 'warning',
      })
      return
    }

    const nextPerguntaId = Math.max(...perguntas.map((p: any) => p.id), 0) + 1
    const proximaPosicao =
      Math.max(
        ...perguntas
          .filter((p: any) => p.id_questionario === questionarioId)
          .map((p: any) => Number(p.pos) || 0),
        0
      ) + 1

    addPergunta({
      id_questionario: questionarioId,
      pos: proximaPosicao,
      nome: nome.trim(),
      tipo,
      s_pontuacao: tipo === 'sn' ? sPontuacao : null,
      s_tipo: tipo === 'sn' ? sTipo : null,
      s_comentario: tipo === 'sn' ? sComentario : null,
      n_pontuacao: tipo === 'sn' ? nPontuacao : null,
      n_tipo: tipo === 'sn' ? nTipo : null,
      n_comentario: tipo === 'sn' ? nComentario : null,
      tipo_dependente: null,
      id_dependente: null,
      escolha_hipotese: tipo === 'me' ? escolhaHipotese : null,
      flag: null,
      flag_ansiedade: null,
      id_clonagem: null,
      grupo_nome: null,
      grupo_pos: null,
      dimensao_nome: null,
      dimensao_pos: null,
      nome_curto: nomeCurto.trim() || nome.trim().slice(0, 40),
      explicacao: explicacao.trim() || null,
    })

    if (tipo === 'me') {
      alternativas
        .filter((alt) => alt.alternativa.trim())
        .forEach((alt) => {
          addAlternativa({
            id_pergunta: nextPerguntaId,
            id_questionario: questionarioId,
            alternativa: alt.alternativa.trim(),
            pontuacao: alt.pontuacao,
            tipo: alt.tipo,
            comentario: alt.comentario.trim() || null,
          })
        })
    }

    showNotification({ message: 'Pergunta criada com sucesso.', variant: 'success' })
    router.push(`/adm/visualizar-questionario/${questionarioId}`)
  }

  return (
    <>
      <PageTitle title='Nova Pergunta' subName={questionario.nome} />

      <Form onSubmit={handleSalvar}>
        <Row>
          <Col lg={8}>
            <Card className='mb-4'>
              <Card.Header className='bg-light'>
                <h5 className='mb-0'>Dados da Pergunta</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className='mb-3'>
                  <Form.Label>Pergunta</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Nome Curto</Form.Label>
                      <Form.Control value={nomeCurto} onChange={(e) => setNomeCurto(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value as 'me' | 'sn' | 'dissertativa')}>
                        <option value='me'>Múltipla escolha</option>
                        <option value='sn'>Sim/Não</option>
                        <option value='dissertativa'>Dissertativa</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className='mb-0'>
                  <Form.Label>Explicação</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={2}
                    value={explicacao}
                    onChange={(e) => setExplicacao(e.target.value)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {tipo === 'me' && (
              <Card className='mb-4'>
                <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                  <h5 className='mb-0'>Alternativas</h5>
                  <Button variant='outline-primary' size='sm' onClick={handleAddAlternativa}>
                    <IconifyIcon icon='iconoir:plus' className='me-1' />
                    Adicionar
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Form.Group className='mb-3'>
                    <Form.Label>Escolha da Hipótese</Form.Label>
                    <Form.Select value={escolhaHipotese} onChange={(e) => setEscolhaHipotese(e.target.value as '1' | 'n')}>
                      <option value='1'>Escolha única</option>
                      <option value='n'>Múltipla seleção</option>
                    </Form.Select>
                  </Form.Group>

                  {alternativas.map((alternativa, index) => (
                    <Row className='align-items-end mb-3' key={index}>
                      <Col md={5}>
                        <Form.Group>
                          <Form.Label>Alternativa</Form.Label>
                          <Form.Control
                            value={alternativa.alternativa}
                            onChange={(e) => handleUpdateAlternativa(index, 'alternativa', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Pontos</Form.Label>
                          <Form.Control
                            type='number'
                            value={alternativa.pontuacao}
                            onChange={(e) => handleUpdateAlternativa(index, 'pontuacao', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Tipo</Form.Label>
                          <Form.Control
                            value={alternativa.tipo}
                            onChange={(e) => handleUpdateAlternativa(index, 'tipo', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Comentário</Form.Label>
                          <Form.Control
                            value={alternativa.comentario}
                            onChange={(e) => handleUpdateAlternativa(index, 'comentario', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1}>
                        <Button
                          variant='outline-danger'
                          onClick={() => handleRemoveAlternativa(index)}
                          disabled={alternativas.length <= 2}
                        >
                          <IconifyIcon icon='iconoir:trash' />
                        </Button>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            )}

            {tipo === 'sn' && (
              <Card className='mb-4'>
                <Card.Header className='bg-light'>
                  <h5 className='mb-0'>Configuração Sim/Não</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Resposta Sim</h6>
                      <Form.Group className='mb-2'>
                        <Form.Label>Pontuação</Form.Label>
                        <Form.Control type='number' value={sPontuacao} onChange={(e) => setSPontuacao(Number(e.target.value) || 0)} />
                      </Form.Group>
                      <Form.Group className='mb-2'>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control value={sTipo} onChange={(e) => setSTipo(e.target.value)} />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control value={sComentario} onChange={(e) => setSComentario(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <h6>Resposta Não</h6>
                      <Form.Group className='mb-2'>
                        <Form.Label>Pontuação</Form.Label>
                        <Form.Control type='number' value={nPontuacao} onChange={(e) => setNPontuacao(Number(e.target.value) || 0)} />
                      </Form.Group>
                      <Form.Group className='mb-2'>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control value={nTipo} onChange={(e) => setNTipo(e.target.value)} />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control value={nComentario} onChange={(e) => setNComentario(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <Card className='mb-4'>
              <Card.Header className='bg-light'>
                <h5 className='mb-0'>Ações</h5>
              </Card.Header>
              <Card.Body className='d-grid gap-2'>
                <Button type='submit' variant='primary'>
                  <IconifyIcon icon='iconoir:check' className='me-1' />
                  Salvar Pergunta
                </Button>
                <Link href={`/adm/visualizar-questionario/${questionarioId}`}>
                  <Button variant='outline-secondary' className='w-100'>
                    Cancelar
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}
