'use client'

import { useState } from 'react'
import { Card, Row, Col, Badge, ProgressBar, Table, Tabs, Tab, Alert, Button } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

// DADOS REALISTAS DAS EMPRESAS
const empresasDemo = [
  { 
    id: 1, 
    nome: 'Petrobras - Refinaria Abreu e Lima', 
    cnpj: '33.000.167/0001-01',
    setor: 'Petróleo e Gás',
    funcionarios: 2847,
    participantes: 2156,
    adesao: 75.7,
    phq9Medio: 8.4,
    gad7Medio: 6.2,
    riscoAlto: 12,
    riscoMedio: 89,
    riscoBaixo: 2055,
    status: 'ativo',
    ultimaAvaliacao: '10/02/2026'
  },
  { 
    id: 2, 
    nome: 'Vale S.A. - Mina de Carajás', 
    cnpj: '33.592.510/0001-54',
    setor: 'Mineração',
    funcionarios: 4520,
    participantes: 3891,
    adesao: 86.1,
    phq9Medio: 7.1,
    gad7Medio: 5.8,
    riscoAlto: 8,
    riscoMedio: 124,
    riscoBaixo: 3759,
    status: 'ativo',
    ultimaAvaliacao: '09/02/2026'
  },
  { 
    id: 3, 
    nome: 'Itaú Unibanco - Sede Curitiba', 
    cnpj: '60.872.504/0001-23',
    setor: 'Financeiro',
    funcionarios: 1234,
    participantes: 1102,
    adesao: 89.3,
    phq9Medio: 6.8,
    gad7Medio: 5.2,
    riscoAlto: 5,
    riscoMedio: 67,
    riscoBaixo: 1030,
    status: 'ativo',
    ultimaAvaliacao: '11/02/2026'
  },
  { 
    id: 4, 
    nome: 'Ambev - Fábrica Recife', 
    cnpj: '07.526.557/0001-00',
    setor: 'Bebidas',
    funcionarios: 892,
    participantes: 756,
    adesao: 84.8,
    phq9Medio: 7.9,
    gad7Medio: 6.1,
    riscoAlto: 9,
    riscoMedio: 71,
    riscoBaixo: 676,
    status: 'ativo',
    ultimaAvaliacao: '08/02/2026'
  },
  { 
    id: 5, 
    nome: 'Hospital das Clínicas - FMUSP', 
    cnpj: '56.258.599/0001-66',
    setor: 'Saúde',
    funcionarios: 1567,
    participantes: 1423,
    adesao: 90.8,
    phq9Medio: 9.2,
    gad7Medio: 7.8,
    riscoAlto: 18,
    riscoMedio: 142,
    riscoBaixo: 1263,
    status: 'ativo',
    ultimaAvaliacao: '11/02/2026'
  },
]

// PARTICIPANTES COM ALERTAS
const participantesAlerta = [
  { id: 452, nome: 'Ana Carolina Silva', empresa: 'Hospital das Clínicas', cargo: 'Enfermeira', phq9: 18, gad7: 15, status: 'risco_alto', dataAvaliacao: '10/02/2026' },
  { id: 891, nome: 'Roberto Almeida', empresa: 'Petrobras', cargo: 'Operador', phq9: 16, gad7: 12, status: 'risco_alto', dataAvaliacao: '09/02/2026' },
  { id: 2234, nome: 'Juliana Costa', empresa: 'Vale S.A.', cargo: 'Engenheira', phq9: 15, gad7: 14, status: 'risco_medio', dataAvaliacao: '11/02/2026' },
  { id: 1156, nome: 'Marcos Vinícius', empresa: 'Ambev', cargo: 'Supervisor', phq9: 17, gad7: 11, status: 'risco_alto', dataAvaliacao: '08/02/2026' },
  { id: 3342, nome: 'Fernanda Lima', empresa: 'Itaú', cargo: 'Analista', phq9: 14, gad7: 13, status: 'risco_medio', dataAvaliacao: '10/02/2026' },
]

