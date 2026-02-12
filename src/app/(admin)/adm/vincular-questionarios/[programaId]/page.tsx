'use client'

import { useState } from 'react'
import { Card, Button, Badge, Row, Col, ListGroup, Modal, Form, Alert } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Questionario {
  id: number
  titulo: string
  categoria: string
  tipo: 'avaliacao' | 'triagem' | 'acompanhamento' | 'feedback'
  totalPerguntas: number
}

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

const questionariosDisponiveis: Questionario[] = [
  { id: 1, titulo: 'Avaliação de Saúde Mental (PHQ-9)', categoria: 'Saúde Mental', tipo: 'triagem', totalPerguntas: 9 },
  { id: 2, titulo: 'Avaliação de Ansiedade (GAD-7)', categoria: 'Saúde Mental', tipo: 'triagem', totalPerguntas: 7 },
  { id: 3, titulo: 'Satisfação no Trabalho', categoria: 'Engajamento', tipo: 'avaliacao', totalPerguntas: 12 },
  { id: 4, titulo: 'Clima Organizacional', categoria: 'Cultura', tipo: 'avaliacao', totalPerguntas: 20 },
  { id: 5, titulo: 'Avaliação de Estresse (PSS)', categoria: 'Bem-estar', tipo: 'acompanhamento', totalPerguntas: 10 },
  { id: 6, titulo: 'Qualidade de Vida (WHOQOL)', categoria: 'Bem-estar', tipo: 'avaliacao', totalPerguntas: 26 },
  { id: 7, titulo: 'Feedback de Coaching', categoria: 'Desenvolvimento', tipo: 'feedback', totalPerguntas: 8 },
  { id: 8, titulo: 'Avaliação de Risco Psicossocial', categoria: 'Saúde Mental', tipo: 'triagem', totalPerguntas: 15 },
]

const vinculadosDemo: QuestionarioVinculado[] = [
  { id: 1, questionarioId: 1, ordem: 1, obrigatorio: true, permiteReavaliacao: false, intervaloDias: 0 },
  { id: 2, questionarioId: 2, ordem: 2, obrigatorio: true, permiteReavaliacao: false, intervaloDias: 0 },
  { id: 3, questionarioId: 3, ordem: 3, obrigatorio: false, permiteReavaliacao: true, intervaloDias: 90 },
]

