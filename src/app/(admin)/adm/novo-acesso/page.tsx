'use client'

import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

const normalizeLogin = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '.')

export default function NovoAcessoPage() {
  const router = useRouter()
  const { usuarios, addUsuario } = useDemo()
  const { showNotification } = useNotificationContext()

  const [usuario, setUsuario] = useState('')
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSalvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nome = usuario.trim()
    const loginNormalizado = normalizeLogin(login)
    const senhaNormalizada = senha.trim()

    if (!nome || !loginNormalizado || !senhaNormalizada) {
      showNotification({ message: 'Preencha usuario, login e senha.', variant: 'warning' })
      return
    }

    const loginExiste = usuarios.some((item: any) => normalizeLogin(item.login || item.nome || '') === loginNormalizado)
    if (loginExiste) {
      showNotification({ message: 'Este login ja existe.', variant: 'warning' })
      return
    }

    addUsuario({
      nome,
      login: loginNormalizado,
      senha: senhaNormalizada,
      role: 'participante',
      status: 'ativo',
      empresaId: null,
      email: `${loginNormalizado}@demo.local`,
      permissoes: [],
    })

    setShowSuccess(true)
    showNotification({ message: 'Acesso criado com sucesso.', variant: 'success' })

    setTimeout(() => {
      router.push('/adm/lista-acessos')
    }, 900)
  }

  return (
    <>
      <PageTitle title='Novo Acesso' subName='Administracao' />

      {showSuccess && (
        <Alert variant='success'>
          <IconifyIcon icon='iconoir:check-circle' className='me-2' />
          Novo acesso criado com sucesso.
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSalvar}>
            <Row>
              <Col md={4} className='mb-3'>
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  value={usuario}
                  onChange={(event) => setUsuario(event.target.value)}
                  placeholder='Nome da pessoa'
                  required
                />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Login</Form.Label>
                <Form.Control
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  placeholder='Identificador de acesso'
                  required
                />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type='password'
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder='Nova senha'
                  required
                />
              </Col>
            </Row>

            <div className='d-flex justify-content-end gap-2 mt-3'>
              <Button type='button' variant='secondary' onClick={() => router.push('/adm/lista-acessos')}>
                Cancelar
              </Button>
              <Button type='submit' variant='success'>
                <IconifyIcon icon='iconoir:floppy-disk' className='me-2' />
                Salvar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
