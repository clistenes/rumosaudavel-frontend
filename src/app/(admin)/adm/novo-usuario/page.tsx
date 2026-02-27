'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Alert, Badge, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function NovoUsuarioPage() {
  const router = useRouter()
  const { empresas, usuarios, addUsuario } = useDemo()
  const { showNotification } = useNotificationContext()

  const [showSuccess, setShowSuccess] = useState(false)
  const [tipoUsuario, setTipoUsuario] = useState<'admin' | 'empresa' | 'participante'>('participante')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    empresaId: '',
    cargo: '',
    departamento: '',
    senha: '',
    confirmarSenha: '',
    enviarEmail: true,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getPermissoes = (tipo: string) => {
    const permissoes: Record<string, string[]> = {
      admin: [
        'Acesso total ao sistema',
        'Gerenciar usuarios',
        'Configuracoes do sistema',
        'Todos os relatorios',
        'Exportar dados',
      ],
      empresa: [
        'Ver participantes da empresa',
        'Relatorios da empresa',
        'Gerenciar participantes',
        'Dashboard da empresa',
      ],
      participante: [
        'Responder questionarios',
        'Ver prontuario pessoal',
        'Acessar recursos de apoio',
        'Visualizar contatos',
      ],
    }

    return permissoes[tipo] || []
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.nome.trim() || !formData.email.trim() || !formData.cpf.trim()) {
      showNotification({ message: 'Preencha nome, e-mail e CPF.', variant: 'warning' })
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      showNotification({ message: 'As senhas nao conferem.', variant: 'warning' })
      return
    }

    if (tipoUsuario !== 'admin' && !formData.empresaId) {
      showNotification({ message: 'Selecione uma empresa para este perfil.', variant: 'warning' })
      return
    }

    const loginDerivado = formData.email.trim().toLowerCase().split('@')[0] || formData.nome.trim().toLowerCase().replace(/\s+/g, '.')
    const existeMesmoLogin = usuarios.some((usuario: any) => String(usuario.login || '').toLowerCase() === loginDerivado)
    if (existeMesmoLogin) {
      showNotification({ message: 'Ja existe um usuario com este login.', variant: 'warning' })
      return
    }

    addUsuario({
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      login: loginDerivado,
      role: tipoUsuario === 'empresa' ? 'gestor' : tipoUsuario,
      status: 'ativo',
      empresaId: formData.empresaId ? Number(formData.empresaId) : null,
      telefone: formData.telefone.trim(),
      cpf: formData.cpf.trim(),
      cargo: formData.cargo.trim(),
      departamento: formData.departamento.trim(),
      permissoes: getPermissoes(tipoUsuario),
    })

    setShowSuccess(true)
    showNotification({ message: 'Usuario criado com sucesso.', variant: 'success' })

    setTimeout(() => {
      setShowSuccess(false)
      router.push('/adm/lista-usuarios')
    }, 1200)
  }

  return (
    <>
      <PageTitle title='Novo Usuario' subName='Criar usuario no sistema' />

      {showSuccess && (
        <Alert variant='success' dismissible onClose={() => setShowSuccess(false)} className='mb-4'>
          <IconifyIcon icon='fa:check-circle' className='me-2' />
          Usuario criado com sucesso! {formData.enviarEmail && 'Um e-mail foi enviado com as credenciais.'}
        </Alert>
      )}

      <Row>
        <Col xl={8}>
          <ComponentContainerCard title='Dados do Usuario'>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12} className='mb-3'>
                  <Form.Label>Tipo de Usuario <span className='text-danger'>*</span></Form.Label>
                  <div className='d-flex gap-2'>
                    <Button variant={tipoUsuario === 'admin' ? 'danger' : 'outline-danger'} onClick={() => setTipoUsuario('admin')} className='flex-fill'>
                      <IconifyIcon icon='fa:user-shield' className='me-1' />
                      Administrador
                    </Button>
                    <Button variant={tipoUsuario === 'empresa' ? 'primary' : 'outline-primary'} onClick={() => setTipoUsuario('empresa')} className='flex-fill'>
                      <IconifyIcon icon='fa:building' className='me-1' />
                      Gestor Empresa
                    </Button>
                    <Button variant={tipoUsuario === 'participante' ? 'success' : 'outline-success'} onClick={() => setTipoUsuario('participante')} className='flex-fill'>
                      <IconifyIcon icon='fa:user' className='me-1' />
                      Participante
                    </Button>
                  </div>
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>Nome Completo <span className='text-danger'>*</span></Form.Label>
                  <Form.Control type='text' value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} placeholder='Nome completo do usuario' required />
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>E-mail <span className='text-danger'>*</span></Form.Label>
                  <Form.Control type='email' value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder='email@exemplo.com' required />
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>CPF <span className='text-danger'>*</span></Form.Label>
                  <Form.Control type='text' value={formData.cpf} onChange={(e) => handleChange('cpf', e.target.value)} placeholder='000.000.000-00' required />
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type='text' value={formData.telefone} onChange={(e) => handleChange('telefone', e.target.value)} placeholder='(00) 00000-0000' />
                </Col>

                {tipoUsuario !== 'admin' && (
                  <>
                    <Col md={6} className='mb-3'>
                      <Form.Label>Empresa {tipoUsuario === 'empresa' && <span className='text-danger'>*</span>}</Form.Label>
                      <Form.Select value={formData.empresaId} onChange={(e) => handleChange('empresaId', e.target.value)} required={tipoUsuario === 'empresa'}>
                        <option value=''>Selecione uma empresa</option>
                        {empresas.map((empresa: any) => (
                          <option key={empresa.id} value={empresa.id}>{empresa.nomeCurto || empresa.nome}</option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6} className='mb-3'>
                      <Form.Label>Cargo</Form.Label>
                      <Form.Control type='text' value={formData.cargo} onChange={(e) => handleChange('cargo', e.target.value)} placeholder='Ex: Analista de RH' />
                    </Col>

                    <Col md={6} className='mb-3'>
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control type='text' value={formData.departamento} onChange={(e) => handleChange('departamento', e.target.value)} placeholder='Ex: Recursos Humanos' />
                    </Col>
                  </>
                )}
              </Row>

              <hr className='my-4' />

              <h6 className='mb-3'>Configuracao de Acesso</h6>

              <Row>
                <Col md={6} className='mb-3'>
                  <Form.Label>Senha <span className='text-danger'>*</span></Form.Label>
                  <Form.Control type='password' value={formData.senha} onChange={(e) => handleChange('senha', e.target.value)} placeholder='Minimo 8 caracteres' required />
                </Col>

                <Col md={6} className='mb-3'>
                  <Form.Label>Confirmar Senha <span className='text-danger'>*</span></Form.Label>
                  <Form.Control type='password' value={formData.confirmarSenha} onChange={(e) => handleChange('confirmarSenha', e.target.value)} placeholder='Repita a senha' required />
                </Col>
              </Row>

              <Form.Check type='checkbox' label='Enviar e-mail com credenciais de acesso' checked={formData.enviarEmail} onChange={(e) => handleChange('enviarEmail', e.target.checked)} className='mb-3' />

              <div className='d-flex justify-content-end gap-2 mt-4'>
                <Link href='/adm/lista-usuarios' className='btn btn-secondary'>
                  Cancelar
                </Link>
                <Button type='submit' variant='primary'>
                  <IconifyIcon icon='fa:user-plus' className='me-1' />
                  Criar Usuario
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title='Permissoes do Perfil'>
            <h6 className='mb-3'>
              <Badge bg={tipoUsuario === 'admin' ? 'danger' : tipoUsuario === 'empresa' ? 'primary' : 'success'} className='me-2'>
                {tipoUsuario === 'admin' ? 'Administrador' : tipoUsuario === 'empresa' ? 'Gestor Empresa' : 'Participante'}
              </Badge>
            </h6>
            <Table size='sm' className='mb-0'>
              <tbody>
                {getPermissoes(tipoUsuario).map((permissao, index) => (
                  <tr key={index}>
                    <td>
                      <IconifyIcon icon='fa:check' className='text-success me-2' />
                      <small>{permissao}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentContainerCard>

          <Card className='mt-3 bg-light'>
            <Card.Body>
              <h6 className='mb-3'>
                <IconifyIcon icon='fa:lightbulb' className='me-2 text-warning' />
                Dicas
              </h6>
              <ul className='list-unstyled mb-0 small'>
                <li className='mb-2'>
                  <IconifyIcon icon='fa:shield-alt' className='text-primary me-2' />
                  Use senhas fortes (minimo 8 caracteres)
                </li>
                <li className='mb-2'>
                  <IconifyIcon icon='fa:envelope' className='text-primary me-2' />
                  O e-mail deve ser unico no sistema
                </li>
                <li>
                  <IconifyIcon icon='fa:user-check' className='text-primary me-2' />
                  Verifique o tipo de usuario antes de salvar
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
