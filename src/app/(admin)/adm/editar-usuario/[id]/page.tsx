'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function EditarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { usuarios, updateUsuario, deleteUsuario } = useDemo()

  const usuarioId = Number(params.id)
  const usuario = useMemo(
    () => usuarios.find((item: any) => item.id === usuarioId),
    [usuarios, usuarioId]
  )

  const [nome, setNome] = useState('')
  const [login, setLogin] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (!usuario) return
    setNome(usuario.nome || '')
    setLogin((usuario as any).login || usuario.nome || '')
  }, [usuario])

  const handleSalvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!nome.trim() || !login.trim()) {
      showNotification({ message: 'Preencha usuario e login.', variant: 'warning' })
      return
    }

    updateUsuario(usuarioId, {
      nome: nome.trim(),
      login: login.trim(),
      ...(novaSenha.trim() ? { senha: novaSenha.trim() } : {}),
    })

    showNotification({ message: 'Usuario atualizado com sucesso.', variant: 'success' })
    router.push('/adm/lista-acessos')
  }

  const handleExcluir = () => {
    deleteUsuario(usuarioId)
    showNotification({ message: 'Usuario excluido com sucesso.', variant: 'success' })
    router.push('/adm/lista-acessos')
  }

  if (!usuario) {
    return (
      <>
        <PageTitle title='Editar Usuario' subName='Administracao' />
        <Alert variant='warning'>Usuario nao encontrado.</Alert>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Editar Usuario' subName='Administracao' />

      <Card>
        <Card.Body>
          <Form onSubmit={handleSalvar}>
            <Row>
              <Col md={4} className='mb-3'>
                <Form.Label>Usuario</Form.Label>
                <Form.Control value={nome} onChange={(event) => setNome(event.target.value)} required />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Login</Form.Label>
                <Form.Control value={login} onChange={(event) => setLogin(event.target.value)} required />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Nova Senha</Form.Label>
                <Form.Control
                  type='password'
                  value={novaSenha}
                  onChange={(event) => setNovaSenha(event.target.value)}
                  placeholder='Digite uma nova senha'
                />
              </Col>
            </Row>

            <div className='d-flex justify-content-between mt-3'>
              <Button variant='outline-danger' onClick={() => setShowDelete(true)}>
                <IconifyIcon icon='iconoir:trash' className='me-2' />
                Excluir
              </Button>
              <div className='d-flex gap-2'>
                <Button type='button' variant='secondary' onClick={() => router.push('/adm/lista-acessos')}>
                  Cancelar
                </Button>
                <Button type='submit' variant='primary'>
                  <IconifyIcon icon='iconoir:check' className='me-2' />
                  Salvar
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {showDelete && (
        <Card className='mt-3 border-danger'>
          <Card.Body>
            <p className='mb-3'>Deseja realmente excluir este usuario?</p>
            <div className='d-flex gap-2'>
              <Button variant='secondary' onClick={() => setShowDelete(false)}>Cancelar</Button>
              <Button variant='danger' onClick={handleExcluir}>Confirmar Exclusao</Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  )
}
