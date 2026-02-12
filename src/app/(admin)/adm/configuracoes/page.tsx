'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Tabs, Tab, Alert, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral')
  const [salvo, setSalvo] = useState(false)

  const handleSalvar = () => {
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  return (
    <>
      <PageTitle title="Configurações do Sistema" subName="Administração e preferências" />

      {salvo && (
        <Alert variant="success" className="mb-3" onClose={() => setSalvo(false)} dismissible>
          <IconifyIcon icon="fa:check-circle" className="me-2" />
          Configurações salvas com sucesso!
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'geral')} className="mb-3">
        <Tab eventKey="geral" title="Geral">
          <ComponentContainerCard title="Configurações Gerais">
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Nome da Instituição</Form.Label>
                  <Form.Control type="text" defaultValue="Rumo Saudável" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>E-mail de Contato</Form.Label>
                  <Form.Control type="email" defaultValue="contato@rumosaudavel.com.br" />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Fuso Horário</Form.Label>
                  <Form.Select defaultValue="America/Sao_Paulo">
                    <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                    <option value="America/Fortaleza">America/Fortaleza (GMT-3)</option>
                    <option value="America/Manaus">America/Manaus (GMT-4)</option>
                  </Form.Select>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Idioma Padrão</Form.Label>
                  <Form.Select defaultValue="pt-BR">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </Form.Select>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Logo da Instituição</Form.Label>
                <Form.Control type="file" accept="image/*" />
                <Form.Text className="text-muted">
                  Tamanho recomendado: 200x50 pixels, formato PNG ou SVG
                </Form.Text>
              </Form.Group>

              <hr className="my-4" />

              <h6 className="mb-3">Configurações de Segurança</h6>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Sessão Expira em (minutos)</Form.Label>
                  <Form.Control type="number" defaultValue={30} min={5} max={120} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Tentativas de Login (antes do bloqueio)</Form.Label>
                  <Form.Control type="number" defaultValue={5} min={3} max={10} />
                </Col>
              </Row>

              <Form.Check 
                type="checkbox" 
                label="Exigir autenticação de dois fatores (2FA) para administradores" 
                className="mb-3"
              />

              <Form.Check 
                type="checkbox" 
                label="Registrar log de todas as ações dos usuários" 
                className="mb-3"
                defaultChecked
              />

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleSalvar}>
                  <IconifyIcon icon="fa:save" className="me-1" />
                  Salvar Configurações
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="questionarios" title="Questionários">
          <ComponentContainerCard title="Configurações de Questionários">
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Tempo Máximo de Resposta (minutos)</Form.Label>
                  <Form.Control type="number" defaultValue={60} />
                  <Form.Text className="text-muted">0 = sem limite</Form.Text>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Tentativas Permitidas</Form.Label>
                  <Form.Control type="number" defaultValue={1} min={1} max={5} />
                </Col>
              </Row>

              <Form.Check 
                type="checkbox" 
                label="Permitir pausar e retomar questionário" 
                className="mb-3"
                defaultChecked
              />

              <Form.Check 
                type="checkbox" 
                label="Mostrar progresso durante a resposta" 
                className="mb-3"
                defaultChecked
              />

              <Form.Check 
                type="checkbox" 
                label="Exibir feedback imediato após cada pergunta" 
                className="mb-3"
              />

              <hr className="my-4" />

              <h6 className="mb-3">Escalas de Avaliação</h6>

              <Table responsive size="sm" className="mb-3">
                <thead>
                  <tr>
                    <th>Escala</th>
                    <th>Valor Mínimo</th>
                    <th>Valor Máximo</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PHQ-9</td>
                    <td>0</td>
                    <td>27</td>
                    <td>Depressão (0-4: Mínima, 5-9: Leve, 10-14: Moderada, 15-19: Moderadamente Severa, 20-27: Severa)</td>
                  </tr>
                  <tr>
                    <td>GAD-7</td>
                    <td>0</td>
                    <td>21</td>
                    <td>Ansiedade (0-4: Mínima, 5-9: Leve, 10-14: Moderada, 15-21: Severa)</td>
                  </tr>
                </tbody>
              </Table>

              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleSalvar}>
                  <IconifyIcon icon="fa:save" className="me-1" />
                  Salvar Configurações
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="notificacoes" title="Notificações">
          <ComponentContainerCard title="Configurações de Notificações">
            <Form>
              <h6 className="mb-3">E-mail</h6>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Servidor SMTP</Form.Label>
                  <Form.Control type="text" placeholder="smtp.exemplo.com" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Porta</Form.Label>
                  <Form.Control type="number" placeholder="587" />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Usuário SMTP</Form.Label>
                  <Form.Control type="text" placeholder="usuario@exemplo.com" />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Senha SMTP</Form.Label>
                  <Form.Control type="password" placeholder="••••••••" />
                </Col>
              </Row>

              <Form.Check 
                type="checkbox" 
                label="Usar TLS/SSL" 
                className="mb-3"
                defaultChecked
              />

              <hr className="my-4" />

              <h6 className="mb-3">Lembretes Automáticos</h6>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Lembrete antes do vencimento (dias)</Form.Label>
                  <Form.Control type="number" defaultValue={3} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Lembrete após vencimento (dias)</Form.Label>
                  <Form.Control type="number" defaultValue={1} />
                </Col>
              </Row>

              <Form.Check 
                type="checkbox" 
                label="Enviar relatório semanal para administradores" 
                className="mb-3"
                defaultChecked
              />

              <Form.Check 
                type="checkbox" 
                label="Notificar imediatamente em casos de risco identificado" 
                className="mb-3"
                defaultChecked
              />

              <div className="d-flex justify-content-between">
                <Button variant="outline-secondary">
                  <IconifyIcon icon="fa:paper-plane" className="me-1" />
                  Testar Configurações
                </Button>
                <Button variant="primary" onClick={handleSalvar}>
                  <IconifyIcon icon="fa:save" className="me-1" />
                  Salvar Configurações
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="usuarios" title="Usuários e Permissões">
          <ComponentContainerCard title="Gerenciamento de Usuários">
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" size="sm">
                <IconifyIcon icon="fa:user-plus" className="me-1" />
                Novo Usuário
              </Button>
            </div>

            <Table responsive>
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Último Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                        <small>AD</small>
                      </div>
                      <span>Admin Principal</span>
                    </div>
                  </td>
                  <td>admin@rumosaudavel.com</td>
                  <td><Badge bg="danger">Administrador</Badge></td>
                  <td><Badge bg="success">Ativo</Badge></td>
                  <td>Hoje, 10:30</td>
                  <td>
                    <Button variant="link" size="sm" className="p-0 me-2">
                      <IconifyIcon icon="fa:edit" />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger">
                      <IconifyIcon icon="fa:ban" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-info rounded-circle text-white d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                        <small>CG</small>
                      </div>
                      <span>Carlos Gomes</span>
                    </div>
                  </td>
                  <td>carlos@empresa.com</td>
                  <td><Badge bg="primary">Empresa</Badge></td>
                  <td><Badge bg="success">Ativo</Badge></td>
                  <td>Ontem, 16:45</td>
                  <td>
                    <Button variant="link" size="sm" className="p-0 me-2">
                      <IconifyIcon icon="fa:edit" />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger">
                      <IconifyIcon icon="fa:ban" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>

            <hr className="my-4" />

            <h6 className="mb-3">Permissões por Perfil</h6>

            <Row>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Header className="bg-danger text-white">
                    <strong>Administrador</strong>
                  </Card.Header>
                  <Card.Body className="small">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Acesso total</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Gerenciar usuários</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Configurações</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Relatórios</li>
                      <li><IconifyIcon icon="fa:check" className="text-success me-1" /> Exportar dados</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Header className="bg-primary text-white">
                    <strong>Empresa</strong>
                  </Card.Header>
                  <Card.Body className="small">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Ver participantes</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Relatórios da empresa</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Gerenciar participantes</li>
                      <li className="mb-1"><IconifyIcon icon="fa:times" className="text-danger me-1" /> Configurações</li>
                      <li><IconifyIcon icon="fa:times" className="text-danger me-1" /> Outras empresas</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-3">
                  <Card.Header className="bg-success text-white">
                    <strong>Participante</strong>
                  </Card.Header>
                  <Card.Body className="small">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Responder questionários</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Ver prontuário</li>
                      <li className="mb-1"><IconifyIcon icon="fa:check" className="text-success me-1" /> Contatos</li>
                      <li className="mb-1"><IconifyIcon icon="fa:times" className="text-danger me-1" /> Dados de outros</li>
                      <li><IconifyIcon icon="fa:times" className="text-danger me-1" /> Relatórios</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey="backup" title="Backup e Dados">
          <ComponentContainerCard title="Backup e Manutenção">
            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h6 className="mb-3">
                      <IconifyIcon icon="fa:database" className="me-2" />
                      Backup do Banco de Dados
                    </h6>
                    <p className="text-muted small">
                      Último backup: <strong>10/02/2026 03:00</strong>
                    </p>
                    <p className="text-muted small">
                      Tamanho: <strong>245 MB</strong>
                    </p>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm">
                        <IconifyIcon icon="fa:download" className="me-1" />
                        Download
                      </Button>
                      <Button variant="primary" size="sm">
                        <IconifyIcon icon="fa:sync" className="me-1" />
                        Backup Agora
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h6 className="mb-3">
                      <IconifyIcon icon="fa:file-export" className="me-2" />
                      Exportação de Dados
                    </h6>
                    <Form.Check 
                      type="checkbox" 
                      label="Agendar backup automático diário" 
                      className="mb-2"
                      defaultChecked
                    />
                    <Form.Check 
                      type="checkbox" 
                      label="Manter backups dos últimos 30 dias" 
                      className="mb-3"
                      defaultChecked
                    />
                    <Button variant="outline-primary" size="sm">
                      <IconifyIcon icon="fa:file-excel" className="me-1" />
                      Exportar Tudo (Excel)
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Alert variant="warning">
              <IconifyIcon icon="fa:exclamation-triangle" className="me-2" />
              <strong>Atenção:</strong> A limpeza de dados é irreversível. Faça backup antes de prosseguir.
            </Alert>

            <Row>
              <Col md={6}>
                <Card border="danger">
                  <Card.Body>
                    <h6 className="text-danger mb-3">
                      <IconifyIcon icon="fa:trash" className="me-2" />
                      Limpeza de Dados
                    </h6>
                    <Form.Group className="mb-3">
                      <Form.Label>Remover dados anteriores a</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                    <Form.Check 
                      type="checkbox" 
                      label="Confirmo que desejo remover permanentemente estes dados" 
                      className="mb-3"
                    />
                    <Button variant="danger" size="sm">
                      <IconifyIcon icon="fa:trash-alt" className="me-1" />
                      Limpar Dados Antigos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Tab>
      </Tabs>
    </>
  )
}
