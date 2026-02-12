'use client'

import { useState } from 'react'
import { Card, Button, Badge, Table, Form, Modal, Row, Col, Tabs, Tab } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Notificacao {
  id: number
  titulo: string
  mensagem: string
  tipo: 'lembrete' | 'alerta' | 'info' | 'sucesso'
  destinatario: string
  dataEnvio: string
  status: 'pendente' | 'enviado' | 'lido' | 'falhou'
  canal: 'email' | 'sms' | 'push' | 'todos'
}

interface Template {
  id: number
  nome: string
  assunto: string
  corpo: string
  tipo: 'boas_vindas' | 'lembrete' | 'alerta' | 'relatorio'
}

const notificacoesDemo: Notificacao[] = [
  { id: 1, titulo: 'Lembrete: Questionário PHQ-9', mensagem: 'Você tem um questionário pendente', tipo: 'lembrete', destinatario: 'João Silva', dataEnvio: '2026-02-10 09:00', status: 'enviado', canal: 'email' },
  { id: 2, titulo: 'Alerta: Pontuação Alta', mensagem: 'Participante com pontuação de risco identificada', tipo: 'alerta', destinatario: 'Administrador', dataEnvio: '2026-02-10 08:30', status: 'lido', canal: 'push' },
  { id: 3, titulo: 'Bem-vindo ao Programa', mensagem: 'Seu cadastro foi confirmado', tipo: 'info', destinatario: 'Maria Santos', dataEnvio: '2026-02-09 14:00', status: 'lido', canal: 'email' },
  { id: 4, titulo: 'Relatório Semanal', mensagem: 'Seu relatório de acompanhamento está disponível', tipo: 'sucesso', destinatario: 'Empresa ABC', dataEnvio: '2026-02-09 10:00', status: 'enviado', canal: 'todos' },
]

const templatesDemo: Template[] = [
  { id: 1, nome: 'Boas-vindas', assunto: 'Bem-vindo ao Programa de Bem-estar', corpo: 'Olá {{nome}}, seja bem-vindo...', tipo: 'boas_vindas' },
  { id: 2, nome: 'Lembrete Questionário', assunto: 'Não esqueça de responder', corpo: 'Olá {{nome}}, você tem questionários pendentes...', tipo: 'lembrete' },
  { id: 3, nome: 'Alerta de Risco', assunto: 'Atenção necessária', corpo: 'Identificamos que {{nome}} pode precisar de apoio...', tipo: 'alerta' },
]