// DADOS DOS PROGRAMAS ATIVOS
const programasAtivos = [
  { 
    id: 1, 
    nome: 'Programa de Saúde Mental 2025', 
    descricao: 'Avaliação e acompanhamento trimestral de todos os colaboradores',
    empresas: 5,
    participantes: 9328,
    questionariosAplicados: 28456,
    taxaResposta: 87.3,
    dataInicio: '01/01/2025',
    dataFim: '31/12/2025',
    status: 'ativo'
  },
  { 
    id: 2, 
    nome: 'Campanha de Prevenção ao Burnout', 
    descricao: 'Foco em setores de alta pressão como saúde e financeiro',
    empresas: 2,
    participantes: 2801,
    questionariosAplicados: 8403,
    taxaResposta: 92.1,
    dataInicio: '01/06/2025',
    dataFim: '30/06/2026',
    status: 'ativo'
  },
]

// MÉTRICAS GLOBAIS
const metricasGlobais = {
  totalParticipantes: 9328,
  totalEmpresas: 5,
  totalAvaliacoes: 28456,
  adesaoGlobal: 87.3,
  phq9MedioGlobal: 7.6,
  gad7MedioGlobal: 6.1,
  riscoAltoGlobal: 52,
  emAcompanhamento: 189,
  altas: 45,
}

// DADOS PARA GRÁFICO DE EVOLUÇÃO
const evolucaoMensal = [
  { mes: 'Ago/25', phq9: 8.2, gad7: 6.8, participantes: 8210 },
  { mes: 'Set/25', phq9: 8.0, gad7: 6.5, participantes: 8450 },
  { mes: 'Out/25', phq9: 7.8, gad7: 6.3, participantes: 8790 },
  { mes: 'Nov/25', phq9: 7.7, gad7: 6.2, participantes: 8950 },
  { mes: 'Dez/25', phq9: 7.6, gad7: 6.1, participantes: 9100 },
  { mes: 'Jan/26', phq9: 7.6, gad7: 6.1, participantes: 9328 },
]

// ALERTAS RECENTES
const alertasRecentes = [
  { id: 1, tipo: 'risco', mensagem: 'Ana Carolina Silva (HC) - PHQ-9: 18 (Risco Severo)', data: '10/02/2026 14:30', icon: 'fa:exclamation-circle' },
  { id: 2, tipo: 'info', mensagem: 'Relatório mensal disponível para download', data: '10/02/2026 10:00', icon: 'fa:file-alt' },
  { id: 3, tipo: 'risco', mensagem: 'Roberto Almeida (Petrobras) - PHQ-9: 16 (Risco Moderado-Severo)', data: '09/02/2026 16:45', icon: 'fa:exclamation-circle' },
  { id: 4, tipo: 'success', mensagem: 'Meta de 85% de adesão alcançada na Vale S.A.', data: '09/02/2026 09:15', icon: 'fa:check-circle' },
  { id: 5, tipo: 'warning', mensagem: '47 participantes pendentes de reavaliação na Ambev', data: '08/02/2026 11:20', icon: 'fa:clock' },
]

