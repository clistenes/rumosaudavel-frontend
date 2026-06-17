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
    nomePortalRumo: '',
    nomePortalUsuario: '',
    descricao: '',
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    setPerguntas(perguntas.filter((p) => p.id !== id).map((p, i) => ({ ...p, ordem: i + 1 })))
  }

  const atualizarPergunta = (id: number, campo: keyof Pergunta, valor: unknown) => {
    setPerguntas(perguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <PageTitle title='Novo Questionario' subName='Criar questionario de avaliacao' />

      {showSuccess && (
        <Alert variant='success' dismissible onClose={() => setShowSuccess(false)} className='mb-4'>
          <IconifyIcon icon='fa:check-circle' className='me-2' />
          Questionario criado com sucesso!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dados')} className='mb-3'>
          <Tab eventKey='dados' title='Dados Basicos'>
            <ComponentContainerCard title='Informacoes do Questionario'>
              <Row>
                <Col md={6} className='mb-3'>
                  <Form.Label>Nome Portal Rumo <span className='text-danger'>*</span></Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.nomePortalRumo}
                    onChange={(e) => handleChange('nomePortalRumo', e.target.value)}
                    placeholder='Ex: Checkup de Saude Mental'
                    required
                  />
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>Nome Portal Usuario <span className='text-danger'>*</span></Form.Label>
                  <Form.Control
                    type='text'
                    value={formData.nomePortalUsuario}
                    onChange={(e) => handleChange('nomePortalUsuario', e.target.value)}
                    placeholder='Ex: Como voce esta hoje?'
                    required
                  />
                </Col>

                <Col md={12} className='mb-3'>
                  <Form.Label>Descricao</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    placeholder='Descreva o objetivo deste questionario...'
                  />
                </Col>
              </Row>
            </ComponentContainerCard>
          </Tab>

          <Tab eventKey='perguntas' title={`Perguntas (${perguntas.length})`}>
            <ComponentContainerCard title='Perguntas do Questionario'>
              <Alert variant='info' className='mb-3'>
                <IconifyIcon icon='fa:info-circle' className='me-2' />
                Adicione as perguntas do questionario. As perguntas serao exibidas na ordem definida.
              </Alert>

              {perguntas.length === 0 ? (
                <div className='text-center py-5'>
                  <IconifyIcon icon='fa:clipboard-list' className='display-4 text-muted mb-3' />
                  <h5>Nenhuma pergunta adicionada</h5>
                  <p className='text-muted'>Clique no botao abaixo para adicionar a primeira pergunta</p>
                </div>
              ) : (
                perguntas.map((pergunta, index) => (
                  <Card key={pergunta.id} className='mb-3 border'>
                    <Card.Header className='bg-light d-flex justify-content-between align-items-center'>
                      <div className='d-flex align-items-center'>
                        <Badge bg='secondary' className='me-2'>{index + 1}</Badge>
                        <span className='fw-medium'>Pergunta {index + 1}</span>
                      </div>
                      <Button
                        variant='link'
                        className='text-danger p-0'
                        onClick={() => removerPergunta(pergunta.id)}
                      >
                        <IconifyIcon icon='fa:trash' />
                      </Button>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={8} className='mb-3'>
                          <Form.Label>Texto da Pergunta</Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={2}
                            value={pergunta.texto}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'texto', e.target.value)}
                            placeholder='Digite a pergunta...'
                          />
                        </Col>
                        <Col md={4} className='mb-3'>
                          <Form.Label>Tipo de Resposta</Form.Label>
                          <Form.Select
                            value={pergunta.tipo}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'tipo', e.target.value)}
                          >
                            <option value='escala'>Escala (0-3)</option>
                            <option value='multipla'>Multipla Escolha</option>
                            <option value='sim_nao'>Sim/Nao</option>
                            <option value='texto'>Texto Livre</option>
                            <option value='numero'>Numero</option>
                          </Form.Select>
                        </Col>
                        <Col md={12}>
                          <Form.Check
                            type='checkbox'
                            label='Pergunta obrigatoria'
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
                variant='outline-primary'
                className='w-100'
                onClick={adicionarPergunta}
              >
                <IconifyIcon icon='fa:plus' className='me-1' />
                Adicionar Pergunta
              </Button>
            </ComponentContainerCard>
          </Tab>
        </Tabs>

        <div className='d-flex justify-content-end gap-2 mt-4'>
          <Link href='/questionarios/todos-questionarios' className='btn btn-secondary'>
            Cancelar
          </Link>
          <Button type='submit' variant='primary' disabled={perguntas.length === 0}>
            <IconifyIcon icon='fa:save' className='me-1' />
            Criar Questionario
          </Button>
        </div>
      </Form>
    </>
  )
}
