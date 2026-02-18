'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

type AlternativaForm = {
  id?: number
  alternativa: string
  pontuacao: number
  tipo: string
  comentario: string
}

export default function EditarPerguntaPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const {
    perguntas,
    alternativas,
    updatePergunta,
    deletePergunta,
    addAlternativa,
    updateAlternativa,
    deleteAlternativa,
  } = useDemo()

  const perguntaId = Number(params.id)

  const pergunta = useMemo(() => perguntas.find((p: any) => p.id === perguntaId), [perguntas, perguntaId])

  const alternativasPergunta = useMemo(
    () => alternativas.filter((a: any) => a.id_pergunta === perguntaId),
    [alternativas, perguntaId]
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
  const [alternativasForm, setAlternativasForm] = useState<AlternativaForm[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!pergunta) return

    setNome(pergunta.nome || '')
    setNomeCurto(pergunta.nome_curto || '')
    setExplicacao(pergunta.explicacao || '')
    setTipo((pergunta.tipo || 'me') as 'me' | 'sn' | 'dissertativa')
    setEscolhaHipotese((pergunta.escolha_hipotese || '1') as '1' | 'n')
    setSPontuacao(Number(pergunta.s_pontuacao) || 0)
    setSTipo(pergunta.s_tipo || 'positivo')
    setSComentario(pergunta.s_comentario || '')
    setNPontuacao(Number(pergunta.n_pontuacao) || 0)
    setNTipo(pergunta.n_tipo || 'negativo')
    setNComentario(pergunta.n_comentario || '')
    setAlternativasForm(
      alternativasPergunta.map((alt: any) => ({
        id: alt.id,
        alternativa: alt.alternativa || '',
        pontuacao: Number(alt.pontuacao) || 0,
        tipo: alt.tipo || 'neutro',
        comentario: alt.comentario || '',
      }))
    )
  }, [pergunta, alternativasPergunta])

  if (!pergunta) {
    return (
      <>
        <PageTitle title='Pergunta não encontrada' subName='Administração' />
        <Card>
          <Card.Body className='text-center py-5'>
            <p className='text-muted'>A pergunta solicitada não existe.</p>
            <Link href='/adm/lista-questionarios'>
              <Button>Voltar</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  const handleAddAlternativa = () => {
    setAlternativasForm((prev) => [...prev, { alternativa: '', pontuacao: 0, tipo: 'neutro', comentario: '' }])
  }

  const handleRemoveAlternativa = (index: number) => {
    setAlternativasForm((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdateAlternativa = (index: number, field: keyof AlternativaForm, value: string) => {
    setAlternativasForm((prev) => {
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

    updatePergunta(perguntaId, {
      nome: nome.trim(),
      nome_curto: nomeCurto.trim() || nome.trim().slice(0, 40),
      explicacao: explicacao.trim() || null,
      tipo,
      escolha_hipotese: tipo === 'me' ? escolhaHipotese : null,
      s_pontuacao: tipo === 'sn' ? sPontuacao : null,
      s_tipo: tipo === 'sn' ? sTipo : null,
      s_comentario: tipo === 'sn' ? sComentario : null,
      n_pontuacao: tipo === 'sn' ? nPontuacao : null,
      n_tipo: tipo === 'sn' ? nTipo : null,
      n_comentario: tipo === 'sn' ? nComentario : null,
    })

    const atuais = alternativasPergunta.map((alt: any) => alt.id)
    const daTela = alternativasForm.filter((alt) => alt.id).map((alt) => alt.id as number)
    const paraExcluir = atuais.filter((id: number) => !daTela.includes(id))

    paraExcluir.forEach((id) => deleteAlternativa(id))

    alternativasForm
      .filter((alt) => alt.alternativa.trim())
      .forEach((alt) => {
        if (alt.id) {
          updateAlternativa(alt.id, {
            alternativa: alt.alternativa.trim(),
            pontuacao: alt.pontuacao,
            tipo: alt.tipo,
            comentario: alt.comentario.trim() || null,
          })
          return
        }

        addAlternativa({
          id_pergunta: perguntaId,
          id_questionario: pergunta.id_questionario,
          alternativa: alt.alternativa.trim(),
          pontuacao: alt.pontuacao,
          tipo: alt.tipo,
          comentario: alt.comentario.trim() || null,
        })
      })

    showNotification({ message: 'Pergunta atualizada com sucesso.', variant: 'success' })
    router.push(`/adm/visualizar-questionario/${pergunta.id_questionario}`)
  }

  const handleExcluir = () => {
    deletePergunta(perguntaId)
    showNotification({ message: 'Pergunta excluída com sucesso.', variant: 'success' })
    setShowDeleteModal(false)
    router.push(`/adm/visualizar-questionario/${pergunta.id_questionario}`)
  }

  return (
    <>
      <PageTitle title='Editar Pergunta' subName='Administração' />

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
                  <Form.Control as='textarea' rows={3} value={nome} onChange={(e) => setNome(e.target.value)} required />
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
                <Form.Group>
                  <Form.Label>Explicação</Form.Label>
                  <Form.Control as='textarea' rows={2} value={explicacao} onChange={(e) => setExplicacao(e.target.value)} />
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

                  {alternativasForm.map((alternativa, index) => (
                    <Row className='align-items-end mb-3' key={`${alternativa.id || 'new'}-${index}`}>
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
                        <Button variant='outline-danger' onClick={() => handleRemoveAlternativa(index)}>
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
            <Card>
              <Card.Header className='bg-light'>
                <h5 className='mb-0'>Ações</h5>
              </Card.Header>
              <Card.Body className='d-grid gap-2'>
                <Button type='submit' variant='primary'>
                  <IconifyIcon icon='iconoir:check' className='me-1' />
                  Salvar
                </Button>
                <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>
                  <IconifyIcon icon='iconoir:trash' className='me-1' />
                  Excluir Pergunta
                </Button>
                <Link href={`/adm/visualizar-questionario/${pergunta.id_questionario}`}>
                  <Button variant='outline-secondary' className='w-100'>
                    Cancelar
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Excluir pergunta</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja realmente excluir esta pergunta?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleExcluir}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
