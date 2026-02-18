'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

interface QuestionarioVinculado {
  id: number
  questionarioId: number
  ordem: number
  obrigatorio: boolean
  permiteReavaliacao: boolean
  intervaloDias: number
  dependenciaId?: number
  dependenciaCondicao?: string
}

export default function VincularQuestionariosPage() {
  const params = useParams()
  const programaId = parseInt(params.programaId as string)
  const { showNotification } = useNotificationContext()
  const { programas, questionarios, getProgramaQuestionarios, setProgramaQuestionarios } = useDemo()

  const programa = useMemo(() => programas.find((p: any) => p.id === programaId), [programas, programaId])

  const [vinculados, setVinculados] = useState<QuestionarioVinculado[]>([])
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedVinculo, setSelectedVinculo] = useState<QuestionarioVinculado | null>(null)

  useEffect(() => {
    const loaded = getProgramaQuestionarios(programaId)
    setVinculados(loaded)
  }, [getProgramaQuestionarios, programaId])

  const questionariosDisponiveis = questionarios.filter((q: any) => q.status === 'ativo')

  const getQuestionarioById = (id: number) => questionariosDisponiveis.find((q: any) => q.id === id)

  const vincularQuestionario = (questionarioId: number) => {
    const novoVinculo: QuestionarioVinculado = {
      id: Date.now(),
      questionarioId,
      ordem: vinculados.length + 1,
      obrigatorio: true,
      permiteReavaliacao: false,
      intervaloDias: 0,
    }
    setVinculados([...vinculados, novoVinculo])
  }

  const desvincularQuestionario = (vinculoId: number) => {
    const novosVinculos = vinculados
      .filter(v => v.id !== vinculoId)
      .map((v, index) => ({ ...v, ordem: index + 1 }))
    setVinculados(novosVinculos)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...vinculados]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index - 1]
    newOrder[index - 1] = temp
    newOrder[index].ordem = index + 1
    newOrder[index - 1].ordem = index
    setVinculados(newOrder)
  }

  const moveDown = (index: number) => {
    if (index === vinculados.length - 1) return
    const newOrder = [...vinculados]
    const temp = newOrder[index]
    newOrder[index] = newOrder[index + 1]
    newOrder[index + 1] = temp
    newOrder[index].ordem = index + 2
    newOrder[index + 1].ordem = index + 1
    setVinculados(newOrder)
  }

  const abrirConfiguracao = (vinculo: QuestionarioVinculado) => {
    setSelectedVinculo(vinculo)
    setShowConfigModal(true)
  }

  const salvarConfiguracao = () => {
    if (!selectedVinculo) return
    setVinculados(vinculados.map(v => (v.id === selectedVinculo.id ? selectedVinculo : v)))
    setShowConfigModal(false)
  }

  const handleSalvarVinculos = () => {
    setProgramaQuestionarios(programaId, vinculados)
    showNotification({ message: 'Vinculações salvas com sucesso!', variant: 'success' })
  }

  const questionariosNaoVinculados = questionariosDisponiveis.filter(
    (q: any) => !vinculados.some(v => v.questionarioId === q.id)
  )

  if (!programa) {
    return (
      <>
        <PageTitle title='Vincular Questionários' subName='Programa não encontrado' />
        <Alert variant='warning'>Programa não encontrado.</Alert>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Vincular Questionários' subName={programa.nome} />

      <Row>
        <Col xl={5}>
          <ComponentContainerCard title='Questionários Disponíveis'>
            <Alert variant='info' className='mb-3'>
              <IconifyIcon icon='iconoir:info-circle' className='me-2' />
              Clique para vincular ao programa.
            </Alert>

            <ListGroup style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {questionariosNaoVinculados.length === 0 && (
                <ListGroup.Item className='text-center text-muted py-4'>
                  Todos os questionários já estão vinculados
                </ListGroup.Item>
              )}
              {questionariosNaoVinculados.map((q: any) => (
                <ListGroup.Item
                  key={q.id}
                  action
                  onClick={() => vincularQuestionario(q.id)}
                  className='d-flex justify-content-between align-items-center'
                >
                  <div>
                    <div className='fw-medium'>{q.codigo} - {q.nome}</div>
                    <small className='text-muted'>{q.tipo} • {q.numeroQuestoes} perguntas</small>
                  </div>
                  <Button variant='link' size='sm' className='p-0 text-success'>
                    <IconifyIcon icon='iconoir:plus-circle' />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </ComponentContainerCard>
        </Col>

        <Col xl={7}>
          <ComponentContainerCard title='Questionários Vinculados'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <Badge bg='primary' className='fs-6'>{vinculados.length} vinculado(s)</Badge>
            </div>

            {vinculados.length === 0 ? (
              <div className='text-center py-5'>
                <IconifyIcon icon='iconoir:clipboard-xmark' className='display-4 text-muted mb-3' />
                <h5>Nenhum questionário vinculado</h5>
              </div>
            ) : (
              <ListGroup>
                {vinculados.map((vinculo, index) => {
                  const q = getQuestionarioById(vinculo.questionarioId)
                  return (
                    <ListGroup.Item key={vinculo.id} className='border-0 border-bottom'>
                      <Row className='align-items-center'>
                        <Col xs='auto'>
                          <Badge bg='secondary' className='fs-6'>{vinculo.ordem}</Badge>
                        </Col>
                        <Col>
                          <div className='fw-medium'>{q?.codigo} - {q?.nome}</div>
                          <div className='small text-muted'>
                            {vinculo.obrigatorio && <Badge bg='danger' className='me-1'>Obrigatório</Badge>}
                            {vinculo.permiteReavaliacao && (
                              <Badge bg='info'>Reavaliação em {vinculo.intervaloDias} dias</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs='auto'>
                          <div className='btn-group btn-group-sm'>
                            <Button variant='outline-secondary' onClick={() => moveUp(index)} disabled={index === 0}>
                              <IconifyIcon icon='iconoir:nav-arrow-up' />
                            </Button>
                            <Button variant='outline-secondary' onClick={() => moveDown(index)} disabled={index === vinculados.length - 1}>
                              <IconifyIcon icon='iconoir:nav-arrow-down' />
                            </Button>
                            <Button variant='outline-primary' onClick={() => abrirConfiguracao(vinculo)}>
                              <IconifyIcon icon='iconoir:settings' />
                            </Button>
                            <Button variant='outline-danger' onClick={() => desvincularQuestionario(vinculo.id)}>
                              <IconifyIcon icon='iconoir:trash' />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            )}

            <hr className='my-4' />
            <div className='d-flex justify-content-between align-items-center'>
              <Link href={`/adm/editar-programa/${programaId}`} className='btn btn-secondary'>Voltar</Link>
              <Button variant='success' disabled={vinculados.length === 0} onClick={handleSalvarVinculos}>
                <IconifyIcon icon='iconoir:check' className='me-1' />
                Salvar Vinculações
              </Button>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Questionário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVinculo && (
            <Form>
              <div className='mb-3'>
                <label className='text-muted small'>Questionário</label>
                <h6>{getQuestionarioById(selectedVinculo.questionarioId)?.nome}</h6>
              </div>
              <Row>
                <Col md={6} className='mb-3'>
                  <Form.Label>Obrigatório</Form.Label>
                  <Form.Select
                    value={selectedVinculo.obrigatorio ? 'true' : 'false'}
                    onChange={(e) => setSelectedVinculo({ ...selectedVinculo, obrigatorio: e.target.value === 'true' })}
                  >
                    <option value='true'>Sim</option>
                    <option value='false'>Não</option>
                  </Form.Select>
                </Col>
                <Col md={6} className='mb-3'>
                  <Form.Label>Permite Reavaliação</Form.Label>
                  <Form.Select
                    value={selectedVinculo.permiteReavaliacao ? 'true' : 'false'}
                    onChange={(e) => setSelectedVinculo({ ...selectedVinculo, permiteReavaliacao: e.target.value === 'true' })}
                  >
                    <option value='true'>Sim</option>
                    <option value='false'>Não</option>
                  </Form.Select>
                </Col>
              </Row>
              <Form.Group className='mb-3'>
                <Form.Label>Intervalo de Reavaliação (dias)</Form.Label>
                <Form.Control
                  type='number'
                  value={selectedVinculo.intervaloDias}
                  onChange={(e) => setSelectedVinculo({ ...selectedVinculo, intervaloDias: parseInt(e.target.value || '0') })}
                  disabled={!selectedVinculo.permiteReavaliacao}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowConfigModal(false)}>Cancelar</Button>
          <Button variant='primary' onClick={salvarConfiguracao}>
            <IconifyIcon icon='iconoir:check' className='me-1' />
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
