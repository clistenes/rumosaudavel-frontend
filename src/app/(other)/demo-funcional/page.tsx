'use client'

import { useState, useEffect } from 'react'
import { Card, Row, Col, Badge, Table, Button, Alert, Tab, Tabs, Spinner } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { demoServices } from '@/services/demo.service'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export default function DemoFuncionalPage() {
  const [activeTab, setActiveTab] = useState('empresas')
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [empresas, setEmpresas] = useState<any[]>([])
  const [participantes, setParticipantes] = useState<any[]>([])
  const [dashboard, setDashboard] = useState<any>(null)
  const [alertas, setAlertas] = useState<any[]>([])

  const setLoadingState = (key: string, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }))
  }

  const loadEmpresas = async () => {
    setLoadingState('empresas', true)
    try {
      const response = await demoServices.empresas.listar({ page: 1, perPage: 10 })
      setEmpresas(response.data.data)
    } catch (err) {
      setError('Erro ao carregar empresas')
    } finally {
      setLoadingState('empresas', false)
    }
  }

  const loadParticipantes = async () => {
    setLoadingState('participantes', true)
    try {
      const response = await demoServices.participantes.listar({ page: 1, perPage: 20 })
      setParticipantes(response.data.data)
    } catch (err) {
      setError('Erro ao carregar participantes')
    } finally {
      setLoadingState('participantes', false)
    }
  }

  const loadDashboard = async () => {
    setLoadingState('dashboard', true)
    try {
      const response = await demoServices.dashboard.metricas()
      setDashboard(response.data)
    } catch (err) {
      setError('Erro ao carregar dashboard')
    } finally {
      setLoadingState('dashboard', false)
    }
  }

  const loadAlertas = async () => {
    setLoadingState('alertas', true)
    try {
      const response = await demoServices.dashboard.alertas()
      setAlertas(response.data)
    } catch (err) {
      setError('Erro ao carregar alertas')
    } finally {
      setLoadingState('alertas', false)
    }
  }

  useEffect(() => {
    loadEmpresas()
    loadParticipantes()
    loadDashboard()
    loadAlertas()
  }, [])

  const handleCriarEmpresa = async () => {
    setLoadingState('criar', true)
    try {
      const novaEmpresa = await demoServices.empresas.criar({
        nome: 'Nova Empresa Demo',
        cnpj: '12.345.678/0001-99',
        setor: 'Tecnologia',
        cidade: 'São Paulo',
        estado: 'SP',
      })
      alert(`Empresa criada: ${novaEmpresa.data.nome}`)
      loadEmpresas()
    } catch (err) {
      alert('Erro ao criar empresa')
    } finally {
      setLoadingState('criar', false)
    }
  }

  const handleResponderQuestionario = async () => {
    setLoadingState('responder', true)
    try {
      const resultado = await demoServices.questionarios.responder(1, {
        respostas: [{ perguntaId: 1, valor: 2 }]
      })
      alert(`Questionário respondido! Pontuação: ${resultado.data.pontuacao}`)
    } catch (err) {
      alert('Erro ao responder questionário')
    } finally {
      setLoadingState('responder', false)
    }
  }

  if (error) {
    return (
      <Alert variant="danger">
        <IconifyIcon icon="fa:exclamation-triangle" className="me-2" />
        {error}
      </Alert>
    )
  }

  return (
    <>
      <PageTitle title="Demonstração Funcional" subName="Todas as funcionalidades em modo demo" />

      <Alert variant="info" className="mb-4">
        <div className="d-flex align-items-center">
          <IconifyIcon icon="fa:info-circle" className="fs-3 me-3" />
          <div>
            <strong>Modo Demonstração Ativo</strong>
            <p className="mb-0">
              Todos os dados são simulados mas realistas. As operações funcionam normalmente 
              (criar, editar, excluir) mas são salvas apenas em memória.
            </p>
          </div>
        </div>
      </Alert>

      <div className="mb-3 d-flex gap-2">
        <Button 
          variant="primary" 
          onClick={handleCriarEmpresa}
          disabled={loading['criar']}
        >
          {loading['criar'] ? (
            <><Spinner size="sm" className="me-1" /> Criando...</>
          ) : (
            <><IconifyIcon icon="fa:plus" className="me-1" /> Criar Nova Empresa (Demo)</>
          )}
        </Button>
        <Button 
          variant="success" 
          onClick={handleResponderQuestionario}
          disabled={loading['responder']}
        >
          {loading['responder'] ? (
            <><Spinner size="sm" className="me-1" /> Processando...</>
          ) : (
            <><IconifyIcon icon="fa:check" className="me-1" /> Simular Resposta</>
          )}
        </Button>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'empresas')} className="mb-3">
        <Tab eventKey="empresas" title="Empresas">
          <ComponentContainerCard title="Empresas Cadastradas">
            {loading['empresas'] ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Carregando empresas...</p>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>CNPJ</th>
                    <th>Setor</th>
                    <th>Participantes</th>
                    <th>Status</th>
                    <th>PHQ-9</th>
                    <th>GAD-7</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa: any) => (
                    <tr key={empresa.id}>
                      <td>
                        <strong>{empresa.nome}</strong>
                        <br />
                        <small className="text-muted">{empresa.cidade}, {empresa.estado}</small>
                      </td>
                      <td>{empresa.cnpj}</td>
                      <td>{empresa.setor}</td>
                      <td>{empresa.participantes}</td>
                      <td><Badge bg="success">{empresa.status}</Badge></td>
                      <td>
                        <Badge bg={empresa.phq9Medio >= 10 ? 'warning' : 'success'}>
                          {empresa.phq9Medio}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={empresa.gad7Medio >= 10 ? 'warning' : 'success'}>
                          {empresa.gad7Medio}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="participantes" title="Participantes">
          <ComponentContainerCard title="Participantes do Programa">
            {loading['participantes'] ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Carregando participantes...</p>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cargo</th>
                    <th>Empresa</th>
                    <th>Risco</th>
                    <th>PHQ-9</th>
                    <th>GAD-7</th>
                    <th>Alertas</th>
                  </tr>
                </thead>
                <tbody>
                  {participantes.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.nome}</strong>
                        <br />
                        <small className="text-muted">{p.cpf}</small>
                      </td>
                      <td>{p.cargo}</td>
                      <td>{p.empresaNome || `Empresa ${p.empresaId}`}</td>
                      <td>
                        <Badge bg={
                          p.riscoSaude === 'alto' ? 'danger' : 
                          p.riscoSaude === 'medio' ? 'warning' : 'success'
                        }>
                          {p.riscoSaude}
                        </Badge>
                      </td>
                      <td>{p.phq9Score}</td>
                      <td>{p.gad7Score}</td>
                      <td>
                        {p.alertasPendentes > 0 && (
                          <Badge bg="danger">{p.alertasPendentes}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="dashboard" title="Dashboard">
          {loading['dashboard'] ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Carregando dashboard...</p>
            </div>
          ) : dashboard ? (
            <>
              <Row className="mb-4">
                {dashboard.cards.map((card: any, idx: number) => (
                  <Col xl={3} md={6} key={idx} className="mb-3">
                    <Card className={`bg-${card.cor} text-white h-100`}>
                      <Card.Body className="text-center">
                        <IconifyIcon icon={card.icone} className="fs-1 mb-2 opacity-75" />
                        <h4 className="mb-0">
                          {card.valor.toLocaleString()}{card.sufixo || ''}
                        </h4>
                        <small>{card.label}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <ComponentContainerCard title="Alertas do Sistema">
                {loading['alertas'] ? (
                  <Spinner animation="border" />
                ) : (
                  <ul className="list-unstyled">
                    {alertas.slice(0, 5).map((alerta: any) => (
                      <li key={alerta.id} className="mb-2 pb-2 border-bottom">
                        <div className="d-flex align-items-center">
                          <IconifyIcon 
                            icon={alerta.tipo === 'risco' ? 'fa:exclamation-circle' : 'fa:info-circle'}
                            className={`text-${alerta.tipo === 'risco' ? 'danger' : 'info'} me-2`}
                          />
                          <div>
                            <strong>{alerta.titulo}</strong>
                            <p className="mb-0 small text-muted">{alerta.mensagem}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </ComponentContainerCard>
            </>
          ) : null}
        </Tab>
      </Tabs>

      <Card className="mt-4 bg-light">
        <Card.Body>
          <h5>Demonstração Interativa</h5>
          <p className="mb-0">
            <IconifyIcon icon="fa:hand-pointer" className="me-2" />
            Clique nos botões acima para ver as funcionalidades em ação. 
            Os dados são persistidos em memória durante a sessão.
          </p>
        </Card.Body>
      </Card>
    </>
  )
}
