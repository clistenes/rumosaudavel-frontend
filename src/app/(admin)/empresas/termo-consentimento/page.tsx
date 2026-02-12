'use client'

import { useState } from 'react'
import { Card, Button, Form, Row, Col, Alert, Modal, Badge } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'

export default function TermoConsentimentoPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [termo, setTermo] = useState({
    titulo: 'Termo de Consentimento Livre e Esclarecido',
    versao: '1.0',
    dataAtualizacao: '2026-02-01',
    conteudo: `TERMOS DE CONSENTIMENTO LIVRE E ESCLARECIDO

Você está sendo convidado(a) a participar do Programa de Saúde Mental e Bem-estar Corporativo.

1. OBJETIVO
Este programa tem como objetivo avaliar e acompanhar a saúde mental dos colaboradores, identificando necessidades de apoio e promovendo ações de bem-estar.

2. PROCEDIMENTOS
Você será solicitado a responder questionários de autoavaliação sobre saúde mental, satisfação no trabalho e bem-estar geral. As avaliações serão realizadas periodicamente.

3. CONFIDENCIALIDADE
Todas as informações fornecidas são estritamente confidenciais. Os dados serão:
- Armazenados de forma segura e criptografada
- Acessíveis apenas a profissionais autorizados
- Utilizados apenas para fins do programa
- Não compartilhados com gestores diretos

4. BENEFÍCIOS
Participação em programa de cuidado com saúde mental, acesso a recursos de apoio, acompanhamento profissional quando necessário.

5. RISCOS
Os questionários podem abordar temas sensíveis. Em caso de desconforto, equipe de apoio estará disponível.

6. VOLUNTARIEDADE
Sua participação é voluntária. Você pode:
- Recusar participar sem qualquer penalidade
- Retirar seu consentimento a qualquer momento
- Solicitar exclusão dos dados coletados

7. CONTATO
Em caso de dúvidas, entre em contato com nossa equipe através dos canais disponibilizados na plataforma.

DECLARO que li e entendi os termos acima e concordo em participar do programa.`
  })

  const handleSave = () => {
    // Simula salvamento
    alert('Termo salvo com sucesso!')
  }

  return (
    <>
      <PageTitle title="Termo de Consentimento" subName="Gerenciar termo LGPD" />

      <Row>
        <Col xl={8}>
          <ComponentContainerCard title="Editar Termo de Consentimento">
            <Form>
              <Row>
                <Col md={8} className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    type="text"
                    value={termo.titulo}
                    onChange={(e) => setTermo({...termo, titulo: e.target.value})}
                  />
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Versão</Form.Label>
                  <Form.Control
                    type="text"
                    value={termo.versao}
                    onChange={(e) => setTermo({...termo, versao: e.target.value})}
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Conteúdo do Termo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={20}
                  value={termo.conteudo}
                  onChange={(e) => setTermo({...termo, conteudo: e.target.value})}
                  style={{ fontFamily: 'monospace', fontSize: '14px' }}
                />
              </Form.Group>

              <Alert variant="info">
                <IconifyIcon icon="fa:info-circle" className="me-2" />
                <strong>Dica:</strong> Use quebras de linha para organizar o conteúdo. O termo será apresentado aos participantes na tela de cadastro.
              </Alert>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={() => setShowPreview(true)}>
                  <IconifyIcon icon="fa:eye" className="me-1" />
                  Pré-visualizar
                </Button>
                <Link href="/empresas/dados-empresas" className="btn btn-secondary">
                  Cancelar
                </Link>
                <Button variant="primary" onClick={handleSave}>
                  <IconifyIcon icon="fa:save" className="me-1" />
                  Salvar Termo
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title="Histórico de Versões">
            <div className="mb-3 pb-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">Versão 1.0</h6>
                  <small className="text-muted">Atual - 01/02/2026</small>
                </div>
                <Badge bg="success">Ativa</Badge>
              </div>
            </div>

            <div className="mb-3 pb-3 border-bottom opacity-50">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">Versão 0.9</h6>
                  <small className="text-muted">15/01/2026</small>
                </div>
                <Badge bg="secondary">Arquivada</Badge>
              </div>
            </div>

            <Button variant="outline-primary" size="sm" className="w-100">
              <IconifyIcon icon="fa:history" className="me-1" />
              Ver Histórico Completo
            </Button>
          </ComponentContainerCard>

          <Card className="mt-3 bg-light">
            <Card.Body>
              <h6 className="mb-3">
                <IconifyIcon icon="fa:balance-scale" className="me-2" />
                Conformidade LGPD
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-2">
                  <IconifyIcon icon="fa:check-circle" className="text-success me-2" />
                  Consentimento explícito
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="fa:check-circle" className="text-success me-2" />
                  Finalidade clara
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="fa:check-circle" className="text-success me-2" />
                  Direito de revogação
                </li>
                <li>
                  <IconifyIcon icon="fa:check-circle" className="text-success me-2" />
                  Contato do DPO
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Pré-visualização do Termo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="bg-light p-4 rounded" style={{ whiteSpace: 'pre-line' }}>
            <h4 className="text-center mb-4">{termo.titulo}</h4>
            <div style={{ lineHeight: '1.8' }}>
              {termo.conteudo}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
