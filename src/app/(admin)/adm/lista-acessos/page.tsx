'use client'

import { useState } from 'react'
import { Card, Table, Badge, Form, Row, Col, Button, Alert, Modal } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Acesso {
  id: number
  usuario: string
  email: string
  tipo: 'admin' | 'empresa' | 'participante'
  empresa?: string
  ultimoAcesso: string
  ip: string
  dispositivo: string
  status: 'online' | 'offline' | 'bloqueado'
  sessaoAtiva: boolean
}

const acessosDemo: Acesso[] = [
  { id: 1, usuario: 'Administrador', email: 'admin@rumosaudavel.com', tipo: 'admin', ultimoAcesso: 'Agora', ip: '192.168.1.100', dispositivo: 'Chrome / Windows', status: 'online', sessaoAtiva: true },
  { id: 2, usuario: 'Carlos Silva', email: 'carlos@techcorp.com', tipo: 'empresa', empresa: 'TechCorp Brasil', ultimoAcesso: '2 min atrás', ip: '192.168.1.105', dispositivo: 'Firefox / MacOS', status: 'online', sessaoAtiva: true },
  { id: 3, usuario: 'Maria Santos', email: 'maria@inovacao.com', tipo: 'empresa', empresa: 'Inovação Ltda', ultimoAcesso: '15 min atrás', ip: '192.168.1.110', dispositivo: 'Chrome / Windows', status: 'offline', sessaoAtiva: false },
  { id: 4, usuario: 'João Pereira', email: 'joao.participante@email.com', tipo: 'participante', empresa: 'Saúde Corp', ultimoAcesso: '1 hora atrás', ip: '192.168.1.115', dispositivo: 'Safari / iPhone', status: 'offline', sessaoAtiva: false },
  { id: 5, usuario: 'Ana Costa', email: 'ana@empresaabc.com', tipo: 'empresa', empresa: 'Empresa ABC', ultimoAcesso: '2 horas atrás', ip: '192.168.1.120', dispositivo: 'Chrome / Android', status: 'bloqueado', sessaoAtiva: false },
]

export default function ListaAcessosPage() {
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [showEncerrarModal, setShowEncerrarModal] = useState(false)
  const [acessoSelecionado, setAcessoSelecionado] = useState<Acesso | null>(null)

  const acessosFiltrados = acessosDemo.filter(a => {
    const matchTipo = !filtroTipo || a.tipo === filtroTipo
    const matchStatus = !filtroStatus || a.status === filtroStatus
    return matchTipo && matchStatus
  })

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      admin: 'danger',
      empresa: 'primary',
      participante: 'success',
    }
    const labels: Record<string, string> = {
      admin: 'Administrador',
      empresa: 'Empresa',
      participante: 'Participante',
    }
    return <Badge bg={colors[tipo]}>{labels[tipo]}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      online: 'success',
      offline: 'secondary',
      bloqueado: 'danger',
    }
    return <Badge bg={colors[status]}>{status}</Badge>
  }

  const handleEncerrarSessao = (acesso: Acesso) => {
    setAcessoSelecionado(acesso)
    setShowEncerrarModal(true)
  }

  const confirmarEncerramento = () => {
    setShowEncerrarModal(false)
    setAcessoSelecionado(null)
  }

  const onlineCount = acessosDemo.filter(a => a.status === 'online').length

  return (
    <>
      <PageTitle title="Lista de Acessos" subName="Controle de sessões e acessos ao sistema" />

      {onlineCount > 0 && (
        <Alert variant="info" className="mb-4">
          <IconifyIcon icon="fa:users" className="me-2" />
          <strong>{onlineCount} usuário(s)</strong> estão online no momento.
        </Alert>
      )}

      <Row className="mb-4">
        <Col xl={3} md={6}>
          <Card className="bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Online</h6>
                <h3 className="mb-0">{onlineCount}</h3>
              </div>
              <IconifyIcon icon="fa:signal" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-secondary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Offline</h6>
                <h3 className="mb-0">{acessosDemo.filter(a => a.status === 'offline').length}</h3>
              </div>
              <IconifyIcon icon="fa:power-off" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-danger text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Bloqueados</h6>
                <h3 className="mb-0">{acessosDemo.filter(a => a.status === 'bloqueado').length}</h3>
              </div>
              <IconifyIcon icon="fa:ban" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Sessões Ativas</h6>
                <h3 className="mb-0">{acessosDemo.filter(a => a.sessaoAtiva).length}</h3>
              </div>
              <IconifyIcon icon="fa:desktop" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ComponentContainerCard title="Filtros">
        <Row>
          <Col lg={4} md={6} className="mb-3">
            <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="admin">Administrador</option>
              <option value="empresa">Empresa</option>
              <option value="participante">Participante</option>
            </Form.Select>
          </Col>
          <Col lg={4} md={6} className="mb-3">
            <Form.Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="bloqueado">Bloqueado</option>
            </Form.Select>
          </Col>
          <Col lg={4} md={6} className="mb-3">
            <Button variant="outline-danger">
              <IconifyIcon icon="fa:ban" className="me-1" />
              Encerrar Todas as Sessões
            </Button>
          </Col>
        </Row>
      </ComponentContainerCard>

      <ComponentContainerCard title={`Acessos (${acessosFiltrados.length})`}>
        <Table responsive className="mb-0">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Tipo</th>
              <th>Empresa</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>IP</th>
              <th>Dispositivo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {acessosFiltrados.map((acesso) => (
              <tr key={acesso.id}>
                <td>
                  <div className="fw-medium">{acesso.usuario}</div>
                  <small className="text-muted">{acesso.email}</small>
                </td>
                <td>{getTipoBadge(acesso.tipo)}</td>
                <td>{acesso.empresa || '-'}</td>
                <td>{getStatusBadge(acesso.status)}</td>
                <td>{acesso.ultimoAcesso}</td>
                <td><small className="text-muted">{acesso.ip}</small></td>
                <td><small>{acesso.dispositivo}</small></td>
                <td>
                  {acesso.sessaoAtiva && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 text-danger"
                      onClick={() => handleEncerrarSessao(acesso)}
                    >
                      <IconifyIcon icon="fa:power-off" />
                    </Button>
                  )}
                  <Button variant="link" size="sm" className="p-0 ms-2">
                    <IconifyIcon icon="fa:history" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {acessosFiltrados.length === 0 && (
          <div className="text-center py-5">
            <IconifyIcon icon="fa:user-slash" className="display-4 text-muted mb-3" />
            <h5>Nenhum acesso encontrado</h5>
            <p className="text-muted">Ajuste os filtros para ver mais resultados</p>
          </div>
        )}
      </ComponentContainerCard>

      <Modal show={showEncerrarModal} onHide={() => setShowEncerrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Encerrar Sessão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja encerrar a sessão de <strong>{acessoSelecionado?.usuario}</strong>?</p>
          <p className="text-muted mb-0">O usuário será desconectado imediatamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEncerrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEncerramento}>
            <IconifyIcon icon="fa:power-off" className="me-1" />
            Encerrar Sessão
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
