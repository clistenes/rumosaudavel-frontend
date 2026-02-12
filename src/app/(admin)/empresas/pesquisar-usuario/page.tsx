'use client'

import { useState } from 'react'
import { Card, Button, Form, Table, Badge, Row, Col, Pagination } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Usuario {
  id: number
  nome: string
  email: string
  empresa: string
  perfil: string
  status: 'ativo' | 'inativo' | 'bloqueado'
  ultimoAcesso: string
}

const usuariosDemo: Usuario[] = [
  { id: 1, nome: 'Carlos Silva', email: 'carlos@techcorp.com', empresa: 'TechCorp Brasil', perfil: 'Gestor', status: 'ativo', ultimoAcesso: 'Hoje, 10:30' },
  { id: 2, nome: 'Maria Santos', email: 'maria@inovacao.com', empresa: 'Inovação Ltda', perfil: 'RH', status: 'ativo', ultimoAcesso: 'Ontem, 15:45' },
  { id: 3, nome: 'João Pereira', email: 'joao@saudecorp.com', empresa: 'Saúde Corp', perfil: 'Admin', status: 'ativo', ultimoAcesso: 'Hoje, 09:15' },
  { id: 4, nome: 'Ana Costa', email: 'ana@empresaabc.com', empresa: 'Empresa ABC', perfil: 'Gestor', status: 'inativo', ultimoAcesso: '10/02/2026' },
  { id: 5, nome: 'Pedro Lima', email: 'pedro@grupoxyz.com', empresa: 'Grupo XYZ', perfil: 'RH', status: 'bloqueado', ultimoAcesso: '05/02/2026' },
]

export default function PesquisarUsuarioPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEmpresa, setFiltroEmpresa] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const usuariosFiltrados = usuariosDemo.filter(u => {
    const matchSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEmpresa = !filtroEmpresa || u.empresa === filtroEmpresa
    const matchPerfil = !filtroPerfil || u.perfil === filtroPerfil
    const matchStatus = !filtroStatus || u.status === filtroStatus
    return matchSearch && matchEmpresa && matchPerfil && matchStatus
  })

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ativo: 'success',
      inativo: 'secondary',
      bloqueado: 'danger',
    }
    return <Badge bg={colors[status]}>{status}</Badge>
  }

  return (
    <>
      <PageTitle title="Pesquisar Usuário" subName="Buscar e gerenciar usuários de empresas" />

      <Row className="mb-4">
        <Col xl={3} md={6}>
          <Card className="bg-primary text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Total Usuários</h6>
                <h3 className="mb-0">156</h3>
              </div>
              <IconifyIcon icon="fa:users" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-success text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Ativos</h6>
                <h3 className="mb-0">142</h3>
              </div>
              <IconifyIcon icon="fa:user-check" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-warning text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Inativos</h6>
                <h3 className="mb-0">8</h3>
              </div>
              <IconifyIcon icon="fa:user-times" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} md={6}>
          <Card className="bg-danger text-white">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0">Bloqueados</h6>
                <h3 className="mb-0">6</h3>
              </div>
              <IconifyIcon icon="fa:user-lock" className="fs-1 opacity-50" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ComponentContainerCard title="Filtros de Pesquisa">
        <Row>
          <Col lg={4} md={6} className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col lg={2} md={6} className="mb-3">
            <Form.Select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
              <option value="">Todas as empresas</option>
              <option value="TechCorp Brasil">TechCorp Brasil</option>
              <option value="Inovação Ltda">Inovação Ltda</option>
              <option value="Saúde Corp">Saúde Corp</option>
              <option value="Empresa ABC">Empresa ABC</option>
            </Form.Select>
          </Col>
          <Col lg={2} md={6} className="mb-3">
            <Form.Select value={filtroPerfil} onChange={(e) => setFiltroPerfil(e.target.value)}>
              <option value="">Todos os perfis</option>
              <option value="Gestor">Gestor</option>
              <option value="RH">RH</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Col>
          <Col lg={2} md={6} className="mb-3">
            <Form.Select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </Form.Select>
          </Col>
          <Col lg={2} md={6} className="mb-3">
            <Link href="/empresas/novo-usuario-empresa" className="btn btn-primary w-100">
              <IconifyIcon icon="fa:plus" className="me-1" />
              Novo Usuário
            </Link>
          </Col>
        </Row>
      </ComponentContainerCard>

      <ComponentContainerCard title={`Resultados (${usuariosFiltrados.length})`}>
        <Table responsive className="mb-0">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Empresa</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px' }}>
                      <small>{usuario.nome.charAt(0)}</small>
                    </div>
                    <div>
                      <div className="fw-medium">{usuario.nome}</div>
                      <small className="text-muted">{usuario.email}</small>
                    </div>
                  </div>
                </td>
                <td>{usuario.empresa}</td>
                <td><Badge bg="info">{usuario.perfil}</Badge></td>
                <td>{getStatusBadge(usuario.status)}</td>
                <td>{usuario.ultimoAcesso}</td>
                <td>
                  <Button variant="link" size="sm" className="p-0 me-2">
                    <IconifyIcon icon="fa:edit" />
                  </Button>
                  <Button variant="link" size="sm" className="p-0 me-2">
                    <IconifyIcon icon="fa:key" />
                  </Button>
                  <Button variant="link" size="sm" className="p-0 text-danger">
                    <IconifyIcon icon="fa:ban" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-5">
            <IconifyIcon icon="fa:search" className="display-4 text-muted mb-3" />
            <h5>Nenhum usuário encontrado</h5>
            <p className="text-muted">Tente ajustar os filtros de pesquisa</p>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Mostrando {usuariosFiltrados.length} de {usuariosDemo.length} usuários
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
