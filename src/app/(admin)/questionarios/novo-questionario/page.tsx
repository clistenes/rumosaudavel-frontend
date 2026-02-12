'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Badge, Alert, Tab, Tabs } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Pergunta {
  id: number
  texto: string
  tipo: 'escala' | 'multipla' | 'sim_nao' | 'texto' | 'numero'
  obrigatoria: boolean
  ordem: number
}

export default function NovoQuestionarioPage() {
  const [activeTab, setActiveTab] = useState('dados')
  const [showSuccess, setShowSuccess] = useState(false)
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: 'avaliacao',
    tempoEstimado: 10,
    instrucoes: '',
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const adicionarPergunta = () => {
    const novaPergunta: Pergunta = {
      id: Date.now(),
      texto: '',
      tipo: 'escala',
      obrigatoria: true,
      ordem: perguntas.length + 1,
    }
    setPerguntas([...perguntas, novaPergunta])
  }

  const removerPergunta = (id: number) => {
    setPerguntas(perguntas.filter(p => p.id !== id).map((p, i) => ({ ...p, ordem: i + 1 })))
  }

  const atualizarPergunta = (id: number, campo: keyof Pergunta, valor: unknown) => {
    setPerguntas(perguntas.map(p => p.id === id ? { ...p, [campo]: valor } : p))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <PageTitle title="Novo Questionário" subName="Criar questionário de avaliação" />

      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)} className="mb-4">
          <IconifyIcon icon="fa:check-circle" className="me-2" />
          Questionário criado com sucesso!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dados')} className="mb-3">
          <Tab eventKey="dados" title="Dados Básicos">
            <ComponentContainerCard title="Informações do Questionário">
              <Row>
                <Col md={8} className="mb-3">
                  <Form.Label>Título <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    placeholder="Ex: Avaliação de Saúde Mental (PHQ-9)"
                    required
                  />
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Label>Categoria <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) => handleChange('categoria', e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="saude_mental">Saúde Mental</option>
                    <option value="engajamento">Engajamento</option>
                    <option value="bem_estar">Bem-estar</option>
                    <option value="clima">Clima Organizacional</option>
                    <option value="desenvolvimento">Desenvolvimento</option>
                  </Form.Select>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    placeholder="Descreva o objetivo deste questionário..."
                  />
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={formData.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                  >
                    <option value="avaliacao">Avaliação</option>
                    <option value="triagem">Triagem</option>
                    <option value="acompanhamento">Acompanhamento</option>
                    <option value="feedback">Feedback</option>
                  </Form.Select>
                </Col>

                <Col md={4} className="mb-3">
                  <Form.Label>Tempo Estimado (min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.tempoEstimado}
                    onChange={(e) => handleChange('tempoEstimado', parseInt(e.target.value))}
                    min={1}
                    max={120}
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Label>Instruções para o Participante</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.instrucoes}
                    onChange={(e) => handleChange('instrucoes', e.target.value)}
                    placeholder="Instruções que serão exibidas antes de iniciar o questionário..."
                  />
                </Col>
              </Row>
            </ComponentContainerCard>
          </Tab>

          <Tab eventKey="perguntas" title={`Perguntas (${perguntas.length})`}>
            <ComponentContainerCard title="Perguntas do Questionário">
              <Alert variant="info" className="mb-3">
                <IconifyIcon icon="fa:info-circle" className="me-2" />
                Adicione as perguntas do questionário. As perguntas serão exibidas na ordem definida.
              </Alert>

              {perguntas.length === 0 ? (
                <div className="text-center py-5">
                  <IconifyIcon icon="fa:clipboard-list" className="display-4 text-muted mb-3" />
                  <h5>Nenhuma pergunta adicionada</h5>
                  <p className="text-muted">Clique no botão abaixo para adicionar a primeira pergunta</p>
                </div>
              ) : (
                perguntas.map((pergunta, index) => (
                  <Card key={pergunta.id} className="mb-3 border">
                    <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <Badge bg="secondary" className="me-2">{index + 1}</Badge>
                        <span className="fw-medium">Pergunta {index + 1}</span>
                      </div>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={() => removerPergunta(pergunta.id)}
                      >
                        <IconifyIcon icon="fa:trash" />
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={8} className="mb-3">
                          <Form.Label>Texto da Pergunta</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={pergunta.texto}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'texto', e.target.value)}
                            placeholder="Digite a pergunta..."
                          />
                        </Col>
                        <Col md={4} className="mb-3">
                          <Form.Label>Tipo de Resposta</Form.Label>
                          <Form.Select
                            value={pergunta.tipo}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'tipo', e.target.value)}
                          >
                            <option value="escala">Escala (0-3)</option>
                            <option value="multipla">Múltipla Escolha</option>
                            <option value="sim_nao">Sim/Não</option>
                            <option value="texto">Texto Livre</option>
                            <option value="numero">Número</option>
                          </Form.Select>
                        </Col>
                        <Col md={12}>
                          <Form.Check
                            type="checkbox"
                            label="Pergunta obrigatória"
                            checked={pergunta.obrigatoria}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'obrigatoria', e.target.checked)}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))
              )}

              <Button
                variant="outline-primary"
                className="w-100"
                onClick={adicionarPergunta}
              >
                <IconifyIcon icon="fa:plus" className="me-1" />
                Adicionar Pergunta
              </Button>
            </ComponentContainerCard>
          </Tab>

          <Tab eventKey="config" title="Configurações">
            <ComponentContainerCard title="Configurações Avançadas">
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Status Inicial</Form.Label>
                  <Form.Select defaultValue="rascunho">
                    <option value="rascunho">Rascunho</option>
                    <option value="ativo">Ativo</option>
                  </Form.Select>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Escoring</Form.Label>
                  <Form.Select defaultValue="soma">
                    <option value="soma">Soma Simples</option>
                    <option value="media">Média</option>
                    <option value="ponderado">Ponderado</option>
                    <option value="personalizado">Personalizado</option>
                  </Form.Select>
                </Col>
              </Row>

              <h6 className="mb-3 mt-4">Opções de Exibição</h6>

              <Form.Check
                type="checkbox"
                label="Mostrar barra de progresso"
                className="mb-2"
                defaultChecked
              />

              <Form.Check
                type="checkbox"
                label="Permitir voltar às perguntas anteriores"
                className="mb-2"
                defaultChecked
              />

              <Form.Check
                type="checkbox"
                label="Embaralhar ordem das perguntas"
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                label="Exibir uma pergunta por vez"
                className="mb-2"
                defaultChecked
              />

              <Form.Check
                type="checkbox"
                label="Permitir salvar rascunho"
                className="mb-2"
                defaultChecked
              />
            </ComponentContainerCard>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Link href="/questionarios/todos-questionarios" className="btn btn-secondary">
            Cancelar
          </Link>
          <Button type="submit" variant="primary" disabled={perguntas.length === 0}>
            <IconifyIcon icon="fa:save" className="me-1" />
            Criar Questionário
          </Button>
        </div>
      </Form>
    </>
  )
}
