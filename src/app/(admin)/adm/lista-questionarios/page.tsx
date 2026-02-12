'use client'

import { useState, useMemo } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Pagination, Modal, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Row Component
function SortableTableRow({ 
  questionario, 
  onView, 
  onEdit, 
  onDuplicate, 
  onDelete,
  getTipoBadge 
}: { 
  questionario: any
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDuplicate: (q: any) => void
  onDelete: (q: any) => void
  getTipoBadge: (tipo: string) => string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: questionario.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td>
        <div className="d-flex align-items-center">
          <div {...listeners} className="cursor-grab me-2" style={{ cursor: 'grab' }}>
            <IconifyIcon icon="iconoir:menu" className="text-muted" />
          </div>
          <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
            <IconifyIcon icon="iconoir:clipboard-check" className="text-primary" />
          </div>
          <div>
            <div className="fw-bold">{questionario.codigo}</div>
            <small className="text-muted">{questionario.nome}</small>
            <div className="small text-muted">{questionario.descricao?.substring(0, 60)}...</div>
          </div>
        </div>
      </td>
      <td className="text-center">
        <Badge bg="secondary">{getTipoBadge(questionario.tipo)}</Badge>
      </td>
      <td className="text-center">
        <Badge bg="info">{questionario.numeroQuestoes}</Badge>
      </td>
      <td className="text-center">{questionario.tempoEstimadoMinutos} min</td>
      <td className="text-center">
        <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
          {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td className="text-center">
        <div className="fw-bold">{questionario.aplicacoesTotal?.toLocaleString()}</div>
        <small className="text-muted">+{questionario.aplicacoesUltimoMes} este mês</small>
      </td>
      <td className="text-center">
        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onView(questionario.id)}>
          <IconifyIcon icon="iconoir:eye" />
        </Button>
        <Button variant="outline-info" size="sm" className="me-1" onClick={() => onEdit(questionario.id)}>
          <IconifyIcon icon="iconoir:edit-pencil" />
        </Button>
        <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => onDuplicate(questionario)}>
          <IconifyIcon icon="iconoir:copy" />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(questionario)}>
          <IconifyIcon icon="iconoir:trash" />
        </Button>
      </td>
    </tr>
  )
}

