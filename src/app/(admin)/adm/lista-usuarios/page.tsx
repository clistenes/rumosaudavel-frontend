'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Pagination, Modal } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { EMPRESAS_DEMO } from '@/assets/data/demo-data'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function ListaUsuarios() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { usuarios, deleteUsuario, duplicarUsuario } = useDemo()
  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<any>(null)
  const itemsPerPage = 5

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const matchBusca = u.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        u.email.toLowerCase().includes(busca.toLowerCase())
      const matchRole = !filtroRole || u.role === filtroRole
      const matchStatus = !filtroStatus || u.status === filtroStatus
      return matchBusca && matchRole && matchStatus
    })
  }, [usuarios, busca, filtroRole, filtroStatus])

  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage)
  const usuariosPaginados = usuariosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getEmpresaNome = (empresaId: number | null) => {
    if (!empresaId) return 'Admin (Todas)'
    const empresa = EMPRESAS_DEMO.find(e => e.id === empresaId)
    return empresa?.nomeCurto || 'N/A'
  }

  const getRoleBadge = (role: string) => {
    const roles: { [key: string]: { label: string; color: string } } = {
      admin: { label: 'Administrador', color: 'danger' },
      gestor: { label: 'Gestor', color: 'primary' },
      participante: { label: 'Participante', color: 'info' },
      psicologo: { label: 'Psicólogo', color: 'success' }
    }
    const r = roles[role] || { label: role, color: 'secondary' }
    return <Badge bg={r.color}>{r.label}</Badge>
  }

  const handleDeleteClick = (u: any) => {
    setUsuarioToDelete(u)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (usuarioToDelete) {
      deleteUsuario(usuarioToDelete.id)
      showNotification({ message: `Usuário "${usuarioToDelete.nome}" excluído.`, variant: 'success' })
      setShowDeleteModal(false)
      setUsuarioToDelete(null)
    }
  }

  const handleDuplicar = (u: any) => {
    duplicarUsuario(u.id)
    showNotification({ message: `Usuário "${u.nome}" duplicado.`, variant: 'success' })
  }

  const stats = useMemo(() => {
    return {
      total: usuarios.length,
      ativos: usuarios.filter((u: any) => u.status === 'ativo').length,
      admins: usuarios.filter((u: any) => u.role === 'admin').length
    }
  }, [usuarios])

  return (
    <>
      <PageTitle title="Lista de Usuários" subName="Administração" />

      {/* Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="bg-primary text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.total}</h3>
              <small>Total de Usuários</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="bg-success text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.ativos}</h3>
              <small>Ativos</small>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="bg-danger text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.admins}</h3>
              <small>Administradores</small>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-3 flex-wrap">
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text><IconifyIcon icon="iconoir:search" /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar usuários..."
                  value={busca}
                  onChange={(e) => { setBusca(e.target.value); setCurrentPage(1) }}
                />
              </InputGroup>

              <Form.Select style={{ width: '150px' }} value={filtroRole} onChange={(e) => { setFiltroRole(e.target.value); setCurrentPage(1) }}>
                <option value="">Todos os perfis</option>
                <option value="admin">Administrador</option>
                <option value="gestor">Gestor</option>
                <option value="participante">Participante</option>
              </Form.Select>

              <Form.Select style={{ width: '150px' }} value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setCurrentPage(1) }}>
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Form.Select>
            </div>

            <Link href="/adm/adicionar-usuario">
              <Button variant="primary">
                <IconifyIcon icon="iconoir:plus" className="me-1" />
                Novo Usuário
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Usuário</th>
                  <th className="text-center">Perfil</th>
                  <th className="text-center">Empresa</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Último Acesso</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((u: any) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          <IconifyIcon icon="iconoir:user" className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-bold">{u.nome}</div>
                          <small className="text-muted">{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{getRoleBadge(u.role)}</td>
                    <td className="text-center">
                      <Badge bg="secondary">{getEmpresaNome(u.empresaId)}</Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={u.status === 'ativo' ? 'success' : 'secondary'}>
                        {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <small>{new Date(u.ultimoAcesso).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => router.push(`/adm/editar-usuario/${u.id}`)}>
                        <IconifyIcon icon="iconoir:edit-pencil" />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleDuplicar(u)}>
                        <IconifyIcon icon="iconoir:copy" />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(u)}>
                        <IconifyIcon icon="iconoir:trash" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {usuariosPaginados.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="iconoir:user" style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5>Nenhum usuário encontrado</h5>
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Mostrando {usuariosPaginados.length} de {usuariosFiltrados.length}
              </small>
              <Pagination size="sm">
                <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Excluir "<strong>{usuarioToDelete?.nome}</strong>"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>
            <IconifyIcon icon="iconoir:trash" className="me-2" />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
