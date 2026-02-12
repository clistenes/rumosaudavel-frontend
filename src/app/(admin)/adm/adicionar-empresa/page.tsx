'use client'

import { useState, useCallback } from 'react'
import { Card, Form, Button, Row, Col, Tabs, Tab, Alert, Badge } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ColorPicker from '@/components/ColorPicker'

interface CampoPersonalizado {
  id: number
  nome: string
  tipo: 'texto' | 'radio'
  opcoes?: string[]
}

export default function AdicionarEmpresa() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dados')
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  // Dados da empresa
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [introducao, setIntroducao] = useState('')
  const [cor, setCor] = useState('#FF6600')
  const [termoConsentimento, setTermoConsentimento] = useState(true)

  // Campos padrão
  const [camposPadrao, setCamposPadrao] = useState({
    nome: true,
    email: true,
    celular: true,
    faixa_etaria: true,
    sexo: true,
    estado_civil: false,
    celular2: false,
  })

  // Campos personalizados
  const [camposPersonalizados, setCamposPersonalizados] = useState<CampoPersonalizado[]>([])
  const [novoCampoNome, setNovoCampoNome] = useState('')
  const [novoCampoTipo, setNovoCampoTipo] = useState<'texto' | 'radio'>('texto')

  const handleGerarSlug = useCallback((nomeEmpresa: string) => {
    return nomeEmpresa
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
  }, [])

  const handleNomeChange = (valor: string) => {
    setNome(valor)
    if (!slug || slug === handleGerarSlug(nome)) {
      setSlug(handleGerarSlug(valor))
    }
  }

  const handleAdicionarCampo = () => {
    if (!novoCampoNome.trim()) return
    
    const novoCampo: CampoPersonalizado = {
      id: Date.now(),
      nome: novoCampoNome,
      tipo: novoCampoTipo,
      opcoes: novoCampoTipo === 'radio' ? ['Opção 1', 'Opção 2'] : undefined,
    }
    
    setCamposPersonalizados([...camposPersonalizados, novoCampo])
    setNovoCampoNome('')
  }

  const handleRemoverCampo = (id: number) => {
    setCamposPersonalizados(camposPersonalizados.filter(c => c.id !== id))
  }

  const handleSalvar = async () => {
    if (!nome.trim()) {
      alert('O nome da empresa é obrigatório!')
      return
    }

    setSalvando(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSucesso(true)
    setSalvando(false)
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/adm/lista-empresas')
    }, 2000)
  }

  return (
    <>
      <PageTitle title="Nova Empresa" subName="Empresas" />

      {sucesso && (
        <Alert variant="success" className="mb-4">
          <IconifyIcon icon="iconoir:check-circle" className="me-2" />
          <strong>Empresa criada com sucesso!</strong> Redirecionando...
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'dados')}
        className="mb-4"
      >
        <Tab eventKey="dados" title="Dados da Empresa">
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da Empresa *</Form.Label>
                    <Form.Control
                      type="text"
                      value={nome}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      placeholder="Ex: Empresa ABC Ltda"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Slug (URL do Portal)</Form.Label>
                    <Form.Control
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="empresa-abc"
                    />
                    <Form.Text className="text-muted">
                      URL do portal: https://rumosaudavel.com/portal/{slug || 'empresa'}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Introdução</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={introducao}
                      onChange={(e) => setIntroducao(e.target.value)}
                      placeholder="Texto de boas-vindas exibido no portal da empresa..."
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cor do Tema</Form.Label>
                        <ColorPicker
                          value={cor}
                          onChange={setCor}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Logo da Empresa</Form.Label>
                        <Form.Control type="file" accept="image/*" />
                        <Form.Text className="text-muted">
                          Tamanho recomendado: 200x60px
                        </Form.Text>
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
                      <h6>Preview do Portal</h6>
                      <div
                        className="p-3 rounded mb-3"
                        style={{ backgroundColor: cor + '20', border: `2px solid ${cor}` }}
                      >
                        <div
                          className="p-2 rounded text-center text-white mb-2"
                          style={{ backgroundColor: cor }}
                        >
                          <strong>{nome || 'Nome da Empresa'}</strong>
                        </div>
                        <div className="text-center">
                          <small style={{ color: cor }}>
                            portal/{slug || 'empresa'}
                          </small>
                        </div>
                      </div>
                      
                      <Alert variant="info" className="small">
                        <IconifyIcon icon="iconoir:info-circle" className="me-1" />
                        O participante acessará através desta URL
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="campos" title="Campos do Cadastro">
          <Card>
            <Card.Body>
              <h6 className="mb-3">Campos Padrão</h6>
              <Row className="mb-4">
                {Object.entries(camposPadrao).map(([campo, ativo]) => (
                  <Col md={4} key={campo} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`campo-${campo}`}
                      label={campo.replace('_', ' ').toUpperCase()}
                      checked={ativo}
                      onChange={(e) => setCamposPadrao({ ...camposPadrao, [campo]: e.target.checked })}
                    />
                  </Col>
                ))}
              </Row>

              <hr className="my-4" />

              <h6 className="mb-3">Campos Personalizados</h6>
              
              <Row className="mb-3">
                <Col md={5}>
                  <Form.Control
                    type="text"
                    placeholder="Nome do campo"
                    value={novoCampoNome}
                    onChange={(e) => setNovoCampoNome(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={novoCampoTipo}
                    onChange={(e) => setNovoCampoTipo(e.target.value as 'texto' | 'radio')}
                  >
                    <option value="texto">Texto</option>
                    <option value="radio">Múltipla Escolha</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Button variant="primary" onClick={handleAdicionarCampo}>
                    <IconifyIcon icon="iconoir:plus" className="me-1" />
                    Adicionar Campo
                  </Button>
                </Col>
              </Row>

              {camposPersonalizados.length > 0 && (
                <div className="mt-3">
                  {camposPersonalizados.map((campo) => (
                    <div
                      key={campo.id}
                      className="d-flex justify-content-between align-items-center p-2 mb-2 border rounded"
                    >
                      <div>
                        <strong>{campo.nome}</strong>
                        <Badge bg="secondary" className="ms-2">
                          {campo.tipo === 'texto' ? 'Texto' : 'Múltipla Escolha'}
                        </Badge>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoverCampo(campo.id)}
                      >
                        <IconifyIcon icon="iconoir:trash" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {camposPersonalizados.length === 0 && (
                <Alert variant="light" className="text-center">
                  <small className="text-muted">
                    Nenhum campo personalizado adicionado
                  </small>
                </Alert>
              )}
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
          <IconifyIcon icon="iconoir:cancel" className="me-2" />
          Cancelar
        </Button>
        
        <Button
          variant="success"
          onClick={handleSalvar}
          disabled={salvando || !nome.trim()}
        >
          {salvando ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Salvando...
            </>
          ) : (
            <>
              <IconifyIcon icon="iconoir:check" className="me-2" />
              Criar Empresa
            </>
          )}
        </Button>
      </div>
    </>
  )
}
