'use client'

import { useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Form, InputGroup, Modal, Row, Col, Table, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useParticipantes, useRemoverParticipante } from '@/hooks/api/useParticipantes'
import { isDemoMode } from '@/utils/env'

const normalizeParticipante = (participante: any) => {
  const phq9 = Number(participante.phq9Score ?? participante.phq9Ultimo ?? 0)
  const gad7 = Number(participante.gad7Score ?? participante.gad7Ultimo ?? 0)
  const risco = participante.riscoSaude || (phq9 >= 15 || gad7 >= 15 ? 'alto' : phq9 >= 10 || gad7 >= 10 ? 'medio' : 'baixo')
  const pontuacao = Number(participante.pontuacao ?? Math.round((phq9 + gad7) * 3))

  return {
    ...participante,
    login: participante.login || participante.email?.split('@')[0] || `participante-${participante.id}`,
    setor: participante.setor || participante.departamento || '-',
    ultimoAcesso: participante.ultimoAcesso || participante.updated_at || null,
    pontuacao,
    termometro: participante.termometro || (risco === 'alto' ? 'vermelho' : risco === 'medio' ? 'amarelo' : 'verde'),
    risco,
    depressao: phq9,
    ansiedade: gad7,
    respondido: !!participante.ultimaAvaliacao || phq9 > 0 || gad7 > 0,
  }
}

