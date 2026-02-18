'use client'

import { useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Table, Form, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Dados realistas para termômetro
const intervalosTermometro = [
  { id: 1, cor: '#28a745', legenda: 'Baixo Risco', inicio: 0, fim: 30, texto: 'Mantenha as práticas atuais de bem-estar' },
  { id: 2, cor: '#ffc107', legenda: 'Risco Moderado', inicio: 31, fim: 60, texto: 'Atenção necessária - monitorar situação' },
  { id: 3, cor: '#fd7e14', legenda: 'Risco Elevado', inicio: 61, fim: 80, texto: 'Ações preventivas recomendadas' },
  { id: 4, cor: '#dc3545', legenda: 'Alto Risco', inicio: 81, fim: 100, texto: 'Intervenção imediata necessária' },
]

const dadosParticipantes = [
  { id: 1, login: 'joao.silva', setor: 'Administrativo', pontuacao: 85, intervalo: 4 },
  { id: 2, login: 'maria.santos', setor: 'Operacional', pontuacao: 72, intervalo: 3 },
  { id: 3, login: 'pedro.oliveira', setor: 'Administrativo', pontuacao: 45, intervalo: 2 },
  { id: 4, login: 'ana.costa', setor: 'RH', pontuacao: 25, intervalo: 1 },
  { id: 5, login: 'carlos.souza', setor: 'Operacional', pontuacao: 68, intervalo: 3 },
  { id: 6, login: 'julia.lima', setor: 'Administrativo', pontuacao: 55, intervalo: 2 },
  { id: 7, login: 'roberto.ferreira', setor: 'Operacional', pontuacao: 88, intervalo: 4 },
  { id: 8, login: 'patricia.melo', setor: 'RH', pontuacao: 38, intervalo: 2 },
]

// Componente Termômetro Visual
const TermometroVisual = ({ valor, max = 100 }: { valor: number; max?: number }) => {
  const porcentagem = Math.min((valor / max) * 100, 100)
  
  const getCor = (val: number) => {
    if (val <= 30) return '#28a745'
    if (val <= 60) return '#ffc107'
    if (val <= 80) return '#fd7e14'
    return '#dc3545'
  }

  return (
    <div className="d-flex align-items-center" style={{ height: '30px' }}>
      {/* Escala */}
      <div className="d-flex flex-column me-2" style={{ fontSize: '10px', width: '30px' }}>
        <span>100</span>
        <span className="mt-auto">0</span>
      </div>
      
      {/* Termômetro */}
      <div 
        className="position-relative"
        style={{
          width: '20px',
          height: '200px',
          background: 'linear-gradient(to top, #28a745 0%, #28a745 30%, #ffc107 30%, #ffc107 60%, #fd7e14 60%, #fd7e14 80%, #dc3545 80%, #dc3545 100%)',
          borderRadius: '10px',
          border: '2px solid #ddd',
        }}
      >
        {/* Marcador */}
        <div
          className="position-absolute w-100"
          style={{
            bottom: `${porcentagem}%`,
            left: 0,
            transform: 'translateY(50%)',
            height: '4px',
            backgroundColor: '#000',
            borderRadius: '2px',
          }}
        />
        
        {/* Valor */}
        <div
          className="position-absolute"
          style={{
            bottom: `${porcentagem}%`,
            left: '25px',
            transform: 'translateY(50%)',
            backgroundColor: getCor(valor),
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          {valor}
        </div>
      </div>
    </div>
  )
}

// Barra de termômetro horizontal
const TermometroBarra = ({ valor }: { valor: number }) => {
  const getCor = (val: number) => {
    if (val <= 30) return 'success'
    if (val <= 60) return 'warning'
    if (val <= 80) return 'orange'
    return 'danger'
  }

  const getCorHex = (val: number) => {
    if (val <= 30) return '#28a745'
    if (val <= 60) return '#ffc107'
    if (val <= 80) return '#fd7e14'
    return '#dc3545'
  }

  return (
    <div className="d-flex align-items-center">
      <div style={{ width: '60px' }}>
        <span className="fw-bold" style={{ color: getCorHex(valor) }}>
          {valor} pts
        </span>
      </div>
      <div className="flex-grow-1 ms-2" style={{ maxWidth: '200px' }}>
        <div 
          className="progress"
          style={{ height: '20px', backgroundColor: '#e9ecef' }}
        >
          <div
            className={`progress-bar bg-${getCor(valor)}`}
            role="progressbar"
            style={{ 
              width: `${valor}%`,
              backgroundColor: getCorHex(valor),
            }}
          >
            {valor}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RelatorioTermometro() {
  const searchParams = useSearchParams()
  const empresaId = searchParams.get('empresa')
  const [filtroSetor, setFiltroSetor] = useState('')

  const participantesFiltrados = filtroSetor
    ? dadosParticipantes.filter(p => p.setor === filtroSetor)
    : dadosParticipantes

  // Estatísticas
  const totalParticipantes = dadosParticipantes.length
  const participantesPorIntervalo = intervalosTermometro.map(intervalo => ({
    ...intervalo,
    quantidade: dadosParticipantes.filter(p => 
      p.pontuacao >= intervalo.inicio && p.pontuacao <= intervalo.fim
    ).length
  }))

  const mediaPontuacao = Math.round(
    dadosParticipantes.reduce((acc, p) => acc + p.pontuacao, 0) / totalParticipantes
  )

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatório Termômetro' subName='Relatórios' />
        <div className='alert alert-warning'>
          Esta tela deve ser acessada pela lista de empresas.
          <div className='mt-2'>
            <Link href='/adm/lista-empresas'>
              <Button variant='primary' size='sm'>Voltar para Lista de Empresas</Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Relatório Termômetro' subName='Relatórios' />

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Setor</Form.Label>
            <Form.Select value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
              <option value="">Todos os Setores</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Operacional">Operacional</option>
              <option value="RH">RH</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Questionário</Form.Label>
            <Form.Select>
              <option>Avaliação de Saúde Mental</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button variant="primary" className="w-100">
            <IconifyIcon icon="iconoir:refresh" className="me-2" />
            Atualizar
          </Button>
        </Col>
      </Row>

      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <ComponentContainerCard title="Total Participantes">
            <div className="text-center">
              <h2 className="text-primary mb-0">{totalParticipantes}</h2>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title="Média de Pontuação">
            <div className="text-center">
              <h2 
                className="mb-0"
                style={{ 
                  color: mediaPontuacao <= 30 ? '#28a745' : 
                         mediaPontuacao <= 60 ? '#ffc107' : 
                         mediaPontuacao <= 80 ? '#fd7e14' : '#dc3545'
                }}
              >
                {mediaPontuacao}
              </h2>
              <small className="text-muted">pontos</small>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title="Maior Pontuação">
            <div className="text-center">
              <h2 className="text-danger mb-0">
                {Math.max(...dadosParticipantes.map(p => p.pontuacao))}
              </h2>
              <small className="text-muted">maior risco</small>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title="Menor Pontuação">
            <div className="text-center">
              <h2 className="text-success mb-0">
                {Math.min(...dadosParticipantes.map(p => p.pontuacao))}
              </h2>
              <small className="text-muted">menor risco</small>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Intervalos e Participantes */}
      <Row className="mb-4">
        <Col md={4}>
          <ComponentContainerCard title="Intervalos de Risco">
            <div className="d-flex justify-content-center py-3">
              <TermometroVisual valor={mediaPontuacao} />
            </div>
            
            <div className="mt-3">
              {participantesPorIntervalo.map((intervalo) => (
                <div 
                  key={intervalo.id} 
                  className="d-flex justify-content-between align-items-center p-2 mb-2 rounded"
                  style={{ backgroundColor: intervalo.cor + '20' }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: intervalo.cor,
                        borderRadius: '3px',
                        marginRight: '10px',
                      }}
                    />
                    <div>
                      <div className="fw-bold small">{intervalo.legenda}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>
                        {intervalo.inicio} - {intervalo.fim} pts
                      </div>
                    </div>
                  </div>
                  <Badge bg="secondary" className="ms-2">
                    {intervalo.quantidade}
                  </Badge>
                </div>
              ))}
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={8}>
          <ComponentContainerCard title="Participantes por Pontuação">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Login</th>
                    <th>Setor</th>
                    <th>Pontuação</th>
                    <th>Termômetro</th>
                    <th>Intervalo</th>
                  </tr>
                </thead>
                <tbody>
                  {participantesFiltrados
                    .sort((a, b) => b.pontuacao - a.pontuacao)
                    .map((item) => {
                      const intervalo = intervalosTermometro.find(
                        i => item.pontuacao >= i.inicio && item.pontuacao <= i.fim
                      )
                      return (
                        <tr key={item.id}>
                          <td>{item.login}</td>
                          <td>{item.setor}</td>
                          <td className="fw-bold">{item.pontuacao}</td>
                          <td style={{ width: '280px' }}>
                            <TermometroBarra valor={item.pontuacao} />
                          </td>
                          <td>
                            {intervalo && (
                              <Badge
                                style={{
                                  backgroundColor: intervalo.cor,
                                  color: intervalo.cor === '#ffc107' ? '#000' : '#fff',
                                }}
                              >
                                {intervalo.legenda}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
