'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Alert, Badge, Table } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

interface Empresa {
  id: number
  nome: string
}

const empresasDemo: Empresa[] = [
  { id: 1, nome: 'TechCorp Brasil' },
  { id: 2, nome: 'Inovação Ltda' },
  { id: 3, nome: 'Saúde Corp' },
]

export default function NovoUsuarioPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [tipoUsuario, setTipoUsuario] = useState('participante')
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getPermissoes = (tipo: string) => {
    const permissoes: Record<string, string[]> = {
      admin: [
        'Acesso total ao sistema',
        'Gerenciar usuários',
        'Configurações do sistema',
        'Todos os relatórios',
        'Exportar dados',
      ],
      empresa: [
        'Ver participantes da empresa',
        'Relatórios da empresa',
        'Gerenciar participantes',
        'Dashboard da empresa',
      ],
      participante: [
        'Responder questionários',
        'Ver prontuário pessoal',
        'Acessar recursos de apoio',
        'Visualizar contatos',
      ],
    }
    return permissoes[tipo] || []
  }

  return (
    <>
      <PageTitle title="Novo Usuário" subName="Criar usuário no sistema" />

      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)} className="mb-4">
          <IconifyIcon icon="fa:check-circle" className="me-2" />
          Usuário criado com sucesso! {formData.enviarEmail && 'Um e-mail foi enviado com as credenciais.'}
        </Alert>
      )}

      <Row>
        <Col xl={8}>
          <ComponentContainerCard title="Dados do Usuário">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label>Tipo de Usuário <span className="text-danger">*</span></Form.Label>
                  <div className="d-flex gap-2">
                    <Button
                      variant={tipoUsuario === 'admin' ? 'danger' : 'outline-danger'}
                      onClick={() => setTipoUsuario('admin')}
                      className="flex-fill"
                    >
                      <IconifyIcon icon="fa:user-shield" className="me-1" />
                      Administrador
                    </Button>
                    <Button
                      variant={tipoUsuario === 'empresa' ? 'primary' : 'outline-primary'}
                      onClick={() => setTipoUsuario('empresa')}
                      className="flex-fill"
                    >
                      <IconifyIcon icon="fa:building" className="me-1" />
                      Gestor Empresa
                    </Button>
                    <Button
                      variant={tipoUsuario === 'participante' ? 'success' : 'outline-success'}
                      onClick={() => setTipoUsuario('participante')}
                      className="flex-fill"
                    >
                      <IconifyIcon icon="fa:user" className="me-1" />
                      Participante
                    </Button>
                  </div>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Nome Completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder="Nome completo do usuário"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>E-mail <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>CPF <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </Col>

                {tipoUsuario !== 'admin' && (
                  <>
                    <Col md={6} className="mb-3">
                      <Form.Label>Empresa {tipoUsuario === 'empresa' && <span className="text-danger">*</span>}</Form.Label>
                      <Form.Select
                        value={formData.empresaId}
                        onChange={(e) => handleChange('empresaId', e.target.value)}
                        required={tipoUsuario === 'empresa'}
                      >
                        <option value="">Selecione uma empresa</option>
                        {empresasDemo.map(e => (
                          <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Cargo</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => handleChange('cargo', e.target.value)}
                        placeholder="Ex: Analista de RH"
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.departamento}
                        onChange={(e) => handleChange('departamento', e.target.value)}
                        placeholder="Ex: Recursos Humanos"
                      />
                    </Col>
                  </>
                )}
              </Row>

              <hr className="my-4" />

              <h6 className="mb-3">Configuração de Acesso</h6>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Senha <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Confirmar Senha <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                    placeholder="Repita a senha"
                    required
                  />
                </Col>
              </Row>

              <Form.Check
                type="checkbox"
                label="Enviar e-mail com credenciais de acesso"
                checked={formData.enviarEmail}
                onChange={(e) => handleChange('enviarEmail', e.target.checked)}
                className="mb-3"
              />

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link href="/adm/configuracoes" className="btn btn-secondary">
                  Cancelar
                </Link>
                <Button type="submit" variant="primary">
                  <IconifyIcon icon="fa:user-plus" className="me-1" />
                  Criar Usuário
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title="Permissões do Perfil">
            <h6 className="mb-3">
              <Badge bg={tipoUsuario === 'admin' ? 'danger' : tipoUsuario === 'empresa' ? 'primary' : 'success'} className="me-2">
                {tipoUsuario === 'admin' ? 'Administrador' : tipoUsuario === 'empresa' ? 'Gestor Empresa' : 'Participante'}
              </Badge>
            </h6>
            <Table size="sm" className="mb-0">
              <tbody>
                {getPermissoes(tipoUsuario).map((permissao, index) => (
                  <tr key={index}>
                    <td>
                      <IconifyIcon icon="fa:check" className="text-success me-2" />
                      <small>{permissao}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ComponentContainerCard>

          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="mb-3">
                <IconifyIcon icon="fa:lightbulb" className="me-2 text-warning" />
                Dicas
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <IconifyIcon icon="fa:shield-alt" className="text-primary me-2" />
                  Use senhas fortes (mínimo 8 caracteres)
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="fa:envelope" className="text-primary me-2" />
                  O e-mail deve ser único no sistema
                </li>
                <li>
                  <IconifyIcon icon="fa:user-check" className="text-primary me-2" />
                  Verifique o tipo de usuário antes de salvar
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
