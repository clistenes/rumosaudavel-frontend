'use client'

import { useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Table, Form, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Dados para semáforo por dimensão
const dadosSemaforo = [
  {
    dimensao: 'Ambiente de Trabalho',
    baixoRisco: 45,
    medioRisco: 35,
    altoRisco: 18,
    total: 98,
  },
  {
    dimensao: 'Relacionamentos',
    baixoRisco: 62,
    medioRisco: 28,
    altoRisco: 8,
    total: 98,
  },
  {
    dimensao: 'Reconhecimento',
    baixoRisco: 25,
    medioRisco: 35,
    altoRisco: 37,
    total: 97,
  },
  {
    dimensao: 'Desenvolvimento',
    baixoRisco: 38,
    medioRisco: 42,
    altoRisco: 16,
    total: 96,
  },
  {
    dimensao: 'Comunicação',
    baixoRisco: 48,
    medioRisco: 32,
    altoRisco: 18,
    total: 98,
  },
  {
    dimensao: 'Carga Horária',
    baixoRisco: 30,
    medioRisco: 38,
    altoRisco: 30,
    total: 98,
  },
]

// Dados para heatmap (fatores vs grupos)
const fatoresHeatmap = [
  { nome: 'Exigências do trabalho', administrativo: 65, operacional: 78, rh: 45 },
  { nome: 'Controle do trabalho', administrativo: 55, operacional: 42, rh: 62 },
  { nome: 'Apoio social', administrativo: 70, operacional: 58, rh: 75 },
  { nome: 'Recompensas', administrativo: 45, operacional: 38, rh: 52 },
  { nome: 'Injustiça', administrativo: 35, operacional: 48, rh: 28 },
  { nome: 'Valores', administrativo: 58, operacional: 52, rh: 65 },
]

const getCorCelula = (valor: number) => {
  if (valor <= 30) return '#28a745' // Verde - baixo risco
  if (valor <= 60) return '#ffc107' // Amarelo - médio risco
  if (valor <= 80) return '#fd7e14' // Laranja - alto risco
  return '#dc3545' // Vermelho - risco crítico
}

export default function RelatorioSemaforoHeatmap() {
  const searchParams = useSearchParams()
  const empresaId = searchParams.get('empresa')
  const [visualizacao, setVisualizacao] = useState<'semaforo' | 'heatmap'>('semaforo')

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatório Semáforo e Heatmap' subName='Relatórios' />
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
      <PageTitle title='Relatório Semáforo e Heatmap' subName='Relatórios' />

      {/* Toggle Visualização */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <Button
                variant={visualizacao === 'semaforo' ? 'primary' : 'outline-primary'}
                onClick={() => setVisualizacao('semaforo')}
              >
                <IconifyIcon icon="iconoir:traffic-lights" className="me-2" />
                Semáforo
              </Button>
              <Button
                variant={visualizacao === 'heatmap' ? 'primary' : 'outline-primary'}
                onClick={() => setVisualizacao('heatmap')}
              >
                <IconifyIcon icon="iconoir:grid-table" className="me-2" />
                Heatmap
              </Button>
            </div>

            <div className="d-flex gap-2">
              <Form.Select style={{ width: '200px' }}>
                <option>Todos os Questionários</option>
                <option>Avaliação de Saúde Mental</option>
              </Form.Select>
              <Button variant="primary">
                <IconifyIcon icon="iconoir:refresh" />
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Legenda */}
      <Row className="mb-3">
        <Col>
          <div className="d-flex gap-4 justify-content-center">
            <div className="d-flex align-items-center">
              <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', borderRadius: '4px', marginRight: '8px' }} />
              <span>Baixo Risco (0-30%)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ffc107', borderRadius: '4px', marginRight: '8px' }} />
              <span>Médio Risco (31-60%)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ width: '20px', height: '20px', backgroundColor: '#fd7e14', borderRadius: '4px', marginRight: '8px' }} />
              <span>Alto Risco (61-80%)</span>
            </div>
            <div className="d-flex align-items-center">
              <div style={{ width: '20px', height: '20px', backgroundColor: '#dc3545', borderRadius: '4px', marginRight: '8px' }} />
              <span>Risco Crítico (81-100%)</span>
            </div>
          </div>
        </Col>
      </Row>

      {visualizacao === 'semaforo' ? (
        /* SEMÁFORO */
        <Row>
          <Col>
            <ComponentContainerCard title="Distribuição de Risco por Dimensão">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Dimensão</th>
                      <th className="text-center" style={{ width: '150px' }}>
                        <Badge bg="success">Baixo Risco</Badge>
                      </th>
                      <th className="text-center" style={{ width: '150px' }}>
                        <Badge bg="warning" text="dark">Médio Risco</Badge>
                      </th>
                      <th className="text-center" style={{ width: '150px' }}>
                        <Badge bg="danger">Alto Risco</Badge>
                      </th>
                      <th className="text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosSemaforo.map((item, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{item.dimensao}</td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <div
                              style={{
                                width: `${(item.baixoRisco / item.total) * 100}%`,
                                minWidth: '30px',
                                height: '30px',
                                backgroundColor: '#28a745',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            >
                              {item.baixoRisco}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <div
                              style={{
                                width: `${(item.medioRisco / item.total) * 100}%`,
                                minWidth: '30px',
                                height: '30px',
                                backgroundColor: '#ffc107',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#000',
                                fontWeight: 'bold',
                              }}
                            >
                              {item.medioRisco}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <div
                              style={{
                                width: `${(item.altoRisco / item.total) * 100}%`,
                                minWidth: '30px',
                                height: '30px',
                                backgroundColor: '#dc3545',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            >
                              {item.altoRisco}
                            </div>
                          </div>
                        </td>
                        <td className="text-center fw-bold">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </ComponentContainerCard>
          </Col>
        </Row>
      ) : (
        /* HEATMAP */
        <Row>
          <Col>
            <ComponentContainerCard title="Exposição ao Risco por Fator e Setor">
              <div className="table-responsive">
                <Table className="mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start">Fator de Risco</th>
                      <th>Administrativo</th>
                      <th>Operacional</th>
                      <th>RH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fatoresHeatmap.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-start fw-bold">{item.nome}</td>
                        {['administrativo', 'operacional', 'rh'].map((setor) => {
                          const valor = item[setor as keyof typeof item] as number
                          return (
                            <td key={setor}>
                              <div
                                style={{
                                  backgroundColor: getCorCelula(valor),
                                  color: valor <= 60 ? '#000' : '#fff',
                                  padding: '15px 20px',
                                  borderRadius: '8px',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                }}
                              >
                                {valor}%
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="mt-4">
                <h6>Análise:</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <IconifyIcon icon="iconoir:warning-circle" className="text-danger me-2" />
                    <strong>Setor Operacional</strong> apresenta maior exposição em &quot;Exigências do trabalho&quot; (78%)
                  </li>
                  <li className="mb-2">
                    <IconifyIcon icon="iconoir:warning-circle" className="text-danger me-2" />
                    <strong>Reconhecimento</strong> é o fator com maior necessidade de atenção em todos os setores
                  </li>
                  <li>
                    <IconifyIcon icon="iconoir:check-circle" className="text-success me-2" />
                    <strong>Setor RH</strong> mantém melhores índices de bem-estar geral
                  </li>
                </ul>
              </div>
            </ComponentContainerCard>
          </Col>
        </Row>
      )}
    </>
  )
}
