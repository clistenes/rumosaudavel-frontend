'use client'

import { useMemo, useState } from 'react'
import { Button, Card, Modal, Spinner, Table } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useUsuarios, useRemoverUsuario } from '@/hooks/api/useUsuarios'
import { isDemoMode } from '@/utils/env'

type Acesso = {
  id: number
  nome: string
  login: string
  criacao: string
}

const formatarCriacao = (valor?: string | null) => {
  if (!valor) return '-'
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return '-'
  return data.toLocaleDateString('pt-BR')
}

export default function ListaAcessosPage() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: usuariosData, loading, error, refetch } = useUsuarios({ perPage: 200 })
  const { mutateAsync: removerUsuario, loading: removendo } = useRemoverUsuario()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [acessoSelecionado, setAcessoSelecionado] = useState<Acesso | null>(null)

  const usuarios = demoMode ? demoContext.usuarios : (usuariosData?.data || [])

  const acessos = useMemo(() => {
    return usuarios.map((usuario: any) => {
      return {
        id: usuario.id,
        nome: usuario.nome || 'Usuario',
        login: usuario.login || usuario.nome || '-',
        criacao: formatarCriacao(usuario.dataCadastro || usuario.created_at),
      } satisfies Acesso
    })
  }, [usuarios])

  const handleDeleteClick = (acesso: Acesso) => {
    setAcessoSelecionado(acesso)
    setShowDeleteModal(true)
  }

  const confirmarDelete = async () => {
    if (!acessoSelecionado) return

    try {
      if (demoMode) {
        demoContext.deleteUsuario(acessoSelecionado.id)
      } else {
        await removerUsuario(acessoSelecionado.id)
        refetch()
      }

      showNotification({
        message: `Acesso de "${acessoSelecionado.nome}" removido com sucesso.`,
        variant: 'success',
      })
    } catch {
      showNotification({
        message: 'Erro ao remover acesso.',
        variant: 'danger',
      })
    } finally {
      setShowDeleteModal(false)
      setAcessoSelecionado(null)
    }
  }

  if (!demoMode && loading) {
    return (
      <>
        <PageTitle title='Lista de Acessos' subName='Administracao' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Lista de Acessos' subName='Administracao' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar acessos</h5>
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
      <PageTitle title='Lista de Acessos' subName='Administracao' />

      <ComponentContainerCard title={`Acessos (${acessos.length})`}>
        <Table responsive className='mb-0'>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Login</th>
              <th>Criacao</th>
              <th className='text-center'>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {acessos.map((acesso) => (
              <tr key={acesso.id}>
                <td>{acesso.nome}</td>
                <td>{acesso.login}</td>
                <td>{acesso.criacao}</td>
                <td className='text-center'>
                  <Button
                    variant='outline-primary'
                    size='sm'
                    className='me-2'
                    onClick={() => router.push(`/adm/editar-usuario/${acesso.id}`)}
                    title='Editar'
                  >
                    <IconifyIcon icon='iconoir:edit-pencil' />
                  </Button>
                  <Button
                    variant='outline-danger'
                    size='sm'
                    onClick={() => handleDeleteClick(acesso)}
                    title='Deletar'
                  >
                    <IconifyIcon icon='iconoir:trash' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {acessos.length === 0 && (
          <div className='text-center py-5'>
            <IconifyIcon icon='iconoir:user-xmark' style={{ fontSize: '48px' }} className='text-muted mb-3' />
            <h5>Nenhum acesso encontrado</h5>
          </div>
        )}
      </ComponentContainerCard>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusao</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Deseja remover o acesso de <strong>{acessoSelecionado?.nome}</strong>?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={confirmarDelete} disabled={removendo}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
