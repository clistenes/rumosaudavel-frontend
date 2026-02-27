'use client'

import { useMemo, useState } from 'react'
import { Card, Button, Badge, Form, InputGroup, Row, Col, Modal, Spinner, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useProgramas, useRemoverPrograma } from '@/hooks/api/useProgramas'
import { isDemoMode } from '@/utils/env'
import type { DemoProgramaEmpresaVinculo } from '@/types/demo'

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR')
}

const formatIntervalo = (vinculo: DemoProgramaEmpresaVinculo) => {
  if (vinculo.indeterminado) return 'Indeterminado'
  if (!vinculo.intervaloInicio || !vinculo.intervaloFim) return 'Intervalo nao definido'
  return `${formatDate(vinculo.intervaloInicio)} - ${formatDate(vinculo.intervaloFim)}`
}

export default function ListaProgramas() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: programasData, loading: loadingProgramas, error, refetch } = useProgramas({ perPage: 100 })
  const { mutateAsync: removerPrograma } = useRemoverPrograma()

  const programas: any[] = demoMode ? demoContext.programas : (programasData?.data || [])
  const empresas: any[] = demoMode ? demoContext.empresas : []
  const usuarios: any[] = demoMode ? demoContext.usuarios : []

  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [programaToDelete, setProgramaToDelete] = useState<any>(null)

  const [showVincularModal, setShowVincularModal] = useState(false)
  const [programaVincularId, setProgramaVincularId] = useState<number | null>(null)
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('')

  const [showAcessoPublicoModal, setShowAcessoPublicoModal] = useState(false)
  const [selectedPublico, setSelectedPublico] = useState<{ programaId: number; vinculoId: number } | null>(null)

  const [showIntervaloModal, setShowIntervaloModal] = useState(false)
  const [selectedIntervalo, setSelectedIntervalo] = useState<{ programaId: number; vinculoId: number } | null>(null)
  const [intervaloInicio, setIntervaloInicio] = useState('')
  const [intervaloFim, setIntervaloFim] = useState('')
  const [intervaloIndeterminado, setIntervaloIndeterminado] = useState(true)

  const [showAcessoUsuariosModal, setShowAcessoUsuariosModal] = useState(false)
  const [selectedAcessoUsuarios, setSelectedAcessoUsuarios] = useState<{ programaId: number; vinculoId: number; empresaId: number } | null>(null)
  const [buscaUsuarios, setBuscaUsuarios] = useState('')
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<number[]>([])

  const programasFiltrados = useMemo(() => {
    return programas.filter((p: any) => {
      const matchBusca =
        !busca ||
        p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = !filtroStatus || p.status === filtroStatus
      return matchBusca && matchStatus
    })
  }, [programas, busca, filtroStatus])

  const getVinculos = (programa: any): DemoProgramaEmpresaVinculo[] => {
    if (!demoMode) return (programa.empresasVinculadas || []) as DemoProgramaEmpresaVinculo[]
    return demoContext.getProgramaEmpresas(programa.id)
  }

  const getEmpresa = (empresaId: number) => empresas.find((item: any) => Number(item.id) === Number(empresaId))

  const getLinkPublico = (empresaId: number) => {
    const empresa = getEmpresa(empresaId)
    const slug = empresa?.slug || toSlug(empresa?.nome || `empresa-${empresaId}`)
    return `https://portal.demo.local/empresa/${slug}`
  }

  const abrirVincularEmpresa = (programaId: number) => {
    if (!demoMode) {
      showNotification({ message: 'Disponivel apenas no modo demo.', variant: 'warning' })
      return
    }
    setProgramaVincularId(programaId)
    setEmpresaSelecionada('')
    setShowVincularModal(true)
  }

  const empresasDisponiveis = useMemo(() => {
    if (!programaVincularId) return []
    const programa = programas.find((item: any) => item.id === programaVincularId)
    if (!programa) return []
    const vinculadas = new Set(getVinculos(programa).map((v) => v.empresaId))
    return empresas.filter((empresa: any) => !vinculadas.has(Number(empresa.id)))
  }, [programaVincularId, programas, empresas, demoMode])

  const confirmarVinculoEmpresa = () => {
    if (!programaVincularId || !empresaSelecionada) {
      showNotification({ message: 'Selecione uma empresa para vincular.', variant: 'warning' })
      return
    }

    demoContext.vincularEmpresaPrograma(programaVincularId, Number(empresaSelecionada))
    setShowVincularModal(false)
    setEmpresaSelecionada('')
    showNotification({ message: 'Empresa vinculada ao programa com sucesso.', variant: 'success' })
  }

  const abrirAcessoPublico = (programaId: number, vinculoId: number) => {
    setSelectedPublico({ programaId, vinculoId })
    setShowAcessoPublicoModal(true)
  }

  const abrirIntervalo = (programaId: number, vinculo: DemoProgramaEmpresaVinculo) => {
    setSelectedIntervalo({ programaId, vinculoId: vinculo.id })
    setIntervaloInicio(vinculo.intervaloInicio || '')
    setIntervaloFim(vinculo.intervaloFim || '')
    setIntervaloIndeterminado(vinculo.indeterminado)
    setShowIntervaloModal(true)
  }

  const salvarIntervalo = () => {
    if (!selectedIntervalo) return

    if (!intervaloIndeterminado) {
      if (!intervaloInicio || !intervaloFim) {
        showNotification({ message: 'Informe inicio e fim do intervalo.', variant: 'warning' })
        return
      }
      if (new Date(intervaloInicio) > new Date(intervaloFim)) {
        showNotification({ message: 'Data de inicio nao pode ser maior que a data final.', variant: 'warning' })
        return
      }
    }

    demoContext.atualizarIntervaloEmpresaPrograma(selectedIntervalo.programaId, selectedIntervalo.vinculoId, {
      indeterminado: intervaloIndeterminado,
      intervaloInicio: intervaloIndeterminado ? null : intervaloInicio,
      intervaloFim: intervaloIndeterminado ? null : intervaloFim,
    })

    setShowIntervaloModal(false)
    showNotification({ message: 'Intervalo atualizado com sucesso.', variant: 'success' })
  }

  const abrirControleAcesso = (programaId: number, vinculo: DemoProgramaEmpresaVinculo) => {
    const usuariosEmpresa = usuarios.filter((usuario: any) => Number(usuario.empresaId) === Number(vinculo.empresaId))
    const idsValidos = new Set(usuariosEmpresa.map((usuario: any) => Number(usuario.id)))
    const saneados = (vinculo.usuariosPermitidos || []).filter((id) => idsValidos.has(Number(id)))

    if (saneados.length !== (vinculo.usuariosPermitidos || []).length) {
      demoContext.atualizarUsuariosPermitidosPrograma(programaId, vinculo.id, saneados)
    }

    setSelectedAcessoUsuarios({ programaId, vinculoId: vinculo.id, empresaId: vinculo.empresaId })
    setUsuariosSelecionados(saneados)
    setBuscaUsuarios('')
    setShowAcessoUsuariosModal(true)
  }

  const usuariosEmpresaFiltrados = useMemo(() => {
    if (!selectedAcessoUsuarios) return []
    const termo = buscaUsuarios.toLowerCase()
    return usuarios
      .filter((usuario: any) => Number(usuario.empresaId) === Number(selectedAcessoUsuarios.empresaId))
      .filter((usuario: any) => {
        if (!buscaUsuarios) return true
        return (
          String(usuario.nome || '').toLowerCase().includes(termo) ||
          String(usuario.login || '').toLowerCase().includes(termo)
        )
      })
  }, [selectedAcessoUsuarios, buscaUsuarios, usuarios])

  const toggleUsuarioSelecionado = (usuarioId: number) => {
    setUsuariosSelecionados((prev) =>
      prev.includes(usuarioId) ? prev.filter((item) => item !== usuarioId) : [...prev, usuarioId]
    )
  }

  const selecionarTodosVisiveis = () => {
    const idsVisiveis = usuariosEmpresaFiltrados.map((usuario: any) => Number(usuario.id))
    const todosSelecionados = idsVisiveis.every((id) => usuariosSelecionados.includes(id))
    if (todosSelecionados) {
      setUsuariosSelecionados((prev) => prev.filter((id) => !idsVisiveis.includes(id)))
      return
    }
    setUsuariosSelecionados((prev) => Array.from(new Set([...prev, ...idsVisiveis])))
  }

  const salvarControleAcesso = () => {
    if (!selectedAcessoUsuarios) return
    demoContext.atualizarUsuariosPermitidosPrograma(
      selectedAcessoUsuarios.programaId,
      selectedAcessoUsuarios.vinculoId,
      usuariosSelecionados
    )
    setShowAcessoUsuariosModal(false)
    showNotification({ message: 'Controle de acesso atualizado.', variant: 'success' })
  }

  const removerVinculoEmpresa = (programaId: number, vinculo: DemoProgramaEmpresaVinculo, nomeEmpresa: string) => {
    const confirmed = window.confirm(`Deseja remover o vinculo da empresa "${nomeEmpresa}" neste programa?`)
    if (!confirmed) return
    demoContext.removerEmpresaPrograma(programaId, vinculo.id)
    showNotification({ message: 'Vinculo removido com sucesso.', variant: 'success' })
  }

  const handleDeleteClick = (programa: any) => {
    setProgramaToDelete(programa)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!programaToDelete) return
    try {
      if (demoMode) {
        demoContext.deletePrograma(programaToDelete.id)
      } else {
        await removerPrograma(programaToDelete.id)
        refetch()
      }
      showNotification({
        message: `Programa "${programaToDelete.nome}" excluido com sucesso.`,
        variant: 'success',
      })
    } catch {
      showNotification({
        message: 'Erro ao excluir programa. Tente novamente.',
        variant: 'danger',
      })
    } finally {
      setShowDeleteModal(false)
      setProgramaToDelete(null)
    }
  }

  const handleDuplicar = (programa: any) => {
    if (demoMode) {
      demoContext.duplicarPrograma(programa.id)
      showNotification({
        message: `Programa "${programa.nome}" duplicado com sucesso.`,
        variant: 'success',
      })
      return
    }
    showNotification({
      message: 'Funcao de duplicar nao disponivel em producao ainda.',
      variant: 'warning',
    })
  }

  if (!demoMode && loadingProgramas) {
    return (
      <>
        <PageTitle title='Programas de Saude' subName='Programas' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Programas de Saude' subName='Programas' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar programas</h5>
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

  const vinculoPublico = selectedPublico
    ? (programas.find((programa: any) => programa.id === selectedPublico.programaId)?.empresasVinculadas || []).find(
      (v: any) => v.id === selectedPublico.vinculoId
    )
    : null

  return (
    <>
      <PageTitle title='Programas de Saude' subName='Programas' />

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <div className='d-flex gap-3 flex-wrap'>
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text>
                  <IconifyIcon icon='iconoir:search' />
                </InputGroup.Text>
                <Form.Control
                  type='text'
                  placeholder='Buscar programa...'
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                />
              </InputGroup>

              <Form.Select style={{ width: '150px' }} value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)}>
                <option value=''>Todos</option>
                <option value='ativo'>Ativo</option>
                <option value='inativo'>Inativo</option>
              </Form.Select>
            </div>

            <Link href='/adm/adicionar-programa'>
              <Button variant='primary'>
                <IconifyIcon icon='iconoir:plus' className='me-2' />
                Novo Programa
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Row>
        {programasFiltrados.map((programa: any, index: number) => {
          const vinculos = getVinculos(programa)
          return (
            <Col md={6} xl={4} key={programa.id} className='mb-4'>
              <Card
                className='h-100'
                style={{
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  transitionDelay: `${index * 45}ms`,
                }}
              >
                <Card.Body>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <Badge bg={programa.status === 'ativo' ? 'success' : 'secondary'}>
                      {programa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <small className='text-muted'>{formatDate(programa.dataInicio || programa.createdAt)}</small>
                  </div>

                  <h5 className='mb-2'>{programa.nome}</h5>
                  <p className='text-muted small mb-3' style={{ minHeight: '40px' }}>
                    {programa.descricao}
                  </p>

                  <div className='d-flex gap-3 mb-3 text-center'>
                    <div>
                      <div className='fw-bold text-primary'>{programa.duracaoMeses || 0}</div>
                      <small className='text-muted'>Meses</small>
                    </div>
                    <div>
                      <div className='fw-bold text-info'>{vinculos.length}</div>
                      <small className='text-muted'>Empresas</small>
                    </div>
                    <div>
                      <div className='fw-bold text-success'>{Number(programa.participantesAtivos || 0).toLocaleString()}</div>
                      <small className='text-muted'>Participantes</small>
                    </div>
                  </div>

                  <div className='d-flex gap-2 mb-3'>
                    <Button variant='outline-primary' size='sm' className='flex-fill' onClick={() => router.push(`/adm/editar-programa/${programa.id}`)}>
                      <IconifyIcon icon='iconoir:edit-pencil' className='me-1' />
                      Configurar
                    </Button>
                    <Button variant='outline-info' size='sm' className='flex-fill' onClick={() => abrirVincularEmpresa(programa.id)}>
                      <IconifyIcon icon='iconoir:building' className='me-1' />
                      Vincular Empresa
                    </Button>
                  </div>

                  <div className='border rounded p-2 bg-light-subtle'>
                    <div className='small fw-semibold mb-2'>Empresas vinculadas</div>
                    {vinculos.length === 0 && <div className='small text-muted'>Nenhuma empresa vinculada.</div>}

                    {vinculos.map((vinculo) => {
                      const empresa = getEmpresa(vinculo.empresaId)
                      const nomeEmpresa = empresa?.nome || `Empresa ${vinculo.empresaId}`
                      const iniciais = nomeEmpresa
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((nome: string) => nome[0]?.toUpperCase())
                        .join('')

                      return (
                        <div key={vinculo.id} className='border rounded bg-white p-2 mb-2'>
                          <div className='d-flex align-items-center mb-2'>
                            <div
                              className='rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2'
                              style={{ width: '30px', height: '30px', backgroundColor: '#0d6efd', fontSize: '11px' }}
                            >
                              {iniciais || 'E'}
                            </div>
                            <div className='small'>
                              <div className='fw-semibold'>{nomeEmpresa}</div>
                              <div className='text-muted'>{formatIntervalo(vinculo)}</div>
                            </div>
                          </div>

                          <div className='d-flex flex-wrap gap-1'>
                            <Button variant='outline-secondary' size='sm' onClick={() => abrirAcessoPublico(programa.id, vinculo.id)}>
                              Acesso Publico
                            </Button>
                            <Button variant='outline-primary' size='sm' onClick={() => abrirControleAcesso(programa.id, vinculo)}>
                              Controlar Acesso
                            </Button>
                            <Button variant='outline-info' size='sm' onClick={() => abrirIntervalo(programa.id, vinculo)}>
                              Configurar Intervalo
                            </Button>
                            <Button
                              variant='outline-danger'
                              size='sm'
                              onClick={() => removerVinculoEmpresa(programa.id, vinculo, nomeEmpresa)}
                            >
                              Remover vinculo
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className='d-flex gap-2 mt-3'>
                    <Button variant='outline-secondary' size='sm' onClick={() => handleDuplicar(programa)} title='Duplicar' className='flex-fill'>
                      <IconifyIcon icon='iconoir:copy' className='me-1' />
                      Duplicar
                    </Button>
                    <Button variant='outline-danger' size='sm' onClick={() => handleDeleteClick(programa)} title='Excluir' className='flex-fill'>
                      <IconifyIcon icon='iconoir:trash' className='me-1' />
                      Excluir
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {programasFiltrados.length === 0 && (
        <div className='text-center py-5'>
          <IconifyIcon icon='iconoir:suitcase' style={{ fontSize: '48px' }} className='text-muted mb-3' />
          <h5>Nenhum programa encontrado</h5>
          <p className='text-muted'>Crie um novo programa para comecar.</p>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir o programa <strong>{programaToDelete?.nome}</strong>?
          </p>
          <p className='text-muted small'>Esta acao nao pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmDelete}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showVincularModal} onHide={() => setShowVincularModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vincular Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Empresa disponivel</Form.Label>
            <Form.Select value={empresaSelecionada} onChange={(event) => setEmpresaSelecionada(event.target.value)}>
              <option value=''>Selecione uma empresa</option>
              {empresasDisponiveis.map((empresa: any) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {empresasDisponiveis.length === 0 && <div className='small text-muted mt-2'>Nao ha empresas disponiveis para vincular.</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowVincularModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={confirmarVinculoEmpresa} disabled={!empresaSelecionada}>
            Vincular
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAcessoPublicoModal} onHide={() => setShowAcessoPublicoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acesso Publico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPublico && (
            <>
              {(() => {
                const programa = programas.find((item: any) => item.id === selectedPublico.programaId)
                const vinculo = (programa?.empresasVinculadas || []).find((item: any) => item.id === selectedPublico.vinculoId) as DemoProgramaEmpresaVinculo | undefined
                if (!vinculo) return <div className='text-muted small'>Vinculo nao encontrado.</div>
                const url = getLinkPublico(vinculo.empresaId)
                return (
                  <>
                    <div className='mb-2'>
                      <Badge bg={vinculo.acessoPublicoAtivo ? 'success' : 'secondary'}>
                        {vinculo.acessoPublicoAtivo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <Form.Control value={url} readOnly className='mb-2' />
                    <div className='d-flex gap-2'>
                      <Button
                        variant='outline-primary'
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(url)
                            showNotification({ message: 'Link copiado para a area de transferencia.', variant: 'success' })
                          } catch {
                            showNotification({ message: 'Nao foi possivel copiar o link.', variant: 'danger' })
                          }
                        }}
                      >
                        <IconifyIcon icon='iconoir:copy' className='me-1' />
                        Copiar Link
                      </Button>
                      <Button
                        variant={vinculo.acessoPublicoAtivo ? 'outline-warning' : 'outline-success'}
                        onClick={() => demoContext.toggleAcessoPublicoPrograma(selectedPublico.programaId, selectedPublico.vinculoId)}
                      >
                        {vinculo.acessoPublicoAtivo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </>
                )
              })()}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showIntervaloModal} onHide={() => setShowIntervaloModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Intervalo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            type='switch'
            id='intervalo-indeterminado'
            label='Indeterminado'
            checked={intervaloIndeterminado}
            onChange={(event) => setIntervaloIndeterminado(event.target.checked)}
            className='mb-3'
          />
          <Row>
            <Col md={6} className='mb-2'>
              <Form.Label>Data inicio</Form.Label>
              <Form.Control
                type='date'
                value={intervaloInicio}
                disabled={intervaloIndeterminado}
                onChange={(event) => setIntervaloInicio(event.target.value)}
              />
            </Col>
            <Col md={6} className='mb-2'>
              <Form.Label>Data fim</Form.Label>
              <Form.Control
                type='date'
                value={intervaloFim}
                disabled={intervaloIndeterminado}
                onChange={(event) => setIntervaloFim(event.target.value)}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowIntervaloModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={salvarIntervalo}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAcessoUsuariosModal} onHide={() => setShowAcessoUsuariosModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Controlar Acesso de Usuarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex justify-content-between align-items-center mb-3 gap-2'>
            <InputGroup style={{ maxWidth: '320px' }}>
              <InputGroup.Text>
                <IconifyIcon icon='iconoir:search' />
              </InputGroup.Text>
              <Form.Control
                placeholder='Buscar por nome ou login'
                value={buscaUsuarios}
                onChange={(event) => setBuscaUsuarios(event.target.value)}
              />
            </InputGroup>
            <Button variant='outline-secondary' onClick={selecionarTodosVisiveis}>
              Selecionar visiveis
            </Button>
          </div>

          {usuariosEmpresaFiltrados.length === 0 ? (
            <div className='text-center py-4'>
              <div className='text-muted mb-2'>Nenhum usuario encontrado para esta empresa.</div>
              <Link href='/adm/novo-acesso' className='btn btn-outline-primary btn-sm'>
                Novo Acesso
              </Link>
            </div>
          ) : (
            <div className='table-responsive'>
              <Table hover>
                <thead className='table-light'>
                  <tr>
                    <th>Nome</th>
                    <th>Login</th>
                    <th>Perfil</th>
                    <th className='text-center'>Selecionado</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosEmpresaFiltrados.map((usuario: any) => (
                    <tr key={usuario.id}>
                      <td>{usuario.nome}</td>
                      <td>{usuario.login || '-'}</td>
                      <td>{usuario.role || '-'}</td>
                      <td className='text-center'>
                        <Form.Check
                          type='checkbox'
                          checked={usuariosSelecionados.includes(Number(usuario.id))}
                          onChange={() => toggleUsuarioSelecionado(Number(usuario.id))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowAcessoUsuariosModal(false)}>
            Cancelar
          </Button>
          <Button variant='primary' onClick={salvarControleAcesso}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