export default function NotificacoesPage() {
  const [activeTab, setActiveTab] = useState('enviadas')
  const [showModal, setShowModal] = useState(false)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesDemo)
  const [templates] = useState<Template[]>(templatesDemo)

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      lembrete: 'warning',
      alerta: 'danger',
      info: 'info',
      sucesso: 'success',
    }
    return <Badge bg={colors[tipo] || 'secondary'}>{tipo}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pendente: 'secondary',
      enviado: 'primary',
      lido: 'success',
      falhou: 'danger',
    }
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>
  }

  const getCanalIcon = (canal: string) => {
    const icons: Record<string, string> = {
      email: 'fa:envelope',
      sms: 'fa:comment',
      push: 'fa:bell',
      todos: 'fa:share-alt',
    }
    return <IconifyIcon icon={icons[canal] || 'fa:circle'} className="me-1" />
  }

  return (
    <>
      <PageTitle title="Central de Notificações" subName="Gerencie lembretes e comunicações" />

      <Row className="mb-4">
        <Col xl={3} md={6}>
          <Card className="bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Total Enviadas</h6>
                <h3 className="mb-0">1,234</h3>
              </div>
              <IconifyIcon icon="fa:paper-plane" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Taxa de Abertura</h6>
                <h3 className="mb-0">78%</h3>
              </div>
              <IconifyIcon icon="fa:envelope-open" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Pendentes</h6>
                <h3 className="mb-0">23</h3>
              </div>
              <IconifyIcon icon="fa:clock" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Falhas</h6>
                <h3 className="mb-0">5</h3>
              </div>
              <IconifyIcon icon="fa:exclamation-circle" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'enviadas')} className="mb-3">
        <Tab eventKey="enviadas" title="Notificações Enviadas">
          <ComponentContainerCard title="Histórico de Notificações">
            <div className="d-flex justify-content-between mb-3">
              <div className="d-flex gap-2">
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Todos os tipos</option>
                  <option>Lembrete</option>
                  <option>Alerta</option>
                  <option>Info</option>
                </Form.Select>
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Todos os status</option>
                  <option>Enviado</option>
                  <option>Lido</option>
                  <option>Pendente</option>
                </Form.Select>
              </div>
              <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>
                <IconifyIcon icon="fa:plus" className="me-1" />
                Nova Notificação
              </Button>
            </div>

            <Table responsive>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Destinatário</th>
                  <th>Canal</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {notificacoes.map((notif) => (
                  <tr key={notif.id}>
                    <td>
                      <div className="fw-medium">{notif.titulo}</div>
                      <small className="text-muted">{notif.mensagem.substring(0, 50)}...</small>
                    </td>
                    <td>{getTipoBadge(notif.tipo)}</td>
                    <td>{notif.destinatario}</td>
                    <td>{getCanalIcon(notif.canal)} {notif.canal}</td>
                    <td>{notif.dataEnvio}</td>
                    <td>{getStatusBadge(notif.status)}</td>
                    <td>
                      <Button variant="link" size="sm" className="p-0">
                        <IconifyIcon icon="fa:eye" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="templates" title="Templates">
          <ComponentContainerCard title="Templates de Mensagens">
            <div className="d-flex justify-content-end mb-3">
              <Button size="sm" variant="primary">
                <IconifyIcon icon="fa:plus" className="me-1" />
                Novo Template
              </Button>
            </div>

            <Row>
              {templates.map((template) => (
                <Col xl={4} md={6} key={template.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Badge bg="primary">{template.tipo}</Badge>
                        <div>
                          <Button variant="link" size="sm" className="p-0 me-2">
                            <IconifyIcon icon="fa:edit" />
                          </Button>
                          <Button variant="link" size="sm" className="p-0 text-danger">
                            <IconifyIcon icon="fa:trash" />
                          </Button>
                        </div>
                      </div>
                      <h6 className="fw-medium mb-1">{template.nome}</h6>
                      <p className="small text-muted mb-2">{template.assunto}</p>
                      <div className="bg-light p-2 rounded small">
                        {template.corpo.substring(0, 80)}...
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="agendadas" title="Notificações Agendadas">
          <ComponentContainerCard title="Agendamentos">
            <div className="text-center py-5">
              <IconifyIcon icon="fa:calendar-alt" className="display-4 text-muted mb-3" />
              <h5>Nenhuma notificação agendada</h5>
              <p className="text-muted">Agende notificações automáticas para lembretes</p>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <IconifyIcon icon="fa:plus" className="me-1" />
                Agendar Notificação
              </Button>
            </div>
          </ComponentContainerCard>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nova Notificação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Tipo de Notificação</Form.Label>
                <Form.Select>
                  <option>Lembrete de Questionário</option>
                  <option>Alerta Personalizado</option>
                  <option>Comunicado Geral</option>
                  <option>Relatório</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Canal de Envio</Form.Label>
                <Form.Select>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="todos">Todos os canais</option>
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Destinatários</Form.Label>
                <Form.Select>
                  <option>Todos os participantes</option>
                  <option>Participantes específicos</option>
                  <option>Por empresa</option>
                  <option>Por programa</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Data de Envio</Form.Label>
                <Form.Control type="datetime-local" />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" placeholder="Título da notificação" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensagem</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Conteúdo da mensagem..." />
              <Form.Text className="text-muted">
                Use {'{{nome}}'}, {'{{empresa}}'}, {'{{programa}}'} para personalização
              </Form.Text>
            </Form.Group>

            <Form.Check 
              type="checkbox" 
              label="Agendar recorrência (lembrete semanal)" 
              className="mb-3"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            <IconifyIcon icon="fa:paper-plane" className="me-1" />
            Enviar Notificação
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
