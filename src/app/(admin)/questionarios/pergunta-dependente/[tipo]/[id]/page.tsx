'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState, useEffect } from 'react'
import { Row, Col, Button, Form, Nav, Tab, Spinner, Alert, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { questionariosService } from '@/services/questionarios'
import { useNotificationContext } from '@/context/useNotificationContext'

interface Alternativa {
  id?: number
  texto: string
  pontuacao: number
  tipo: 'positivo' | 'negativo' | 'neutro'
}

const PerguntaDependente = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showNotification } = useNotificationContext()
  
  const tipo = params.tipo as string // 's', 'n', ou 'me'
  const id = params.id as string
  const questionarioId = searchParams.get('questionario')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Dados da pergunta pai
  const [perguntaPai, setPerguntaPai] = useState<any>(null)
  const [alternativaPai, setAlternativaPai] = useState<any>(null)

  // Campos do formulário
  const [nome, setNome] = useState('')
  const [nomeSite, setNomeSite] = useState('')
  const [nomeCurto, setNomeCurto] = useState('')
  const [explicacao, setExplicacao] = useState('')
  const [tipoPergunta, setTipoPergunta] = useState<'me' | 'sn' | 'dissertativa'>('me')
  const [escolhaHipotese, setEscolhaHipotese] = useState<'1' | 'n'>('1')
  const [alternativas, setAlternativas] = useState<Alternativa[]>([])

  // Configurações Sim/Não
  const [sPontuacao, setSPontuacao] = useState(0)
  const [sTipo, setSTipo] = useState<'positivo' | 'negativo'>('positivo')
  const [sComentario, setSComentario] = useState('')
  const [nPontuacao, setNPontuacao] = useState(0)
  const [nTipo, setNTipo] = useState<'positivo' | 'negativo'>('negativo')
  const [nComentario, setNComentario] = useState('')

  useEffect(() => {
    carregarDadosPai()
  }, [tipo, id])

  const carregarDadosPai = async () => {
    try {
      setLoading(true)

      if (tipo === 's' || tipo === 'n') {
        // Buscar pergunta pai
        const response = await questionariosService.obterPergunta(parseInt(id))
        setPerguntaPai(response.data)
      } else if (tipo === 'me') {
        // Buscar alternativa e depois a pergunta pai
        // Aqui precisaríamos de um endpoint para buscar alternativa
        // Por enquanto, vamos apenas usar o ID
        setAlternativaPai({ id: parseInt(id) })
      }
    } catch (error) {
      showNotification({
        message: 'Erro ao carregar dados da pergunta pai.',
        variant: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAlternativa = () => {
    setAlternativas([...alternativas, { 
      texto: '', 
      pontuacao: 0, 
      tipo: 'positivo' 
    }])
  }

  const handleRemoveAlternativa = (index: number) => {
    setAlternativas(alternativas.filter((_, i) => i !== index))
  }

  const handleAlternativaChange = (index: number, field: keyof Alternativa, value: any) => {
    const novasAlternativas = [...alternativas]
    novasAlternativas[index] = { ...novasAlternativas[index], [field]: value }
    setAlternativas(novasAlternativas)
  }

  const getTipoLabel = () => {
    switch (tipo) {
      case 's': return 'Sim'
      case 'n': return 'Não'
      case 'me': return 'Alternativa específica'
      default: return tipo
    }
  }

  const handleSalvar = async () => {
    if (!questionarioId) {
      showNotification({
        message: 'ID do questionário não encontrado.',
        variant: 'danger'
      })
      return
    }

    try {
      setSaving(true)

      const data = {
        id_questionario: parseInt(questionarioId),
        id_dependente: parseInt(id),
        tipo_dependente: tipo,
        nome,
        nome_site: nomeSite,
        nome_curto: nomeCurto,
        explicacao,
        tipo: tipoPergunta,
        escolha_hipotese: tipoPergunta === 'me' ? escolhaHipotese : undefined,
        alternativas: tipoPergunta === 'me' ? alternativas : undefined,
        s_pontuacao: tipoPergunta === 'sn' ? sPontuacao : undefined,
        s_tipo: tipoPergunta === 'sn' ? sTipo : undefined,
        s_comentario: tipoPergunta === 'sn' ? sComentario : undefined,
        n_pontuacao: tipoPergunta === 'sn' ? nPontuacao : undefined,
        n_tipo: tipoPergunta === 'sn' ? nTipo : undefined,
        n_comentario: tipoPergunta === 'sn' ? nComentario : undefined,
      }

      await questionariosService.criarPerguntaDependente(data)

      showNotification({
        message: 'Pergunta dependente criada com sucesso!',
        variant: 'success'
      })

      router.back()
    } catch (error) {
      showNotification({
        message: 'Erro ao criar pergunta dependente. Tente novamente.',
        variant: 'danger'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <PageTitle title='Nova Pergunta Dependente' subName='Questionários' />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Nova Pergunta Dependente' subName='Questionários' />

      {/* Informação da pergunta pai */}
      <Alert variant="info" className="mb-4">
        <h6 className="mb-2">
          <IconifyIcon icon="iconoir:question-mark-circle" className="me-2" />
          Pergunta Condicional
        </h6>
        <p className="mb-1">
          Esta pergunta será exibida apenas quando o participante responder:
        </p>
        <Badge bg="primary" className="me-2">{getTipoLabel()}</Badge>
        {perguntaPai && (
          <div className="mt-2 small">
            <strong>Pergunta pai:</strong> {perguntaPai.nome_site || perguntaPai.nome}
          </div>
        )}
        {alternativaPai && (
          <div className="mt-2 small">
            <strong>Alternativa:</strong> ID {alternativaPai.id}
          </div>
        )}
      </Alert>
      
      <Row>
        <Col md={8}>
          <ComponentContainerCard title="Dados da Pergunta">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome (Admin) *</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nome interno da pergunta"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome no Site *</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Texto exibido ao participante"
                  value={nomeSite}
                  onChange={(e) => setNomeSite(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome Curto (Relatórios)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nome curto para relatórios"
                  value={nomeCurto}
                  onChange={(e) => setNomeCurto(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Explicação</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={2} 
                  placeholder="Texto explicativo (tooltip)"
                  value={explicacao}
                  onChange={(e) => setExplicacao(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Pergunta *</Form.Label>
                <Form.Select 
                  value={tipoPergunta} 
                  onChange={(e) => setTipoPergunta(e.target.value as 'me' | 'sn' | 'dissertativa')}
                >
                  <option value="me">Múltipla Escolha</option>
                  <option value="sn">Sim/Não</option>
                  <option value="dissertativa">Dissertativa</option>
                </Form.Select>
              </Form.Group>

              {tipoPergunta === 'me' && (
                <Form.Group className="mb-3">
                  <Form.Label>Escolha da Hipótese</Form.Label>
                  <Form.Select
                    value={escolhaHipotese}
                    onChange={(e) => setEscolhaHipotese(e.target.value as '1' | 'n')}
                  >
                    <option value="1">Escolha Única</option>
                    <option value="n">Múltipla Escolha</option>
                  </Form.Select>
                </Form.Group>
              )}
            </Form>
          </ComponentContainerCard>

          {tipoPergunta === 'me' && (
            <ComponentContainerCard title="Alternativas">
              {alternativas.length === 0 && (
                <Alert variant="info">Adicione pelo menos uma alternativa.</Alert>
              )}
              {alternativas.map((alt, index) => (
                <Row key={index} className="mb-3 align-items-end">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Alternativa {index + 1}</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Texto da alternativa"
                        value={alt.texto}
                        onChange={(e) => handleAlternativaChange(index, 'texto', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Pontuação</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="0"
                        value={alt.pontuacao}
                        onChange={(e) => handleAlternativaChange(index, 'pontuacao', parseFloat(e.target.value) || 0)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        value={alt.tipo}
                        onChange={(e) => handleAlternativaChange(index, 'tipo', e.target.value)}
                      >
                        <option value="positivo">Positivo</option>
                        <option value="negativo">Negativo</option>
                        <option value="neutro">Neutro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleRemoveAlternativa(index)}
                    >
                      <IconifyIcon icon="iconoir:trash" />
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="primary" onClick={handleAddAlternativa}>
                <IconifyIcon icon="iconoir:plus" className="me-1" /> Nova Alternativa
              </Button>
            </ComponentContainerCard>
          )}

          {tipoPergunta === 'sn' && (
            <ComponentContainerCard title="Configuração Sim/Não">
              <Tab.Container defaultActiveKey="sim">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="sim">Resposta "Sim"</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="nao">Resposta "Não"</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="sim">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Pontuação</Form.Label>
                        <Form.Control 
                          type="number" 
                          placeholder="0"
                          value={sPontuacao}
                          onChange={(e) => setSPontuacao(parseFloat(e.target.value) || 0)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                          value={sTipo}
                          onChange={(e) => setSTipo(e.target.value as 'positivo' | 'negativo')}
                        >
                          <option value="positivo">Positivo</option>
                          <option value="negativo">Negativo</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          value={sComentario}
                          onChange={(e) => setSComentario(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="nao">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Pontuação</Form.Label>
                        <Form.Control 
                          type="number" 
                          placeholder="0"
                          value={nPontuacao}
                          onChange={(e) => setNPontuacao(parseFloat(e.target.value) || 0)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                          value={nTipo}
                          onChange={(e) => setNTipo(e.target.value as 'positivo' | 'negativo')}
                        >
                          <option value="positivo">Positivo</option>
                          <option value="negativo">Negativo</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          value={nComentario}
                          onChange={(e) => setNComentario(e.target.value)}
                        />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </ComponentContainerCard>
          )}
        </Col>

        <Col md={4}>
          <ComponentContainerCard title="Ações">
            <Button 
              variant="success" 
              className="w-100 mb-2"
              onClick={handleSalvar}
              disabled={saving || !nome || !nomeSite || !questionarioId}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Salvando...
                </>
              ) : (
                <>
                  <IconifyIcon icon="iconoir:check" className="me-1" /> Criar Pergunta
                </>
              )}
            </Button>
            <Button 
              variant="outline-secondary" 
              className="w-100"
              onClick={() => router.back()}
              disabled={saving}
            >
              <IconifyIcon icon="iconoir:cancel" className="me-1" /> Cancelar
            </Button>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default PerguntaDependente
