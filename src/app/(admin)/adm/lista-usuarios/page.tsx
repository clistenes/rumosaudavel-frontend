'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, Card, Form, InputGroup, Modal, Pagination, Spinner, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { useRemoverUsuario, useUsuarios } from '@/hooks/api/useUsuarios'
import { isDemoMode } from '@/utils/env'

const normalizeUsuario = (usuario: any) => ({
  ...usuario,
  role: usuario.role || usuario.tipo || 'participante',
  status: usuario.status || (usuario.ativo === false ? 'inativo' : 'ativo'),
  empresaId: usuario.empresaId ?? usuario.id_empresa ?? null,
  ultimoAcesso: usuario.ultimoAcesso || usuario.updated_at || usuario.created_at || null,
})

export default function ListaUsuarios() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: usuariosData, loading, error, refetch } = useUsuarios({ perPage: 100 })
  const { data: empresasData } = useEmpresas({ perPage: 100 })
  const { mutateAsync: removerUsuario } = useRemoverUsuario()

  const usuariosBrutos = demoMode ? demoContext.usuarios : (usuariosData?.data || [])
  const usuarios = useMemo(() => usuariosBrutos.map(normalizeUsuario), [usuariosBrutos])
  const empresas = demoMode ? demoContext.empresas : (empresasData?.data || [])

  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [usuarioToDelete, setUsuarioToDelete] = useState<any>(null)
  const itemsPerPage = 10

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u: any) => {
      const termo = busca.toLowerCase()
      const matchBusca = !busca ||
        u.nome?.toLowerCase().includes(termo) ||
        u.email?.toLowerCase().includes(termo)
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
    const empresa = empresas.find((e: any) => e.id === empresaId) as any
    return (empresa?.nomeCurto || empresa?.nome || 'N/A') as string
  }

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string }> = {
      admin: { label: 'Administrador', color: 'danger' },
      gestor: { label: 'Gestor', color: 'primary' },
      empresa: { label: 'Empresa', color: 'primary' },
      participante: { label: 'Participante', color: 'info' },
      psicologo: { label: 'Psicologo', color: 'success' },
    }
    const mapped = roles[role] || { label: role, color: 'secondary' }
    return <Badge bg={mapped.color}>{mapped.label}</Badge>
  }

  const handleDeleteClick = (usuario: any) => {
    setUsuarioToDelete(usuario)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!usuarioToDelete) return

    try {
      if (demoMode) {
        demoContext.deleteUsuario(usuarioToDelete.id)
      } else {
        await removerUsuario(usuarioToDelete.id)
        refetch()
      }
      showNotification({ message: `Usuario "${usuarioToDelete.nome}" excluido.`, variant: 'success' })
    } catch (deleteError) {
      showNotification({ message: 'Erro ao excluir usuario.', variant: 'danger' })
    } finally {
      setShowDeleteModal(false)
      setUsuarioToDelete(null)
    }
  }

  const handleDuplicar = (usuario: any) => {
    if (demoMode) {
      demoContext.duplicarUsuario(usuario.id)
      showNotification({ message: `Usuario "${usuario.nome}" duplicado.`, variant: 'success' })
      return
    }

    showNotification({ message: 'Duplicacao ainda nao implementada na API.', variant: 'warning' })
  }

  const stats = useMemo(() => ({
    total: usuarios.length,
    ativos: usuarios.filter((u: any) => u.status === 'ativo').length,
    admins: usuarios.filter((u: any) => u.role === 'admin').length,
  }), [usuarios])

  const formatarData = (valor?: string | null) => {
    if (!valor) return '-'
    const data = new Date(valor)
    if (Number.isNaN(data.getTime())) return '-'
    return data.toLocaleDateString('pt-BR')
  }

  if (!demoMode && loading) {
    return (
      <>
        <PageTitle title='Lista de Usuarios' subName='Administracao' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Lista de Usuarios' subName='Administracao' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar usuarios</h5>
            <p className='text-muted'>{error.message}</p>
            <Button variant='primary' onClick={refetch}>
              <IconifyIcon icon='iconoir:refresh' className='me-2' />
              Tentar novamente
            </Button>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Lista de Usuarios' subName='Administracao' />

      <div className='row mb-4'>
        <div className='col-md-4'>
          <Card className='bg-primary text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.total}</h3>
              <small>Total de Usuarios</small>
            </Card.Body>
          </Card>
        </div>
        <div className='col-md-4'>
          <Card className='bg-success text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.ativos}</h3>
              <small>Ativos</small>
            </Card.Body>
          </Card>
        </div>
        <div className='col-md-4'>
          <Card className='bg-danger text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.admins}</h3>
              <small>Administradores</small>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <div className='d-flex gap-3 flex-wrap'>
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text><IconifyIcon icon='iconoir:search' /></InputGroup.Text>
                <Form.Control
                  type='text'
                  placeholder='Buscar usuarios...'
                  value={busca}
                  onChange={(event) => { setBusca(event.target.value); setCurrentPage(1) }}
                />
              </InputGroup>

              <Form.Select style={{ width: '170px' }} value={filtroRole} onChange={(event) => { setFiltroRole(event.target.value); setCurrentPage(1) }}>
                <option value=''>Todos os perfis</option>
                <option value='admin'>Administrador</option>
                <option value='gestor'>Gestor</option>
                <option value='empresa'>Empresa</option>
                <option value='participante'>Participante</option>
              </Form.Select>

              <Form.Select style={{ width: '150px' }} value={filtroStatus} onChange={(event) => { setFiltroStatus(event.target.value); setCurrentPage(1) }}>
                <option value=''>Todos os status</option>
                <option value='ativo'>Ativo</option>
                <option value='inativo'>Inativo</option>
              </Form.Select>
            </div>

            <Link href='/adm/novo-usuario'>
              <Button variant='primary'>
                <IconifyIcon icon='iconoir:plus' className='me-1' />
                Novo Usuario
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className='table-responsive'>
            <Table hover className='mb-0'>
              <thead className='table-light'>
                <tr>
                  <th>Usuario</th>
                  <th className='text-center'>Perfil</th>
                  <th className='text-center'>Empresa</th>
                  <th className='text-center'>Status</th>
                  <th className='text-center'>Ultimo Acesso</th>
                  <th className='text-center'>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((usuario: any) => (
                  <tr key={usuario.id}>
                    <td>
                      <div className='d-flex align-items-center'>
                        <div className='bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3' style={{ width: '40px', height: '40px' }}>
                          <IconifyIcon icon='iconoir:user' className='text-primary' />
                        </div>
                        <div>
                          <div className='fw-bold'>{usuario.nome}</div>
                          <small className='text-muted'>{usuario.email}</small>
                        </div>
                      </div>
                    </td>
                    <td className='text-center'>{getRoleBadge(usuario.role)}</td>
                    <td className='text-center'><Badge bg='secondary'>{getEmpresaNome(usuario.empresaId)}</Badge></td>
                    <td className='text-center'>
                      <Badge bg={usuario.status === 'ativo' ? 'success' : 'secondary'}>
                        {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className='text-center'><small>{formatarData(usuario.ultimoAcesso)}</small></td>
                    <td className='text-center'>
                      <Button variant='outline-primary' size='sm' className='me-1' onClick={() => router.push(`/adm/editar-usuario/${usuario.id}`)}>
                        <IconifyIcon icon='iconoir:edit-pencil' />
                      </Button>
                      <Button variant='outline-secondary' size='sm' className='me-1' onClick={() => handleDuplicar(usuario)}>
                        <IconifyIcon icon='iconoir:copy' />
                      </Button>
                      <Button variant='outline-danger' size='sm' onClick={() => handleDeleteClick(usuario)}>
                        <IconifyIcon icon='iconoir:trash' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {usuariosPaginados.length === 0 && (
            <div className='text-center py-5'>
              <IconifyIcon icon='iconoir:user' style={{ fontSize: '48px' }} className='text-muted mb-3' />
              <h5>Nenhum usuario encontrado</h5>
            </div>
          )}

          {totalPages > 1 && (
            <div className='d-flex justify-content-between align-items-center mt-3'>
              <small className='text-muted'>
                Mostrando {usuariosPaginados.length} de {usuariosFiltrados.length}
              </small>
              <Pagination size='sm'>
                <Pagination.Prev onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Excluir "<strong>{usuarioToDelete?.nome}</strong>"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant='danger' onClick={confirmDelete}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