export default function VincularQuestionariosPage() {
  const params = useParams()
  const programaId = params.programaId as string

  const [vinculados, setVinculados] = useState<QuestionarioVinculado[]>(vinculadosDemo)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [selectedVinculo, setSelectedVinculo] = useState<QuestionarioVinculado | null>(null)

  const getQuestionarioById = (id: number) => questionariosDisponiveis.find(q => q.id === id)

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
    setVinculados(vinculados.map(v => 
      v.id === selectedVinculo.id ? selectedVinculo : v
    ))
    setShowConfigModal(false)
  }

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      triagem: 'danger',
      avaliacao: 'primary',
      acompanhamento: 'info',
      feedback: 'success',
    }
    return <Badge bg={colors[tipo] || 'secondary'}>{tipo}</Badge>
  }

  const questionariosNaoVinculados = questionariosDisponiveis.filter(
    q => !vinculados.some(v => v.questionarioId === q.id)
  )

  return (
    <>
      <PageTitle 
        title="Vincular Questionários" 
        subName={`Programa ID: ${programaId}`} 
      />

      <Row>
        <Col xl={5}>
          <ComponentContainerCard title="Questionários Disponíveis">
            <Alert variant="info" className="mb-3">
              <IconifyIcon icon="fa:info-circle" className="me-2" />
              Clique em um questionário para vinculá-lo ao programa
            </Alert>
            
            <ListGroup style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {questionariosNaoVinculados.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">
                  Todos os questionários já estão vinculados
                </ListGroup.Item>
              ) : (
                questionariosNaoVinculados.map(q => (
                  <ListGroup.Item
                    key={q.id}
                    action
                    onClick={() => vincularQuestionario(q.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-medium">{q.titulo}</div>
                      <small className="text-muted">
                        {q.categoria} • {q.totalPerguntas} perguntas
                      </small>
                    </div>
                    <div className="text-end">
                      {getTipoBadge(q.tipo)}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="ms-2 p-0 text-success"
                      >
                        <IconifyIcon icon="fa:plus-circle" />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>

            <div className="mt-3 text-center">
              <small className="text-muted">
                {questionariosNaoVinculados.length} disponíveis de {questionariosDisponiveis.length} total
              </small>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col xl={7}>
          <ComponentContainerCard title="Questionários Vinculados">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Badge bg="primary" className="fs-6">
                {vinculados.length} vinculado(s)
              </Badge>
            </div>
            {vinculados.length === 0 ? (
              <div className="text-center py-5">
                <IconifyIcon icon="fa:clipboard-list" className="display-4 text-muted mb-3" />
                <h5>Nenhum questionário vinculado</h5>
                <p className="text-muted">
                  Selecione questionários da lista à esquerda para começar
                </p>
              </div>
            ) : (
              <ListGroup>
                {vinculados.map((vinculo, index) => {
                  const q = getQuestionarioById(vinculo.questionarioId)
                  return (
                    <ListGroup.Item key={vinculo.id} className="border-0 border-bottom">
                      <Row className="align-items-center">
                        <Col xs="auto">
                          <Badge bg="secondary" className="fs-6">
                            {vinculo.ordem}
                          </Badge>
                        </Col>
                        <Col>
                          <div className="fw-medium">{q?.titulo}</div>
                          <div className="small text-muted">
                            {q?.categoria} • {getTipoBadge(q?.tipo || '')}
                            {vinculo.obrigatorio && (
                              <Badge bg="danger" className="ms-2">Obrigatório</Badge>
                            )}
                            {vinculo.permiteReavaliacao && (
                              <Badge bg="info" className="ms-2">
                                Reavaliação em {vinculo.intervaloDias} dias
                              </Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs="auto">
                          <div className="btn-group btn-group-sm">
                            <Button
                              variant="outline-secondary"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                            >
                              <IconifyIcon icon="fa:arrow-up" />
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() => moveDown(index)}
                              disabled={index === vinculados.length - 1}
                            >
                              <IconifyIcon icon="fa:arrow-down" />
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() => abrirConfiguracao(vinculo)}
                            >
                              <IconifyIcon icon="fa:cog" />
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => desvincularQuestionario(vinculo.id)}
                            >
                              <IconifyIcon icon="fa:times" />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            )}

            <hr className="my-4" />

            <div className="d-flex justify-content-between align-items-center">
              <Link href={`/adm/editar-programa/${programaId}`} className="btn btn-secondary">
                <IconifyIcon icon="fa:arrow-left" className="me-1" />
                Voltar ao Programa
              </Link>
              <Button variant="success" disabled={vinculados.length === 0}>
                <IconifyIcon icon="fa:check" className="me-1" />
                Salvar Vinculações
              </Button>
            </div>
          </ComponentContainerCard>

          {vinculados.length > 0 && (
            <Card className="mt-3 bg-light">
              <Card.Body>
                <h6 className="mb-3">
                  <IconifyIcon icon="fa:sitemap" className="me-2" />
                  Fluxo de Aplicação
                </h6>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  {vinculados.map((v, i) => (
                    <div key={v.id} className="d-flex align-items-center">
                      <div className="bg-white border rounded p-2">
                        <small className="fw-medium">
                          {getQuestionarioById(v.questionarioId)?.titulo.substring(0, 30)}...
                        </small>
                        {v.dependenciaId && (
                          <div className="small text-muted">
                            <IconifyIcon icon="fa:link" className="me-1" />
                            Depende de #{vinculados.find(v2 => v2.id === v.dependenciaId)?.ordem}
                          </div>
                        )}
                      </div>
                      {i < vinculados.length - 1 && (
                        <IconifyIcon icon="fa:arrow-right" className="mx-2 text-muted" />
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Configurar Questionário
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVinculo && (
            <Form>
              <div className="mb-3">
                <label className="text-muted small">Questionário</label>
                <h6>{getQuestionarioById(selectedVinculo.questionarioId)?.titulo}</h6>
              </div>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Ordem de Aplicação</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedVinculo.ordem}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      ordem: parseInt(e.target.value)
                    })}
                    min={1}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Obrigatório</Form.Label>
                  <Form.Select
                    value={selectedVinculo.obrigatorio ? 'true' : 'false'}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      obrigatorio: e.target.value === 'true'
                    })}
                  >
                    <option value="true">Sim - Obrigatório</option>
                    <option value="false">Não - Opcional</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Permite Reavaliação</Form.Label>
                  <Form.Select
                    value={selectedVinculo.permiteReavaliacao ? 'true' : 'false'}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      permiteReavaliacao: e.target.value === 'true'
                    })}
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </Form.Select>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Intervalo para Reavaliação (dias)</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedVinculo.intervaloDias}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      intervaloDias: parseInt(e.target.value)
                    })}
                    disabled={!selectedVinculo.permiteReavaliacao}
                  />
                </Col>
              </Row>

              <hr className="my-4" />

              <h6 className="mb-3">
                <IconifyIcon icon="fa:link" className="me-2" />
                Dependência (Opcional)
              </h6>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Depende do Questionário</Form.Label>
                  <Form.Select
                    value={selectedVinculo.dependenciaId || ''}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      dependenciaId: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                  >
                    <option value="">Nenhuma dependência</option>
                    {vinculados
                      .filter(v => v.id !== selectedVinculo.id)
                      .map(v => (
                        <option key={v.id} value={v.id}>
                          #{v.ordem} - {getQuestionarioById(v.questionarioId)?.titulo.substring(0, 40)}...
                        </option>
                      ))}
                  </Form.Select>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Condição de Dependência</Form.Label>
                  <Form.Select
                    value={selectedVinculo.dependenciaCondicao || ''}
                    onChange={(e) => setSelectedVinculo({
                      ...selectedVinculo,
                      dependenciaCondicao: e.target.value || undefined
                    })}
                    disabled={!selectedVinculo.dependenciaId}
                  >
                    <option value="">Selecione...</option>
                    <option value="completado">Quando completado</option>
                    <option value="pontuacao_alta">Pontuação alta (risco)</option>
                    <option value="pontuacao_media">Pontuação média</option>
                    <option value="pontuacao_baixa">Pontuação baixa</option>
                  </Form.Select>
                </Col>
              </Row>

              {selectedVinculo.dependenciaId && (
                <Alert variant="warning" className="mt-3">
                  <IconifyIcon icon="fa:exclamation-triangle" className="me-2" />
                  Este questionário só será exibido após a condição ser atendida no questionário #{vinculados.find(v => v.id === selectedVinculo.dependenciaId)?.ordem}
                </Alert>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfigModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={salvarConfiguracao}>
            <IconifyIcon icon="fa:save" className="me-1" />
            Salvar Configuração
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
