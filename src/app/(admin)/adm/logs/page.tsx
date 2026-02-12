'use client'

import { useState } from 'react'
import { Card, Table, Badge, Form, Row, Col, Pagination, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Log {
  id: number
  data: string
  usuario: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  acao: string
  modulo: string
  ip: string
  detalhes: string
}

const logsDemo: Log[] = [
  { id: 1, data: '10/02/2026 14:30:22', usuario: 'admin@rumosaudavel.com', tipo: 'success', acao: 'LOGIN', modulo: 'Auth', ip: '192.168.1.100', detalhes: 'Login bem-sucedido' },
  { id: 2, data: '10/02/2026 14:28:15', usuario: 'carlos@techcorp.com', tipo: 'info', acao: 'VIEW', modulo: 'Relatórios', ip: '192.168.1.105', detalhes: 'Visualizou relatório analítico' },
  { id: 3, data: '10/02/2026 14:25:00', usuario: 'maria@inovacao.com', tipo: 'success', acao: 'CREATE', modulo: 'Participantes', ip: '192.168.1.110', detalhes: 'Cadastrou participante ID: 452' },
  { id: 4, data: '10/02/2026 14:20:45', usuario: 'admin@rumosaudavel.com', tipo: 'warning', acao: 'UPDATE', modulo: 'Configurações', ip: '192.168.1.100', detalhes: 'Alterou configurações de segurança' },
  { id: 5, data: '10/02/2026 14:15:30', usuario: 'joao@saudecorp.com', tipo: 'error', acao: 'EXPORT', modulo: 'Relatórios', ip: '192.168.1.115', detalhes: 'Falha na exportação: timeout' },
  { id: 6, data: '10/02/2026 14:10:12', usuario: 'admin@rumosaudavel.com', tipo: 'success', acao: 'DELETE', modulo: 'Usuários', ip: '192.168.1.100', detalhes: 'Removeu usuário ID: 89' },
  { id: 7, data: '10/02/2026 14:05:00', usuario: 'carlos@techcorp.com', tipo: 'info', acao: 'VIEW', modulo: 'Dashboard', ip: '192.168.1.105', detalhes: 'Acessou dashboard analytics' },
]

export default function LogsPage() {
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroData, setFiltroData] = useState('')

  const logsFiltrados = logsDemo.filter(log => {
    const matchTipo = !filtroTipo || log.tipo === filtroTipo
    const matchModulo = !filtroModulo || log.modulo === filtroModulo
    const matchData = !filtroData || log.data.includes(filtroData)
    return matchTipo && matchModulo && matchData
  })

  const getTipoBadge = (tipo: string) => {
    const configs: Record<string, { bg: string; icon: string }> = {
      info: { bg: 'info', icon: 'fa:info-circle' },
      success: { bg: 'success', icon: 'fa:check-circle' },
      warning: { bg: 'warning', icon: 'fa:exclamation-triangle' },
      error: { bg: 'danger', icon: 'fa:times-circle' },
    }
    const config = configs[tipo]
    return (
      <Badge bg={config.bg}>
        <IconifyIcon icon={config.icon} className="me-1" />
        {tipo.toUpperCase()}
      </Badge>
    )
  }

  return (
    <>
      <PageTitle title="Logs do Sistema" subName="Auditoria e rastreamento de ações" />

      <Row className="mb-4">
        <Col xl={3} md={6}>
          <Card className="bg-info text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Logs Hoje</h6>
                <h3 className="mb-0">1,234</h3>
              </div>
              <IconifyIcon icon="fa:file-alt" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Sucessos</h6>
                <h3 className="mb-0">1,156</h3>
              </div>
              <IconifyIcon icon="fa:check" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Alertas</h6>
                <h3 className="mb-0">45</h3>
              </div>
              <IconifyIcon icon="fa:exclamation" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-danger text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Erros</h6>
                <h3 className="mb-0">33</h3>
              </div>
              <IconifyIcon icon="fa:bug" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ComponentContainerCard title="Filtros">
        <Row>
          <Col lg={3} md={6} className="mb-3">
            <Form.Select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="info">Info</option>
              <option value="success">Sucesso</option>
              <option value="warning">Alerta</option>
              <option value="error">Erro</option>
            </Form.Select>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Form.Select value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}>
              <option value="">Todos os módulos</option>
              <option value="Auth">Autenticação</option>
              <option value="Usuários">Usuários</option>
              <option value="Participantes">Participantes</option>
              <option value="Relatórios">Relatórios</option>
              <option value="Configurações">Configurações</option>
            </Form.Select>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Form.Control
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Button variant="outline-secondary" className="me-2">
              <IconifyIcon icon="fa:download" className="me-1" />
              Exportar
            </Button>
            <Button variant="outline-danger">
              <IconifyIcon icon="fa:trash" className="me-1" />
              Limpar Antigos
            </Button>
          </Col>
        </Row>
      </ComponentContainerCard>

      <ComponentContainerCard title={`Logs (${logsFiltrados.length})`}>
        <Table responsive className="mb-0" size="sm">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Módulo</th>
              <th>IP</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => (
              <tr key={log.id}>
                <td><small>{log.data}</small></td>
                <td>{getTipoBadge(log.tipo)}</td>
                <td><small>{log.usuario}</small></td>
                <td><Badge bg="secondary">{log.acao}</Badge></td>
                <td>{log.modulo}</td>
                <td><small className="text-muted">{log.ip}</small></td>
                <td><small>{log.detalhes}</small></td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Mostrando {logsFiltrados.length} registros
          </small>
          <Pagination size="sm">
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </ComponentContainerCard>
    </>
  )
}
