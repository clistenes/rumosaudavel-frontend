'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, InputGroup, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useQuestionarios, useRemoverQuestionario } from '@/hooks/api/useQuestionarios'
import { isDemoMode } from '@/utils/env'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const normalizeQuestionario = (questionario: any) => {
  const status = questionario.status || (questionario.ativo === false ? 'inativo' : 'ativo')
  const nome = questionario.nome || questionario.titulo || questionario.title || 'Questionario'
  const tipo = questionario.tipo || questionario.categoria || 'geral'

  return {
    ...questionario,
    codigo: questionario.codigo || `Q-${questionario.id}`,
    nome,
    descricao: questionario.descricao || '',
    tipo,
    status,
    numeroQuestoes: questionario.numeroQuestoes ?? questionario.totalPerguntas ?? 0,
    tempoEstimadoMinutos: questionario.tempoEstimadoMinutos ?? questionario.tempoEstimado ?? 0,
    aplicacoesTotal: questionario.aplicacoesTotal ?? 0,
    aplicacoesUltimoMes: questionario.aplicacoesUltimoMes ?? 0,
  }
}

function SortableTableRow({
  questionario,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  getTipoLabel,
  enableDrag,
}: {
  questionario: any
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDuplicate: (questionario: any) => void
  onDelete: (questionario: any) => void
  getTipoLabel: (tipo: string) => string
  enableDrag: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: questionario.id })

  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
    >
      <td>
        <div className='d-flex align-items-center'>
          <div
            {...(enableDrag ? listeners : {})}
            className='me-2'
            style={{ cursor: enableDrag ? 'grab' : 'default', opacity: enableDrag ? 1 : 0.35 }}
            title={enableDrag ? 'Arrastar para reordenar' : 'Disponivel apenas no modo demo'}
          >
            <IconifyIcon icon='iconoir:menu' className='text-muted' />
          </div>
          <div className='bg-primary bg-opacity-10 p-2 rounded me-3'>
            <IconifyIcon icon='iconoir:clipboard-check' className='text-primary' />
          </div>
          <div>
            <div className='fw-bold'>{questionario.codigo}</div>
            <small className='text-muted'>{questionario.nome}</small>
            <div className='small text-muted'>{questionario.descricao?.substring(0, 60) || '-'}</div>
          </div>
        </div>
      </td>
      <td className='text-center'>
        <Badge bg='secondary'>{getTipoLabel(questionario.tipo)}</Badge>
      </td>
      <td className='text-center'>
        <Badge bg='info'>{questionario.numeroQuestoes}</Badge>
      </td>
      <td className='text-center'>{questionario.tempoEstimadoMinutos} min</td>
      <td className='text-center'>
        <Badge bg={questionario.status === 'ativo' ? 'success' : 'secondary'}>
          {questionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td className='text-center'>
        <div className='fw-bold'>{Number(questionario.aplicacoesTotal || 0).toLocaleString()}</div>
        <small className='text-muted'>+{Number(questionario.aplicacoesUltimoMes || 0)} este mes</small>
      </td>
      <td className='text-center'>
        <Button variant='outline-primary' size='sm' className='me-1' onClick={() => onView(questionario.id)}>
          <IconifyIcon icon='iconoir:eye' />
        </Button>
        <Button variant='outline-info' size='sm' className='me-1' onClick={() => onEdit(questionario.id)}>
          <IconifyIcon icon='iconoir:edit-pencil' />
        </Button>
        <Button variant='outline-secondary' size='sm' className='me-1' onClick={() => onDuplicate(questionario)}>
          <IconifyIcon icon='iconoir:copy' />
        </Button>
        <Button variant='outline-danger' size='sm' onClick={() => onDelete(questionario)}>
          <IconifyIcon icon='iconoir:trash' />
        </Button>
      </td>
    </tr>
  )
}

