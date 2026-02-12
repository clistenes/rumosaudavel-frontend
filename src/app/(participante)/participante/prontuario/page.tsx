'use client'

import { Card, Button, Badge, Row, Col, ListGroup, Table, Alert } from 'react-bootstrap'
import Link from 'next/link'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { PARTICIPANTES_DEMO, EMPRESAS_DEMO } from '@/assets/data/demo-data'

export default function ProntuarioParticipante() {
  // Get current participant (José Antônio)
  const participante = PARTICIPANTES_DEMO[0]
  const empresa = EMPRESAS_DEMO.find(e => e.id === participante.empresaId)

  // Mock history
  const historico = [
    { data: '2026-02-05', questionario: 'PHQ-9', score: 18, risco: 'alto', status: 'Concluído' },
    { data: '2026-02-05', questionario: 'GAD-7', score: 15, risco: 'alto', status: 'Concluído' },
    { data: '2026-01-05', questionario: 'PHQ-9', score: 16, risco: 'alto', status: 'Concluído' },
    { data: '2026-01-05', questionario: 'GAD-7', score: 14, risco: 'alto', status: 'Concluído' },
    { data: '2025-12-05', questionario: 'PHQ-9', score: 14, risco: 'medio', status: 'Concluído' },
    { data: '2025-12-05', questionario: 'GAD-7', score: 12, risco: 'medio', status: 'Concluído' },
  ]

  const getRiscoBadge = (risco: string) => {
    const colors: { [key: string]: string } = {
      alto: 'danger',
      medio: 'warning',
      baixo: 'success'
    }
    return <Badge bg={colors[risco] || 'secondary'}>{risco === 'alto' ? 'Alto' : risco === 'medio' ? 'Médio' : 'Baixo'}</Badge>
  }

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date()
    const nasc = new Date(dataNasc)
    let idade = hoje.getFullYear() - nasc.getFullYear()
    const mes = hoje.getMonth() - nasc.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--
    return idade
  }

  return (
    <>
      <PageTitle title="Meu Prontuário" subName="Participante" />

      {/* Header */}
      <Card className="bg-primary text-white mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="mb-2">{participante.nome}</h4>
              <p className="mb-0 opacity-75">
                {participante.cargo} | {participante.departamento}
              </p>
              <small className="opacity-75">{empresa?.nomeCurto}</small>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Badge bg="light" text="dark" className="px-3 py-2">
                <IconifyIcon icon="iconoir:user" className="me-1" />
                Participante
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alert for high risk */}
      {participante.riscoSaude === 'alto' && (
        <Alert variant="danger" className="mb-4">
          <IconifyIcon icon="iconoir:warning-triangle" className="me-2" />
          <strong>Atenção:</strong> Você está classificado como <strong>risco alto</strong>. 
          Recomendamos que procure acompanhamento profissional. 
          <Link href="/participante/contatos" className="alert-link ms-2">
            Ver canais de apoio →
          </Link>
        </Alert>
      )}

      {/* Personal Info */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Dados Pessoais</h6>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">CPF</span>
                  <span>{participante.cpf}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Idade</span>
                  <span>{calcularIdade(participante.dataNascimento)} anos</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Sexo</span>
                  <span>{participante.sexo === 'M' ? 'Masculino' : 'Feminino'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Estado Civil</span>
                  <span>{participante.estadoCivil}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Cidade</span>
                  <span>{participante.cidade}, {participante.estado}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Admissão</span>
                  <span>{new Date(participante.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h6 className="mb-0">Indicadores Atuais</h6>
            </Card.Header>
            <Card.Body>
              <Row className="text-center mb-3">
                <Col xs={6}>
                  <Card className="bg-info bg-opacity-10">
                    <Card.Body>
                      <h4 className="text-info mb-1">{participante.phq9Score}</h4>
                      <small className="text-muted">PHQ-9</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className="bg-primary bg-opacity-10">
                    <Card.Body>
                      <h4 className="text-primary mb-1">{participante.gad7Score}</h4>
                      <small className="text-muted">GAD-7</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between align-items-center">
                  <span className="text-muted">Nível de Risco</span>
                  {getRiscoBadge(participante.riscoSaude)}
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between align-items-center">
                  <span className="text-muted">Alertas Pendentes</span>
                  <Badge bg={participante.alertasPendentes > 0 ? 'danger' : 'success'} pill>
                    {participante.alertasPendentes}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-2 d-flex justify-content-between">
                  <span className="text-muted">Última Avaliação</span>
                  <span>{new Date(participante.ultimaAvaliacao).toLocaleDateString('pt-BR')}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* History */}
      <Card>
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Histórico de Avaliações</h6>
          <Badge bg="secondary">{historico.length} registros</Badge>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Questionário</th>
                  <th className="text-center">Score</th>
                  <th className="text-center">Risco</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((registro, index) => (
                  <tr key={index}>
                    <td>{new Date(registro.data).toLocaleDateString('pt-BR')}</td>
                    <td>{registro.questionario}</td>
                    <td className="text-center">
                      <Badge bg={registro.score >= 15 ? 'danger' : registro.score >= 10 ? 'warning' : 'success'}>
                        {registro.score}
                      </Badge>
                    </td>
                    <td className="text-center">{getRiscoBadge(registro.risco)}</td>
                    <td className="text-center">
                      <Badge bg="success">{registro.status}</Badge>
                    </td>
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm">
                        <IconifyIcon icon="iconoir:page" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