const formatarDataHora = (valor?: string | null) => {
  if (!valor) return 'Nunca'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return 'Nunca'
  return `${data.toLocaleDateString('pt-BR')} ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function ListaParticipantesEmpresaPage() {
  const params = useParams()
  const empresaId = Number(params.empresaId)
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: participantesData, loading, error, refetch } = useParticipantes({ perPage: 200, empresaId })
  const { mutateAsync: removerParticipante } = useRemoverParticipante()

  const participantesBase = demoMode
    ? demoContext.participantes.filter((participante: any) => participante.empresaId === empresaId)
    : (participantesData?.data || [])

  const participantes = useMemo(
    () => participantesBase.map(normalizeParticipante),
    [participantesBase]
  )

  const [busca, setBusca] = useState('')
  const [filtroRisco, setFiltroRisco] = useState<string>('')
  const [filtroSetor, setFiltroSetor] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [participanteSelecionado, setParticipanteSelecionado] = useState<any>(null)

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((participante: any) => {
      const termo = busca.toLowerCase()
      const matchBusca = !busca ||
        participante.nome?.toLowerCase().includes(termo) ||
        participante.login?.toLowerCase().includes(termo)
      const matchRisco = !filtroRisco || participante.risco === filtroRisco
      const matchSetor = !filtroSetor || participante.setor === filtroSetor
      return matchBusca && matchRisco && matchSetor
    })
  }, [participantes, busca, filtroRisco, filtroSetor])

  const setoresDisponiveis = useMemo(
    () => Array.from(new Set(participantes.map((participante: any) => participante.setor))).filter(Boolean),
    [participantes]
  )

  const totalRespondentes = participantes.filter((participante: any) => participante.respondido).length
  const totalRiscoAlto = participantes.filter((participante: any) => participante.risco === 'alto').length

  const getCorTermometro = (cor: string) => {
    const cores: Record<string, string> = {
      verde: '#28a745',
      amarelo: '#ffc107',
      vermelho: '#dc3545',
    }
    return cores[cor] || '#6c757d'
  }

  const getBadgeRisco = (risco: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      baixo: { bg: 'success', text: 'Baixo' },
      medio: { bg: 'warning', text: 'Medio' },
      alto: { bg: 'danger', text: 'Alto' },
    }
    return badges[risco] || { bg: 'secondary', text: risco }
  }

  const handleDelete = (participante: any) => {
    setParticipanteSelecionado(participante)
    setShowDeleteModal(true)
  }

  const handleConfirmarDelete = async () => {
    if (!participanteSelecionado) return

    try {
      if (demoMode) {
        demoContext.deleteParticipante(participanteSelecionado.id)
      } else {
        await removerParticipante(participanteSelecionado.id)
        refetch()
      }
      showNotification({ message: `Participante "${participanteSelecionado.nome}" excluido.`, variant: 'success' })
    } catch (deleteError) {
      showNotification({ message: 'Erro ao excluir participante.', variant: 'danger' })
    } finally {
      setShowDeleteModal(false)
      setParticipanteSelecionado(null)
    }
  }

  const handleSimularAcesso = (participante: any) => {
    showNotification({ message: `Simulando acesso como: ${participante.login}`, variant: 'info' })
  }

  if (!demoMode && loading) {
    return (
      <>
        <PageTitle title='Participantes da Empresa' subName='Empresas' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Participantes da Empresa' subName='Empresas' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar participantes</h5>
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
      <PageTitle title='Participantes da Empresa' subName='Empresas' />

      <Row className='mb-4'>
        <Col md={3}>
          <Card className='bg-primary bg-opacity-10 border-primary'>
            <Card.Body className='text-center'>
              <h3 className='text-primary mb-1'>{participantes.length}</h3>
              <p className='text-muted small mb-0'>Total Participantes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='bg-success bg-opacity-10 border-success'>
            <Card.Body className='text-center'>
              <h3 className='text-success mb-1'>{totalRespondentes}</h3>
              <p className='text-muted small mb-0'>Responderam</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='bg-info bg-opacity-10 border-info'>
            <Card.Body className='text-center'>
              <h3 className='text-info mb-1'>{participantes.length ? Math.round((totalRespondentes / participantes.length) * 100) : 0}%</h3>
              <p className='text-muted small mb-0'>Taxa Resposta</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className='bg-danger bg-opacity-10 border-danger'>
            <Card.Body className='text-center'>
              <h3 className='text-danger mb-1'>{totalRiscoAlto}</h3>
              <p className='text-muted small mb-0'>Risco Alto</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <div className='d-flex gap-3 flex-wrap'>
              <InputGroup style={{ width: '250px' }}>
                <InputGroup.Text>
                  <IconifyIcon icon='iconoir:search' />
                </InputGroup.Text>
                <Form.Control
                  type='text'
                  placeholder='Buscar por login ou nome...'
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
              </InputGroup>

              <Form.Select style={{ width: '150px' }} value={filtroRisco} onChange={(event) => setFiltroRisco(event.target.value)}>
                <option value=''>Todos os riscos</option>
                <option value='baixo'>Baixo</option>
                <option value='medio'>Medio</option>
                <option value='alto'>Alto</option>
              </Form.Select>

              <Form.Select style={{ width: '170px' }} value={filtroSetor} onChange={(event) => setFiltroSetor(event.target.value)}>
                <option value=''>Todos os setores</option>
                {setoresDisponiveis.map((setor) => (
                  <option key={setor} value={setor}>{setor}</option>
                ))}
              </Form.Select>
            </div>

            <div className='d-flex gap-2'>
              <Link href={`/adm/adicionar-participante?empresa=${empresaId}`}>
                <Button variant='primary'>
                  <IconifyIcon icon='iconoir:plus' className='me-2' />
                  Novo Participante
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {totalRiscoAlto > 0 && (
        <Alert variant='danger' className='mb-4'>
          <IconifyIcon icon='iconoir:warning-triangle' className='me-2' />
          <strong>Atencao:</strong> {totalRiscoAlto} participante(s) em situacao de risco alto.
        </Alert>
      )}

      <Card>
        <Card.Body>
          <div className='table-responsive'>
            <Table hover className='mb-0 align-middle'>
              <thead className='table-light'>
                <tr>
                  <th>Participante</th>
                  <th>Setor</th>
                  <th className='text-center'>Ultimo Acesso</th>
                  <th className='text-center'>Pontuacao</th>
                  <th className='text-center'>Termometro</th>
                  <th className='text-center'>Risco</th>
                  <th className='text-center'>PHQ-9</th>
                  <th className='text-center'>GAD-7</th>
                  <th className='text-center'>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {participantesFiltrados.map((participante: any) => {
                  const badgeRisco = getBadgeRisco(participante.risco)
                  return (
                    <tr key={participante.id}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div className='me-2'>
                            {participante.respondido ? (
                              <IconifyIcon icon='iconoir:check-circle' className='text-success' />
                            ) : (
                              <IconifyIcon icon='iconoir:clock' className='text-warning' />
                            )}
                          </div>
                          <div>
                            <div className='fw-bold'>{participante.nome}</div>
                            <small className='text-muted'>@{participante.login}</small>
                          </div>
                        </div>
                      </td>
                      <td>{participante.setor}</td>
                      <td className='text-center'>
                        <small>{formatarDataHora(participante.ultimoAcesso)}</small>
                      </td>
                      <td className='text-center'>
                        {participante.respondido ? (
                          <span className={`fw-bold ${participante.pontuacao >= 70 ? 'text-danger' : participante.pontuacao >= 50 ? 'text-warning' : 'text-success'}`}>
                            {participante.pontuacao}
                          </span>
                        ) : (
                          <span className='text-muted'>-</span>
                        )}
                      </td>
                      <td className='text-center'>
                        {participante.respondido && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: getCorTermometro(participante.termometro),
                              margin: '0 auto',
                              border: '2px solid #fff',
                              boxShadow: '0 0 0 1px #ddd',
                            }}
                          />
                        )}
                      </td>
                      <td className='text-center'>
                        {participante.respondido ? (
                          <Badge bg={badgeRisco.bg}>{badgeRisco.text}</Badge>
                        ) : (
                          <Badge bg='secondary'>Pendente</Badge>
                        )}
                      </td>
                      <td className='text-center'>
                        {participante.respondido ? (
                          <span className={participante.depressao >= 10 ? 'text-danger fw-bold' : ''}>
                            {participante.depressao}
                          </span>
                        ) : (
                          <span className='text-muted'>-</span>
                        )}
                      </td>
                      <td className='text-center'>
                        {participante.respondido ? (
                          <span className={participante.ansiedade >= 10 ? 'text-danger fw-bold' : ''}>
                            {participante.ansiedade}
                          </span>
                        ) : (
                          <span className='text-muted'>-</span>
                        )}
                      </td>
                      <td className='text-center'>
                        <Link href={`/adm/info-participante/${participante.id}`}>
                          <Button variant='outline-primary' size='sm' className='me-1' title='Ver Detalhes'>
                            <IconifyIcon icon='iconoir:page' />
                          </Button>
                        </Link>
                        <Button
                          variant='outline-success'
                          size='sm'
                          className='me-1'
                          title='Simular Acesso'
                          onClick={() => handleSimularAcesso(participante)}
                        >
                          <IconifyIcon icon='iconoir:user-badge-check' />
                        </Button>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          title='Deletar'
                          onClick={() => handleDelete(participante)}
                        >
                          <IconifyIcon icon='iconoir:trash' />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>

          {participantesFiltrados.length === 0 && (
            <div className='text-center py-5'>
              <IconifyIcon icon='iconoir:community' style={{ fontSize: '48px' }} className='text-muted mb-3' />
              <h5>Nenhum participante encontrado</h5>
              <p className='text-muted'>Tente ajustar os filtros ou adicione novos participantes.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir o participante <strong>{participanteSelecionado?.nome}</strong>?</p>
          <p className='text-muted small'>Esta acao nao pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleConfirmarDelete}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Confirmar Exclusao
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
