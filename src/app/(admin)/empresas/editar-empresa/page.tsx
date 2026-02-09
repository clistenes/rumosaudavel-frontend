'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'
import { Row, Col, Button, Form, Tabs, Tab } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const EditarEmpresa = () => {
  const [activeTab, setActiveTab] = useState('dados')
  const [camposPersonalizados, setCamposPersonalizados] = useState([
    { id: 1, nome: 'Faixa Etária', tipo: 'radio' },
    { id: 2, nome: 'Cargo', tipo: 'text' },
  ])

  const camposPadrao = [
    { id: 'nome', label: 'Nome', checked: true },
    { id: 'faixa_etaria', label: 'Faixa Etária', checked: true },
    { id: 'sexo', label: 'Sexo', checked: true },
    { id: 'estado_civil', label: 'Estado Civil', checked: false },
    { id: 'celular', label: 'Celular', checked: true },
    { id: 'celular2', label: 'Celular 2', checked: false },
  ]

  return (
    <>
      <PageTitle title='Editar Empresa' subName='Empresas' />
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dados')}
        className="mb-3"
      >
        <Tab eventKey="dados" title="Dados da Empresa">
          <Row>
            <Col md={8}>
              <ComponentContainerCard title="Informações Básicas">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Empresa</Form.Label>
                    <Form.Control type="text" defaultValue="Empresa Demo" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Introdução</Form.Label>
                    <Form.Control as="textarea" rows={4} defaultValue="Bem-vindo ao programa de saúde ocupacional." />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cor do Tema</Form.Label>
                        <Form.Control type="color" defaultValue="#FF6600" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control type="text" defaultValue="empresa-demo" />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control type="file" accept="image/*" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="termo-consentimento"
                      label="Termo de Consentimento"
                      defaultChecked
                    />
                  </Form.Group>
                </Form>
              </ComponentContainerCard>
            </Col>

            <Col md={4}>
              <ComponentContainerCard title="Link de Acesso">
                <p className="text-muted mb-2">URL do Portal:</p>
                <div className="input-group mb-3">
                  <Form.Control 
                    type="text" 
                    value="https://rumosaudavel.com/portal/empresa-demo"
                    readOnly
                  />
                  <Button variant="outline-secondary">
                    <IconifyIcon icon="iconoir:copy" />
                  </Button>
                </div>
              </ComponentContainerCard>

              <ComponentContainerCard title="Ações">
                <Button variant="success" className="w-100 mb-2">
                  <IconifyIcon icon="iconoir:check" className="me-1" /> Salvar
                </Button>
                <Button variant="outline-danger" className="w-100">
                  <IconifyIcon icon="iconoir:trash" className="me-1" /> Deletar Empresa
                </Button>
              </ComponentContainerCard>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="campos" title="Campos do Cadastro">
          <Row>
            <Col md={6}>
              <ComponentContainerCard title="Campos Padrão">
                {camposPadrao.map((campo) => (
                  <Form.Check 
                    key={campo.id}
                    type="checkbox"
                    id={`campo-${campo.id}`}
                    label={campo.label}
                    defaultChecked={campo.checked}
                    className="mb-2"
                  />
                ))}
              </ComponentContainerCard>
            </Col>

            <Col md={6}>
              <ComponentContainerCard title="Campos Personalizados">
                {camposPersonalizados.map((campo) => (
                  <div key={campo.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div>
                      <strong>{campo.nome}</strong>
                      <div className="small text-muted">Tipo: {campo.tipo}</div>
                    </div>
                    <Button variant="danger" size="sm">
                      <IconifyIcon icon="iconoir:trash" />
                    </Button>
                  </div>
                ))}
                <Button variant="primary" className="w-100 mt-3">
                  <IconifyIcon icon="iconoir:plus" className="me-1" /> Novo Campo
                </Button>
              </ComponentContainerCard>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="login" title="Login da Empresa">
          <Row>
            <Col md={6}>
              <ComponentContainerCard title="Criar Login">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control type="text" placeholder="usuario" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control type="password" placeholder="********" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="email@empresa.com" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      label="Acessa Dashboard"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      label="Acessa Relatórios"
                    />
                  </Form.Group>

                  <Button variant="success" className="w-100">
                    <IconifyIcon icon="iconoir:plus" className="me-1" /> Criar Login
                  </Button>
                </Form>
              </ComponentContainerCard>
            </Col>

            <Col md={6}>
              <ComponentContainerCard title="Configurações de Dashboard">
                <Form.Group className="mb-3">
                  <Form.Label>Campo para Filtro Heatmap</Form.Label>
                  <Form.Select>
                    <option>Selecione um campo...</option>
                    <option>Faixa Etária</option>
                    <option>Cargo</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Campo para Filtro Semáforo</Form.Label>
                  <Form.Select>
                    <option>Selecione um campo...</option>
                    <option>Faixa Etária</option>
                    <option>Cargo</option>
                  </Form.Select>
                </Form.Group>
              </ComponentContainerCard>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </>
  )
}

export default EditarEmpresa
