'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Badge, Form, InputGroup, Row, Col, Modal, Spinner, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { useDuplicarPrograma, useProgramas, useRemoverPrograma, useVincularEmpresaPrograma } from '@/hooks/api/useProgramas'
import { programaService, type EmpresaVinculadaPrograma } from '@/services'
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

const toApiDate = (value: string) => {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
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
  const { data: empresasData } = useEmpresas({ perPage: 200 })
  const { mutateAsync: removerPrograma } = useRemoverPrograma()
  const { mutateAsync: duplicarPrograma } = useDuplicarPrograma()
  const { mutateAsync: vincularEmpresaPrograma } = useVincularEmpresaPrograma()

  const programas: any[] = demoMode ? demoContext.programas : (programasData?.data || [])
  const empresas: any[] = demoMode ? demoContext.empresas : (empresasData?.data || [])
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
  const [empresasVinculadasPorPrograma, setEmpresasVinculadasPorPrograma] = useState<Record<number, EmpresaVinculadaPrograma[]>>({})
  const [loadingVinculosPorPrograma, setLoadingVinculosPorPrograma] = useState<Record<number, boolean>>({})
  const [vinculosVersion, setVinculosVersion] = useState(0)

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

  const programaIdsKey = useMemo(
    () => programas.map((programa: any) => Number(programa.id)).sort((a, b) => a - b).join(','),
    [programas]
  )

  useEffect(() => {
    if (demoMode || programas.length === 0) {
      setEmpresasVinculadasPorPrograma({})
      setLoadingVinculosPorPrograma({})
      return
    }

    let ativo = true
    const initialLoadingState = Object.fromEntries(
      programas.map((programa: any) => [Number(programa.id), true])
    ) as Record<number, boolean>
    setLoadingVinculosPorPrograma(initialLoadingState)

    const carregarVinculosPorPrograma = async (programaId: number) => {
      let empresasVinculadas: EmpresaVinculadaPrograma[] = []

      try {
        const response = await programaService.listarEmpresasVinculadas(programaId)
        empresasVinculadas = Array.isArray(response.data) ? response.data : []
      } catch (error) {
        console.error(error)
      }

      if (!ativo) return

      setEmpresasVinculadasPorPrograma((prev) => ({
        ...prev,
        [programaId]: empresasVinculadas,
      }))
      setLoadingVinculosPorPrograma((prev) => ({
        ...prev,
        [programaId]: false,
      }))
    }

    programas.forEach((programa: any) => {
      void carregarVinculosPorPrograma(Number(programa.id))
    })

    return () => {
      ativo = false
    }
  }, [demoMode, programaIdsKey, vinculosVersion])

  const getVinculos = (programa: any): DemoProgramaEmpresaVinculo[] => {
    if (!demoMode) {
      const empresasVinculadas = empresasVinculadasPorPrograma[Number(programa.id)] || []
      const timestamp = new Date().toISOString()

      return empresasVinculadas.map((empresa) => ({
        id: Number(empresa.id),
        empresaId: Number(empresa.id),
        intervaloInicio: empresa.intervalo_inicio || null,
        intervaloFim: empresa.intervalo_termino || null,
        indeterminado: !empresa.intervalo_inicio || !empresa.intervalo_termino,
        acessoPublicoAtivo: false,
        usuariosPermitidos: [],
        createdAt: timestamp,
        updatedAt: timestamp,
        nomeEmpresa: empresa.nome,
      })) as DemoProgramaEmpresaVinculo[]
    }
    return demoContext.getProgramaEmpresas(programa.id)
  }

  const getEmpresa = (empresaId: number) => empresas.find((item: any) => Number(item.id) === Number(empresaId))

  const getLinkPublico = (empresaId: number) => {
    const empresa = getEmpresa(empresaId)
    const slug = empresa?.slug || toSlug(empresa?.nome || `empresa-${empresaId}`)
    return `https://portal.demo.local/empresa/${slug}`
  }

  const abrirVincularEmpresa = (programaId: number) => {
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

  const confirmarVinculoEmpresa = async () => {
    if (!programaVincularId || !empresaSelecionada) {
      showNotification({ message: 'Selecione uma empresa para vincular.', variant: 'warning' })
      return
    }

    try {
      if (demoMode) {
        demoContext.vincularEmpresaPrograma(programaVincularId, Number(empresaSelecionada))
      } else {
        await vincularEmpresaPrograma({
          programaId: programaVincularId,
          empresaId: Number(empresaSelecionada),
        })
        await refetch()
        setVinculosVersion((prev) => prev + 1)
      }

      setShowVincularModal(false)
      setEmpresaSelecionada('')
      showNotification({ message: 'Empresa vinculada ao programa com sucesso.', variant: 'success' })
    } catch {
      showNotification({ message: 'Nao foi possivel vincular a empresa.', variant: 'danger' })
    }
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

    if (demoMode) {
      demoContext.atualizarIntervaloEmpresaPrograma(selectedIntervalo.programaId, selectedIntervalo.vinculoId, {
        indeterminado: intervaloIndeterminado,
        intervaloInicio: intervaloIndeterminado ? null : intervaloInicio,
        intervaloFim: intervaloIndeterminado ? null : intervaloFim,
      })

      setShowIntervaloModal(false)
      showNotification({ message: 'Intervalo atualizado com sucesso.', variant: 'success' })
      return
    }

    void (async () => {
      try {
        if (intervaloIndeterminado) {
          await programaService.resetarIntervaloEmpresa(selectedIntervalo.programaId, selectedIntervalo.vinculoId)
        } else {
          await programaService.definirIntervaloEmpresa(selectedIntervalo.programaId, selectedIntervalo.vinculoId, {
            inicio: toApiDate(intervaloInicio),
            termino: toApiDate(intervaloFim),
          })
        }

        setVinculosVersion((prev) => prev + 1)
        setShowIntervaloModal(false)
        showNotification({ message: 'Intervalo atualizado com sucesso.', variant: 'success' })
      } catch {
        showNotification({ message: 'Erro ao definir intervalo. Tente novamente.', variant: 'danger' })
      }
    })()
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

  const handleDuplicar = async (programa: any) => {
    if (demoMode) {
      demoContext.duplicarPrograma(programa.id)
      showNotification({
        message: `Programa "${programa.nome}" duplicado com sucesso.`,
        variant: 'success',
      })
      return
    }

    try {
      await duplicarPrograma(programa.id)
      await refetch()
      showNotification({
        message: `Programa "${programa.nome}" duplicado com sucesso.`,
        variant: 'success',
      })
    } catch {
      showNotification({
        message: 'Erro ao duplicar programa. Tente novamente.',
        variant: 'danger',
      })
    }
  }

  if (!demoMode && loadingProgramas) {
    return (
      <>
        <PageTitle title='Programas' subName='Programas' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Programas' subName='Programas' />
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
      <PageTitle title='Programas' subName='Programas' />

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

      <div className='d-flex flex-column gap-3'>
        {programasFiltrados.map((programa: any) => {
          const vinculos = getVinculos(programa)
          return (
            <Card key={programa.id} className='overflow-hidden'>
              <div className='px-4 py-3 border-bottom' style={{ background: '#d6dccf' }}>
                <div className='d-flex justify-content-between align-items-center gap-3 flex-wrap'>
                  <div className='d-flex align-items-center gap-3'>
                    <h4 className='mb-0' style={{ color: '#9c5a00' }}>{programa.nome}</h4>
                    <Badge bg={programa.status === 'ativo' ? 'success' : 'secondary'}>
                      {programa.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>

                  <div className='d-flex align-items-center gap-3 flex-wrap'>
                    <span className='fw-semibold'>{formatDate(programa.dataInicio || programa.createdAt)}</span>
                    <Button variant='secondary' size='sm' onClick={() => abrirVincularEmpresa(programa.id)}>
                      vincular empresa
                      <IconifyIcon icon='iconoir:briefcase' className='ms-2' />
                    </Button>
                  </div>
                </div>
              </div>

              <Card.Body className='px-4 py-2'>
                {!demoMode && loadingVinculosPorPrograma[Number(programa.id)] && (
                  <div className='py-3 d-flex align-items-center gap-2 text-muted'>
                    <Spinner animation='border' size='sm' />
                    <span>Carregando empresas vinculadas...</span>
                  </div>
                )}

                {vinculos.length === 0 && !loadingVinculosPorPrograma[Number(programa.id)] && (
                  <div className='py-3 text-muted'>Nenhuma empresa vinculada ao programa.</div>
                )}

                {vinculos.map((vinculo) => {
                  const empresa = getEmpresa(vinculo.empresaId)
                  const nomeEmpresa = (vinculo as any).nomeEmpresa || empresa?.nomeCurto || empresa?.nome || `Empresa ${vinculo.empresaId}`
                  const intervalo = formatIntervalo(vinculo).toLowerCase()

                  return (
                    <div key={vinculo.id} className='d-flex justify-content-between align-items-center py-3 border-bottom gap-3 flex-wrap'>
                      <div className='d-flex align-items-center gap-3'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center'
                          style={{ width: '40px', height: '40px', background: '#f4f4f4', color: '#d17600' }}
                        >
                          <IconifyIcon icon='iconoir:brain' />
                        </div>
                        <h3 className='mb-0'>{nomeEmpresa}</h3>
                      </div>

                      <div className='d-flex align-items-center gap-2 flex-wrap'>
                        <span className='fs-4 text-muted'>{intervalo}</span>
                        {demoMode && (
                          <>
                            <Button variant='secondary' size='sm' onClick={() => abrirAcessoPublico(programa.id, vinculo.id)}>
                              <IconifyIcon icon='iconoir:link' />
                            </Button>
                            <Button variant='secondary' size='sm' onClick={() => abrirControleAcesso(programa.id, vinculo)}>
                              controlar acessos
                              <IconifyIcon icon='iconoir:lock' className='ms-2' />
                            </Button>
                            <Button variant='secondary' size='sm' onClick={() => abrirIntervalo(programa.id, vinculo)}>
                              configurar intervalo
                              <IconifyIcon icon='iconoir:timer' className='ms-2' />
                            </Button>
                            <Button variant='secondary' size='sm' onClick={() => removerVinculoEmpresa(programa.id, vinculo, nomeEmpresa)}>
                              <IconifyIcon icon='iconoir:trash' />
                            </Button>
                          </>
                        )}
                        {!demoMode && (
                          <Button variant='secondary' size='sm' onClick={() => abrirIntervalo(programa.id, vinculo)}>
                            configurar intervalo
                            <IconifyIcon icon='iconoir:timer' className='ms-2' />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                <div className='d-flex justify-content-between align-items-center pt-3'>
                  <small className='text-muted'>{vinculos.length} empresa(s) vinculadas ao programa</small>
                  <div className='d-flex gap-2'>
                    <Button variant='outline-secondary' size='sm' onClick={() => handleDuplicar(programa)}>
                      duplicar
                    </Button>
                    <Button variant='outline-danger' size='sm' onClick={() => handleDeleteClick(programa)}>
                      excluir programa
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )
        })}
      </div>

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