export default function ListaQuestionarios() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: questionariosData, loading, error, refetch } = useQuestionarios({ perPage: 100 })
  const { mutateAsync: removerQuestionario } = useRemoverQuestionario()

  const questionariosBrutos = demoMode ? demoContext.questionarios : (questionariosData?.data || [])
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [questionarioToDelete, setQuestionarioToDelete] = useState<any>(null)
  const itemsPerPage = 8

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const questionarios = useMemo(
    () => questionariosBrutos.map(normalizeQuestionario),
    [questionariosBrutos]
  )

  const questionariosFiltrados = useMemo(() => {
    return questionarios.filter((questionario: any) => {
      const termo = busca.toLowerCase()
      const matchBusca = !busca ||
        questionario.nome?.toLowerCase().includes(termo) ||
        questionario.codigo?.toLowerCase().includes(termo) ||
        questionario.descricao?.toLowerCase().includes(termo)
      const matchTipo = !filtroTipo || questionario.tipo === filtroTipo
      const matchStatus = !filtroStatus || questionario.status === filtroStatus
      return matchBusca && matchTipo && matchStatus
    })
  }, [questionarios, busca, filtroTipo, filtroStatus])

  const totalPages = Math.ceil(questionariosFiltrados.length / itemsPerPage)
  const questionariosPaginados = questionariosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDragEnd = (event: DragEndEvent) => {
    if (!demoMode) return

    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = questionarios.findIndex((questionario: any) => questionario.id === active.id)
    const newIndex = questionarios.findIndex((questionario: any) => questionario.id === over.id)
    const novaOrdem = arrayMove(questionarios, oldIndex, newIndex)

    demoContext.reorderQuestionarios(novaOrdem.map((questionario: any) => questionario.id))
    showNotification({ message: 'Ordem dos questionarios atualizada', variant: 'success' })
  }

  const handleExportar = () => {
    const headers = ['ID', 'Codigo', 'Nome', 'Tipo', 'Questoes', 'Tempo (min)', 'Status', 'Aplicacoes']
    const csvContent = [
      headers.join(';'),
      ...questionariosFiltrados.map((questionario: any) => [
        questionario.id,
        questionario.codigo,
        questionario.nome,
        questionario.tipo,
        questionario.numeroQuestoes,
        questionario.tempoEstimadoMinutos,
        questionario.status,
        questionario.aplicacoesTotal,
      ].join(';')),
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `questionarios_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    showNotification({ message: `${questionariosFiltrados.length} questionarios exportados.`, variant: 'success' })
  }

  const handleDuplicar = (questionario: any) => {
    if (demoMode) {
      demoContext.duplicarQuestionario(questionario.id)
      showNotification({ message: `Questionario "${questionario.nome}" duplicado.`, variant: 'success' })
      return
    }

    showNotification({ message: 'Duplicacao ainda nao implementada na API.', variant: 'warning' })
  }

  const handleDeleteClick = (questionario: any) => {
    setQuestionarioToDelete(questionario)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!questionarioToDelete) return

    try {
      if (demoMode) {
        demoContext.deleteQuestionario(questionarioToDelete.id)
      } else {
        await removerQuestionario(questionarioToDelete.id)
        refetch()
      }

      showNotification({ message: `Questionario "${questionarioToDelete.nome}" excluido.`, variant: 'success' })
    } catch (deleteError) {
      showNotification({ message: 'Erro ao excluir questionario.', variant: 'danger' })
    } finally {
      setShowDeleteModal(false)
      setQuestionarioToDelete(null)
    }
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      depressao: 'Depressao',
      ansiedade: 'Ansiedade',
      estresse: 'Estresse',
      burnout: 'Burnout',
      insonia: 'Insonia',
      avaliacao: 'Avaliacao',
      triagem: 'Triagem',
      acompanhamento: 'Acompanhamento',
      feedback: 'Feedback',
    }
    return labels[tipo] || tipo
  }

  const stats = useMemo(() => ({
    total: questionarios.length,
    ativos: questionarios.filter((questionario: any) => questionario.status === 'ativo').length,
    totalAplicacoes: questionarios.reduce((acc: number, questionario: any) => acc + Number(questionario.aplicacoesTotal || 0), 0),
  }), [questionarios])

  if (!demoMode && loading) {
    return (
      <>
        <PageTitle title='Lista de Questionarios' subName='Administracao' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Lista de Questionarios' subName='Administracao' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar questionarios</h5>
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
      <PageTitle title='Lista de Questionarios' subName='Administracao' />

      <Row className='mb-4'>
        <Col md={4}>
          <Card className='bg-primary text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.total}</h3>
              <small>Total de Questionarios</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='bg-success text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.ativos}</h3>
              <small>Ativos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='bg-info text-white text-center'>
            <Card.Body>
              <h3 className='mb-1'>{stats.totalAplicacoes.toLocaleString()}</h3>
              <small>Aplicacoes Totais</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <div className='d-flex gap-3 flex-wrap'>
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text><IconifyIcon icon='iconoir:search' /></InputGroup.Text>
                <Form.Control
                  type='text'
                  placeholder='Buscar questionarios...'
                  value={busca}
                  onChange={(event) => { setBusca(event.target.value); setCurrentPage(1) }}
                />
              </InputGroup>

              <Form.Select style={{ width: '170px' }} value={filtroTipo} onChange={(event) => { setFiltroTipo(event.target.value); setCurrentPage(1) }}>
                <option value=''>Todos os tipos</option>
                <option value='depressao'>Depressao</option>
                <option value='ansiedade'>Ansiedade</option>
                <option value='estresse'>Estresse</option>
                <option value='burnout'>Burnout</option>
                <option value='insonia'>Insonia</option>
                <option value='avaliacao'>Avaliacao</option>
              </Form.Select>

              <Form.Select style={{ width: '150px' }} value={filtroStatus} onChange={(event) => { setFiltroStatus(event.target.value); setCurrentPage(1) }}>
                <option value=''>Todos os status</option>
                <option value='ativo'>Ativo</option>
                <option value='inativo'>Inativo</option>
              </Form.Select>
            </div>

            <div className='d-flex gap-2'>
              <Button variant='outline-success' onClick={handleExportar}>
                <IconifyIcon icon='iconoir:download' className='me-1' />
                Exportar
              </Button>
              <Link href='/adm/novo-questionario'>
                <Button variant='primary'>
                  <IconifyIcon icon='iconoir:plus' className='me-1' />
                  Novo Questionario
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className='table-responsive'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={questionariosPaginados.map((questionario: any) => questionario.id)} strategy={verticalListSortingStrategy}>
                <Table hover className='mb-0'>
                  <thead className='table-light'>
                    <tr>
                      <th style={{ width: '40px' }} />
                      <th>Questionario</th>
                      <th className='text-center'>Tipo</th>
                      <th className='text-center'>Questoes</th>
                      <th className='text-center'>Tempo</th>
                      <th className='text-center'>Status</th>
                      <th className='text-center'>Aplicacoes</th>
                      <th className='text-center'>Acoes</th>
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
                        getTipoLabel={getTipoLabel}
                        enableDrag={demoMode}
                      />
                    ))}
                  </tbody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>

          {questionariosPaginados.length === 0 && (
            <div className='text-center py-5'>
              <IconifyIcon icon='iconoir:clipboard' style={{ fontSize: '48px' }} className='text-muted mb-3' />
              <h5>Nenhum questionario encontrado</h5>
              <p className='text-muted'>Tente ajustar os filtros ou adicione um novo.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className='d-flex justify-content-between align-items-center mt-3'>
              <small className='text-muted'>
                Mostrando {questionariosPaginados.length} de {questionariosFiltrados.length}
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
          <p>Excluir "<strong>{questionarioToDelete?.nome}</strong>"?</p>
          <p className='text-muted small'>Esta acao nao pode ser desfeita.</p>
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
