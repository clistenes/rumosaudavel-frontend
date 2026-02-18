'use client'

import { useMemo, useState } from 'react'
import { Accordion, Badge, Button, Card, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function VisualizarQuestionarioPage() {
  const params = useParams()
  const questionarioId = Number(params.id)
  const { showNotification } = useNotificationContext()

  const {
    questionarios,
    perguntas,
    alternativas,
    dimensoes,
    grupos,
    deletePergunta,
    deleteDimensao,
    deleteGrupo,
    duplicarQuestionario,
    updateQuestionario,
  } = useDemo()

  const questionario = useMemo(
    () => questionarios.find((item: any) => item.id === questionarioId),
    [questionarios, questionarioId]
  )

  const perguntasQuestionario = useMemo(
    () => perguntas.filter((item: any) => item.id_questionario === questionarioId),
    [perguntas, questionarioId]
  )

  const dimensoesQuestionario = useMemo(
    () => dimensoes.filter((item: any) => item.id_questionario === questionarioId),
    [dimensoes, questionarioId]
  )

  const gruposQuestionario = useMemo(
    () => grupos.filter((item: any) => item.id_questionario === questionarioId),
    [grupos, questionarioId]
  )

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteType, setDeleteType] = useState<'pergunta' | 'dimensao' | 'grupo'>('pergunta')
  const [itemToDelete, setItemToDelete] = useState<any>(null)

  const getAlternativasByPergunta = (perguntaId: number) => {
    return alternativas.filter((item: any) => item.id_pergunta === perguntaId)
  }

  const getTipoPerguntaLabel = (tipo: string) => {
    if (tipo === 'sn') return 'Sim/Nao'
    if (tipo === 'me') return 'Multipla Escolha'
    if (tipo === 'dissertativa') return 'Dissertativa'
    return tipo
  }

  const getTipoPerguntaBadge = (tipo: string) => {
    if (tipo === 'sn') return 'info'
    if (tipo === 'me') return 'primary'
    if (tipo === 'dissertativa') return 'secondary'
    return 'secondary'
  }

  const askDelete = (type: 'pergunta' | 'dimensao' | 'grupo', item: any) => {
    setDeleteType(type)
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    if (deleteType === 'pergunta') {
      deletePergunta(itemToDelete.id)
      showNotification({ message: 'Pergunta excluida com sucesso.', variant: 'success' })
    } else if (deleteType === 'dimensao') {
      deleteDimensao(itemToDelete.id)
      showNotification({ message: 'Dimensao excluida com sucesso.', variant: 'success' })
    } else {
      deleteGrupo(itemToDelete.id)
      showNotification({ message: 'Grupo excluido com sucesso.', variant: 'success' })
    }

    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const handleExportar = () => {
    if (!questionario) return

    const headers = ['Ordem', 'Tipo', 'Pergunta']
    const rows = perguntasQuestionario
      .slice()
      .sort((a: any, b: any) => (a.pos || 0) - (b.pos || 0))
      .map((pergunta: any) => {
        const safeNome = `"${String(pergunta.nome || '').replaceAll('"', '""')}"`
        return [pergunta.pos || '', pergunta.tipo || '', safeNome].join(';')
      })

    const csvContent = [headers.join(';'), ...rows].join('\n')
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `questionario_${questionario.codigo || questionario.id}.csv`
    link.click()

    showNotification({ message: 'Exportacao concluida.', variant: 'success' })
  }

  const handleDuplicar = () => {
    duplicarQuestionario(questionarioId)
    showNotification({ message: 'Questionario duplicado com sucesso.', variant: 'success' })
  }

  const handleToggleStatus = () => {
    if (!questionario) return

    const nextStatus = questionario.status === 'ativo' ? 'inativo' : 'ativo'
    updateQuestionario(questionarioId, { status: nextStatus })
    showNotification({
      message: `Questionario ${nextStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso.`,
      variant: 'success',
    })
  }

  if (!questionario) {
    return (
      <>
        <PageTitle title='Questionario nao encontrado' subName='Administracao' />
        <Card>
          <Card.Body className='text-center py-5'>
            <IconifyIcon icon='iconoir:clipboard-xmark' style={{ fontSize: '64px' }} className='text-muted mb-3' />
            <h4>Questionario nao encontrado</h4>
            <p className='text-muted'>O questionario solicitado nao existe.</p>
            <Link href='/adm/lista-questionarios'>
              <Button variant='primary'>Voltar para Lista</Button>
            </Link>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title={`${questionario.codigo} - Detalhes`} subName='Administracao' />

      <Card className='mb-4'>
        <Card.Body>
          <Row className='align-items-center'>
            <Col md={8}>
              <div className='d-flex align-items-center mb-3'>
                <div className='bg-primary bg-opacity-10 p-3 rounded me-3'>
                  <IconifyIcon icon='iconoir:clipboard-check' className='text-primary fs-2' />
                </div>
                <div>
                  <h4 className='mb-1'>{questionario.nome}</h4>
                  <Badge bg='secondary' className='me-2'>
                    {questionario.codigo}
                  </Badge>
                  <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
                    {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
              <p className='text-muted mb-0'>{questionario.descricao}</p>
            </Col>
            <Col md={4} className='text-md-end mt-3 mt-md-0'>
              <div className='d-flex gap-2 justify-content-md-end'>
                <Link href={`/adm/editar-questionario/${questionario.id}`}>
                  <Button variant='outline-primary'>
                    <IconifyIcon icon='iconoir:edit-pencil' className='me-1' />
                    Editar
                  </Button>
                </Link>
                <Link href='/adm/lista-questionarios'>
                  <Button variant='outline-secondary'>Voltar</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className='mb-4'>
        <Col md={3}>
          <Card className='text-center h-100'>
            <Card.Body>
              <IconifyIcon icon='iconoir:question-mark' className='text-primary fs-2 mb-2' />
              <h4 className='mb-1'>{perguntasQuestionario.length}</h4>
              <small className='text-muted'>Questoes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='text-center h-100'>
            <Card.Body>
              <IconifyIcon icon='iconoir:layers' className='text-warning fs-2 mb-2' />
              <h4 className='mb-1'>{dimensoesQuestionario.length}</h4>
              <small className='text-muted'>Dimensoes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='text-center h-100'>
            <Card.Body>
              <IconifyIcon icon='iconoir:clock' className='text-info fs-2 mb-2' />
              <h4 className='mb-1'>{questionario.tempoEstimadoMinutos}</h4>
              <small className='text-muted'>Minutos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='text-center h-100'>
            <Card.Body>
              <IconifyIcon icon='iconoir:users' className='text-success fs-2 mb-2' />
              <h4 className='mb-1'>{questionario.aplicacoesTotal?.toLocaleString() || 0}</h4>
              <small className='text-muted'>Aplicacoes</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex gap-2 flex-wrap'>
            <Link href={`/adm/nova-pergunta/${questionario.id}`}>
              <Button variant='primary'>
                <IconifyIcon icon='iconoir:plus' className='me-1' />
                Nova Pergunta
              </Button>
            </Link>
            <Button variant='outline-primary' onClick={handleToggleStatus}>
              <IconifyIcon icon='iconoir:layers' className='me-1' />
              {questionario.status === 'ativo' ? 'Inativar' : 'Ativar'}
            </Button>
            <Button variant='outline-info' onClick={handleExportar}>
              <IconifyIcon icon='iconoir:download' className='me-1' />
              Exportar CSV
            </Button>
            <Button variant='outline-secondary' onClick={handleDuplicar}>
              <IconifyIcon icon='iconoir:copy' className='me-1' />
              Duplicar
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          {dimensoesQuestionario.length > 0 && (
            <Card className='mb-4'>
              <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                <h5 className='mb-0'>
                  <IconifyIcon icon='iconoir:layers' className='me-2' />
                  Estrutura Hierarquica
                </h5>
                <Badge bg='primary'>{dimensoesQuestionario.length} dimensoes</Badge>
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey='0'>
                  {dimensoesQuestionario.map((dimensao: any, dimIndex: number) => {
                    const gruposDimensao = gruposQuestionario.filter((grupo: any) => grupo.id_dimensao === dimensao.id)
                    return (
                      <Accordion.Item eventKey={String(dimIndex)} key={dimensao.id}>
                        <Accordion.Header>
                          <div className='d-flex align-items-center w-100'>
                            <span className='me-2'>{dimensao.nome}</span>
                            <Badge bg='info' className='ms-auto me-3'>
                              {gruposDimensao.length} grupos
                            </Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className='d-flex justify-content-end mb-2'>
                            <Button
                              variant='outline-danger'
                              size='sm'
                              onClick={() => askDelete('dimensao', dimensao)}
                            >
                              <IconifyIcon icon='iconoir:trash' className='me-1' />
                              Excluir Dimensao
                            </Button>
                          </div>
                          {gruposDimensao.length > 0 ? (
                            gruposDimensao.map((grupo: any) => (
                              <Card key={grupo.id} className='mb-2 border'>
                                <Card.Body className='py-2'>
                                  <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                      <IconifyIcon icon='iconoir:folder' className='me-2 text-warning' />
                                      <strong>{grupo.nome}</strong>
                                    </div>
                                    <Button variant='link' size='sm' className='p-0 text-danger' onClick={() => askDelete('grupo', grupo)}>
                                      <IconifyIcon icon='iconoir:trash' />
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            ))
                          ) : (
                            <p className='text-muted text-center mb-0'>Nenhum grupo nesta dimensao</p>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
                </Accordion>
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
              <h5 className='mb-0'>
                <IconifyIcon icon='iconoir:question-mark' className='me-2' />
                Perguntas
              </h5>
              <Badge bg='primary'>{perguntasQuestionario.length} perguntas</Badge>
            </Card.Header>
            <Card.Body>
              <Accordion>
                {perguntasQuestionario
                  .slice()
                  .sort((a: any, b: any) => (a.pos || 0) - (b.pos || 0))
                  .map((pergunta: any, index: number) => {
                    const alternativasPergunta = getAlternativasByPergunta(pergunta.id)
                    return (
                      <Accordion.Item eventKey={String(index)} key={pergunta.id}>
                        <Accordion.Header>
                          <div className='d-flex align-items-center w-100'>
                            <Badge bg='secondary' className='me-2'>
                              {index + 1}
                            </Badge>
                            <span className='text-truncate' style={{ maxWidth: '60%' }}>
                              {pergunta.nome_curto || String(pergunta.nome || '').substring(0, 50)}
                            </span>
                            <Badge bg={getTipoPerguntaBadge(pergunta.tipo)} className='ms-auto me-3'>
                              {getTipoPerguntaLabel(pergunta.tipo)}
                            </Badge>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className='mb-3'>
                            <h6>Texto completo:</h6>
                            <p className='text-muted'>{pergunta.nome}</p>
                            {pergunta.explicacao && (
                              <small className='text-info'>
                                <IconifyIcon icon='iconoir:info-circle' className='me-1' />
                                {pergunta.explicacao}
                              </small>
                            )}
                          </div>

                          {pergunta.tipo === 'me' && alternativasPergunta.length > 0 && (
                            <div className='mb-3'>
                              <h6>Alternativas:</h6>
                              <ListGroup variant='flush'>
                                {alternativasPergunta.map((alt: any) => (
                                  <ListGroup.Item key={alt.id} className='px-0'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                      <span>{alt.alternativa}</span>
                                      <Badge bg='primary'>{alt.pontuacao} pts</Badge>
                                    </div>
                                    {alt.comentario && <small className='text-muted'>{alt.comentario}</small>}
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </div>
                          )}

                          {pergunta.tipo === 'sn' && (
                            <div className='mb-3'>
                              <h6>Opcoes Sim/Nao:</h6>
                              <Row>
                                <Col md={6}>
                                  <Card className='border-success'>
                                    <Card.Body className='py-2'>
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <span>
                                          <strong>Sim</strong>
                                        </span>
                                        <Badge bg='success'>{pergunta.s_pontuacao} pts</Badge>
                                      </div>
                                      {pergunta.s_comentario && <small className='text-muted'>{pergunta.s_comentario}</small>}
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={6}>
                                  <Card className='border-secondary'>
                                    <Card.Body className='py-2'>
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <span>
                                          <strong>Nao</strong>
                                        </span>
                                        <Badge bg='secondary'>{pergunta.n_pontuacao} pts</Badge>
                                      </div>
                                      {pergunta.n_comentario && <small className='text-muted'>{pergunta.n_comentario}</small>}
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                            </div>
                          )}

                          {pergunta.tipo === 'dissertativa' && (
                            <div className='mb-3'>
                              <h6>Resposta:</h6>
                              <Form.Control as='textarea' rows={2} placeholder='Campo de texto livre...' disabled />
                            </div>
                          )}

                          <div className='d-flex gap-2'>
                            <Link href={`/adm/editar-pergunta/${pergunta.id}`}>
                              <Button variant='outline-primary' size='sm'>
                                <IconifyIcon icon='iconoir:edit-pencil' className='me-1' />
                                Editar
                              </Button>
                            </Link>
                            {pergunta.tipo !== 'dissertativa' && (
                              <Button
                                variant='outline-info'
                                size='sm'
                                onClick={() =>
                                  showNotification({
                                    message: 'Perguntas dependentes serao implementadas no Sprint 4.',
                                    variant: 'info',
                                  })
                                }
                              >
                                <IconifyIcon icon='iconoir:branch' className='me-1' />
                                Dependente
                              </Button>
                            )}
                            <Button variant='outline-danger' size='sm' onClick={() => askDelete('pergunta', pergunta)}>
                              <IconifyIcon icon='iconoir:trash' className='me-1' />
                              Excluir
                            </Button>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
              </Accordion>

              {perguntasQuestionario.length === 0 && (
                <div className='text-center py-5'>
                  <IconifyIcon icon='iconoir:question-mark' style={{ fontSize: '48px' }} className='text-muted mb-3' />
                  <h5>Nenhuma pergunta cadastrada</h5>
                  <p className='text-muted'>Adicione perguntas ao questionario para comecar.</p>
                  <Link href={`/adm/nova-pergunta/${questionario.id}`}>
                    <Button variant='primary'>
                      <IconifyIcon icon='iconoir:plus' className='me-1' />
                      Adicionar Pergunta
                    </Button>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className='mb-4'>
            <Card.Header className='bg-light'>
              <h5 className='mb-0'>
                <IconifyIcon icon='iconoir:chart' className='me-2' />
                Faixas de Risco
              </h5>
            </Card.Header>
            <Card.Body>
              {questionario.faixasRisco?.map((faixa: any, index: number) => (
                <Card
                  key={index}
                  className={`mb-2 border-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}
                >
                  <Card.Body className='py-2'>
                    <div className='d-flex justify-content-between align-items-center mb-1'>
                      <Badge bg={faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}>
                        {faixa.min}-{faixa.max} pts
                      </Badge>
                      <small className={`fw-bold text-${faixa.risco === 'alto' ? 'danger' : faixa.risco === 'medio' ? 'warning' : 'success'}`}>
                        {faixa.risco === 'alto' ? 'Alto' : faixa.risco === 'medio' ? 'Medio' : 'Baixo'}
                      </small>
                    </div>
                    <small className='text-muted'>{faixa.descricao}</small>
                  </Card.Body>
                </Card>
              )) || <p className='text-muted text-center mb-0'>Nenhuma faixa definida</p>}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className='bg-light'>
              <h5 className='mb-0'>
                <IconifyIcon icon='iconoir:info-circle' className='me-2' />
                Informacoes
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Codigo</span>
                  <span className='fw-medium'>{questionario.codigo}</span>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Tipo</span>
                  <Badge bg='secondary'>{questionario.tipo}</Badge>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Status</span>
                  <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
                    {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Tempo Estimado</span>
                  <span>{questionario.tempoEstimadoMinutos} min</span>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Escore Maximo</span>
                  <span>{questionario.escoreMaximo} pts</span>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2 d-flex justify-content-between'>
                  <span className='text-muted'>Aplicacoes</span>
                  <span>{questionario.aplicacoesTotal?.toLocaleString() || 0}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir <strong>{itemToDelete?.nome || itemToDelete?.nome_curto}</strong>?
          </p>
          <p className='text-muted small'>
            {deleteType === 'dimensao' && 'Os grupos associados tambem serao removidos.'}
            {deleteType === 'grupo' && 'As perguntas permanecerao no questionario.'}
            {deleteType === 'pergunta' && 'Esta acao nao pode ser desfeita.'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
