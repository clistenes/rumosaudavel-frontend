'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Badge } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

interface FaixaRisco {
  min: number
  max: number
  risco: string
  descricao: string
}

export default function NovoQuestionario() {
  const router = useRouter()
  const { addQuestionario } = useDemo()
  const { showNotification } = useNotificationContext()
  
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    tipo: 'depressao',
    numeroQuestoes: 9,
    escoreMaximo: 27,
    tempoEstimadoMinutos: 5,
    status: 'ativo',
  })

  const [faixasRisco, setFaixasRisco] = useState<FaixaRisco[]>([
    { min: 0, max: 4, risco: 'baixo', descricao: 'Depressão mínima ou ausente' },
    { min: 5, max: 9, risco: 'medio', descricao: 'Depressão leve' },
    { min: 10, max: 14, risco: 'medio', descricao: 'Depressão moderada' },
    { min: 15, max: 19, risco: 'alto', descricao: 'Depressão moderadamente severa' },
    { min: 20, max: 27, risco: 'alto', descricao: 'Depressão severa' },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novoQuestionario = {
      ...formData,
      faixasRisco,
      aplicacoesTotal: 0,
      aplicacoesUltimoMes: 0,
    }
    
    addQuestionario(novoQuestionario)
    showNotification({
      message: `Questionário "${formData.nome}" criado com sucesso!`,
      variant: 'success'
    })
    
    router.push('/adm/lista-questionarios')
  }

  const addFaixaRisco = () => {
    const lastMax = faixasRisco[faixasRisco.length - 1]?.max || 0
    setFaixasRisco([...faixasRisco, { 
      min: lastMax + 1, 
      max: lastMax + 5, 
      risco: 'baixo', 
      descricao: '' 
    }])
  }

  const removeFaixaRisco = (index: number) => {
    setFaixasRisco(faixasRisco.filter((_, i) => i !== index))
  }

  const updateFaixaRisco = (index: number, field: keyof FaixaRisco, value: any) => {
    const newFaixas = [...faixasRisco]
    newFaixas[index] = { ...newFaixas[index], [field]: value }
    setFaixasRisco(newFaixas)
  }

  return (
    <>
      <PageTitle title="Novo Questionário" subName="Administração" />

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Informações Básicas</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: PHQ-9"
                        value={formData.codigo}
                        onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                        required
                      />
                      <Form.Text className="text-muted">
                        Código único do questionário
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: Patient Health Questionnaire-9"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descreva o objetivo do questionário..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        value={formData.tipo}
                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      >
                        <option value="depressao">Depressão</option>
                        <option value="ansiedade">Ansiedade</option>
                        <option value="estresse">Estresse</option>
                        <option value="burnout">Burnout</option>
                        <option value="insonia">Insônia</option>
                        <option value="outro">Outro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nº de Questões</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={formData.numeroQuestoes}
                        onChange={(e) => setFormData({...formData, numeroQuestoes: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tempo Estimado (min)</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={formData.tempoEstimadoMinutos}
                        onChange={(e) => setFormData({...formData, tempoEstimadoMinutos: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Escore Máximo</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        value={formData.escoreMaximo}
                        onChange={(e) => setFormData({...formData, escoreMaximo: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Risk Ranges */}
            <Card className="mb-4">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Faixas de Risco</h5>
                <Button variant="outline-primary" size="sm" onClick={addFaixaRisco}>
                  <IconifyIcon icon="iconoir:plus" className="me-1" />
                  Adicionar Faixa
                </Button>
              </Card.Header>
              <Card.Body>
                {faixasRisco.map((faixa, index) => (
                  <Card key={index} className="mb-3 border">
                    <Card.Body>
                      <Row className="align-items-end">
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>Mín</Form.Label>
                            <Form.Control
                              type="number"
                              value={faixa.min}
                              onChange={(e) => updateFaixaRisco(index, 'min', parseInt(e.target.value))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>Máx</Form.Label>
                            <Form.Control
                              type="number"
                              value={faixa.max}
                              onChange={(e) => updateFaixaRisco(index, 'max', parseInt(e.target.value))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Risco</Form.Label>
                            <Form.Select
                              value={faixa.risco}
                              onChange={(e) => updateFaixaRisco(index, 'risco', e.target.value)}
                            >
                              <option value="baixo">Baixo</option>
                              <option value="medio">Médio</option>
                              <option value="alto">Alto</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                              type="text"
                              value={faixa.descricao}
                              onChange={(e) => updateFaixaRisco(index, 'descricao', e.target.value)}
                              placeholder="Ex: Depressão leve"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={1}>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => removeFaixaRisco(index)}
                            disabled={faixasRisco.length <= 1}
                          >
                            <IconifyIcon icon="iconoir:trash" />
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Resumo</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted d-block">Código</small>
                  <strong>{formData.codigo || '-'}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Nome</small>
                  <strong>{formData.nome || '-'}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Tipo</small>
                  <Badge bg="secondary">{formData.tipo}</Badge>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Questões</small>
                  <strong>{formData.numeroQuestoes}</strong>
                </div>
                <div className="mb-3">
                  <small className="text-muted d-block">Status</small>
                  <Badge bg={formData.status === 'ativo' ? 'success' : 'secondary'}>
                    {formData.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                <IconifyIcon icon="iconoir:check" className="me-2" />
                Criar Questionário
              </Button>
              <Link href="/adm/lista-questionarios">
                <Button variant="outline-secondary" className="w-100">
                  <IconifyIcon icon="iconoir:nav-arrow-left" className="me-2" />
                  Cancelar
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  )
}
