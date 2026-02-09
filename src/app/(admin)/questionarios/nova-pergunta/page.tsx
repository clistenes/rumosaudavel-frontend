'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'
import { Row, Col, Button, Form, Nav, Tab } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const NovaPergunta = () => {
  const [tipoPergunta, setTipoPergunta] = useState('me')
  const [alternativas, setAlternativas] = useState([
    { id: 1, texto: '', pontuacao: 0, tipo: 'positivo' },
  ])

  const handleAddAlternativa = () => {
    setAlternativas([...alternativas, { 
      id: alternativas.length + 1, 
      texto: '', 
      pontuacao: 0, 
      tipo: 'positivo' 
    }])
  }

  const handleRemoveAlternativa = (id: number) => {
    setAlternativas(alternativas.filter(a => a.id !== id))
  }

  return (
    <>
      <PageTitle title='Nova Pergunta' subName='Questionários' />
      
      <Row>
        <Col md={8}>
          <ComponentContainerCard title="Dados da Pergunta">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome (Admin)</Form.Label>
                <Form.Control type="text" placeholder="Nome interno da pergunta" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome no Site</Form.Label>
                <Form.Control type="text" placeholder="Texto exibido ao participante" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome Curto (Relatórios)</Form.Label>
                <Form.Control type="text" placeholder="Nome curto para relatórios" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Explicação</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Texto explicativo (tooltip)" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Pergunta</Form.Label>
                <Form.Select 
                  value={tipoPergunta} 
                  onChange={(e) => setTipoPergunta(e.target.value)}
                >
                  <option value="me">Múltipla Escolha</option>
                  <option value="sn">Sim/Não</option>
                  <option value="dissertativa">Dissertativa</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </ComponentContainerCard>

          {tipoPergunta === 'me' && (
            <ComponentContainerCard title="Alternativas">
              {alternativas.map((alt, index) => (
                <Row key={alt.id} className="mb-3 align-items-end">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Alternativa {index + 1}</Form.Label>
                      <Form.Control type="text" placeholder="Texto da alternativa" />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Pontuação</Form.Label>
                      <Form.Control type="number" placeholder="0" />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select>
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
                      onClick={() => handleRemoveAlternativa(alt.id)}
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
                        <Form.Control type="number" placeholder="0" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select>
                          <option value="positivo">Positivo</option>
                          <option value="negativo">Negativo</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control as="textarea" rows={2} />
                      </Form.Group>
                    </Form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="nao">
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Pontuação</Form.Label>
                        <Form.Control type="number" placeholder="0" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select>
                          <option value="positivo">Positivo</option>
                          <option value="negativo">Negativo</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control as="textarea" rows={2} />
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
            <Button variant="success" className="w-100 mb-2">
              <IconifyIcon icon="iconoir:check" className="me-1" /> Salvar Pergunta
            </Button>
            <Button variant="outline-secondary" className="w-100">
              <IconifyIcon icon="iconoir:cancel" className="me-1" /> Cancelar
            </Button>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default NovaPergunta
