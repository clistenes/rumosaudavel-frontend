'use client'

import { useEffect, useState, useMemo } from 'react'
import { Row, Col, Card, Table, Badge, Button, ProgressBar, ListGroup } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PageTitle from '@/components/PageTitle'
import DashboardCards from '@/components/DashboardCards'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { EMPRESAS_DEMO, PARTICIPANTES_DEMO, ALERTAS_DEMO, EVOLUCAO_MENSAL } from '@/assets/data/demo-data'
import type { DashboardCardProps } from '@/components/DashboardCards'

interface Participante {
  id: number
  empresaId: number
  nome: string
  cpf: string
  email: string
  telefone: string
  cargo: string
  departamento: string
  dataNascimento: string
  dataAdmissao: string
  sexo: string
  estadoCivil: string
  cidade: string
  estado: string
  status: string
  riscoSaude: string
  phq9Score: number
  gad7Score: number
  ultimaAvaliacao: string
  alertasPendentes: number
}

interface EmpresaData {
  id: number
  nome: string
  nomeCurto: string
  funcionarios: number
  participantes: number
  adesao: number
  phq9Medio: number
  gad7Medio: number
  riscoAlto: number
  riscoMedio: number
  riscoBaixo: number
}

export default function EmpresaDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Get empresa data based on logged-in user
  const empresaId = useMemo(() => {
    return session?.user?.id_empresa || 1 // Default to Nexus Petroquímica for demo
  }, [session])

  const empresa = useMemo(() => {
    return EMPRESAS_DEMO.find(e => e.id === empresaId) || EMPRESAS_DEMO[0]
  }, [empresaId])

  const participantes = useMemo(() => {
    return (PARTICIPANTES_DEMO as Participante[]).filter(p => p.empresaId === empresaId)
  }, [empresaId])

  const alertasEmpresa = useMemo(() => {
    return ALERTAS_DEMO.filter(a => a.empresaId === empresaId)
  }, [empresaId])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalParticipantes = participantes.length
    const ativos = participantes.filter(p => p.status === 'ativo').length
    const riscoAlto = participantes.filter(p => p.riscoSaude === 'alto').length
    const riscoMedio = participantes.filter(p => p.riscoSaude === 'medio').length
    const riscoBaixo = participantes.filter(p => p.riscoSaude === 'baixo').length
    const comAlertas = participantes.filter(p => p.alertasPendentes > 0).length
    
    const mediaPHQ9 = participantes.length > 0 
      ? participantes.reduce((acc, p) => acc + p.phq9Score, 0) / participantes.length 
      : 0
    const mediaGAD7 = participantes.length > 0 
      ? participantes.reduce((acc, p) => acc + p.gad7Score, 0) / participantes.length 
      : 0

    return {
      totalParticipantes,
      ativos,
      riscoAlto,
      riscoMedio,
      riscoBaixo,
      comAlertas,
      mediaPHQ9,
      mediaGAD7,
      taxaAdesao: empresa.adesao
    }
  }, [participantes, empresa])

  // Dashboard cards data
  const cards: DashboardCardProps[] = useMemo(() => [
    {
      title: 'Participantes',
      value: stats.totalParticipantes,
      icon: 'iconoir:community',
      variant: 'primary'
    },
    {
      title: 'Taxa de Adesão',
      value: `${stats.taxaAdesao.toFixed(1)}%`,
      icon: 'iconoir:percent-rotate-clockwise',
      variant: 'success'
    },
    {
      title: 'PHQ-9 Médio',
      value: stats.mediaPHQ9.toFixed(1),
      icon: 'iconoir:stats-report',
      variant: stats.mediaPHQ9 >= 15 ? 'danger' : stats.mediaPHQ9 >= 10 ? 'warning' : 'info'
    },
    {
      title: 'GAD-7 Médio',
      value: stats.mediaGAD7.toFixed(1),
      icon: 'iconoir:stats-up-square',
      variant: stats.mediaGAD7 >= 15 ? 'danger' : stats.mediaGAD7 >= 10 ? 'warning' : 'info'
    }
  ], [stats])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleRelatoriosClick = () => {
    router.push('/empresa/relatorios/geral')
  }

  // Get trend icon and color
  const getTendencia = (score: number) => {
    if (score >= 15) return { icon: 'iconoir:trending-down', color: 'danger', label: 'Piora' }
    if (score >= 10) return { icon: 'iconoir:trending', color: 'warning', label: 'Estável' }
    return { icon: 'iconoir:trending-up', color: 'success', label: 'Melhora' }
  }

  // Format date
  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR')
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <PageTitle title={`Dashboard - ${empresa.nomeCurto}`} />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-0">Acompanhamento dos resultados da sua empresa</p>
              <small className="text-muted">
                <IconifyIcon icon="iconoir:building" className="me-1" />
                {empresa.funcionarios.toLocaleString()} funcionários cadastrados
              </small>
            </div>
            <div className="d-flex gap-2">
              <Link href="/empresa/participantes">
                <Button variant="outline-primary" size="sm">
                  <IconifyIcon icon="iconoir:community" className="me-1" />
                  Ver Participantes
                </Button>
              </Link>
              <Link href="/empresa/relatorios/geral">
                <Button variant="primary" size="sm">
                  <IconifyIcon icon="iconoir:reports" className="me-1" />
                  Relatórios
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <DashboardCards 
        cards={cards}
        showManualCard={true}
        manualCardOnClick={handleRelatoriosClick}
      />

      {/* Risk Distribution and Alerts */}
      <Row className="mt-4">
        <Col xl={4}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Distribuição de Risco</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="mb-0">{stats.totalParticipantes}</h3>
                <small className="text-muted">Participantes Ativos</small>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-danger fw-bold">
                    <IconifyIcon icon="iconoir:warning-circle" className="me-1" />
                    Risco Alto
                  </span>
                  <span className="text-danger">{stats.riscoAlto}</span>
                </div>
                <ProgressBar 
                  now={(stats.riscoAlto / stats.totalParticipantes) * 100} 
                  variant="danger" 
                  style={{ height: '12px' }}
                />
                <small className="text-muted">PHQ-9 ≥ 15 ou GAD-7 ≥ 15</small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-warning fw-bold">
                    <IconifyIcon icon="iconoir:warning-triangle" className="me-1" />
                    Risco Médio
                  </span>
                  <span className="text-warning">{stats.riscoMedio}</span>
                </div>
                <ProgressBar 
                  now={(stats.riscoMedio / stats.totalParticipantes) * 100} 
                  variant="warning" 
                  style={{ height: '12px' }}
                />
                <small className="text-muted">PHQ-9 10-14 ou GAD-7 10-14</small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-success fw-bold">
                    <IconifyIcon icon="iconoir:check-circle" className="me-1" />
                    Risco Baixo
                  </span>
                  <span className="text-success">{stats.riscoBaixo}</span>
                </div>
                <ProgressBar 
                  now={(stats.riscoBaixo / stats.totalParticipantes) * 100} 
                  variant="success" 
                  style={{ height: '12px' }}
                />
                <small className="text-muted">PHQ-9 ≤ 9 e GAD-7 ≤ 9</small>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span>Com Alertas Pendentes</span>
                <Badge bg={stats.comAlertas > 0 ? 'danger' : 'success'} pill>
                  {stats.comAlertas}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="mb-4">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Participantes em Destaque</h5>
              <Link href="/empresa/participantes">
                <Button variant="outline-primary" size="sm">Ver Todos</Button>
              </Link>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Participante</th>
                      <th className="text-center">Cargo</th>
                      <th className="text-center">PHQ-9</th>
                      <th className="text-center">GAD-7</th>
                      <th className="text-center">Risco</th>
                      <th className="text-center">Tendência</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.slice(0, 5).map((participante) => {
                      const tendencia = getTendencia(participante.phq9Score)
                      return (
                        <tr key={participante.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                                style={{
                                  width: '35px',
                                  height: '35px',
                                  backgroundColor: participante.riscoSaude === 'alto' ? '#DC3545' : 
                                                 participante.riscoSaude === 'medio' ? '#FFC107' : '#28A745',
                                  fontSize: '12px'
                                }}
                              >
                                {getInitials(participante.nome)}
                              </div>
                              <div>
                                <div className="fw-bold small">{participante.nome}</div>
                                <small className="text-muted">{participante.departamento}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <small>{participante.cargo}</small>
                          </td>
                          <td className="text-center">
                            <Badge bg={participante.phq9Score >= 15 ? 'danger' : participante.phq9Score >= 10 ? 'warning' : 'success'}>
                              {participante.phq9Score}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg={participante.gad7Score >= 15 ? 'danger' : participante.gad7Score >= 10 ? 'warning' : 'success'}>
                              {participante.gad7Score}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg={participante.riscoSaude === 'alto' ? 'danger' : participante.riscoSaude === 'medio' ? 'warning' : 'success'}>
                              {participante.riscoSaude === 'alto' ? 'Alto' : participante.riscoSaude === 'medio' ? 'Médio' : 'Baixo'}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <span className={`text-${tendencia.color} small`}>
                              <IconifyIcon icon={tendencia.icon} className="me-1" />
                              {tendencia.label}
                            </span>
                          </td>
                          <td className="text-center">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => router.push('/empresa/participantes')}
                            >
                              <IconifyIcon icon="iconoir:page" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Alerts and Quick Actions */}
      <Row>
        <Col xl={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <IconifyIcon icon="iconoir:bell" className="me-2" />
                Alertas Recentes
              </h5>
            </Card.Header>
            <Card.Body>
              {alertasEmpresa.length > 0 ? (
                <ListGroup variant="flush">
                  {alertasEmpresa.slice(0, 5).map((alerta) => (
                    <ListGroup.Item key={alerta.id} className="px-0">
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          <IconifyIcon 
                            icon={alerta.prioridade === 'critica' ? 'iconoir:warning-circle' : 
                                  alerta.prioridade === 'alta' ? 'iconoir:warning-triangle' : 'iconoir:info-circle'}
                            className={`text-${alerta.prioridade === 'critica' ? 'dark' : alerta.prioridade === 'alta' ? 'danger' : 'warning'} fs-5`}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{alerta.titulo}</h6>
                          <p className="mb-1 small text-muted">{alerta.mensagem}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {new Date(alerta.dataCriacao).toLocaleDateString('pt-BR')}
                            </small>
                            <Badge bg={alerta.status === 'pendente' ? 'danger' : alerta.status === 'em_andamento' ? 'warning' : 'success'}>
                              {alerta.status === 'pendente' ? 'Pendente' : alerta.status === 'em_andamento' ? 'Em Andamento' : 'Resolvido'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <IconifyIcon icon="iconoir:check-circle" className="text-success fs-1 mb-2" />
                  <p className="text-muted mb-0">Nenhum alerta pendente</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <IconifyIcon icon="iconoir:fast-arrow-right" className="me-2" />
                Ações Rápidas
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <Link href="/empresa/participantes">
                    <Card className="h-100 cursor-pointer hover-shadow">
                      <Card.Body className="text-center">
                        <IconifyIcon icon="iconoir:community" className="text-primary fs-2 mb-2" />
                        <h6 className="mb-1">Gerenciar Participantes</h6>
                        <small className="text-muted">Ver lista completa</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={6} className="mb-3">
                  <Link href="/empresa/relatorios/geral">
                    <Card className="h-100 cursor-pointer hover-shadow">
                      <Card.Body className="text-center">
                        <IconifyIcon icon="iconoir:reports" className="text-success fs-2 mb-2" />
                        <h6 className="mb-1">Relatórios</h6>
                        <small className="text-muted">Exportar dados</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={6} className="mb-3">
                  <Link href="/empresa/relatorios/semaforo">
                    <Card className="h-100 cursor-pointer hover-shadow">
                      <Card.Body className="text-center">
                        <IconifyIcon icon="iconoir:warning-triangle" className="text-danger fs-2 mb-2" />
                        <h6 className="mb-1">Alertas de Risco</h6>
                        <small className="text-muted">Monitorar casos críticos</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
                <Col md={6} className="mb-3">
                  <Link href="/empresa/relatorios/graficos">
                    <Card className="h-100 cursor-pointer hover-shadow">
                      <Card.Body className="text-center">
                        <IconifyIcon icon="iconoir:clipboard-check" className="text-info fs-2 mb-2" />
                        <h6 className="mb-1">Questionários</h6>
                        <small className="text-muted">Ver disponíveis</small>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
