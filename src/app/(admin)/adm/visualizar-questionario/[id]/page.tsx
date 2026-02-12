'use client'

import { useState, useMemo } from 'react'
import { Card, Button, Badge, Row, Col, ListGroup, Accordion, Modal, Form, Dropdown } from 'react-bootstrap'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function VisualizarQuestionario() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const questionarioId = parseInt(params.id as string)
  
  const { 
    questionarios, 
    perguntas, 
    alternativas, 
    dimensoes, 
    grupos,
    deletePergunta,
    deleteDimensao,
    deleteGrupo
  } = useDemo()
  
  const questionario = useMemo(() => {
    return questionarios.find((q: any) => q.id === questionarioId)
  }, [questionarios, questionarioId])

  // Modais
  const [showDeletePerguntaModal, setShowDeletePerguntaModal] = useState(false)
  const [showDeleteDimensaoModal, setShowDeleteDimensaoModal] = useState(false)
  const [showDeleteGrupoModal, setShowDeleteGrupoModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'pergunta' | 'dimensao' | 'grupo'>('pergunta')

  // Dados relacionados
  const perguntasQuestionario = useMemo(() => {
    return perguntas.filter((p: any) => p.id_questionario === questionarioId)
  }, [perguntas, questionarioId])

  const dimensoesQuestionario = useMemo(() => {
    return dimensoes.filter((d: any) => d.id_questionario === questionarioId)
  }, [dimensoes, questionarioId])

  const gruposQuestionario = useMemo(() => {
    return grupos.filter((g: any) => g.id_questionario === questionarioId)
  }, [grupos, questionarioId])

  const getAlternativasByPergunta = (perguntaId: number) => {
    return alternativas.filter((a: any) => a.id_pergunta === perguntaId)
  }

  const getTipoPerguntaLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      'sn': 'Sim/Não',
      'me': 'Múltipla Escolha',
      'dissertativa': 'Dissertativa'
    }
    return labels[tipo] || tipo
  }

  const getTipoPerguntaBadge = (tipo: string) => {
    const colors: { [key: string]: string } = {
      'sn': 'info',
      'me': 'primary',
      'dissertativa': 'secondary'
    }
    return colors[tipo] || 'secondary'
  }

  // Handlers de exclusão
  const handleDeletePergunta = (pergunta: any) => {
    setItemToDelete(pergunta)
    setDeleteType('pergunta')
    setShowDeletePerguntaModal(true)
  }

  const handleDeleteDimensao = (dimensao: any) => {
    setItemToDelete(dimensao)
    setDeleteType('dimensao')
    setShowDeleteDimensaoModal(true)
  }

  const handleDeleteGrupo = (grupo: any) => {
    setItemToDelete(grupo)
    setDeleteType('grupo')
    setShowDeleteGrupoModal(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      if (deleteType === 'pergunta') {
        deletePergunta(itemToDelete.id)
        showNotification({ message: 'Pergunta excluída com sucesso!', variant: 'success' })
        setShowDeletePerguntaModal(false)
      } else if (deleteType === 'dimensao') {
        deleteDimensao(itemToDelete.id)
        showNotification({ message: 'Dimensão excluída com sucesso!', variant: 'success' })
        setShowDeleteDimensaoModal(false)
      } else if (deleteType === 'grupo') {
        deleteGrupo(itemToDelete.id)
        showNotification({ message: 'Grupo excluído com sucesso!', variant: 'success' })
        setShowDeleteGrupoModal(false)
      }
      setItemToDelete(null)
    }
  }

  if (!questionario) {
    return (
      <>
        <PageTitle title="Questionário não encontrado" subName="Administração" />
        <Card>
          <Card.Body className="text-center py-5">
            <IconifyIcon icon="iconoir:clipboard-xmark" style={{ fontSize: '64px' }} className="text-muted mb-3" />
            <h4>Questionário não encontrado</h4>
            <p className="text-muted">O questionário solicitado não existe.</p>
            <Link href="/adm/lista-questionarios">
              <Button variant="primary">Voltar para Lista</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title={`${questionario.codigo} - Detalhes`} subName="Administração" />

      {/* Header */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <IconifyIcon icon="iconoir:clipboard-check" className="text-primary fs-2" />
                </div>
                <div>
                  <h4 className="mb-1">{questionario.nome}</h4>
                  <Badge bg="secondary" className="me-2">{questionario.codigo}</Badge>
                  <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
                    {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              <p className="text-muted mb-0">{questionario.descricao}</p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-md-end">
                <Link href={`/adm/editar-questionario/${questionario.id}`}>
                  <Button variant="outline-primary">
                    <IconifyIcon icon="iconoir:edit-pencil" className="me-1" />
                    Editar
                  </Button>
                </Link>
                <Link href="/adm/lista-questionarios">
                  <Button variant="outline-secondary">Voltar</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <IconifyIcon icon="iconoir:question-mark" className="text-primary fs-2 mb-2" />
              <h4 className="mb-1">{perguntasQuestionario.length}</h4>
              <small className="text-muted">Questões</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <IconifyIcon icon="iconoir:layers" className="text-warning fs-2 mb-2" />
              <h4 className="mb-1">{dimensoesQuestionario.length}</h4>
              <small className="text-muted">Dimensões</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <IconifyIcon icon="iconoir:clock" className="text-info fs-2 mb-2" />
              <h4 className="mb-1">{questionario.tempoEstimadoMinutos}</h4>
              <small className="text-muted">Minutos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <IconifyIcon icon="iconoir:users" className="text-success fs-2 mb-2" />
              <h4 className="mb-1">{questionario.aplicacoesTotal?.toLocaleString() || 0}</h4>
              <small className="text-muted">Aplicações</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ações Rápidas */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex gap-2 flex-wrap">
            <Link href={`/adm/nova-pergunta/${questionario.id}`}>
              <Button variant="primary">
                <IconifyIcon icon="iconoir:plus" className="me-1" />
                Nova Pergunta
              </Button>
            </Link>
            <Button variant="outline-primary" onClick={() => router.push(`/adm/gerenciar-dimensoes/${questionario.id}`)}>
              <IconifyIcon icon="iconoir:layers" className="me-1" />
              Gerenciar Dimensões
            </Button>
            <Button variant="outline-info" onClick={() => router.push(`/adm/intervalo/${questionario.id}`)}>
              <IconifyIcon icon="iconoir:chart" className="me-1" />
              Intervalos de Pontuação
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-acoes">
                <IconifyIcon icon="iconoir:more-vert" className="me-1" />
                Mais Ações
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => router.push(`/adm/exportar-questionario/${questionario.id}`)}>
                  <IconifyIcon icon="iconoir:download" className="me-2" />
                  Exportar
                </Dropdown.Item>
                <Dropdown.Item onClick={() => router.push(`/adm/duplicar-questionario/${questionario.id}`)}>
                  <IconifyIcon icon="iconoir:copy" className="me-2" />
                  Duplicar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>

      <Row>
        {/* Coluna Esquerda - Estrutura Hierárquica */}
        <Col lg={8}>
          {/* Dimensões e Grupos */}
          {dimensoesQuestionario.length > 0 && (
            <Card className="mb-4">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <IconifyIcon icon="iconoir:layers" className="me-2" />
                  Estrutura Hierárquica
                </h5>
                <Badge bg="primary">{dimensoesQuestionario.length} dimensões</Badge>
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey="0">
                  {dimensoesQuestionario.map((dimensao: any, dimIndex: number) => {
                    const gruposDimensao = gruposQuestionario.filter((g: any) => g.id_dimensao === dimensao.id)
                    return (
                      <Accordion.Item eventKey={String(dimIndex)} key={dimensao.id}>
                        <Accordion.Header>
                          <div className="d-flex align-items-center w-100">
                            <span className="me-2">{dimensao.nome}</span>
                            <Badge bg="info" className="ms-auto me-3">{gruposDimensao.length} grupos</Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="d-flex justify-content-end mb-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => router.push(`/adm/novo-grupo/${dimensao.id}`)}
                            >
                              <IconifyIcon icon="iconoir:plus" className="me-1" />
                              Novo Grupo
                            </Button>
                          </div>
                          {gruposDimensao.length > 0 ? (
                            gruposDimensao.map((grupo: any) => (
                              <Card key={grupo.id} className="mb-2 border">
                                <Card.Body className="py-2">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <IconifyIcon icon="iconoir:folder" className="me-2 text-warning" />
                                      <strong>{grupo.nome}</strong>
                                    </div>
                                    <div>
                                      <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="p-0 me-2"
                                        onClick={() => router.push(`/adm/editar-grupo/${grupo.id}`)}
                                      >
                                        <IconifyIcon icon="iconoir:edit-pencil" />
                                      </Button>
                                      <Button 
                                        variant="link" 
                                        size="sm" 
                                        className="p-0 text-danger"
                                        onClick={() => handleDeleteGrupo(grupo)}
                                      >
                                        <IconifyIcon icon="iconoir:trash" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            ))
                          ) : (
                            <p className="text-muted text-center mb-0">Nenhum grupo nesta dimensão</p>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
                </Accordion>
              </Card.Body>
            </Card>
          )}

          {/* Lista de Perguntas */}
          <Card>
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <IconifyIcon icon="iconoir:question-mark" className="me-2" />
                Perguntas
              </h5>
              <Badge bg="primary">{perguntasQuestionario.length} perguntas</Badge>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {perguntasQuestionario.map((pergunta: any, index: number) => {
                  const alternativasPergunta = getAlternativasByPergunta(pergunta.id)
                  return (
                    <Accordion.Item eventKey={String(index)} key={pergunta.id}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center w-100">
                          <Badge bg="secondary" className="me-2">{index + 1}</Badge>
                          <span className="text-truncate" style={{ maxWidth: '60%' }}>
                            {pergunta.nome_curto || pergunta.nome.substring(0, 50)}...
                          </span>
                          <Badge bg={getTipoPerguntaBadge(pergunta.tipo)} className="ms-auto me-3">
                            {getTipoPerguntaLabel(pergunta.tipo)}
                          </Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="mb-3">
                          <h6>Texto completo:</h6>
                          <p className="text-muted">{pergunta.nome}</p>
                          {pergunta.explicacao && (
                            <small className="text-info">
                              <IconifyIcon icon="iconoir:info-circle" className="me-1" />
                              {pergunta.explicacao}
                            </small>
                          )}
                        </div>

                        {/* Alternativas ou Opções Sim/Não */}
                        {pergunta.tipo === 'me' && alternativasPergunta.length > 0 && (
                          <div className="mb-3">
                            <h6>Alternativas:</h6>
                            <ListGroup variant="flush">
                              {alternativasPergunta.map((alt: any) => (
                                <ListGroup.Item key={alt.id} className="px-0">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span>{alt.alternativa}</span>
                                    <Badge bg="primary">{alt.pontuacao} pts</Badge>
                                  </div>
                                  {alt.comentario && (
                                    <small className="text-muted">{alt.comentario}</small>
                                  )}
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </div>
                        )}

                        {pergunta.tipo === 'sn' && (
                          <div className="mb-3">
                            <h6>Opções Sim/Não:</h6>
                            <Row>
                              <Col md={6}>
                                <Card className="border-success">
                                  <Card.Body className="py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span><strong>Sim</strong></span>
                                      <Badge bg="success">{pergunta.s_pontuacao} pts</Badge>
                                    </div>
                                    {pergunta.s_comentario && (
                                      <small className="text-muted">{pergunta.s_comentario}</small>
                                    )}
                                  </Card.Body>
                                </Card>
                              </Col>
                              <Col md={6}>
                                <Card className="border-secondary">
                                  <Card.Body className="py-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <span><strong>Não</strong></span>
                                      <Badge bg="secondary">{pergunta.n_pontuacao} pts</Badge>
                                    </div>
                                    {pergunta.n_comentario && (
                                      <small className="text-muted">{pergunta.n_comentario}</small>
                                    )}
                                  </Card.Body>
                                </Card>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {pergunta.tipo === 'dissertativa' && (
                          <div className="mb-3">
                            <h6>Resposta:</h6>
                            <Form.Control as="textarea" rows={2} placeholder="Campo de texto livre para resposta..." disabled />
                          </div>
                        )}

                        {/* Informações adicionais */}
                        {(pergunta.dimensao_nome || pergunta.grupo_nome) && (
                          <div className="mb-3">
                            <small className="text-muted">
                              {pergunta.dimensao_nome && (
                                <span className="me-3">
                                  <IconifyIcon icon="iconoir:layers" className="me-1" />
                                  Dimensão: {pergunta.dimensao_nome}
                                </span>
                              )}
                              {pergunta.grupo_nome && (
                                <span>
                                  <IconifyIcon icon="iconoir:folder" className="me-1" />
                                  Grupo: {pergunta.grupo_nome}
                                </span>
                              )}
                            </small>
                          </div>
                        )}

                        {/* Botões de ação */}
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => router.push(`/adm/editar-pergunta/${pergunta.id}`)}
                          >
                            <IconifyIcon icon="iconoir:edit-pencil" className="me-1" />
                            Editar
                          </Button>
                          {pergunta.tipo !== 'dissertativa' && (
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              onClick={() => router.push(`/adm/pergunta-dependente/${pergunta.tipo}/${pergunta.id}`)}
                            >
                              <IconifyIcon icon="iconoir:branch" className="me-1" />
                              Dependente
                            </Button>
                          )}
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePergunta(pergunta)}
                          >
                            <IconifyIcon icon="iconoir:trash" className="me-1" />
                            Excluir
                          </Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  )
                })}
              </Accordion>

              {perguntasQuestionario.length === 0 && (
                <div className="text-center py-5">
                  <IconifyIcon icon="iconoir:question-mark" style={{ fontSize: '48px' }} className="text-muted mb-3" />
                  <h5>Nenhuma pergunta cadastrada</h5>
                  <p className="text-muted">Adicione perguntas ao questionário para começar.</p>
                  <Link href={`/adm/nova-pergunta/${questionario.id}`}>
                    <Button variant="primary">
                      <IconifyIcon icon="iconoir:plus" className="me-1" />
                      Adicionar Pergunta
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna Direita - Faixas de Risco e Info */}
        <Col lg={4}>
          {/* Faixas de Risco */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <IconifyIcon icon="iconoir:chart" className="me-2" />
                Faixas de Risco
              </h5>
            </Card.Header>
            <Card.Body>
              {questionario.faixasRisco?.map((faixa: any, index: number) => (
                <Card key={index} className={`mb-2 border-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}>
                  <Card.Body className="py-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
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
              )) || <p className="text-muted text-center mb-0">Nenhuma faixa definida</p>}
            </Card.Body>
          </Card>

          {/* Informações do Questionário */}
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Informações
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Código</span>
                  <span className="fw-medium">{questionario.codigo}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Tipo</span>
                  <Badge bg="secondary">{questionario.tipo}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Status</span>
                  <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
                    {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Tempo Estimado</span>
                  <span>{questionario.tempoEstimadoMinutos} min</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Escore Máximo</span>
                  <span>{questionario.escoreMaximo} pts</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Aplicações</span>
                  <span>{questionario.aplicacoesTotal?.toLocaleString() || 0}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeletePerguntaModal || showDeleteDimensaoModal || showDeleteGrupoModal} onHide={() => {
        setShowDeletePerguntaModal(false)
        setShowDeleteDimensaoModal(false)
        setShowDeleteGrupoModal(false)
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir <strong>{itemToDelete?.nome || itemToDelete?.nome_curto}</strong>?
          </p>
          <p className="text-muted small">
            {deleteType === 'dimensao' && 'Os grupos associados também serão removidos.'}
            {deleteType === 'grupo' && 'As perguntas permanecerão no questionário.'}
            {deleteType === 'pergunta' && 'Esta ação não pode ser desfeita.'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowDeletePerguntaModal(false)
            setShowDeleteDimensaoModal(false)
            setShowDeleteGrupoModal(false)
          }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <IconifyIcon icon="iconoir:trash" className="me-2" />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