export default function ListaQuestionarios() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { 
    questionarios, 
    deleteQuestionario, 
    duplicarQuestionario,
    reorderQuestionarios 
  } = useDemo()
  
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [questionarioToDelete, setQuestionarioToDelete] = useState<any>(null)
  const itemsPerPage = 5

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter questionnaires
  const questionariosFiltrados = useMemo(() => {
    return questionarios.filter((q: any) => {
      const matchBusca = q.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                        q.codigo?.toLowerCase().includes(busca.toLowerCase()) ||
                        q.descricao?.toLowerCase().includes(busca.toLowerCase())
      const matchTipo = !filtroTipo || q.tipo === filtroTipo
      const matchStatus = !filtroStatus || q.status === filtroStatus
      return matchBusca && matchTipo && matchStatus
    })
  }, [questionarios, busca, filtroTipo, filtroStatus])

  // Pagination
  const totalPages = Math.ceil(questionariosFiltrados.length / itemsPerPage)
  const questionariosPaginados = questionariosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = questionarios.findIndex((q: any) => q.id === active.id)
      const newIndex = questionarios.findIndex((q: any) => q.id === over.id)
      
      const newOrder = arrayMove(questionarios, oldIndex, newIndex)
      reorderQuestionarios(newOrder.map((q: any) => q.id))
      
      showNotification({
        message: 'Ordem dos questionários atualizada',
        variant: 'success'
      })
    }
  }

  // Export to CSV
  const handleExportar = () => {
    const headers = ['ID', 'Código', 'Nome', 'Tipo', 'Questões', 'Escore Máx', 'Tempo (min)', 'Status', 'Aplicações']
    
    const csvContent = [
      headers.join(';'),
      ...questionariosFiltrados.map((q: any) => [
        q.id, q.codigo, q.nome, q.tipo, q.numeroQuestoes, q.escoreMaximo, 
        q.tempoEstimadoMinutos, q.status, q.aplicacoesTotal
      ].join(';'))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `questionarios_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification({ 
      message: `${questionariosFiltrados.length} questionários exportados.`, 
      variant: 'success' 
    })
  }

  // Duplicate
  const handleDuplicar = (q: any) => {
    duplicarQuestionario(q.id)
    showNotification({ 
      message: `Questionário "${q.nome}" duplicado com sucesso.`, 
      variant: 'success' 
    })
  }

  // View
  const handleView = (id: number) => {
    router.push(`/adm/visualizar-questionario/${id}`)
  }

  // Edit
  const handleEdit = (id: number) => {
    router.push(`/adm/editar-questionario/${id}`)
  }

  // Delete
  const handleDeleteClick = (q: any) => {
    setQuestionarioToDelete(q)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (questionarioToDelete) {
      deleteQuestionario(questionarioToDelete.id)
      showNotification({ 
        message: `Questionário "${questionarioToDelete.nome}" excluído.`, 
        variant: 'success' 
      })
      setShowDeleteModal(false)
      setQuestionarioToDelete(null)
    }
  }

  // Get type badge
  const getTipoBadge = (tipo: string) => {
    const types: { [key: string]: string } = {
      depressao: 'Depressão',
      ansiedade: 'Ansiedade',
      estresse: 'Estresse',
      burnout: 'Burnout',
      insonia: 'Insônia'
    }
    return types[tipo] || tipo
  }

  // Stats
  const stats = useMemo(() => {
    const total = questionarios.length
    const ativos = questionarios.filter((q: any) => q.status === 'ativo').length
    const totalAplicacoes = questionarios.reduce((acc: number, q: any) => acc + (q.aplicacoesTotal || 0), 0)
    return { total, ativos, totalAplicacoes }
  }, [questionarios])

  return (
    <>
      <PageTitle title="Lista de Questionários" subName="Administração" />

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="bg-primary text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.total}</h3>
              <small>Total de Questionários</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-success text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.ativos}</h3>
              <small>Ativos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="bg-info text-white text-center">
            <Card.Body>
              <h3 className="mb-1">{stats.totalAplicacoes.toLocaleString()}</h3>
              <small>Aplicações Totais</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-3 flex-wrap">
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text><IconifyIcon icon="iconoir:search" /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar questionários..."
                  value={busca}
                  onChange={(e) => { setBusca(e.target.value); setCurrentPage(1) }}
                />
              </InputGroup>

              <Form.Select style={{ width: '150px' }} value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setCurrentPage(1) }}>
                <option value="">Todos os tipos</option>
                <option value="depressao">Depressão</option>
                <option value="ansiedade">Ansiedade</option>
                <option value="estresse">Estresse</option>
                <option value="burnout">Burnout</option>
                <option value="insonia">Insônia</option>
              </Form.Select>

              <Form.Select style={{ width: '150px' }} value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setCurrentPage(1) }}>
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </Form.Select>
            </div>

            <div className="d-flex gap-2">
              <Button variant="outline-success" onClick={handleExportar}>
                <IconifyIcon icon="iconoir:download" className="me-1" />
                Exportar
              </Button>
              <Link href="/adm/novo-questionario">
                <Button variant="primary">
                  <IconifyIcon icon="iconoir:plus" className="me-1" />
                  Novo Questionário
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Table with Drag and Drop */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questionariosPaginados.map((q: any) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40px' }}></th>
                      <th>Questionário</th>
                      <th className="text-center">Tipo</th>
                      <th className="text-center">Questões</th>
                      <th className="text-center">Tempo</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Aplicações</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionariosPaginados.map((questionario: any) => (
                      <SortableTableRow
                        key={questionario.id}
                        questionario={questionario}
                        onView={(id) => router.push(`/adm/visualizar-questionario/${id}`)}
                        onEdit={(id) => router.push(`/adm/editar-questionario/${id}`)}
                        onDuplicate={handleDuplicar}
                        onDelete={handleDeleteClick}
                        getTipoBadge={getTipoBadge}
                      />
                    ))}
                  </tbody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>

          {questionariosPaginados.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="iconoir:clipboard" style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5>Nenhum questionário encontrado</h5>
              <p className="text-muted">Tente ajustar os filtros ou adicione um novo.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Mostrando {questionariosPaginados.length} de {questionariosFiltrados.length}
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
          <p>Excluir "<strong>{questionarioToDelete?.nome}</strong>"?</p>
          <p className="text-muted small">Esta ação não pode ser desfeita.</p>
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
