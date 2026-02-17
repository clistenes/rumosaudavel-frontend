'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Pagination, Modal, Row, Col, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { EMPRESAS_DEMO } from '@/assets/data/demo-data'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useParticipantes, useRemoverParticipante } from '@/hooks/api/useParticipantes'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { isDemoMode } from '@/utils/env'

export default function ListaParticipantes() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaFilter = searchParams.get('empresa')
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  
  // Hooks do modo DEMO
  const demoContext = useDemo()
  
  // Hooks da API (modo Produção)
  const { data: participantesData, loading: loadingParticipantes, error, refetch } = useParticipantes({ 
    perPage: 100,
    empresaId: empresaFilter ? parseInt(empresaFilter) : undefined 
  })
  const { mutateAsync: removerParticipante } = useRemoverParticipante()
  const { data: empresasData } = useEmpresas({ perPage: 100 })
  
  // Dados (Demo ou API)
  const participantes: any[] = demoMode ? demoContext.participantes : (participantesData?.data || [])
  const empresas: any[] = demoMode ? EMPRESAS_DEMO : (empresasData?.data || [])
  
  const [busca, setBusca] = useState('')
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>(empresaFilter || '')
  const [filtroRisco, setFiltroRisco] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [participanteToDelete, setParticipanteToDelete] = useState<any>(null)
  const itemsPerPage = 10

  // Get empresa name by ID
  const getEmpresaNome = (empresaId: number) => {
    const empresa = demoMode 
      ? EMPRESAS_DEMO.find(e => e.id === empresaId)
      : empresas.find((e: any) => e.id === empresaId)
    return demoMode ? (empresa as any)?.nomeCurto || 'N/A' : (empresa as any)?.nome || 'N/A'
  }

  // Filtrar participantes
  const participantesFiltrados = useMemo(() => {
    return participantes.filter((participante: any) => {
      const matchBusca = !busca || 
                        participante.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                        participante.email?.toLowerCase().includes(busca.toLowerCase()) ||
                        participante.cpf?.includes(busca)
      const matchEmpresa = !filtroEmpresa || participante.empresaId === parseInt(filtroEmpresa)
      const matchRisco = !filtroRisco || participante.riscoSaude === filtroRisco
      return matchBusca && matchEmpresa && matchRisco
    })
  }, [participantes, busca, filtroEmpresa, filtroRisco])

  // Paginação
  const totalPages = Math.ceil(participantesFiltrados.length / itemsPerPage)
  const participantesPaginados = participantesFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Exportar para Excel (CSV)
  const handleExportar = () => {
    const headers = ['ID', 'Nome', 'CPF', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Departamento', 'Status', 'Risco Saúde', 'PHQ-9', 'GAD-7', 'Última Avaliação', 'Alertas']
    
    const csvContent = [
      headers.join(';'),
      ...participantesFiltrados.map(p => [
        p.id,
        p.nome,
        p.cpf,
        p.email,
        p.telefone,
        getEmpresaNome(p.empresaId),
        p.cargo,
        p.departamento,
        p.status,
        p.riscoSaude,
        p.phq9Score,
        p.gad7Score,
        p.ultimaAvaliacao,
        p.alertasPendentes
      ].join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `participantes_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification({ 
      message: `Exportação concluída! ${participantesFiltrados.length} participantes exportados.`, 
      variant: 'success' 
    })
  }

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (participante: any) => {
    setParticipanteToDelete(participante)
    setShowDeleteModal(true)
  }

  // Confirmar exclusão
  const confirmDelete = async () => {
    if (participanteToDelete) {
      try {
        if (demoMode) {
          demoContext.deleteParticipante(participanteToDelete.id)
        } else {
          await removerParticipante(participanteToDelete.id)
          refetch()
        }
        showNotification({ 
          message: `Participante "${participanteToDelete.nome}" foi removido com sucesso.`, 
          variant: 'success' 
        })
      } catch (error) {
        showNotification({ 
          message: 'Erro ao remover participante. Tente novamente.', 
          variant: 'danger' 
        })
      } finally {
        setShowDeleteModal(false)
        setParticipanteToDelete(null)
      }
    }
  }

  // Visualizar prontuário
  const handleViewProntuario = (participanteId: number) => {
    router.push(`/adm/relatorios/prontuario/${participanteId}`)
  }

  // Calcular tendência (simulada)
  const getTendencia = (phq9Score: number) => {
    if (phq9Score >= 15) return { label: 'Piora', color: 'danger', icon: 'iconoir:trending-down' }
    if (phq9Score >= 10) return { label: 'Estável', color: 'warning', icon: 'iconoir:trending' }
    return { label: 'Melhora', color: 'success', icon: 'iconoir:trending-up' }
  }

  // Formatar data
  const formatarData = (dataString: string) => {
    if (!dataString) return '-'
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }

  // Loading state
  if (!demoMode && loadingParticipantes) {
    return (
      <>
        <PageTitle title="Lista de Participantes" subName="Administração" />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    )
  }

  // Error state
  if (!demoMode && error) {
    return (
      <>
        <PageTitle title="Lista de Participantes" subName="Administração" />
        <Card className="text-center py-5">
          <Card.Body>
            <IconifyIcon icon="iconoir:wifi-off" style={{ fontSize: '48px' }} className="text-danger mb-3" />
            <h5>Erro ao carregar participantes</h5>
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

  // Calcular idade
  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  // Estatísticas
  const stats = useMemo(() => {
    const total = participantesFiltrados.length
    const riscoAlto = participantesFiltrados.filter(p => p.riscoSaude === 'alto').length
    const riscoMedio = participantesFiltrados.filter(p => p.riscoSaude === 'medio').length
    const riscoBaixo = participantesFiltrados.filter(p => p.riscoSaude === 'baixo').length
    const comAlertas = participantesFiltrados.filter(p => p.alertasPendentes > 0).length
    return { total, riscoAlto, riscoMedio, riscoBaixo, comAlertas }
  }, [participantesFiltrados])

  return (
    <>
      <PageTitle title="Lista de Participantes" subName="Administração" />

      {/* Estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary text-white">
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.total}</h3>
              <small>Total de Participantes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-danger text-white">
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.riscoAlto}</h3>
              <small>Risco Alto</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-warning">
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.riscoMedio}</h3>
              <small>Risco Médio</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success text-white">
            <Card.Body className="text-center">
              <h3 className="mb-1">{stats.comAlertas}</h3>
              <small>Com Alertas</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-3 flex-wrap">
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text>
                  <IconifyIcon icon="iconoir:search" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nome, email, CPF..."
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </InputGroup>

              <Form.Select
                style={{ width: '200px' }}
                value={filtroEmpresa}
                onChange={(e) => {
                  setFiltroEmpresa(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">Todas as empresas</option>
                {empresas.map((empresa: any) => (
                  <option key={empresa.id} value={empresa.id}>
                    {demoMode ? empresa.nomeCurto : empresa.nome}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                style={{ width: '150px' }}
                value={filtroRisco}
                onChange={(e) => {
                  setFiltroRisco(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">Todos os riscos</option>
                <option value="alto">Risco Alto</option>
                <option value="medio">Risco Médio</option>
                <option value="baixo">Risco Baixo</option>
              </Form.Select>
            </div>

            <div className="d-flex gap-2">
              <Button variant="outline-success" onClick={handleExportar}>
                <IconifyIcon icon="iconoir:download" className="me-2" />
                Exportar Excel
              </Button>
              <Link href="/adm/adicionar-participante">
                <Button variant="primary">
                  <IconifyIcon icon="iconoir:plus" className="me-2" />
                  Novo Participante
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabela */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Participante</th>
                  <th className="text-center">Empresa</th>
                  <th className="text-center">Cargo/Dept</th>
                  <th className="text-center">Idade</th>
                  <th className="text-center">PHQ-9</th>
                  <th className="text-center">GAD-7</th>
                  <th className="text-center">Risco</th>
                  <th className="text-center">Tendência</th>
                  <th className="text-center">Alertas</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participantesPaginados.map((participante) => {
                  const tendencia = getTendencia(participante.phq9Score)
                  
                  return (
                    <tr key={participante.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: participante.riscoSaude === 'alto' ? '#DC3545' : 
                                             participante.riscoSaude === 'medio' ? '#FFC107' : '#28A745',
                              fontSize: '14px'
                            }}
                          >
                            {participante.nome.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <div className="fw-bold">{participante.nome}</div>
                            <small className="text-muted">{participante.email}</small>
                            <div className="small text-muted">{participante.cpf}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge bg="info" className="text-dark">
                          {getEmpresaNome(participante.empresaId)}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className="fw-bold small">{participante.cargo}</div>
                        <small className="text-muted">{participante.departamento}</small>
                      </td>
                      <td className="text-center">
                        {calcularIdade(participante.dataNascimento)} anos
                      </td>
                      <td className="text-center">
                        <Badge bg={participante.phq9Score >= 15 ? 'danger' : participante.phq9Score >= 10 ? 'warning' : 'success'}>
                          {participante.phq9Score}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={participante.gad7Score >= 15 ? 'danger' : participante.gad7Score >= 10 ? 'warning' : 'success'}>
                          {participante.gad7Score}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={participante.riscoSaude === 'alto' ? 'danger' : participante.riscoSaude === 'medio' ? 'warning' : 'success'}>
                          {participante.riscoSaude === 'alto' ? 'Alto' : participante.riscoSaude === 'medio' ? 'Médio' : 'Baixo'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <div className={`text-${tendencia.color} small`}>
                          <IconifyIcon icon={tendencia.icon} className="me-1" />
                          {tendencia.label}
                        </div>
                      </td>
                      <td className="text-center">
                        {participante.alertasPendentes > 0 ? (
                          <Badge bg="danger" pill>{participante.alertasPendentes}</Badge>
                        ) : (
                          <IconifyIcon icon="iconoir:check" className="text-success" />
                        )}
                      </td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewProntuario(participante.id)}
                          title="Ver Prontuário"
                        >
                          <IconifyIcon icon="iconoir:page" />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          className="me-1"
                          onClick={() => router.push(`/adm/editar-participante/${participante.id}`)}
                          title="Editar"
                        >
                          <IconifyIcon icon="iconoir:edit-pencil" />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(participante)}
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

          {participantesPaginados.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="iconoir:user" style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5>Nenhum participante encontrado</h5>
              <p className="text-muted">Tente ajustar os filtros ou adicione um novo participante.</p>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Mostrando {participantesPaginados.length} de {participantesFiltrados.length} participantes
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

      {/* Modal de Confirmação */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir o participante <strong>{participanteToDelete?.nome}</strong>?</p>
          <p className="text-muted small">Esta ação não pode ser desfeita. Todos os dados e avaliações serão removidos.</p>
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
