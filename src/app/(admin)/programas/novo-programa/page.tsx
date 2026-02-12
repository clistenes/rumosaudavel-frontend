'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, ListGroup, Alert, Badge } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Questionario {
  id: number
  titulo: string
  categoria: string
  selecionado: boolean
}

const questionariosDisponiveis: Questionario[] = [
  { id: 1, titulo: 'Avaliação PHQ-9', categoria: 'Saúde Mental', selecionado: false },
  { id: 2, titulo: 'Avaliação GAD-7', categoria: 'Saúde Mental', selecionado: false },
  { id: 3, titulo: 'Satisfação no Trabalho', categoria: 'Engajamento', selecionado: false },
  { id: 4, titulo: 'Clima Organizacional', categoria: 'Cultura', selecionado: false },
  { id: 5, titulo: 'Avaliação de Estresse', categoria: 'Bem-estar', selecionado: false },
]

export default function NovoProgramaPage() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [questionarios, setQuestionarios] = useState(questionariosDisponiveis)
  const [showSuccess, setShowSuccess] = useState(false)

  const toggleQuestionario = (id: number) => {
    setQuestionarios(prev => prev.map(q => 
      q.id === id ? { ...q, selecionado: !q.selecionado } : q
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const selecionados = questionarios.filter(q => q.selecionado)

  return (
    <>
      <PageTitle title="Novo Programa" subName="Criar programa de avaliação" />

      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)} className="mb-4">
          <IconifyIcon icon="fa:check-circle" className="me-2" />
          Programa criado com sucesso!
        </Alert>
      )}

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
                    placeholder="Ex: Programa de Bem-estar Corporativo 2025"
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

                <Col md={6} className="mb-3">
                  <Form.Label>Data de Início <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Data de Término</Form.Label>
                  <Form.Control
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </Col>
              </Row>

              <hr className="my-4" />

              <h6 className="mb-3">Questionários do Programa</h6>
              <p className="text-muted small mb-3">Selecione os questionários que farão parte deste programa:</p>

              <ListGroup>
                {questionarios.map((q) => (
                  <ListGroup.Item
                    key={q.id}
                    action
                    active={q.selecionado}
                    onClick={() => toggleQuestionario(q.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-medium">{q.titulo}</div>
                      <small className={q.selecionado ? 'text-white' : 'text-muted'}>{q.categoria}</small>
                    </div>
                    {q.selecionado && <IconifyIcon icon="fa:check" />}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link href="/programas/todos-programas" className="btn btn-secondary">
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
              <label className="text-muted small">Período</label>
              <p className="mb-1 fw-medium">
                {dataInicio ? new Date(dataInicio).toLocaleDateString('pt-BR') : '-'}
                {' '}
                {dataFim && `a ${new Date(dataFim).toLocaleDateString('pt-BR')}`}
              </p>
            </div>
            <div className="mb-3">
              <label className="text-muted small">Questionários Selecionados</label>
              <p className="mb-1 fw-medium">{selecionados.length}</p>
            </div>

            {selecionados.length > 0 && (
              <div className="alert alert-info">
                <IconifyIcon icon="fa:info-circle" className="me-2" />
                <small>Os questionários serão aplicados na ordem selecionada.</small>
              </div>
            )}
          </ComponentContainerCard>

          <ComponentContainerCard title="Dicas">
            <ul className="list-unstyled mb-0 small">
              <li className="mb-2">
                <IconifyIcon icon="fa:lightbulb" className="text-warning me-2" />
                Defina um período claro para o programa
              </li>
              <li className="mb-2">
                <IconifyIcon icon="fa:users" className="text-primary me-2" />
                Você poderá adicionar empresas após a criação
              </li>
              <li>
                <IconifyIcon icon="fa:chart-line" className="text-success me-2" />
                Monitore o progresso pelo dashboard
              </li>
            </ul>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
