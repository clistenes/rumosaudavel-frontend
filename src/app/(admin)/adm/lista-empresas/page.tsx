'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Pagination, Modal, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useEmpresas, useRemoverEmpresa } from '@/hooks/api/useEmpresas'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function ListaEmpresas() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  
  // Hooks da API
  const { data: empresasData, loading: loadingEmpresas, error, refetch } = useEmpresas({ perPage: 100 })
  const { mutateAsync: removerEmpresa, loading: deleting } = useRemoverEmpresa()
  
  // DEBUG: Logs para verificar dados
  console.log('🔍 [ListaEmpresas] Debug:')
  console.log('🔍 [ListaEmpresas] empresasData:', empresasData)
  console.log('🔍 [ListaEmpresas] loading:', loadingEmpresas)
  console.log('🔍 [ListaEmpresas] error:', error)
  
  // Dados das empresas
  const empresas = empresasData?.data || []
  console.log('🔍 [ListaEmpresas] empresas:', empresas)
  console.log('🔍 [ListaEmpresas] Total de empresas:', empresas.length)
  
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<any>(null)
  const itemsPerPage = 10

  // Filtrar empresas localmente
  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa: any) => {
      const matchBusca = !busca || 
                        empresa.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                        empresa.cnpj?.includes(busca) ||
                        empresa.cidade?.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = !filtroStatus || 
                         (filtroStatus === 'ativo' && empresa.ativo) ||
                         (filtroStatus === 'inativo' && !empresa.ativo)
      return matchBusca && matchStatus
    })
  }, [empresas, busca, filtroStatus])

  // Paginação local
  const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage)
  const empresasPaginadas = empresasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Exportar para Excel (CSV)
  const handleExportar = () => {
    const headers = ['ID', 'Nome', 'CNPJ', 'Email', 'Telefone', 'Cidade', 'Estado', 'Participantes', 'Status', 'Data Cadastro']
    
    const csvContent = [
      headers.join(';'),
      ...empresasFiltradas.map((e: any) => [
        e.id,
        e.nome,
        e.cnpj,
        e.email,
        e.telefone,
        e.cidade,
        e.estado,
        e.totalParticipantes || 0,
        e.ativo ? 'Ativo' : 'Inativo',
        e.dataCriacao ? new Date(e.dataCriacao).toLocaleDateString('pt-BR') : ''
      ].join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `empresas_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification({ 
      message: `Exportação concluída! ${empresasFiltradas.length} empresas exportadas.`, 
      variant: 'success' 
    })
  }

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (empresa: any) => {
    setEmpresaToDelete(empresa)
    setShowDeleteModal(true)
  }

  // Confirmar exclusão
  const confirmDelete = async () => {
    if (empresaToDelete) {
      try {
        await removerEmpresa(empresaToDelete.id)
        showNotification({ 
          message: `Empresa "${empresaToDelete.nome}" foi removida com sucesso.`, 
          variant: 'success' 
        })
        refetch() // Recarrega a lista
      } catch (error) {
        showNotification({ 
          message: 'Erro ao remover empresa. Tente novamente.', 
          variant: 'danger' 
        })
      } finally {
        setShowDeleteModal(false)
        setEmpresaToDelete(null)
      }
    }
  }

  // Visualizar empresa
  const handleView = (empresaId: number) => {
    router.push(`/adm/editar-empresa/${empresaId}`)
  }

  // Ver participantes
  const handleViewParticipants = (empresaId: number) => {
    router.push(`/adm/lista-participantes?empresa=${empresaId}`)
  }

  // Formatar data
  const formatarData = (dataString: string) => {
    if (!dataString) return '-'
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }

  // Loading state
  if (loadingEmpresas) {
    return (
      <>
        <PageTitle title="Lista de Empresas" subName="Administração" />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <PageTitle title="Lista de Empresas" subName="Administração" />
        <Card className="text-center py-5">
          <Card.Body>
            <IconifyIcon icon="iconoir:wifi-off" style={{ fontSize: '48px' }} className="text-danger mb-3" />
            <h5>Erro ao carregar empresas</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={refetch}>
              <IconifyIcon icon="iconoir:refresh" className="me-2" />
              Tentar novamente
            </Button>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title="Lista de Empresas" subName="Administração" />

      {/* Filtros e Ações */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-3 flex-wrap">
              <InputGroup style={{ width: '350px' }}>
                <InputGroup.Text>
                  <IconifyIcon icon="iconoir:search" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nome, CNPJ ou setor..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </InputGroup>

              <Form.Select
                style={{ width: '180px' }}
                value={filtroStatus}
                onChange={(e) => {
                  setFiltroStatus(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">Todos os status</option>
                <option value="ativo">Ativa</option>
                <option value="inativo">Inativa</option>
              </Form.Select>
            </div>

            <div className="d-flex gap-2">
              <Button variant="outline-success" onClick={handleExportar}>
                <IconifyIcon icon="iconoir:download" className="me-2" />
                Exportar Excel
              </Button>
              <Link href="/adm/adicionar-empresa">
                <Button variant="primary">
                  <IconifyIcon icon="iconoir:plus" className="me-2" />
                  Nova Empresa
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Resumo */}
      <Card className="mb-4 bg-light">
        <Card.Body>
          <div className="row text-center">
            <div className="col-md-4">
              <h4 className="mb-1">{empresas.length}</h4>
              <small className="text-muted">Total de Empresas</small>
            </div>
            <div className="col-md-4">
              <h4 className="mb-1">{empresas.reduce((acc: number, e: any) => acc + (e.totalParticipantes || 0), 0).toLocaleString()}</h4>
              <small className="text-muted">Total de Participantes</small>
            </div>
            <div className="col-md-4">
              <h4 className="mb-1">{empresas.filter((e: any) => e.ativo).length}</h4>
              <small className="text-muted">Empresas Ativas</small>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabela de Empresas */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Empresa</th>
                  <th className="text-center">Localização</th>
                  <th className="text-center">Contato</th>
                  <th className="text-center">Participantes</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Cadastro</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresasPaginadas.map((empresa: any) => {
                  return (
                    <tr key={empresa.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#0066CC',
                              fontSize: '14px'
                            }}
                          >
                            {empresa.nome?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold">{empresa.nome}</div>
                            <small className="text-muted">{empresa.cnpj}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="small">
                          <IconifyIcon icon="iconoir:map-pin" className="me-1" />
                          {empresa.cidade || '-'}{empresa.estado ? `, ${empresa.estado}` : ''}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="small">
                          <div>{empresa.email}</div>
                          <div className="text-muted">{empresa.telefone}</div>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg="info">
                          {empresa.totalParticipantes || 0}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={empresa.ativo ? 'success' : 'secondary'}>
                          {empresa.ativo ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <small className="text-muted">
                          {formatarData(empresa.dataCriacao)}
                        </small>
                      </td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleView(empresa.id)}
                          title="Editar"
                        >
                          <IconifyIcon icon="iconoir:edit-pencil" />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewParticipants(empresa.id)}
                          title="Ver Participantes"
                        >
                          <IconifyIcon icon="iconoir:community" />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(empresa)}
                          title="Excluir"
                        >
                          <IconifyIcon icon="iconoir:trash" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>

          {empresasPaginadas.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="iconoir:building" style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5>Nenhuma empresa encontrada</h5>
              <p className="text-muted">Tente ajustar os filtros ou adicione uma nova empresa.</p>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Mostrando {empresasPaginadas.length} de {empresasFiltradas.length} empresas
              </small>
              <Pagination size="sm">
                <Pagination.Prev 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir a empresa <strong>{empresaToDelete?.nome}</strong>?</p>
          <p className="text-muted small">Esta ação não pode ser desfeita. Todos os dados associados a esta empresa serão removidos.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <IconifyIcon icon="iconoir:trash" className="me-2" />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
