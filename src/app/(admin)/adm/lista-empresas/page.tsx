'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Pagination, Modal } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function ListaEmpresas() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { empresas, deleteEmpresa } = useDemo()
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<any>(null)
  const itemsPerPage = 5

  // Filtrar empresas
  const empresasFiltradas = useMemo(() => {
    return empresas.filter(empresa => {
      const matchBusca = empresa.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        empresa.nomeCurto.toLowerCase().includes(busca.toLowerCase()) ||
                        empresa.cnpj.includes(busca) ||
                        empresa.setor.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = !filtroStatus || empresa.status === filtroStatus
      return matchBusca && matchStatus
    })
  }, [empresas, busca, filtroStatus])

  // Paginação
  const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage)
  const empresasPaginadas = empresasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Exportar para Excel (CSV)
  const handleExportar = () => {
    const headers = ['ID', 'Nome', 'CNPJ', 'Setor', 'Cidade', 'Estado', 'Funcionários', 'Participantes', 'Adesão %', 'PHQ-9 Médio', 'GAD-7 Médio', 'Risco Alto', 'Risco Médio', 'Risco Baixo', 'Status', 'Data Cadastro', 'Contato', 'Cargo']
    
    const csvContent = [
      headers.join(';'),
      ...empresasFiltradas.map(e => [
        e.id,
        e.nome,
        e.cnpj,
        e.setor,
        e.cidade,
        e.estado,
        e.funcionarios,
        e.participantes,
        e.adesao.toFixed(1),
        e.phq9Medio.toFixed(1),
        e.gad7Medio.toFixed(1),
        e.riscoAlto,
        e.riscoMedio,
        e.riscoBaixo,
        e.status,
        e.dataCadastro,
        e.contatoNome,
        e.contatoCargo
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
  const confirmDelete = () => {
    if (empresaToDelete) {
      deleteEmpresa(empresaToDelete.id)
      showNotification({ 
        message: `Empresa "${empresaToDelete.nomeCurto}" foi removida com sucesso.`, 
        variant: 'success' 
      })
      setShowDeleteModal(false)
      setEmpresaToDelete(null)
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

  // Calcular taxa de resposta
  const calcularTaxaResposta = (participantes: number, funcionarios: number) => {
    return Math.round((participantes / funcionarios) * 100)
  }

  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
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
            <div className="col-md-3">
              <h4 className="mb-1">{empresas.length}</h4>
              <small className="text-muted">Total de Empresas</small>
            </div>
            <div className="col-md-3">
              <h4 className="mb-1">{empresas.reduce((acc, e) => acc + e.funcionarios, 0).toLocaleString()}</h4>
              <small className="text-muted">Total de Funcionários</small>
            </div>
            <div className="col-md-3">
              <h4 className="mb-1">{empresas.reduce((acc, e) => acc + e.participantes, 0).toLocaleString()}</h4>
              <small className="text-muted">Participantes Ativos</small>
            </div>
            <div className="col-md-3">
              <h4 className="mb-1">{Math.round(empresas.reduce((acc, e) => acc + e.adesao, 0) / empresas.length)}%</h4>
              <small className="text-muted">Taxa Média de Adesão</small>
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
                  <th className="text-center">Setor</th>
                  <th className="text-center">Funcionários</th>
                  <th className="text-center">Adesão</th>
                  <th className="text-center">PHQ-9</th>
                  <th className="text-center">GAD-7</th>
                  <th className="text-center">Riscos</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {empresasPaginadas.map((empresa) => {
                  const taxaResposta = calcularTaxaResposta(empresa.participantes, empresa.funcionarios)
                  
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
                            {empresa.nomeCurto.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold">{empresa.nomeCurto}</div>
                            <small className="text-muted">{empresa.cnpj}</small>
                            <div className="small text-muted">
                              <IconifyIcon icon="iconoir:map-pin" className="me-1" />
                              {empresa.cidade}, {empresa.estado}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg="info" className="text-dark">{empresa.setor}</Badge>
                      </td>
                      <td className="text-center">
                        <div className="fw-bold">{empresa.funcionarios.toLocaleString()}</div>
                        <small className="text-muted">{empresa.participantes.toLocaleString()} ativos</small>
                      </td>
                      <td className="text-center">
                        <Badge bg={taxaResposta >= 70 ? 'success' : taxaResposta >= 50 ? 'warning' : 'danger'}>
                          {taxaResposta}%
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={empresa.phq9Medio >= 15 ? 'danger' : empresa.phq9Medio >= 10 ? 'warning' : 'success'}>
                          {empresa.phq9Medio.toFixed(1)}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={empresa.gad7Medio >= 15 ? 'danger' : empresa.gad7Medio >= 10 ? 'warning' : 'success'}>
                          {empresa.gad7Medio.toFixed(1)}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column gap-1">
                          <Badge bg="danger" className="small">Alto: {empresa.riscoAlto}</Badge>
                          <Badge bg="warning" text="dark" className="small">Médio: {empresa.riscoMedio}</Badge>
                          <Badge bg="success" className="small">Baixo: {empresa.riscoBaixo}</Badge>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg={empresa.status === 'ativo' ? 'success' : 'secondary'}>
                          {empresa.status === 'ativo' ? 'Ativa' : 'Inativa'}
                        </Badge>
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
          <p>Tem certeza que deseja excluir a empresa <strong>{empresaToDelete?.nomeCurto}</strong>?</p>
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
