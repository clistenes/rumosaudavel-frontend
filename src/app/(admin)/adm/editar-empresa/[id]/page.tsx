'use client'

import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ColorPicker from '@/components/ColorPicker'
import { useDemo } from '@/context/DemoContext'
import { useEmpresa, useAtualizarEmpresa, useRemoverEmpresa } from '@/hooks/api/useEmpresas'
import { useNotificationContext } from '@/context/useNotificationContext'
import { isDemoMode } from '@/utils/env'

const normalizeEmpresa = (empresa: any) => {
  if (!empresa) return null

  const nome = empresa.nome || empresa.empresa_nome || ''
  const slug =
    empresa.slug ||
    empresa.empresa_slug ||
    (typeof nome === 'string'
      ? nome
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : '')

  const introducao = empresa.introducao || empresa.empresa_introducao || ''
  const cor = empresa.cor || empresa.empresa_cor || '#FF6600'
  const cnpj = empresa.cnpj || empresa.empresa_cnpj || ''
  const email = empresa.email || empresa.empresa_email || ''
  const telefone = empresa.telefone || empresa.empresa_telefone || ''
  const cidade = empresa.cidade || empresa.empresa_cidade || ''
  const estado = empresa.estado || empresa.empresa_estado || ''
  const termoRaw = empresa.termoConsentimento ?? empresa.empresa_termo
  const termoConsentimento = typeof termoRaw === 'string'
    ? termoRaw === 'on' || termoRaw === 'true' || termoRaw === '1'
    : termoRaw ?? true

  const status = empresa.status || (empresa.ativo ? 'ativo' : 'inativo')

  return {
    ...empresa,
    nome,
    slug,
    introducao,
    cor,
    cnpj,
    email,
    telefone,
    cidade,
    estado,
    termoConsentimento,
    status,
    participantesCount: empresa.participantes ?? empresa.totalParticipantes ?? 0,
    riscoAltoCount: empresa.riscoAlto ?? 0,
    adesaoPercentual: empresa.adesao ?? 0,
    dataCadastroFormatada: empresa.dataCadastro || empresa.dataCriacao || empresa.created_at || null,
  }
}

