'use client'

import { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col, Tabs, Tab, Alert, Badge, Table, Spinner } from 'react-bootstrap'
import { useRouter, useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ColorPicker from '@/components/ColorPicker'
import { useDemo } from '@/context/DemoContext'
import { useEmpresa, useAtualizarEmpresa } from '@/hooks/api/useEmpresas'
import { useNotificationContext } from '@/context/useNotificationContext'
import { isDemoMode } from '@/utils/env'

export default function EditarEmpresa() {
  const router = useRouter()
  const params = useParams()
  const empresaId = parseInt(params.id as string)
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()
  
  // Hooks da API
  const { data: empresaData, loading: loadingEmpresa, error, refetch } = useEmpresa(demoMode ? null : empresaId)
  const { mutateAsync: atualizarEmpresa, loading: salvando } = useAtualizarEmpresa()
  
  // Buscar empresa do demo context
  const empresaDemo = demoMode ? demoContext.empresas.find((e: any) => e.id === empresaId) : null
  const empresa = demoMode ? empresaDemo : (empresaData as any)?.data || empresaData

  const [activeTab, setActiveTab] = useState('dados')
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Dados da empresa
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [introducao, setIntroducao] = useState('')
  const [cor, setCor] = useState('#FF6600')
  const [termoConsentimento, setTermoConsentimento] = useState(true)
  const [status, setStatus] = useState('ativa')

  // Dados do login da empresa
  const [loginEmpresa, setLoginEmpresa] = useState('')
  const [senhaEmpresa, setSenhaEmpresa] = useState('')
  const [emailEmpresa, setEmailEmpresa] = useState('')
  const [acessaDashboard, setAcessaDashboard] = useState(true)
  const [acessaRelatorios, setAcessaRelatorios] = useState(true)

  // Configurações de dashboard
  const [filtroHeatmap1, setFiltroHeatmap1] = useState('')
  const [filtroHeatmap2, setFiltroHeatmap2] = useState('')

  // Carregar dados da empresa
  useEffect(() => {
    if (empresa) {
      setNome(empresa.nome || '')
      setSlug(empresa.slug || '')
      setIntroducao(empresa.introducao || '')
      setCor(empresa.cor || '#FF6600')
      setTermoConsentimento(empresa.termoConsentimento || true)
      setStatus(empresa.status || 'ativa')
    }
  }, [empresa])

  const handleSalvar = async () => {
    try {
      const dadosAtualizados = {
        nome,
        slug,
        introducao,
        cor,
        termoConsentimento,
        status
      }

      if (demoMode) {
        // Modo Demo
        demoContext.updateEmpresa(empresaId, dadosAtualizados)
        showNotification({
          message: 'Empresa atualizada com sucesso!',
          variant: 'success'
        })
      } else {
        // Modo Produção
        await atualizarEmpresa({ id: empresaId, data: dadosAtualizados })
        showNotification({
          message: 'Empresa atualizada com sucesso!',
          variant: 'success'
        })
        refetch()
      }
    } catch (error) {
      showNotification({
        message: 'Erro ao atualizar empresa. Tente novamente.',
        variant: 'danger'
      })
    }
  }

  const handleCriarLogin = () => {
    setShowLoginModal(true)
  }

  // Loading state
  if (loadingEmpresa) {
    return (
      <>
        <PageTitle title="Editar Empresa" subName="Empresas" />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <PageTitle title="Editar Empresa" subName="Empresas" />
        <Card className="text-center py-5">
          <Card.Body>
            <IconifyIcon icon="iconoir:wifi-off" style={{ fontSize: '48px' }} className="text-danger mb-3" />
            <h5>Erro ao carregar empresa</h5>
            <p className="text-muted">{error.message}</p>
            <Button variant="primary" onClick={refetch}>
              <IconifyIcon icon="iconoir:refresh" className="me-2" />
              Tentar novamente
            </Button>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <PageTitle title="Editar Empresa" subName="Empresas" />

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dados')}
        className="mb-4"
      >
        <Tab eventKey="dados" title="Dados Gerais">
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Empresa</Form.Label>
                    <Form.Control
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Slug (URL)</Form.Label>
                    <Form.Control
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      URL: https://rumosaudavel.com/portal/{slug}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Introdução</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={introducao}
                      onChange={(e) => setIntroducao(e.target.value)}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cor do Tema</Form.Label>
                        <ColorPicker value={cor} onChange={setCor} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value="ativa">Ativa</option>
                          <option value="inativa">Inativa</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Check
                    type="switch"
                    id="termo-consentimento"
                    label="Exigir Termo de Consentimento"
                    checked={termoConsentimento}
                    onChange={(e) => setTermoConsentimento(e.target.checked)}
                    className="mb-3"
                  />
                </Col>

                <Col md={4}>
                  <Card className="bg-light">
                    <Card.Body>
                      <h6>Estatísticas</h6>
                      <div className="mb-2">
                        <small className="text-muted">Total de Participantes:</small>
                        <div className="fs-4 fw-bold">150</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Responderam:</small>
                        <div className="fs-4 fw-bold text-success">98</div>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">Taxa de Resposta:</small>
                        <div className="fs-4 fw-bold text-info">65%</div>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted">Cadastrado em:</small>
                        <div>15/01/2025</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="campos" title="Campos">
          <Card>
            <Card.Body>
              <h6 className="mb-3">Campos Padrão do Cadastro</h6>
              <Row className="mb-4">
                {['Nome', 'Email', 'Celular', 'Faixa Etária', 'Sexo', 'Estado Civil'].map((campo) => (
                  <Col md={4} key={campo} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`campo-${campo}`}
                      label={campo}
                      defaultChecked={['Nome', 'Email', 'Celular'].includes(campo)}
                    />
                  </Col>
                ))}
              </Row>

              <hr />

              <h6 className="mb-3">Campos Personalizados</h6>
              <Alert variant="info">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Gerencie campos adicionais no cadastro dos participantes
              </Alert>
              
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Setor</td>
                    <td><Badge bg="secondary">Múltipla Escolha</Badge></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <IconifyIcon icon="iconoir:edit-pencil" />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <IconifyIcon icon="iconoir:trash" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Cargo</td>
                    <td><Badge bg="secondary">Texto</Badge></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1">
                        <IconifyIcon icon="iconoir:edit-pencil" />
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <IconifyIcon icon="iconoir:trash" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="login" title="Login da Empresa">
          <Card>
            <Card.Body>
              <h6 className="mb-3">Acesso ao Dashboard da Empresa</h6>
              
              <Alert variant="info" className="mb-4">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Crie login para o gestor da empresa acessar relatórios e acompanhar os resultados.
              </Alert>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                      type="text"
                      value={loginEmpresa}
                      onChange={(e) => setLoginEmpresa(e.target.value)}
                      placeholder="usuario.empresa"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={emailEmpresa}
                      onChange={(e) => setEmailEmpresa(e.target.value)}
                      placeholder="gestor@empresa.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  value={senhaEmpresa}
                  onChange={(e) => setSenhaEmpresa(e.target.value)}
                  placeholder="********"
                />
              </Form.Group>

              <Form.Check
                type="checkbox"
                id="acessa-dashboard"
                label="Acessa Dashboard"
                checked={acessaDashboard}
                onChange={(e) => setAcessaDashboard(e.target.checked)}
                className="mb-2"
              />
              
              <Form.Check
                type="checkbox"
                id="acessa-relatorios"
                label="Acessa Relatórios"
                checked={acessaRelatorios}
                onChange={(e) => setAcessaRelatorios(e.target.checked)}
                className="mb-3"
              />

              <Button variant="success" onClick={handleCriarLogin}>
                <IconifyIcon icon="iconoir:plus" className="me-2" />
                {loginEmpresa ? 'Atualizar Login' : 'Criar Login'}
              </Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="dashboard" title="Config. Dashboard">
          <Card>
            <Card.Body>
              <h6 className="mb-3">Filtros para Relatórios</h6>
              
              <Alert variant="info" className="mb-4">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Configure quais campos serão usados como filtros nos relatórios de heatmap e semáforo.
              </Alert>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Filtro Heatmap 1</Form.Label>
                    <Form.Select 
                      value={filtroHeatmap1} 
                      onChange={(e) => setFiltroHeatmap1(e.target.value)}
                    >
                      <option value="">Selecione um campo...</option>
                      <option value="faixa_etaria">Faixa Etária</option>
                      <option value="sexo">Sexo</option>
                      <option value="setor">Setor</option>
                      <option value="cargo">Cargo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Filtro Heatmap 2</Form.Label>
                    <Form.Select 
                      value={filtroHeatmap2} 
                      onChange={(e) => setFiltroHeatmap2(e.target.value)}
                    >
                      <option value="">Selecione um campo...</option>
                      <option value="faixa_etaria">Faixa Etária</option>
                      <option value="sexo">Sexo</option>
                      <option value="setor">Setor</option>
                      <option value="cargo">Cargo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Botões de Ação */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={() => router.push('/adm/lista-empresas')}
        >
          <IconifyIcon icon="iconoir:navigate-left" className="me-2" />
          Voltar
        </Button>
        
        <div className="d-flex gap-2">
          <Button variant="outline-danger" onClick={() => alert('Empresa excluída!')}>
            <IconifyIcon icon="iconoir:trash" className="me-2" />
            Excluir
          </Button>
          <Button
            variant="success"
            onClick={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <>
                <IconifyIcon icon="iconoir:check" className="me-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
