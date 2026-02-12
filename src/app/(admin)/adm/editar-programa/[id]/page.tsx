'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, ListGroup, Tab, Tabs, Badge, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Questionario {
  id: number
  titulo: string
  categoria: string
}

interface Empresa {
  id: number
  nome: string
  participantes: number
  progresso: number
}

interface Intervalo {
  id: number
  nome: string
  dias: number
  cor: string
}

const questionariosDisponiveis: Questionario[] = [
  { id: 1, titulo: 'Avaliação de Saúde Mental (PHQ-9)', categoria: 'Saúde Mental' },
  { id: 2, titulo: 'Avaliação de Ansiedade (GAD-7)', categoria: 'Saúde Mental' },
  { id: 3, titulo: 'Satisfação no Trabalho', categoria: 'Engajamento' },
  { id: 4, titulo: 'Clima Organizacional', categoria: 'Cultura' },
  { id: 5, titulo: 'Avaliação de Estresse (PSS)', categoria: 'Bem-estar' },
  { id: 6, titulo: 'Qualidade de Vida (WHOQOL)', categoria: 'Bem-estar' },
]

const empresasDemo: Empresa[] = [
  { id: 1, nome: 'TechCorp Brasil', participantes: 45, progresso: 78 },
  { id: 2, nome: 'Inovação Ltda', participantes: 32, progresso: 45 },
  { id: 3, nome: 'Saúde & Bem-estar SA', participantes: 28, progresso: 92 },
]

const intervalosDemo: Intervalo[] = [
  { id: 1, nome: 'Muito Baixo', dias: 30, cor: '#dc3545' },
  { id: 2, nome: 'Baixo', dias: 60, cor: '#ffc107' },
  { id: 3, nome: 'Moderado', dias: 90, cor: '#17a2b8' },
  { id: 4, nome: 'Alto', dias: 120, cor: '#28a745' },
]

