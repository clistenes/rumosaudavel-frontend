'use client'

import { useState } from 'react'
import { Card, Table, Button, Badge, Form, InputGroup, Alert, Modal, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'

interface Participante {
  id: number
  login: string
  nome: string
  setor: string
  ultimoAcesso: string
  pontuacao: number
  termometro: 'verde' | 'amarelo' | 'vermelho'
  risco: 'baixo' | 'medio' | 'alto'
  depressao: number
  ansiedade: number
  respondido: boolean
}

const participantesDemo: Participante[] = [
  {
    id: 1,
    login: 'joao.silva',
    nome: 'João Silva',
    setor: 'Administrativo',
    ultimoAcesso: '10/02/2025 14:30',
    pontuacao: 78,
    termometro: 'vermelho',
    risco: 'alto',
    depressao: 12,
    ansiedade: 10,
    respondido: true,
  },
  {
    id: 2,
    login: 'maria.santos',
    nome: 'Maria Santos',
    setor: 'Operacional',
    ultimoAcesso: '09/02/2025 09:15',
    pontuacao: 65,
    termometro: 'amarelo',
    risco: 'medio',
    depressao: 8,
    ansiedade: 7,
    respondido: true,
  },
  {
    id: 3,
    login: 'pedro.oliveira',
    nome: 'Pedro Oliveira',
    setor: 'Administrativo',
    ultimoAcesso: '08/02/2025 16:45',
    pontuacao: 82,
    termometro: 'vermelho',
    risco: 'alto',
    depressao: 15,
    ansiedade: 12,
    respondido: true,
  },
  {
    id: 4,
    login: 'ana.costa',
    nome: 'Ana Costa',
    setor: 'RH',
    ultimoAcesso: '10/02/2025 11:20',
    pontuacao: 45,
    termometro: 'verde',
    risco: 'baixo',
    depressao: 4,
    ansiedade: 5,
    respondido: true,
  },
  {
    id: 5,
    login: 'carlos.souza',
    nome: 'Carlos Souza',
    setor: 'Operacional',
    ultimoAcesso: '07/02/2025 08:00',
    pontuacao: 71,
    termometro: 'amarelo',
    risco: 'medio',
    depressao: 9,
    ansiedade: 11,
    respondido: true,
  },
  {
    id: 6,
    login: 'juliana.lima',
    nome: 'Juliana Lima',
    setor: 'Administrativo',
    ultimoAcesso: 'Nunca',
    pontuacao: 0,
    termometro: 'verde',
    risco: 'baixo',
    depressao: 0,
    ansiedade: 0,
    respondido: false,
  },
]

export default function ListaParticipantes() {
  const params = useParams()
  const empresaId = params.empresaId as string
  
  const [participantes] = useState<Participante[]>(participantesDemo)
  const [busca, setBusca] = useState('')
  const [filtroRisco, setFiltroRisco] = useState<string>('')
  const [filtroSetor, setFiltroSetor] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [participanteSelecionado, setParticipanteSelecionado] = useState<Participante | null>(null)

  const participantesFiltrados = participantes.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      p.login.toLowerCase().includes(busca.toLowerCase())
    const matchRisco = !filtroRisco || p.risco === filtroRisco
    const matchSetor = !filtroSetor || p.setor === filtroSetor
    return matchBusca && matchRisco && matchSetor
  })

  const totalRespondentes = participantes.filter(p => p.respondido).length
  const totalRiscoAlto = participantes.filter(p => p.risco === 'alto').length

  const getCorTermometro = (cor: string) => {
    const cores: { [key: string]: string } = {
      verde: '#28a745',
      amarelo: '#ffc107',
      vermelho: '#dc3545',
    }
    return cores[cor] || '#6c757d'
  }

  const getBadgeRisco = (risco: string) => {
    const badges: { [key: string]: { bg: string; text: string } } = {
      baixo: { bg: 'success', text: 'Baixo' },
      medio: { bg: 'warning', text: 'Médio' },
      alto: { bg: 'danger', text: 'Alto' },
    }
    return badges[risco] || { bg: 'secondary', text: risco }
  }

  const handleDeletar = (participante: Participante) => {
    setParticipanteSelecionado(participante)
    setShowDeleteModal(true)
  }

  const handleConfirmarDelete = () => {
    setShowDeleteModal(false)
    setParticipanteSelecionado(null)
    alert(`Participante ${participanteSelecionado?.login} deletado!`)
  }

  const handleSimularAcesso = (participante: Participante) => {
    alert(`Simulando acesso como: ${participante.login}`)
  }

  return (
    <>
      <PageTitle title="Participantes da Empresa" subName="Empresas" />

      {/* Header com estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="bg-primary bg-opacity-10 border-primary">
            <Card.Body className="text-center">
              <h3 className="text-primary mb-1">{participantes.length}</h3>
              <p className="text-muted small mb-0">Total Participantes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-success bg-opacity-10 border-success">
            <Card.Body className="text-center">
              <h3 className="text-success mb-1">{totalRespondentes}</h3>
              <p className="text-muted small mb-0">Responderam</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-info bg-opacity-10 border-info">
            <Card.Body className="text-center">
              <h3 className="text-info mb-1">{Math.round((totalRespondentes / participantes.length) * 100)}%</h3>
              <p className="text-muted small mb-0">Taxa Resposta</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="bg-danger bg-opacity-10 border-danger">
            <Card.Body className="text-center">
              <h3 className="text-danger mb-1">{totalRiscoAlto}</h3>
              <p className="text-muted small mb-0">Risco Alto</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros e Ações */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-3 flex-wrap">
              <InputGroup style={{ width: '250px' }}>
                <InputGroup.Text>
                  <IconifyIcon icon="iconoir:search" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar por login ou nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </InputGroup>

              <Form.Select
                style={{ width: '150px' }}
                value={filtroRisco}
                onChange={(e) => setFiltroRisco(e.target.value)}
              >
                <option value="">Todos os riscos</option>
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
              </Form.Select>

              <Form.Select
                style={{ width: '150px' }}
                value={filtroSetor}
                onChange={(e) => setFiltroSetor(e.target.value)}
              >
                <option value="">Todos os setores</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Operacional">Operacional</option>
                <option value="RH">RH</option>
              </Form.Select>
            </div>

            <div className="d-flex gap-2">
              <Link href={`/adm/adicionar-participante?empresa=${empresaId}`}>
                <Button variant="primary">
                  <IconifyIcon icon="iconoir:plus" className="me-2" />
                  Novo Participante
                </Button>
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Alerta de risco */}
      {totalRiscoAlto > 0 && (
        <Alert variant="danger" className="mb-4">
          <IconifyIcon icon="iconoir:warning-triangle" className="me-2" />
          <strong>Atenção:</strong> {totalRiscoAlto} participante(s) em situação de risco alto. 
          Recomenda-se acompanhamento prioritário.
        </Alert>
      )}

      {/* Tabela de Participantes */}
      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Participante</th>
                  <th>Setor</th>
                  <th className="text-center">Último Acesso</th>
                  <th className="text-center">Pontuação</th>
                  <th className="text-center">Termômetro</th>
                  <th className="text-center">Risco</th>
                  <th className="text-center">PHQ-9</th>
                  <th className="text-center">GAD-7</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {participantesFiltrados.map((p) => {
                  const riscoBadge = getBadgeRisco(p.risco)
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            {p.respondido ? (
                              <IconifyIcon icon="iconoir:check-circle" className="text-success" />
                            ) : (
                              <IconifyIcon icon="iconoir:clock" className="text-warning" />
                            )}
                          </div>
                          <div>
                            <div className="fw-bold">{p.nome}</div>
                            <small className="text-muted">@{p.login}</small>
                          </div>
                        </div>
                      </td>
                      <td>{p.setor}</td>
                      <td className="text-center">
                        <small>{p.ultimoAcesso}</small>
                      </td>
                      <td className="text-center">
                        {p.respondido ? (
                          <span className={`fw-bold ${p.pontuacao >= 70 ? 'text-danger' : p.pontuacao >= 50 ? 'text-warning' : 'text-success'}`}>
                            {p.pontuacao}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        {p.respondido && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: getCorTermometro(p.termometro),
                              margin: '0 auto',
                              border: '2px solid #fff',
                              boxShadow: '0 0 0 1px #ddd',
                            }}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        {p.respondido ? (
                          <Badge bg={riscoBadge.bg}>{riscoBadge.text}</Badge>
                        ) : (
                          <Badge bg="secondary">Pendente</Badge>
                        )}
                      </td>
                      <td className="text-center">
                        {p.respondido ? (
                          <span className={p.depressao >= 10 ? 'text-danger fw-bold' : ''}>
                            {p.depressao}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        {p.respondido ? (
                          <span className={p.ansiedade >= 10 ? 'text-danger fw-bold' : ''}>
                            {p.ansiedade}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        <Link href={`/adm/info-participante/${p.id}`}>
                          <Button variant="outline-primary" size="sm" className="me-1" title="Ver Detalhes">
                            <IconifyIcon icon="iconoir:page" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="me-1" 
                          title="Simular Acesso"
                          onClick={() => handleSimularAcesso(p)}
                        >
                          <IconifyIcon icon="iconoir:user-badge-check" />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          title="Deletar"
                          onClick={() => handleDeletar(p)}
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

          {participantesFiltrados.length === 0 && (
            <div className="text-center py-5">
              <IconifyIcon icon="iconoir:community" style={{ fontSize: '48px' }} className="text-muted mb-3" />
              <h5>Nenhum participante encontrado</h5>
              <p className="text-muted">Tente ajustar os filtros ou adicione novos participantes.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Confirmação de Delete */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tem certeza que deseja excluir o participante <strong>{participanteSelecionado?.nome}</strong>?</p>
          <p className="text-muted small">Esta ação não pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmarDelete}>
            <IconifyIcon icon="iconoir:trash" className="me-2" />
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
