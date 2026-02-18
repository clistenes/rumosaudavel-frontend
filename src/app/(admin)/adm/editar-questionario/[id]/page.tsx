'use client'

import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

type FaixaRisco = {
  min: number
  max: number
  risco: 'baixo' | 'medio' | 'alto'
  descricao: string
}

export default function EditarQuestionarioPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const {
    questionarios,
    perguntas,
    updateQuestionario,
    deleteQuestionario,
    duplicarQuestionario,
  } = useDemo()

  const questionarioId = Number(params.id)

  const questionario = useMemo(
    () => questionarios.find((q: any) => q.id === questionarioId),
    [questionarios, questionarioId]
  )

  const totalPerguntas = useMemo(
    () => perguntas.filter((p: any) => p.id_questionario === questionarioId).length,
    [perguntas, questionarioId]
  )

  const [codigo, setCodigo] = useState('')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tipo, setTipo] = useState('depressao')
  const [escoreMaximo, setEscoreMaximo] = useState(0)
  const [tempoEstimadoMinutos, setTempoEstimadoMinutos] = useState(5)
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo')
  const [faixasRisco, setFaixasRisco] = useState<FaixaRisco[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!questionario) return
    setCodigo(questionario.codigo || '')
    setNome(questionario.nome || '')
    setDescricao(questionario.descricao || '')
    setTipo(questionario.tipo || 'depressao')
    setEscoreMaximo(questionario.escoreMaximo || 0)
    setTempoEstimadoMinutos(questionario.tempoEstimadoMinutos || 5)
    setStatus((questionario.status || 'ativo') as 'ativo' | 'inativo')
    setFaixasRisco(
      (questionario.faixasRisco || []).map((faixa: any) => ({
        min: Number(faixa.min) || 0,
        max: Number(faixa.max) || 0,
        risco: faixa.risco || 'baixo',
        descricao: faixa.descricao || '',
      }))
    )
  }, [questionario])

  if (!questionario) {
    return (
      <>
        <PageTitle title='Questionário não encontrado' subName='Administração' />
        <Card>
          <Card.Body className='text-center py-5'>
            <p className='text-muted mb-3'>O questionário solicitado não existe.</p>
            <Link href='/adm/lista-questionarios'>
              <Button variant='primary'>Voltar para lista</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  const handleAddFaixa = () => {
    const ultimoMax = faixasRisco[faixasRisco.length - 1]?.max || 0
    setFaixasRisco((prev) => [
      ...prev,
      { min: ultimoMax + 1, max: ultimoMax + 5, risco: 'baixo', descricao: '' },
    ])
  }

  const handleUpdateFaixa = (index: number, field: keyof FaixaRisco, value: string) => {
    setFaixasRisco((prev) => {
      const updated = [...prev]
      if (field === 'min' || field === 'max') {
        updated[index] = { ...updated[index], [field]: Number(value) || 0 }
      } else if (field === 'risco') {
        updated[index] = { ...updated[index], risco: value as FaixaRisco['risco'] }
      } else {
        updated[index] = { ...updated[index], descricao: value }
      }
      return updated
    })
  }

  const handleRemoveFaixa = (index: number) => {
    setFaixasRisco((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSalvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!codigo.trim() || !nome.trim()) {
      showNotification({
        message: 'Preencha código e nome para salvar.',
        variant: 'warning',
      })
      return
    }

    updateQuestionario(questionarioId, {
      codigo: codigo.trim(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      tipo,
      escoreMaximo,
      tempoEstimadoMinutos,
      status,
      faixasRisco,
      numeroQuestoes: totalPerguntas,
    })

    showNotification({
      message: `Questionário "${nome}" atualizado com sucesso.`,
      variant: 'success',
    })
  }

  const handleDuplicar = () => {
    duplicarQuestionario(questionarioId)
    showNotification({
      message: 'Questionário duplicado com sucesso.',
      variant: 'success',
    })
    router.push('/adm/lista-questionarios')
  }

  const handleExcluir = () => {
    deleteQuestionario(questionarioId)
    showNotification({
      message: 'Questionário excluído com sucesso.',
      variant: 'success',
    })
    setShowDeleteModal(false)
    router.push('/adm/lista-questionarios')
  }

  return (
    <>
      <PageTitle title='Editar Questionário' subName='Administração' />

      <Form onSubmit={handleSalvar}>
        <Row>
          <Col lg={8}>
            <Card className='mb-4'>
              <Card.Header className='bg-light'>
                <h5 className='mb-0'>Dados do Questionário</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Código</Form.Label>
                      <Form.Control value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className='mb-3'>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value='depressao'>Depressão</option>
                        <option value='ansiedade'>Ansiedade</option>
                        <option value='estresse'>Estresse</option>
                        <option value='burnout'>Burnout</option>
                        <option value='insonia'>Insônia</option>
                        <option value='outro'>Outro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Escore Máximo</Form.Label>
                      <Form.Control
                        type='number'
                        min={1}
                        value={escoreMaximo}
                        onChange={(e) => setEscoreMaximo(Number(e.target.value) || 0)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Tempo (min)</Form.Label>
                      <Form.Control
                        type='number'
                        min={1}
                        value={tempoEstimadoMinutos}
                        onChange={(e) => setTempoEstimadoMinutos(Number(e.target.value) || 0)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value as 'ativo' | 'inativo')}>
                    <option value='ativo'>Ativo</option>
                    <option value='inativo'>Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>Faixas de Risco</h5>
                <Button variant='outline-primary' size='sm' onClick={handleAddFaixa}>
                  <IconifyIcon icon='iconoir:plus' className='me-1' />
                  Adicionar
                </Button>
              </Card.Header>
              <Card.Body>
                {faixasRisco.map((faixa, index) => (
                  <Row className='align-items-end mb-3' key={`${faixa.min}-${faixa.max}-${index}`}>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Min</Form.Label>
                        <Form.Control
                          type='number'
                          value={faixa.min}
                          onChange={(e) => handleUpdateFaixa(index, 'min', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Max</Form.Label>
                        <Form.Control
                          type='number'
                          value={faixa.max}
                          onChange={(e) => handleUpdateFaixa(index, 'max', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Risco</Form.Label>
                        <Form.Select
                          value={faixa.risco}
                          onChange={(e) => handleUpdateFaixa(index, 'risco', e.target.value)}
                        >
                          <option value='baixo'>Baixo</option>
                          <option value='medio'>Médio</option>
                          <option value='alto'>Alto</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                          value={faixa.descricao}
                          onChange={(e) => handleUpdateFaixa(index, 'descricao', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={1}>
                      <Button
                        variant='outline-danger'
                        onClick={() => handleRemoveFaixa(index)}
                        disabled={faixasRisco.length <= 1}
                      >
                        <IconifyIcon icon='iconoir:trash' />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className='mb-4'>
              <Card.Header className='bg-light'>
                <h5 className='mb-0'>Resumo</h5>
              </Card.Header>
              <Card.Body>
                <div className='mb-3'>
                  <small className='text-muted d-block'>Perguntas</small>
                  <strong>{totalPerguntas}</strong>
                </div>
                <div className='mb-3'>
                  <small className='text-muted d-block'>Status</small>
                  <Badge bg={status === 'ativo' ? 'success' : 'secondary'}>
                    {status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            <div className='d-grid gap-2'>
              <Button type='submit' variant='primary' size='lg'>
                <IconifyIcon icon='iconoir:check' className='me-1' />
                Salvar
              </Button>
              <Button variant='outline-info' onClick={handleDuplicar}>
                <IconifyIcon icon='iconoir:copy' className='me-1' />
                Duplicar
              </Button>
              <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>
                <IconifyIcon icon='iconoir:trash' className='me-1' />
                Excluir
              </Button>
              <Link href={`/adm/visualizar-questionario/${questionarioId}`}>
                <Button variant='outline-secondary' className='w-100'>
                  Voltar
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Form>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Excluir questionário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Essa ação remove o questionário e as perguntas associadas. Deseja continuar?
        </Modal.Body>
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
