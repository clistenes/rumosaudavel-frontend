'use client'

import { useState } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Row, Col, Modal, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useProgramas, useRemoverPrograma } from '@/hooks/api/useProgramas'
import { isDemoMode } from '@/utils/env'

export default function ListaProgramas() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()
  
  // Hooks da API
  const { data: programasData, loading: loadingProgramas, error, refetch } = useProgramas({ perPage: 100 })
  const { mutateAsync: removerPrograma } = useRemoverPrograma()
  
  // Dados
  const programas: any[] = demoMode ? demoContext.programas : (programasData?.data || [])
  
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [programaToDelete, setProgramaToDelete] = useState<any>(null)

  const programasFiltrados = programas.filter((p: any) => {
    const matchBusca = !busca || 
                      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                      p.descricao?.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = !filtroStatus || p.status === filtroStatus
    return matchBusca && matchStatus
  })

  const handleDeleteClick = (programa: any) => {
    setProgramaToDelete(programa)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (programaToDelete) {
      try {
        if (demoMode) {
          demoContext.deletePrograma(programaToDelete.id)
        } else {
          await removerPrograma(programaToDelete.id)
          refetch()
        }
        showNotification({
          message: `Programa "${programaToDelete.nome}" excluído com sucesso.`,
          variant: 'success'
        })
      } catch (error) {
        showNotification({
          message: 'Erro ao excluir programa. Tente novamente.',
          variant: 'danger'
        })
      } finally {
        setShowDeleteModal(false)
        setProgramaToDelete(null)
      }
    }
  }

  const handleDuplicar = (programa: any) => {
    if (demoMode) {
      demoContext.duplicarPrograma(programa.id)
      showNotification({
        message: `Programa "${programa.nome}" duplicado com sucesso!`,
        variant: 'success'
      })
    } else {
      showNotification({
        message: 'Função de duplicar não disponível em produção ainda.',
        variant: 'warning'
      })
    }
  }

  const handleVincular = (programaId: number) => {
    router.push(`/adm/vincular-questionarios/${programaId}`)
  }

  // Loading state
  if (!demoMode && loadingProgramas) {
    return (
      <>
        <PageTitle title="Programas de Saúde" subName="Programas" />
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
        <PageTitle title="Programas de Saúde" subName="Programas" />
        <Card className="text-center py-5">
          <Card.Body>
            <IconifyIcon icon="iconoir:wifi-off" style={{ fontSize: '48px' }} className="text-danger mb-3" />
            <h5>Erro ao carregar programas</h5>
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
      <PageTitle title="Programas de Saúde" subName="Programas" />

      {/* Filtros e Ações */}
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
                  placeholder="Buscar programa..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </InputGroup>

              <Form.Select
                style={{ width: '150px' }}
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Form.Select>
            </div>

            <Link href="/adm/adicionar-programa">
              <Button variant="primary">
                <IconifyIcon icon="iconoir:plus" className="me-2" />
                Novo Programa
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      {/* Lista de Programas em Cards */}
      <Row>
        {programasFiltrados.map((programa: any) => (
          <Col md={6} lg={4} key={programa.id} className="mb-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg={programa.status === 'ativo' ? 'success' : 'secondary'}>
                    {programa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <small className="text-muted">
                    {programa.dataInicio ? new Date(programa.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}
                  </small>
                </div>

                <h5 className="card-title mb-2">{programa.nome}</h5>
                <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                  {programa.descricao}
                </p>

                <div className="d-flex gap-3 mb-3 text-center">
                  <div>
                    <div className="fw-bold text-primary">{programa.duracaoMeses || 0}</div>
                    <small className="text-muted">Meses</small>
                  </div>
                  <div>
                    <div className="fw-bold text-info">{programa.empresasParticipantes?.length || 0}</div>
                    <small className="text-muted">Empresas</small>
                  </div>
                  <div>
                    <div className="fw-bold text-success">{programa.participantesAtivos?.toLocaleString() || 0}</div>
                    <small className="text-muted">Participantes</small>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => router.push(`/adm/editar-programa/${programa.id}`)}
                    className="flex-fill"
                  >
                    <IconifyIcon icon="iconoir:edit-pencil" className="me-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => handleVincular(programa.id)}
                    title="Vincular Questionários"
                  >
                    <IconifyIcon icon="iconoir:link" />
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => handleDuplicar(programa)}
                    title="Duplicar"
                  >
                    <IconifyIcon icon="iconoir:copy" />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteClick(programa)}
                    title="Excluir"
                  >
                    <IconifyIcon icon="iconoir:trash" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {programasFiltrados.length === 0 && (
        <div className="text-center py-5">
          <IconifyIcon icon="iconoir:suitcase" style={{ fontSize: '48px' }} className="text-muted mb-3" />
          <h5>Nenhum programa encontrado</h5>
          <p className="text-muted">Crie um novo programa para começar.</p>
        </div>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir o programa <strong>{programaToDelete?.nome}</strong>?</p>
          <p className="text-muted small">Esta ação não pode ser desfeita.</p>
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
