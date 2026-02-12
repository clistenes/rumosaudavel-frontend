'use client'

import { Card, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'

export default function ContatosApoio() {
  const contatos = [
    {
      tipo: 'emergencia',
      nome: 'CVV - Centro de Valorização da Vida',
      descricao: 'Apoio emocional 24h para pessoas em crise',
      telefone: '188',
      disponibilidade: '24 horas',
      gratuito: true,
      icone: 'iconoir:phone',
      cor: 'danger'
    },
    {
      tipo: 'empresa',
      nome: 'Psicólogo(a) da Empresa',
      descricao: 'Atendimento interno para colaboradores',
      telefone: '(11) 3521-7200',
      email: 'psicologia@empresa.com.br',
      disponibilidade: 'Seg-Sex, 8h-18h',
      gratuito: true,
      icone: 'iconoir:user-bag',
      cor: 'primary'
    },
    {
      tipo: 'programa',
      nome: 'Canal de Apoio Rumo Saudável',
      descricao: 'Suporte especializado em saúde mental',
      telefone: '0800-123-4567',
      email: 'apoio@rumosaudavel.com.br',
      disponibilidade: 'Seg-Sex, 7h-22h | Sáb, 8h-12h',
      gratuito: true,
      icone: 'iconoir:heart',
      cor: 'success'
    },
    {
      tipo: 'sus',
      nome: 'Rede de Atenção Psicossocial (RAPS)',
      descricao: 'Atendimento gratuito pelo SUS',
      telefone: '136',
      disponibilidade: '24 horas',
      gratuito: true,
      icone: 'iconoir:health-plus',
      cor: 'info'
    }
  ]

  const dicasBemEstar = [
    { icone: 'iconoir:running', titulo: 'Atividade Física', descricao: 'Movimente-se pelo menos 30 minutos por dia' },
    { icone: 'iconoir:sleep', titulo: 'Sono de Qualidade', descricao: 'Durmia 7-8 horas por noite' },
    { icone: 'iconoir:user-love', titulo: 'Conexões Sociais', descricao: 'Mantenha contato com amigos e familiares' },
    { icone: 'iconoir:meditation', titulo: 'Mindfulness', descricao: 'Pratique momentos de atenção plena' },
    { icone: 'iconoir:eat', titulo: 'Alimentação', descricao: 'Mantenha uma dieta equilibrada' },
    { icone: 'iconoir:sun-light', titulo: 'Tempo ao Ar Livre', descricao: 'Exponha-se à luz natural diariamente' },
  ]

  return (
    <>
      <PageTitle title="Canal de Apoio" subName="Participante" />

      {/* Header */}
      <Card className="bg-primary text-white mb-4">
        <Card.Body className="text-center py-5">
          <IconifyIcon icon="iconoir:phone" style={{ fontSize: '48px' }} className="mb-3" />
          <h3 className="mb-2">Você não está sozinho(a)</h3>
          <p className="mb-0 opacity-75">
            Existem pessoas e profissionais prontos para ajudar. 
            Não hesite em buscar apoio quando precisar.
          </p>
        </Card.Body>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-danger mb-4">
        <Card.Header className="bg-danger text-white">
          <IconifyIcon icon="iconoir:warning-triangle" className="me-2" />
          Emergência 24h
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <h2 className="text-danger mb-2">188</h2>
            <h5 className="mb-2">CVV - Centro de Valorização da Vida</h5>
            <p className="text-muted mb-3">Atendimento gratuito e confidencial 24 horas</p>
            <Button variant="danger" size="lg" href="tel:188">
              <IconifyIcon icon="iconoir:phone" className="me-2" />
              Ligar Agora
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Contacts List */}
      <Row className="mb-4">
        {contatos.filter(c => c.tipo !== 'emergencia').map((contato, index) => (
          <Col md={6} key={index} className="mb-3">
            <Card className={`h-100 border-${contato.cor}`}>
              <Card.Body>
                <div className="d-flex align-items-start mb-3">
                  <div className={`bg-${contato.cor} bg-opacity-10 p-3 rounded me-3`}>
                    <IconifyIcon icon={contato.icone} className={`text-${contato.cor} fs-3`} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{contato.nome}</h6>
                    <p className="text-muted small mb-2">{contato.descricao}</p>
                    {contato.gratuito && <Badge bg="success">Gratuito</Badge>}
                  </div>
                </div>

                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 py-2">
                    <IconifyIcon icon="iconoir:phone" className="me-2 text-muted" />
                    <strong>{contato.telefone}</strong>
                  </ListGroup.Item>
                  {contato.email && (
                    <ListGroup.Item className="px-0 py-2">
                      <IconifyIcon icon="iconoir:mail" className="me-2 text-muted" />
                      {contato.email}
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="px-0 py-2">
                    <IconifyIcon icon="iconoir:clock" className="me-2 text-muted" />
                    {contato.disponibilidade}
                  </ListGroup.Item>
                </ListGroup>

                <div className="mt-3">
                  <Button variant={contato.cor} className="w-100" href={`tel:${contato.telefone.replace(/\D/g, '')}`}>
                    <IconifyIcon icon="iconoir:phone" className="me-2" />
                    Ligar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Wellness Tips */}
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <IconifyIcon icon="iconoir:star" className="me-2" />
            Dicas de Bem-Estar
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {dicasBemEstar.map((dica, index) => (
              <Col md={4} key={index} className="mb-3">
                <div className="d-flex align-items-start">
                  <div className="bg-info bg-opacity-10 p-2 rounded me-3">
                    <IconifyIcon icon={dica.icone} className="text-info" />
                  </div>
                  <div>
                    <h6 className="mb-1">{dica.titulo}</h6>
                    <small className="text-muted">{dica.descricao}</small>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Footer */}
      <div className="text-center mt-4">
        <Link href="/participante">
          <Button variant="outline-primary">
            <IconifyIcon icon="iconoir:nav-arrow-left" className="me-1" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </>
  )
}
