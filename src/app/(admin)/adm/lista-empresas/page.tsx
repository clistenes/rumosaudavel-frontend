'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Form, InputGroup, Modal, Pagination, Spinner, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useEmpresas, useRemoverEmpresa } from '@/hooks/api/useEmpresas'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useDemo } from '@/context/DemoContext'
import { isDemoMode } from '@/utils/env'
import { empresaService } from '@/services'

const getEmpresaId = (empresa: any) => Number(empresa?.id ?? empresa?.empresa_id ?? 0)

const getNumero = (empresa: any, ...keys: string[]) => {
  for (const key of keys) {
    const value = empresa?.[key]
    if (value !== undefined && value !== null && value !== '') {
      const parsed = Number(value)
      if (!Number.isNaN(parsed)) return parsed
    }
  }
  return 0
}

const getTermoConsentimento = (empresa: any) => {
  const value = String(
    empresa?.termoConsentimento ??
    empresa?.termo_consentimento ??
    empresa?.termo ??
    ''
  ).toLowerCase()
  return ['s', 'sim', 'true', '1', 'on'].includes(value) ? 'sim' : 'nao'
}

export default function ListaEmpresas() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const { empresas: empresasDemo, deleteEmpresa } = useDemo()

  const { data: empresasData, loading: loadingEmpresas, error, refetch } = useEmpresas({ perPage: 100 })
  const { mutateAsync: removerEmpresa } = useRemoverEmpresa()

  const empresas = demoMode ? empresasDemo : (empresasData?.data || [])

  const [busca, setBusca] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [empresaToDelete, setEmpresaToDelete] = useState<any>(null)
  const itemsPerPage = 10

  const [usuariosPorEmpresa, setUsuariosPorEmpresa] = useState<Record<number, number>>({})
  const [loadingUsuarios, setLoadingUsuarios] = useState<Record<number, boolean>>({})
  const [erroUsuarios, setErroUsuarios] = useState<Record<number, boolean>>({})
  const inFlightIdsRef = useRef<Set<number>>(new Set())

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa: any) => {
      if (!busca) return true
      const term = busca.toLowerCase()
      return (
        String(empresa.nome || '').toLowerCase().includes(term) ||
        String(empresa.cnpj || '').includes(busca)
      )
    })
  }, [empresas, busca])

  const carregarUsuariosEmpresas = useCallback(async (ids: number[]) => {
    await Promise.all(
      ids.map(async (empresaId) => {
        try {
          const response = await empresaService.dashboard(empresaId)
          const usuarios = Number(response?.data?.usuarios ?? 0) || 0
          setUsuariosPorEmpresa((prev) => ({ ...prev, [empresaId]: usuarios }))
          setErroUsuarios((prev) => ({ ...prev, [empresaId]: false }))
        } catch {
          setErroUsuarios((prev) => ({ ...prev, [empresaId]: true }))
        } finally {
          setLoadingUsuarios((prev) => ({ ...prev, [empresaId]: false }))
          inFlightIdsRef.current.delete(empresaId)
        }
      })
    )
  }, [])

  useEffect(() => {
    const ids = Array.from(
      new Set(
        empresas
          .map((empresa: any) => getEmpresaId(empresa))
          .filter((id: number) => id > 0)
      )
    ).filter((id) => usuariosPorEmpresa[id] === undefined && !erroUsuarios[id] && !inFlightIdsRef.current.has(id))

    if (ids.length === 0) return

    ids.forEach((id) => inFlightIdsRef.current.add(id))
    setLoadingUsuarios((prev) => ({
      ...prev,
      ...Object.fromEntries(ids.map((id) => [id, true])),
    }))

    void carregarUsuariosEmpresas(ids)
  }, [empresas, usuariosPorEmpresa, erroUsuarios, carregarUsuariosEmpresas])

  const totalPages = Math.ceil(empresasFiltradas.length / itemsPerPage)
  const empresasPaginadas = empresasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleDeleteClick = (empresa: any) => {
    setEmpresaToDelete(empresa)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!empresaToDelete) return

    try {
      const empresaId = getEmpresaId(empresaToDelete)
      if (demoMode) {
        deleteEmpresa(empresaId)
      } else {
        await removerEmpresa(empresaId)
        refetch()
      }

      showNotification({
        message: `Empresa "${empresaToDelete.nome}" foi removida com sucesso.`,
        variant: 'success',
      })
    } catch {
      showNotification({
        message: 'Erro ao remover empresa. Tente novamente.',
        variant: 'danger',
      })
    } finally {
      setShowDeleteModal(false)
      setEmpresaToDelete(null)
    }
  }

  const getLinkEmpresa = (empresa: any) => {
    const slug = empresa?.slug || `empresa-${getEmpresaId(empresa)}`
    return `https://rumosaudavel.com/portal/${slug}`
  }

  if (!demoMode && loadingEmpresas) {
    return (
      <>
        <PageTitle title='Lista de Empresas' subName='Administracao' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Lista de Empresas' subName='Administracao' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar empresas</h5>
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
      <PageTitle title='Lista de Empresas' subName='Administracao' />

      <Card className='mb-4'>
        <Card.Body>
          <div className='d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <InputGroup style={{ width: '350px' }}>
              <InputGroup.Text>
                <IconifyIcon icon='iconoir:search' />
              </InputGroup.Text>
              <Form.Control
                type='text'
                placeholder='Buscar por nome ou CNPJ...'
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </InputGroup>

            <Link href='/adm/adicionar-empresa'>
              <Button variant='primary'>
                <IconifyIcon icon='iconoir:plus' className='me-2' />
                Nova Empresa
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className='table-responsive'>
            <Table hover className='mb-0'>
              <thead className='table-light'>
                <tr>
                  <th>Nome</th>
                  <th className='text-center'>Termo Consentimento</th>
                  <th className='text-center'>Analiticos</th>
                  <th className='text-center'>Graficos</th>
                  <th className='text-center'>Cadastrados</th>
                  <th className='text-center'>Respondentes</th>
                  <th className='text-center'>Questionarios Finalizados</th>
                  <th className='text-center'>Link</th>
                  <th className='text-center'>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {empresasPaginadas.map((empresa: any) => {
                  const empresaId = getEmpresaId(empresa)
                  return (
                    <tr key={empresaId}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3'
                            style={{ width: '40px', height: '40px', backgroundColor: '#0066CC', fontSize: '14px' }}
                          >
                            {empresa.nome?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className='fw-bold'>{empresa.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className='text-center'>{getTermoConsentimento(empresa)}</td>
                      <td className='text-center'>
                        <Button
                          variant='secondary'
                          size='sm'
                          onClick={() => router.push(`/adm/relatorios/analitico?empresa=${empresaId}`)}
                          title='Analiticos'
                        >
                          <IconifyIcon icon='iconoir:page' />
                        </Button>
                      </td>
                      <td className='text-center'>
                        <Button
                          variant='secondary'
                          size='sm'
                          onClick={() => router.push(`/adm/relatorios/grafico?empresa=${empresaId}`)}
                          title='Graficos'
                        >
                          <IconifyIcon icon='iconoir:stats-up-square' />
                        </Button>
                      </td>
                      <td className='text-center'>
                        {getNumero(empresa, 'total_cadastrados', 'totalParticipantes', 'participantes').toLocaleString('pt-BR')}
                      </td>
                      <td className='text-center'>
                        {loadingUsuarios[empresaId]
                          ? <Spinner animation='border' size='sm' />
                          : (usuariosPorEmpresa[empresaId] ?? getNumero(empresa, 'total_respondentes', 'respondentes')).toLocaleString('pt-BR')}
                      </td>
                      <td className='text-center'>
                        {getNumero(empresa, 'total_questionarios_finalizados', 'questionarios_finalizados', 'totalQuestionariosFinalizados').toLocaleString('pt-BR')}
                      </td>
                      <td className='text-center'>
                        <Button
                          variant='secondary'
                          size='sm'
                          title='Copiar Link'
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(getLinkEmpresa(empresa))
                              showNotification({ message: 'Link copiado.', variant: 'success' })
                            } catch {
                              showNotification({ message: 'Nao foi possivel copiar o link.', variant: 'danger' })
                            }
                          }}
                        >
                          <IconifyIcon icon='iconoir:copy' />
                        </Button>
                      </td>
                      <td className='text-center'>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          className='me-1'
                          onClick={() => router.push(`/adm/editar-empresa/${empresaId}`)}
                          title='Editar'
                        >
                          <IconifyIcon icon='iconoir:edit-pencil' />
                        </Button>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => handleDeleteClick(empresa)}
                          title='Excluir'
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

          {empresasPaginadas.length === 0 && (
            <div className='text-center py-5'>
              <IconifyIcon icon='iconoir:building' style={{ fontSize: '48px' }} className='text-muted mb-3' />
              <h5>Nenhuma empresa encontrada</h5>
            </div>
          )}

          {totalPages > 1 && (
            <div className='d-flex justify-content-between align-items-center mt-3'>
              <small className='text-muted'>
                Mostrando {empresasPaginadas.length} de {empresasFiltradas.length} empresas
              </small>
              <Pagination size='sm'>
                <Pagination.Prev
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                    {page}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                />
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
          <p>Tem certeza que deseja excluir a empresa <strong>{empresaToDelete?.nome}</strong>?</p>
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
    </>
  )
}