export default function EditarProgramaPage() {
  const params = useParams()
  const programaId = params.id as string

  const [activeTab, setActiveTab] = useState('dados')
  const [nome, setNome] = useState('Programa de Bem-estar Corporativo 2025')
  const [descricao, setDescricao] = useState('Programa anual de avaliação e acompanhamento do bem-estar dos colaboradores')
  const [status, setStatus] = useState('ativo')
  
  const [questionariosSelecionados, setQuestionariosSelecionados] = useState<number[]>([1, 3, 5])
  const [intervalos, setIntervalos] = useState<Intervalo[]>(intervalosDemo)

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

  const adicionarIntervalo = () => {
    const novoIntervalo: Intervalo = {
      id: Date.now(),
      nome: 'Novo Intervalo',
      dias: 30,
      cor: '#6c757d'
    }
    setIntervalos([...intervalos, novoIntervalo])
  }

  const removerIntervalo = (id: number) => {
    setIntervalos(intervalos.filter(i => i.id !== id))
  }

  const atualizarIntervalo = (id: number, campo: keyof Intervalo, valor: string | number) => {
    setIntervalos(intervalos.map(i => 
      i.id === id ? { ...i, [campo]: valor } : i
    ))
  }

  const getQuestionarioById = (id: number) => questionariosDisponiveis.find(q => q.id === id)

  const handleSalvar = () => {
    console.log('Programa salvo:', { id: programaId, nome, descricao, status, questionarios: questionariosSelecionados, intervalos })
  }

  return (
    <>
      <PageTitle 
        title="Editar Programa" 
        subName={`ID: ${programaId} - ${nome}`} 
      />
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dados')}
        className="mb-3"
      >
        <Tab eventKey="dados" title="Dados">
          <ComponentContainerCard title="Informações do Programa">
            <Row>
              <Col md={8}>
                <Form>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Label>Nome do Programa <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </Col>
                    
                    <Col md={12} className="mb-3">
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="pausado">Pausado</option>
                      </Form.Select>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <Link href="/adm/lista-programas" className="btn btn-secondary">
                      Voltar
                    </Link>
                    <Button variant="primary" onClick={handleSalvar}>
                      <IconifyIcon icon="fa:save" className="me-1" />
                      Salvar Alterações
                    </Button>
                  </div>
                </Form>
              </Col>

              <Col md={4}>
                <Card className="bg-light">
                  <Card.Body>
                    <h6>Estatísticas</h6>
                    <div className="mb-2">
                      <small className="text-muted">Empresas participantes:</small>
                      <div className="fw-bold">{empresasDemo.length}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Total de participantes:</small>
                      <div className="fw-bold">{empresasDemo.reduce((acc, e) => acc + e.participantes, 0)}</div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted">Questionários:</small>
                      <div className="fw-bold">{questionariosSelecionados.length}</div>
                    </div>
                    <div>
                      <small className="text-muted">Progresso médio:</small>
                      <div className="fw-bold">{Math.round(empresasDemo.reduce((acc, e) => acc + e.progresso, 0) / empresasDemo.length)}%</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="questionarios" title="Questionários">
          <ComponentContainerCard title="Gerenciar Questionários">
            <div className="d-flex justify-content-end mb-3">
              <Link href={`/adm/vincular-questionarios/${programaId}`} className="btn btn-primary">
                <IconifyIcon icon="fa:link" className="me-1" />
                Vincular Questionários Avançado
              </Link>
            </div>
            <Row>
              <Col md={6}>
                <h6 className="mb-3">Questionários Disponíveis</h6>
                <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
              </Col>

              <Col md={6}>
                <h6 className="mb-3">Ordem de Aplicação</h6>
                <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {questionariosSelecionados.length === 0 ? (
                    <ListGroup.Item className="text-muted text-center py-5">
                      Nenhum questionário selecionado
                    </ListGroup.Item>
                  ) : (
                    questionariosSelecionados.map((id, index) => {
                      const q = getQuestionarioById(id)
                      return (
                        <ListGroup.Item key={id} className="d-flex align-items-center">
                          <Badge bg="secondary" className="me-2">{index + 1}</Badge>
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
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="primary" onClick={handleSalvar}>
                <IconifyIcon icon="fa:save" className="me-1" />
                Salvar Alterações
              </Button>
            </div>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="empresas" title={`Empresas (${empresasDemo.length})`}>
          <ComponentContainerCard title="Empresas Participantes">
            <Table responsive className="mb-0">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Participantes</th>
                  <th>Progresso</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresasDemo.map(empresa => (
                  <tr key={empresa.id}>
                    <td>
                      <strong>{empresa.nome}</strong>
                    </td>
                    <td>{empresa.participantes}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar" 
                            style={{ width: `${empresa.progresso}%` }}
                          />
                        </div>
                        <span className="small">{empresa.progresso}%</span>
                      </div>
                    </td>
                    <td>
                      <Badge bg="success">Ativa</Badge>
                    </td>
                    <td>
                      <Button variant="link" size="sm" className="p-0">
                        <IconifyIcon icon="fa:eye" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Total: {empresasDemo.reduce((acc, e) => acc + e.participantes, 0)} participantes
              </small>
              <Button variant="outline-primary" size="sm">
                <IconifyIcon icon="fa:plus" className="me-1" />
                Adicionar Empresa
              </Button>
            </div>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="intervalos" title="Intervalos">
          <ComponentContainerCard title="Configuração de Intervalos">
            <p className="text-muted mb-3">
              Defina os intervalos de reavaliação baseados no nível de risco identificado nos questionários.
            </p>

            <Table responsive className="mb-3">
              <thead>
                <tr>
                  <th>Nome do Intervalo</th>
                  <th>Dias</th>
                  <th>Cor</th>
                  <th>Visualização</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {intervalos.map((intervalo, index) => (
                  <tr key={intervalo.id}>
                    <td>
                      <Form.Control
                        type="text"
                        value={intervalo.nome}
                        onChange={(e) => atualizarIntervalo(intervalo.id, 'nome', e.target.value)}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={intervalo.dias}
                        onChange={(e) => atualizarIntervalo(intervalo.id, 'dias', parseInt(e.target.value))}
                        size="sm"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="color"
                        value={intervalo.cor}
                        onChange={(e) => atualizarIntervalo(intervalo.id, 'cor', e.target.value)}
                        size="sm"
                        style={{ width: '50px', padding: '2px' }}
                      />
                    </td>
                    <td>
                      <Badge 
                        style={{ backgroundColor: intervalo.cor }}
                        className="px-3 py-2"
                      >
                        {intervalo.nome}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => removerIntervalo(intervalo.id)}
                      >
                        <IconifyIcon icon="fa:trash" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between">
              <Button variant="outline-primary" size="sm" onClick={adicionarIntervalo}>
                <IconifyIcon icon="fa:plus" className="me-1" />
                Adicionar Intervalo
              </Button>
              <Button variant="primary" size="sm" onClick={handleSalvar}>
                <IconifyIcon icon="fa:save" className="me-1" />
                Salvar Configurações
              </Button>
            </div>

            <div className="alert alert-info mt-4">
              <IconifyIcon icon="fa:info-circle" className="me-2" />
              <strong>Como funciona:</strong> Os participantes serão reavaliados automaticamente após o período definido para cada nível de risco. Exemplo: participantes com risco "Muito Baixo" serão reavaliados em 30 dias.
            </div>
          </ComponentContainerCard>
        </Tab>
      </Tabs>
    </>
  )
}
