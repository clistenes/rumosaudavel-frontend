'use client'

import { useState } from 'react'
import { Card, Button, Badge, Tabs, Tab, Table, Form, Row, Col, Alert } from 'react-bootstrap'
import { useRouter, useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'

interface HistoricoCoaching {
  id: number
  data: string
  tipo: string
  descricao: string
  anexos: number
}

interface Contato {
  id: number
  data: string
  horaInicio: string
  horaFim: string
  tipo: string
  resumo: string
}

export default function InfoParticipante() {
  const router = useRouter()
  const params = useParams()
  const participanteId = params.id as string

  const [activeTab, setActiveTab] = useState('dados')
  const [showNovoContato, setShowNovoContato] = useState(false)

  // Dados mockados do participante
  const participante = {
    id: participanteId,
    login: 'joao.silva',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    celular: '(11) 98765-4321',
    faixaEtaria: '26-35',
    sexo: 'Masculino',
    estadoCivil: 'Casado',
    empresa: 'Empresa ABC Ltda',
    setor: 'Administrativo',
    cargo: 'Analista',
    dataCadastro: '15/01/2025',
    ultimoAcesso: '10/02/2025 14:30',
  }

  const historicosCoaching: HistoricoCoaching[] = [
    {
      id: 1,
      data: '05/02/2025',
      tipo: 'Entrevista',
      descricao: 'Avaliação inicial de bem-estar. Participante relatou dificuldades com carga horária.',
      anexos: 2,
    },
    {
      id: 2,
      data: '20/01/2025',
      tipo: 'Acompanhamento',
      descricao: 'Revisão de metas e ajustes no ambiente de trabalho.',
      anexos: 0,
    },
  ]

  const contatos: Contato[] = [
    {
      id: 1,
      data: '10/02/2025',
      horaInicio: '14:00',
      horaFim: '14:30',
      tipo: 'Telefone',
      resumo: 'Agendamento de avaliação presencial',
    },
    {
      id: 2,
      data: '05/02/2025',
      horaInicio: '10:00',
      horaFim: '10:45',
      tipo: 'Presencial',
      resumo: 'Entrevista de acompanhamento inicial',
    },
  ]

  const handleSimularAcesso = () => {
    alert(`Simulando acesso como: ${participante.login}`)
  }

  const getCorTipoContato = (tipo: string) => {
    const cores: { [key: string]: string } = {
      'Telefone': 'primary',
      'Presencial': 'success',
      'Email': 'info',
      'Video': 'warning',
    }
    return cores[tipo] || 'secondary'
  }

  return (
    <>
      <PageTitle title="Informações do Participante" subName="Participantes" />

      {/* Header com info principal */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                style={{ width: '70px', height: '70px', fontSize: '28px' }}
              >
                {participante.nome.charAt(0)}
              </div>
              <div>
                <h4 className="mb-1">{participante.nome}</h4>
                <p className="text-muted mb-1">@{participante.login}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <Badge bg="secondary">{participante.empresa}</Badge>
                  <Badge bg="info">{participante.setor}</Badge>
                  <Badge bg="light" text="dark">{participante.cargo}</Badge>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <Button variant="outline-primary" onClick={handleSimularAcesso}>
                <IconifyIcon icon="iconoir:user-badge-check" className="me-2" />
                Simular Acesso
              </Button>
              <Button variant="outline-secondary">
                <IconifyIcon icon="iconoir:envelope" className="me-2" />
                Enviar Email
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs com informações */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dados')}
        className="mb-4"
      >
        <Tab eventKey="dados" title="Dados Pessoais">
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="mb-3">Informações Básicas</h6>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="bg-light" style={{ width: '40%' }}><strong>Nome</strong></td>
                        <td>{participante.nome}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Login</strong></td>
                        <td>{participante.login}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Email</strong></td>
                        <td>{participante.email}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Celular</strong></td>
                        <td>{participante.celular}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col md={6}>
                  <h6 className="mb-3">Dados Complementares</h6>
                  <Table bordered size="sm">
                    <tbody>
                      <tr>
                        <td className="bg-light" style={{ width: '40%' }}><strong>Faixa Etária</strong></td>
                        <td>{participante.faixaEtaria}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Sexo</strong></td>
                        <td>{participante.sexo}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Estado Civil</strong></td>
                        <td>{participante.estadoCivil}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Setor</strong></td>
                        <td>{participante.setor}</td>
                      </tr>
                      <tr>
                        <td className="bg-light"><strong>Cargo</strong></td>
                        <td>{participante.cargo}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col>
                  <h6 className="mb-3">Informações do Sistema</h6>
                  <div className="d-flex gap-4 flex-wrap">
                    <div>
                      <small className="text-muted">Data de Cadastro:</small>
                      <div className="fw-bold">{participante.dataCadastro}</div>
                    </div>
                    <div>
                      <small className="text-muted">Último Acesso:</small>
                      <div className="fw-bold">{participante.ultimoAcesso}</div>
                    </div>
                    <div>
                      <small className="text-muted">Status:</small>
                      <div><Badge bg="success">Ativo</Badge></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="coaching" title="Histórico de Coaching">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Registros de Intervenção</h6>
                <Button variant="primary" size="sm">
                  <IconifyIcon icon="iconoir:plus" className="me-1" />
                  Novo Registro
                </Button>
              </div>

              {historicosCoaching.map((historico) => (
                <Card key={historico.id} className="mb-3 border-0 bg-light">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <Badge bg="primary" className="me-2">{historico.tipo}</Badge>
                        <span className="text-muted small">{historico.data}</span>
                      </div>
                      <div>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <IconifyIcon icon="iconoir:edit-pencil" />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <IconifyIcon icon="iconoir:trash" />
                        </Button>
                      </div>
                    </div>
                    <p className="mb-2">{historico.descricao}</p>
                    {historico.anexos > 0 && (
                      <div className="small text-muted">
                        <IconifyIcon icon="iconoir:attachment" className="me-1" />
                        {historico.anexos} anexo(s)
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))}

              {historicosCoaching.length === 0 && (
                <Alert variant="light" className="text-center">
                  <IconifyIcon icon="iconoir:clipboard" className="me-2" />
                  Nenhum registro de coaching encontrado
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="contatos" title="Contatos">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Histórico de Contatos</h6>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowNovoContato(true)}
                >
                  <IconifyIcon icon="iconoir:plus" className="me-1" />
                  Registrar Contato
                </Button>
              </div>

              <Table hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Tipo</th>
                    <th>Resumo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contatos.map((contato) => (
                    <tr key={contato.id}>
                      <td>{contato.data}</td>
                      <td>{contato.horaInicio} - {contato.horaFim}</td>
                      <td>
                        <Badge bg={getCorTipoContato(contato.tipo)}>
                          {contato.tipo}
                        </Badge>
                      </td>
                      <td>{contato.resumo}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <IconifyIcon icon="iconoir:edit-pencil" />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <IconifyIcon icon="iconoir:trash" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {contatos.length === 0 && (
                <Alert variant="light" className="text-center">
                  <IconifyIcon icon="iconoir:phone" className="me-2" />
                  Nenhum contato registrado
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="relatorios" title="Relatórios">
          <Card>
            <Card.Body>
              <h6 className="mb-3">Questionários Respondidos</h6>
              
              <Table>
                <thead className="table-light">
                  <tr>
                    <th>Questionário</th>
                    <th className="text-center">Data</th>
                    <th className="text-center">Pontuação</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Avaliação de Saúde Mental</td>
                    <td className="text-center">10/02/2025</td>
                    <td className="text-center">
                      <span className="text-danger fw-bold">78</span>
                    </td>
                    <td className="text-center">
                      <Badge bg="danger">Risco Alto</Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm">
                        <IconifyIcon icon="iconoir:page" className="me-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Bem-estar no Trabalho</td>
                    <td className="text-center">09/02/2025</td>
                    <td className="text-center">
                      <span className="text-warning fw-bold">65</span>
                    </td>
                    <td className="text-center">
                      <Badge bg="warning">Risco Médio</Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm">
                        <IconifyIcon icon="iconoir:page" className="me-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Botões de Ação */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={() => router.back()}
        >
          <IconifyIcon icon="iconoir:navigate-left" className="me-2" />
          Voltar
        </Button>
        
        <Button variant="danger">
          <IconifyIcon icon="iconoir:trash" className="me-2" />
          Excluir Participante
        </Button>
      </div>
    </>
  )
}