export default function EditarEmpresa() {
  const router = useRouter()
  const params = useParams()
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const empresaId = Number(rawId)
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const { data: empresaData, loading: loadingEmpresa, error, refetch } = useEmpresa(demoMode ? null : empresaId)
  const { mutateAsync: atualizarEmpresa, loading: salvando } = useAtualizarEmpresa()
  const { mutateAsync: removerEmpresa, loading: removendo } = useRemoverEmpresa()

  const empresaDemo = demoMode
    ? demoContext.empresas.find((empresa: any) => String(empresa.id) === String(rawId))
    : null
  const empresaIdResolvido = Number(empresaDemo?.id ?? empresaId)
  const empresaApi: any = empresaData
  const empresaNormalizada = normalizeEmpresa(demoMode ? empresaDemo : empresaApi)

  const [activeTab, setActiveTab] = useState('dados')
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [introducao, setIntroducao] = useState('')
  const [cor, setCor] = useState('#FF6600')
  const [termoConsentimento, setTermoConsentimento] = useState(true)
  const [status, setStatus] = useState('ativo')

  const [loginEmpresa, setLoginEmpresa] = useState('')
  const [senhaEmpresa, setSenhaEmpresa] = useState('')
  const [emailEmpresa, setEmailEmpresa] = useState('')
  const [acessaDashboard, setAcessaDashboard] = useState(true)
  const [acessaRelatorios, setAcessaRelatorios] = useState(true)

  const [filtroHeatmap1, setFiltroHeatmap1] = useState('')
  const [filtroHeatmap2, setFiltroHeatmap2] = useState('')

  useEffect(() => {
    if (!empresaNormalizada) return

    setNome(empresaNormalizada.nome)
    setSlug(empresaNormalizada.slug)
    setCnpj(empresaNormalizada.cnpj || '')
    setEmail(empresaNormalizada.email || '')
    setTelefone(empresaNormalizada.telefone || '')
    setCidade(empresaNormalizada.cidade || '')
    setEstado(empresaNormalizada.estado || '')
    setIntroducao(empresaNormalizada.introducao)
    setCor(empresaNormalizada.cor)
    setTermoConsentimento(empresaNormalizada.termoConsentimento)
    setStatus(empresaNormalizada.status)
    setEmailEmpresa(empresaNormalizada.email || '')
  }, [empresaNormalizada])

  const handleSalvar = async () => {
    try {
      if (demoMode) {
        demoContext.updateEmpresa(empresaIdResolvido, {
          nome,
          slug,
          cnpj,
          email,
          telefone,
          cidade,
          estado,
          introducao,
          cor,
          termoConsentimento,
          status,
          ativo: status === 'ativo',
        })
        showNotification({ message: 'Empresa atualizada com sucesso!', variant: 'success' })
        return
      }

      await atualizarEmpresa({
        id: empresaIdResolvido,
        data: {
          empresa_nome: nome,
          empresa_introducao: introducao,
          empresa_cor: cor,
          empresa_termo: termoConsentimento ? 'on' : 'off',
        }
      })

      showNotification({ message: 'Empresa atualizada com sucesso!', variant: 'success' })
      refetch()
    } catch {
      showNotification({ message: 'Erro ao atualizar empresa. Tente novamente.', variant: 'danger' })
    }
  }

  const handleExcluir = async () => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir a empresa "${empresaNormalizada?.nome}"?`)
    if (!confirmed) return

    try {
      if (demoMode) {
        demoContext.deleteEmpresa(empresaIdResolvido)
      } else {
        await removerEmpresa(empresaIdResolvido)
      }

      showNotification({ message: 'Empresa excluída com sucesso!', variant: 'success' })
      router.push('/adm/lista-empresas')
    } catch {
      showNotification({ message: 'Erro ao excluir empresa. Tente novamente.', variant: 'danger' })
    }
  }

  const handleSalvarLogin = () => {
    showNotification({
      message: loginEmpresa ? 'Login da empresa atualizado.' : 'Preencha o login para salvar.',
      variant: loginEmpresa ? 'success' : 'warning'
    })
  }

  if (!demoMode && loadingEmpresa) {
    return (
      <>
        <PageTitle title='Editar Empresa' subName='Empresas' />
        <div className='d-flex justify-content-center align-items-center' style={{ height: '400px' }}>
          <Spinner animation='border' variant='primary' />
        </div>
      </>
    )
  }

  if (!demoMode && error) {
    return (
      <>
        <PageTitle title='Editar Empresa' subName='Empresas' />
        <Card className='text-center py-5'>
          <Card.Body>
            <IconifyIcon icon='iconoir:wifi-off' style={{ fontSize: '48px' }} className='text-danger mb-3' />
            <h5>Erro ao carregar empresa</h5>
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

  if (!empresaNormalizada) {
    return (
      <>
        <PageTitle title='Editar Empresa' subName='Empresas' />
        <Alert variant='warning'>Empresa não encontrada.</Alert>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Editar Empresa' subName='Empresas' />

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dados')} className='mb-4'>
        <Tab eventKey='dados' title='Dados Gerais'>
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Nome da Empresa</Form.Label>
                    <Form.Control type='text' value={nome} onChange={(e) => setNome(e.target.value)} />
                  </Form.Group>

                  <Form.Group className='mb-3'>
                    <Form.Label>Slug (URL)</Form.Label>
                    <Form.Control type='text' value={slug} onChange={(e) => setSlug(e.target.value)} />
                    <Form.Text className='text-muted'>URL: https://rumosaudavel.com/portal/{slug}</Form.Text>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>CNPJ</Form.Label>
                        <Form.Control type='text' value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type='text' value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control type='text' value={cidade} onChange={(e) => setCidade(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className='mb-3'>
                        <Form.Label>UF</Form.Label>
                        <Form.Control type='text' value={estado} onChange={(e) => setEstado(e.target.value.toUpperCase())} maxLength={2} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className='mb-3'>
                    <Form.Label>Introdução</Form.Label>
                    <Form.Control as='textarea' rows={4} value={introducao} onChange={(e) => setIntroducao(e.target.value)} />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Cor do Tema</Form.Label>
                        <ColorPicker value={cor} onChange={setCor} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                          <option value='ativo'>Ativa</option>
                          <option value='inativo'>Inativa</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Check
                    type='switch'
                    id='termo-consentimento'
                    label='Exigir Termo de Consentimento'
                    checked={termoConsentimento}
                    onChange={(e) => setTermoConsentimento(e.target.checked)}
                    className='mb-3'
                  />
                </Col>

                <Col md={4}>
                  <Card className='bg-light'>
                    <Card.Body>
                      <h6>Estatísticas</h6>
                      <div className='mb-2'>
                        <small className='text-muted'>Total de Participantes:</small>
                        <div className='fs-4 fw-bold'>{empresaNormalizada.participantesCount}</div>
                      </div>
                      <div className='mb-2'>
                        <small className='text-muted'>Risco Alto:</small>
                        <div className='fs-4 fw-bold text-danger'>{empresaNormalizada.riscoAltoCount}</div>
                      </div>
                      <div className='mb-2'>
                        <small className='text-muted'>Taxa de Adesão:</small>
                        <div className='fs-4 fw-bold text-info'>{empresaNormalizada.adesaoPercentual}%</div>
                      </div>
                      <div className='mb-0'>
                        <small className='text-muted'>Cadastrado em:</small>
                        <div>{empresaNormalizada.dataCadastroFormatada ? new Date(empresaNormalizada.dataCadastroFormatada).toLocaleDateString('pt-BR') : '-'}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey='campos' title='Campos'>
          <Card>
            <Card.Body>
              <h6 className='mb-3'>Campos Padrão do Cadastro</h6>
              <Row className='mb-4'>
                {['Nome', 'Email', 'Celular', 'Faixa Etária', 'Sexo', 'Estado Civil'].map((campo) => (
                  <Col md={4} key={campo} className='mb-2'>
                    <Form.Check type='checkbox' id={`campo-${campo}`} label={campo} defaultChecked={['Nome', 'Email', 'Celular'].includes(campo)} />
                  </Col>
                ))}
              </Row>

              <hr />
              <h6 className='mb-3'>Campos Personalizados</h6>
              <Alert variant='info'>
                <IconifyIcon icon='iconoir:info-circle' className='me-2' />
                Gerencie campos adicionais no cadastro dos participantes.
              </Alert>

              <Table size='sm'>
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
                    <td><Badge bg='secondary'>Múltipla Escolha</Badge></td>
                    <td>
                      <Button variant='outline-primary' size='sm' className='me-1'><IconifyIcon icon='iconoir:edit-pencil' /></Button>
                      <Button variant='outline-danger' size='sm'><IconifyIcon icon='iconoir:trash' /></Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey='login' title='Login da Empresa'>
          <Card>
            <Card.Body>
              <h6 className='mb-3'>Acesso ao Dashboard da Empresa</h6>

              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Login</Form.Label>
                    <Form.Control type='text' value={loginEmpresa} onChange={(e) => setLoginEmpresa(e.target.value)} placeholder='usuario.empresa' />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' value={emailEmpresa} onChange={(e) => setEmailEmpresa(e.target.value)} placeholder='gestor@empresa.com' />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className='mb-3'>
                <Form.Label>Senha</Form.Label>
                <Form.Control type='password' value={senhaEmpresa} onChange={(e) => setSenhaEmpresa(e.target.value)} placeholder='********' />
              </Form.Group>

              <Form.Check type='checkbox' id='acessa-dashboard' label='Acessa Dashboard' checked={acessaDashboard} onChange={(e) => setAcessaDashboard(e.target.checked)} className='mb-2' />
              <Form.Check type='checkbox' id='acessa-relatorios' label='Acessa Relatórios' checked={acessaRelatorios} onChange={(e) => setAcessaRelatorios(e.target.checked)} className='mb-3' />

              <Button variant='success' onClick={handleSalvarLogin}>
                <IconifyIcon icon='iconoir:check' className='me-2' />
                Salvar Login
              </Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey='dashboard' title='Config. Dashboard'>
          <Card>
            <Card.Body>
              <h6 className='mb-3'>Filtros para Relatórios</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Filtro Heatmap 1</Form.Label>
                    <Form.Select value={filtroHeatmap1} onChange={(e) => setFiltroHeatmap1(e.target.value)}>
                      <option value=''>Selecione um campo...</option>
                      <option value='faixa_etaria'>Faixa Etária</option>
                      <option value='sexo'>Sexo</option>
                      <option value='setor'>Setor</option>
                      <option value='cargo'>Cargo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Filtro Heatmap 2</Form.Label>
                    <Form.Select value={filtroHeatmap2} onChange={(e) => setFiltroHeatmap2(e.target.value)}>
                      <option value=''>Selecione um campo...</option>
                      <option value='faixa_etaria'>Faixa Etária</option>
                      <option value='sexo'>Sexo</option>
                      <option value='setor'>Setor</option>
                      <option value='cargo'>Cargo</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <div className='d-flex justify-content-between'>
        <Button variant='outline-secondary' onClick={() => router.push('/adm/lista-empresas')}>
          <IconifyIcon icon='iconoir:navigate-left' className='me-2' />
          Voltar
        </Button>

        <div className='d-flex gap-2'>
          <Button variant='outline-danger' onClick={handleExcluir} disabled={removendo}>
            <IconifyIcon icon='iconoir:trash' className='me-2' />
            Excluir
          </Button>
          <Button variant='success' onClick={handleSalvar} disabled={salvando}>
            {salvando ? (
              <>
                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden='true'></span>
                Salvando...
              </>
            ) : (
              <>
                <IconifyIcon icon='iconoir:check' className='me-2' />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