export default function DemoCompletaPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const getRiscoBadge = (phq9: number) => {
    if (phq9 >= 15) return <Badge bg="danger">Risco Severo</Badge>
    if (phq9 >= 10) return <Badge bg="warning">Risco Moderado</Badge>
    if (phq9 >= 5) return <Badge bg="info">Risco Leve</Badge>
    return <Badge bg="success">Mínimo</Badge>
  }

  return (
    <>
      <PageTitle title="Demonstração Completa" subName="Sistema Rumo Saudável - Dados Reais Simulados" />

      {/* ALERTA DE DEMO */}
      <Alert variant="info" className="mb-4">
        <div className="d-flex align-items-center">
          <IconifyIcon icon="fa:info-circle" className="fs-3 me-3" />
          <div>
            <strong>Modo Demonstração</strong>
            <p className="mb-0">
              Esta é uma demonstração do sistema com dados simulados baseados em cenários reais de empresas brasileiras. 
              Todos os dados apresentados são fictícios e para fins de demonstração apenas.
            </p>
          </div>
        </div>
      </Alert>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="mb-3">
        {/* TAB DASHBOARD */}
        <Tab eventKey="dashboard" title={<>Dashboard</>}>
          {/* MÉTRICAS GLOBAIS */}
          <Row className="mb-4">
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-primary text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:users" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.totalParticipantes.toLocaleString()}</h4>
                  <small>Participantes</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-success text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:building" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.totalEmpresas}</h4>
                  <small>Empresas</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-info text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:clipboard-check" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.adesaoGlobal}%</h4>
                  <small>Adesão Global</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-warning text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:exclamation-triangle" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.riscoAltoGlobal}</h4>
                  <small>Risco Alto</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-secondary text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:user-md" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.emAcompanhamento}</h4>
                  <small>Em Acompanhamento</small>
                </Card.Body>
              </Card>
            </Col>
            <Col xl={2} md={4} sm={6}>
              <Card className="bg-success text-white h-100">
                <Card.Body className="text-center">
                  <IconifyIcon icon="fa:heartbeat" className="fs-1 mb-2 opacity-75" />
                  <h4 className="mb-0">{metricasGlobais.altas}</h4>
                  <small>Altas no Mês</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={8}>
              <ComponentContainerCard title="Evolução dos Indicadores (Últimos 6 Meses)">
                <div className="mb-4">
                  <h6 className="mb-3">PHQ-9 Médio (Escala de Depressão)</h6>
                  <div className="d-flex align-items-end gap-2" style={{ height: '150px' }}>
                    {evolucaoMensal.map((dado, i) => (
                      <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                        <div className="position-relative w-100">
                          <div 
                            className="bg-danger rounded-top mx-auto" 
                            style={{ 
                              width: '60%', 
                              height: `${(dado.phq9 / 20) * 120}px`,
                              opacity: 0.8 
                            }}
                          />
                          <div className="position-absolute top-0 start-50 translate-middle-x text-center">
                            <small className="fw-bold">{dado.phq9}</small>
                          </div>
                        </div>
                        <small className="text-muted mt-1">{dado.mes}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">GAD-7 Médio (Escala de Ansiedade)</h6>
                <div className="d-flex align-items-end gap-2" style={{ height: '150px' }}>
                  {evolucaoMensal.map((dado, i) => (
                    <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                      <div className="position-relative w-100">
                        <div 
                          className="bg-warning rounded-top mx-auto" 
                          style={{ 
                            width: '60%', 
                            height: `${(dado.gad7 / 15) * 120}px`,
                            opacity: 0.8 
                          }}
                        />
                        <div className="position-absolute top-0 start-50 translate-middle-x text-center">
                          <small className="fw-bold">{dado.gad7}</small>
                        </div>
                      </div>
                      <small className="text-muted mt-1">{dado.mes}</small>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </Col>

            <Col xl={4}>
              <ComponentContainerCard title="Alertas Recentes">
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {alertasRecentes.map((alerta) => (
                    <div key={alerta.id} className="d-flex gap-3 mb-3 pb-3 border-bottom last-border-0">
                      <div className={`flex-shrink-0 mt-1`}>
                        <IconifyIcon 
                          icon={alerta.icon}
                          className={`text-${alerta.tipo === 'risco' ? 'danger' : alerta.tipo}`}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 small">{alerta.mensagem}</p>
                        <small className="text-muted">{alerta.data}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentContainerCard>
            </Col>
          </Row>
        </Tab>

        {/* TAB EMPRESAS */}
        <Tab eventKey="empresas" title={<>Empresas</>}>
          <ComponentContainerCard title="Empresas Participantes">
            <div className="d-flex justify-content-end mb-3">
              <Link href="/adm/adicionar-empresa" className="btn btn-primary btn-sm">
                <IconifyIcon icon="fa:plus" className="me-1" />
                Nova Empresa
              </Link>
            </div>
            <Table responsive className="mb-0">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Setor</th>
                  <th>Funcionários</th>
                  <th>Participantes</th>
                  <th>Adesão</th>
                  <th>PHQ-9 Médio</th>
                  <th>GAD-7 Médio</th>
                  <th>Risco Alto</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {empresasDemo.map((empresa) => (
                  <tr key={empresa.id}>
                    <td>
                      <div className="fw-medium">{empresa.nome}</div>
                      <small className="text-muted">{empresa.cnpj}</small>
                    </td>
                    <td>{empresa.setor}</td>
                    <td>{empresa.funcionarios.toLocaleString()}</td>
                    <td>{empresa.participantes.toLocaleString()}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <ProgressBar 
                          now={empresa.adesao} 
                          variant={empresa.adesao >= 80 ? 'success' : 'warning'}
                          style={{ width: '50px', height: '8px' }}
                          className="me-2"
                        />
                        <small>{empresa.adesao}%</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg={empresa.phq9Medio >= 10 ? 'warning' : empresa.phq9Medio >= 5 ? 'info' : 'success'}>
                        {empresa.phq9Medio}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={empresa.gad7Medio >= 10 ? 'warning' : empresa.gad7Medio >= 5 ? 'info' : 'success'}>
                        {empresa.gad7Medio}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="danger">{empresa.riscoAlto}</Badge>
                    </td>
                    <td>
                      <Badge bg="success">{empresa.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentContainerCard>
        </Tab>

        {/* TAB ALERTAS */}
        <Tab eventKey="alertas" title={<>Alertas de Risco</>}>
          <ComponentContainerCard title="Participantes em Risco">
            <div className="d-flex justify-content-end mb-3">
              <Badge bg="danger" className="fs-6">{participantesAlerta.length} alertas</Badge>
            </div>
            <Alert variant="danger">
              <IconifyIcon icon="fa:exclamation-triangle" className="me-2" />
              <strong>Atenção:</strong> Os participantes abaixo apresentaram pontuações elevadas nos questionários de saúde mental. 
              Recomenda-se contato prioritário.
            </Alert>

            <Table responsive className="mb-0">
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Empresa</th>
                  <th>Cargo</th>
                  <th>PHQ-9</th>
                  <th>GAD-7</th>
                  <th>Status</th>
                  <th>Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {participantesAlerta.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
                          <small>{p.nome.charAt(0)}</small>
                        </div>
                        <span className="fw-medium">{p.nome}</span>
                      </div>
                    </td>
                    <td>{p.empresa}</td>
                    <td>{p.cargo}</td>
                    <td>
                      <Badge bg="danger" className="fs-6">{p.phq9}</Badge>
                    </td>
                    <td>
                      <Badge bg="danger" className="fs-6">{p.gad7}</Badge>
                    </td>
                    <td>{getRiscoBadge(p.phq9)}</td>
                    <td>{p.dataAvaliacao}</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-1">
                        <IconifyIcon icon="fa:phone" />
                      </Button>
                      <Button variant="info" size="sm">
                        <IconifyIcon icon="fa:eye" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentContainerCard>
        </Tab>

        {/* TAB PROGRAMAS */}
        <Tab eventKey="programas" title={<>Programas</>}>
          <Row>
            {programasAtivos.map((programa) => (
              <Col xl={6} key={programa.id} className="mb-3">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">{programa.nome}</h6>
                    <Badge bg="success">{programa.status}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted">{programa.descricao}</p>
                    
                    <Row className="mt-3">
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Empresas</small>
                        <h5 className="mb-0">{programa.empresas}</h5>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Participantes</small>
                        <h5 className="mb-0">{programa.participantes.toLocaleString()}</h5>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Avaliações</small>
                        <h5 className="mb-0">{programa.questionariosAplicados.toLocaleString()}</h5>
                      </Col>
                      <Col xs={6} className="mb-2">
                        <small className="text-muted">Taxa de Resposta</small>
                        <h5 className="mb-0 text-success">{programa.taxaResposta}%</h5>
                      </Col>
                    </Row>

                    <hr />

                    <div className="d-flex justify-content-between small text-muted">
                      <span>Início: {programa.dataInicio}</span>
                      <span>Término: {programa.dataFim}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>

      {/* BOTÕES DE AÇÃO */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link href="/auth/login" className="btn btn-primary btn-lg">
          <IconifyIcon icon="fa:sign-in-alt" className="me-2" />
          Acessar Sistema
        </Link>
        <Link href="/adm/dashboard-analytics" className="btn btn-outline-primary btn-lg">
          <IconifyIcon icon="fa:chart-line" className="me-2" />
          Ver Analytics Completo
        </Link>
      </div>
    </>
  )
}
