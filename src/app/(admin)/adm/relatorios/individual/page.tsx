'use client'

import { useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Table, Badge, Card, Button, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

// Dados realistas do participante
const dadosParticipante = {
  id: 1,
  login: 'joao.silva',
  nome: 'João Silva',
  email: 'joao.silva@empresa.com',
  setor: 'Administrativo',
  faixaEtaria: '26-35',
  dataResposta: '10/02/2025',
  pontuacaoTotal: 78,
  risco: 'alto',
  termometro: 'vermelho',
}

const resultadosPorDimensao = [
  { dimensao: 'Ambiente de Trabalho', pontuacao: 4.2, risco: 'baixo', peso: 20 },
  { dimensao: 'Relacionamentos', pontuacao: 4.5, risco: 'baixo', peso: 15 },
  { dimensao: 'Reconhecimento', pontuacao: 2.1, risco: 'alto', peso: 25 },
  { dimensao: 'Desenvolvimento', pontuacao: 3.0, risco: 'medio', peso: 20 },
  { dimensao: 'Comunicação', pontuacao: 3.4, risco: 'medio', peso: 20 },
]

const indicadoresPHQ9 = {
  nome: 'PHQ-9 (Depressão)',
  pontuacao: 12,
  interpretacao: 'Depressão moderada',
  gravidade: 'moderada',
}

const indicadoresGAD7 = {
  nome: 'GAD-7 (Ansiedade)',
  pontuacao: 10,
  interpretacao: 'Ansiedade moderada',
  gravidade: 'moderada',
}

const recomendacoes = [
  'Buscar apoio do setor de RH para discutir dificuldades no trabalho',
  'Considerar participação em programas de desenvolvimento profissional',
  'Avaliar possibilidade de mentoria ou coaching',
  'Manter comunicação regular com gestor sobre expectativas e metas',
]

export default function RelatorioIndividual() {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false)

  const getCorRisco = (risco: string) => {
    const cores: { [key: string]: string } = {
      baixo: '#28a745',
      medio: '#ffc107',
      alto: '#dc3545',
    }
    return cores[risco] || '#6c757d'
  }

  const getBadgeGravidade = (gravidade: string) => {
    const configs: { [key: string]: { bg: string; text: string } } = {
      leve: { bg: 'success', text: 'Leve' },
      moderada: { bg: 'warning', text: 'Moderada' },
      grave: { bg: 'danger', text: 'Grave' },
    }
    return configs[gravidade] || { bg: 'secondary', text: gravidade }
  }

  return (
    <>
      <PageTitle title='Relatório Individual' subName='Relatórios' />

      {/* Header do Participante */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="mb-1">{dadosParticipante.nome}</h4>
                  <p className="text-muted mb-2">
                    <IconifyIcon icon="iconoir:user" className="me-2" />
                    {dadosParticipante.login} | {dadosParticipante.email}
                  </p>
                  <p className="text-muted mb-0">
                    <IconifyIcon icon="iconoir:building" className="me-2" />
                    {dadosParticipante.setor} | {dadosParticipante.faixaEtaria} anos
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-muted small mb-1">Data da Resposta:</p>
                  <p className="fw-bold">{dadosParticipante.dataResposta}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cards Principais */}
      <Row className="mb-4">
        <Col md={4}>
          <ComponentContainerCard title="Pontuação Total">
            <div className="text-center">
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: getCorRisco(dadosParticipante.risco),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: '#fff',
                  fontSize: '36px',
                  fontWeight: 'bold',
                }}
              >
                {dadosParticipante.pontuacaoTotal}
              </div>
              <Badge bg={dadosParticipante.risco === 'alto' ? 'danger' : dadosParticipante.risco === 'medio' ? 'warning' : 'success'} className="px-3 py-2">
                Risco {dadosParticipante.risco.toUpperCase()}
              </Badge>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title={indicadoresPHQ9.nome}>
            <div className="text-center">
              <h2 className={`mb-2 ${indicadoresPHQ9.gravidade === 'grave' ? 'text-danger' : indicadoresPHQ9.gravidade === 'moderada' ? 'text-warning' : 'text-success'}`}>
                {indicadoresPHQ9.pontuacao}/27
              </h2>
              <p className="mb-2">{indicadoresPHQ9.interpretacao}</p>
              <Badge bg={getBadgeGravidade(indicadoresPHQ9.gravidade).bg}>
                {getBadgeGravidade(indicadoresPHQ9.gravidade).text}
              </Badge>
              <div className="mt-3 text-start small">
                <p className="text-muted mb-1">
                  <IconifyIcon icon="iconoir:info-circle" className="me-1" />
                  0-4: Mínima | 5-9: Leve | 10-14: Moderada | 15-19: Moderadamente Grave | 20-27: Grave
                </p>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title={indicadoresGAD7.nome}>
            <div className="text-center">
              <h2 className={`mb-2 ${indicadoresGAD7.gravidade === 'grave' ? 'text-danger' : indicadoresGAD7.gravidade === 'moderada' ? 'text-warning' : 'text-success'}`}>
                {indicadoresGAD7.pontuacao}/21
              </h2>
              <p className="mb-2">{indicadoresGAD7.interpretacao}</p>
              <Badge bg={getBadgeGravidade(indicadoresGAD7.gravidade).bg}>
                {getBadgeGravidade(indicadoresGAD7.gravidade).text}
              </Badge>
              <div className="mt-3 text-start small">
                <p className="text-muted mb-1">
                  <IconifyIcon icon="iconoir:info-circle" className="me-1" />
                  0-4: Mínima | 5-9: Leve | 10-14: Moderada | 15-21: Grave
                </p>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Resultados por Dimensão */}
      <Row className="mb-4">
        <Col md={8}>
          <ComponentContainerCard title="Resultados por Dimensão">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Dimensão</th>
                    <th className="text-center">Pontuação</th>
                    <th className="text-center">Peso</th>
                    <th className="text-center">Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosPorDimensao.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.dimensao}</td>
                      <td className="text-center">
                        <span 
                          className="fw-bold"
                          style={{ color: item.pontuacao >= 4 ? '#28a745' : item.pontuacao >= 3 ? '#ffc107' : '#dc3545' }}
                        >
                          {item.pontuacao.toFixed(1)}
                        </span>
                        <span className="text-muted"> /5</span>
                      </td>
                      <td className="text-center">{item.peso}%</td>
                      <td className="text-center">
                        <Badge bg={item.risco === 'alto' ? 'danger' : item.risco === 'medio' ? 'warning' : 'success'}>
                          {item.risco.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title="Recomendações">
            <Alert variant="info" className="mb-3">
              <IconifyIcon icon="iconoir:info-circle" className="me-2" />
              Baseado nos resultados, recomendamos:
            </Alert>
            <ul className="list-unstyled">
              {recomendacoes.map((rec, idx) => (
                <li key={idx} className="mb-2 d-flex">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2 mt-1 flex-shrink-0" />
                  <span className="small">{rec}</span>
                </li>
              ))}
            </ul>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Alertas */}
      <Row>
        <Col>
          <Alert variant="warning">
            <Alert.Heading>
              <IconifyIcon icon="iconoir:warning-triangle" className="me-2" />
              Atenção Necessária
            </Alert.Heading>
            <p>
              Os resultados indicam níveis moderados de depressão e ansiedade. 
              Recomenda-se acompanhamento profissional e discussão com o gestor 
              sobre fatores estressores identificados no ambiente de trabalho.
            </p>
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-primary" size="sm">
                <IconifyIcon icon="iconoir:envelope" className="me-1" />
                Enviar por Email
              </Button>
              <Button variant="primary" size="sm">
                <IconifyIcon icon="iconoir:download" className="me-1" />
                Exportar PDF
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </>
  )
}
