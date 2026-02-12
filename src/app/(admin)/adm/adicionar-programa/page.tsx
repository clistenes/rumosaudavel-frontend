'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, ListGroup } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Questionario {
  id: number
  titulo: string
  categoria: string
}

const questionariosDisponiveis: Questionario[] = [
  { id: 1, titulo: 'Avaliação de Saúde Mental (PHQ-9)', categoria: 'Saúde Mental' },
  { id: 2, titulo: 'Avaliação de Ansiedade (GAD-7)', categoria: 'Saúde Mental' },
  { id: 3, titulo: 'Satisfação no Trabalho', categoria: 'Engajamento' },
  { id: 4, titulo: 'Clima Organizacional', categoria: 'Cultura' },
  { id: 5, titulo: 'Avaliação de Estresse (PSS)', categoria: 'Bem-estar' },
  { id: 6, titulo: 'Qualidade de Vida (WHOQOL)', categoria: 'Bem-estar' },
]

export default function AdicionarProgramaPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [questionariosSelecionados, setQuestionariosSelecionados] = useState<number[]>([])

  const toggleQuestionario = (id: number) => {
    setQuestionariosSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(q => q !== id)
        : [...prev, id]
    )
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...questionariosSelecionados]
    ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
    setQuestionariosSelecionados(newOrder)
  }

  const moveDown = (index: number) => {
    if (index === questionariosSelecionados.length - 1) return
    const newOrder = [...questionariosSelecionados]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    setQuestionariosSelecionados(newOrder)
  }

  const removerQuestionario = (id: number) => {
    setQuestionariosSelecionados(prev => prev.filter(q => q !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Programa criado:', { nome, descricao, questionarios: questionariosSelecionados })
    router.push('/adm/lista-programas')
  }

  const getQuestionarioById = (id: number) => questionariosDisponiveis.find(q => q.id === id)

  return (
    <>
      <PageTitle title="Adicionar Programa" subName="Criar novo programa de avaliação" />
      
      <Row>
        <Col xl={8}>
          <ComponentContainerCard title="Dados do Programa">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label>Nome do Programa <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Programa de Bem-estar 2025"
                    required
                  />
                </Col>
                
                <Col md={12} className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva os objetivos do programa..."
                  />
                </Col>
              </Row>

              <hr className="my-4" />

              <h5 className="mb-3">Questionários do Programa</h5>
              
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-light">
                      <strong>Questionários Disponíveis</strong>
                    </Card.Header>
                    <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {questionariosDisponiveis.map(q => (
                        <ListGroup.Item
                          key={q.id}
                          action
                          active={questionariosSelecionados.includes(q.id)}
                          onClick={() => toggleQuestionario(q.id)}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <div className="fw-medium">{q.titulo}</div>
                            <small className="text-muted">{q.categoria}</small>
                          </div>
                          {questionariosSelecionados.includes(q.id) && (
                            <IconifyIcon icon="fa:check" className="text-success" />
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <Card.Header className="bg-light">
                      <strong>Ordem de Aplicação</strong>
                      <small className="d-block text-muted">
                        {questionariosSelecionados.length} questionário(s) selecionado(s)
                      </small>
                    </Card.Header>
                    <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {questionariosSelecionados.length === 0 ? (
                        <ListGroup.Item className="text-muted text-center py-4">
                          Selecione questionários ao lado
                        </ListGroup.Item>
                      ) : (
                        questionariosSelecionados.map((id, index) => {
                          const q = getQuestionarioById(id)
                          return (
                            <ListGroup.Item key={id} className="d-flex align-items-center">
                              <span className="badge bg-secondary me-2">{index + 1}</span>
                              <div className="flex-grow-1">
                                <div className="fw-medium">{q?.titulo}</div>
                                <small className="text-muted">{q?.categoria}</small>
                              </div>
                              <div className="btn-group btn-group-sm">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => moveUp(index)}
                                  disabled={index === 0}
                                >
                                  <IconifyIcon icon="fa:arrow-up" />
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => moveDown(index)}
                                  disabled={index === questionariosSelecionados.length - 1}
                                >
                                  <IconifyIcon icon="fa:arrow-down" />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => removerQuestionario(id)}
                                >
                                  <IconifyIcon icon="fa:times" />
                                </Button>
                              </div>
                            </ListGroup.Item>
                          )
                        })
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link href="/adm/lista-programas" className="btn btn-secondary">
                  Cancelar
                </Link>
                <Button type="submit" variant="primary">
                  <IconifyIcon icon="fa:save" className="me-1" />
                  Criar Programa
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title="Resumo">
            <div className="mb-3">
              <label className="text-muted small">Nome</label>
              <p className="mb-1 fw-medium">{nome || '-'}</p>
            </div>
            <div className="mb-3">
              <label className="text-muted small">Questionários</label>
              <p className="mb-1 fw-medium">{questionariosSelecionados.length} selecionados</p>
            </div>
            <div className="alert alert-info">
              <IconifyIcon icon="fa:info-circle" className="me-2" />
              Os questionários serão aplicados na ordem definida acima.
            </div>
          </ComponentContainerCard>

          <ComponentContainerCard title="Dicas">
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <IconifyIcon icon="fa:check" className="text-success me-2" />
                Selecione pelo menos um questionário
              </li>
              <li className="mb-2">
                <IconifyIcon icon="fa:arrows-v" className="text-primary me-2" />
                Use as setas para ordenar
              </li>
              <li>
                <IconifyIcon icon="fa:calendar" className="text-warning me-2" />
                Configure intervalos após criar
              </li>
            </ul>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
