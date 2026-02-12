'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Alert, Table, Badge } from 'react-bootstrap'
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

export default function NovoUsuarioEmpresaPage() {
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
    tipoAcesso: 'gestor',
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <PageTitle title="Novo Usuário Empresa" subName="Cadastrar gestor de empresa" />

      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)} className="mb-4">
          <IconifyIcon icon="fa:check-circle" className="me-2" />
          Usuário criado com sucesso! Um e-mail foi enviado com as credenciais.
        </Alert>
      )}

      <Row>
        <Col xl={8}>
          <ComponentContainerCard title="Dados do Usuário">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Nome Completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder="Nome do gestor"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>E-mail <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@empresa.com"
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

                <Col md={6} className="mb-3">
                  <Form.Label>Empresa <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.empresaId}
                    onChange={(e) => handleChange('empresaId', e.target.value)}
                    required
                  >
                    <option value="">Selecione uma empresa</option>
                    {empresasDemo.map(e => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </Form.Select>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Tipo de Acesso <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.tipoAcesso}
                    onChange={(e) => handleChange('tipoAcesso', e.target.value)}
                    required
                  >
                    <option value="gestor">Gestor de Empresa</option>
                    <option value="admin_empresa">Administrador da Empresa</option>
                    <option value="rh">Recursos Humanos</option>
                  </Form.Select>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Cargo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => handleChange('cargo', e.target.value)}
                    placeholder="Ex: Gerente de RH"
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
                className="mb-3"
                defaultChecked
              />

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link href="/empresas/dados-empresas" className="btn btn-secondary">
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
          <ComponentContainerCard title="Permissões por Perfil">
            <Table size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Perfil</th>
                  <th>Acesso</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gestor de Empresa</td>
                  <td>
                    <small>Visualizar relatórios da empresa, participantes, dashboards</small>
                  </td>
                </tr>
                <tr>
                  <td>Admin Empresa</td>
                  <td>
                    <small>Gerenciar usuários, configurar programas, todos os relatórios</small>
                  </td>
                </tr>
                <tr>
                  <td>Recursos Humanos</td>
                  <td>
                    <small>Cadastrar participantes, acompanhar avaliações, comunicações</small>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ComponentContainerCard>

          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="mb-3">
                <IconifyIcon icon="fa:shield-alt" className="me-2" />
                Segurança
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <IconifyIcon icon="fa:check" className="text-success me-2" />
                  Senha mínima de 8 caracteres
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="fa:check" className="text-success me-2" />
                  Inclua letras e números
                </li>
                <li>
                  <IconifyIcon icon="fa:check" className="text-success me-2" />
                  Acesso restrito à empresa vinculada
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
