'use client'

import { useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Form, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Dados realistas para gráfico de pizza
const dadosSatisfacaoGeral = {
  muitoSatisfeito: 28,
  satisfeito: 42,
  neutro: 18,
  insatisfeito: 8,
  muitoInsatisfeito: 4,
}

const dadosPorDimensao = [
  {
    dimensao: 'Ambiente de Trabalho',
    positivo: 78,
    negativo: 22,
    detalhes: {
      muitoSatisfeito: 35,
      satisfeito: 43,
      neutro: 15,
      insatisfeito: 5,
      muitoInsatisfeito: 2,
    }
  },
  {
    dimensao: 'Relacionamentos',
    positivo: 85,
    negativo: 15,
    detalhes: {
      muitoSatisfeito: 45,
      satisfeito: 40,
      neutro: 10,
      insatisfeito: 4,
      muitoInsatisfeito: 1,
    }
  },
  {
    dimensao: 'Reconhecimento',
    positivo: 45,
    negativo: 55,
    detalhes: {
      muitoSatisfeito: 12,
      satisfeito: 33,
      neutro: 20,
      insatisfeito: 25,
      muitoInsatisfeito: 10,
    }
  },
  {
    dimensao: 'Desenvolvimento',
    positivo: 62,
    negativo: 38,
    detalhes: {
      muitoSatisfeito: 18,
      satisfeito: 44,
      neutro: 22,
      insatisfeito: 12,
      muitoInsatisfeito: 4,
    }
  },
]

// Componente de Pizza SVG simples
const PizzaChart = ({ data, size = 200 }: { data: { [key: string]: number }; size?: number }) => {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  const colors: { [key: string]: string } = {
    muitoSatisfeito: '#28a745',
    satisfeito: '#6fbf73',
    neutro: '#ffc107',
    insatisfeito: '#f0936e',
    muitoInsatisfeito: '#dc3545',
  }
  
  const labels: { [key: string]: string } = {
    muitoSatisfeito: 'Muito Satisfeito',
    satisfeito: 'Satisfeito',
    neutro: 'Neutro',
    insatisfeito: 'Insatisfeito',
    muitoInsatisfeito: 'Muito Insatisfeito',
  }

  let currentAngle = 0
  const radius = size / 2 - 10
  const center = size / 2

  return (
    <div className="d-flex flex-column align-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Object.entries(data).map(([key, value]) => {
          if (value === 0) return null
          
          const angle = (value / total) * 360
          const startAngle = currentAngle
          const endAngle = currentAngle + angle
          
          const startRad = (startAngle * Math.PI) / 180
          const endRad = (endAngle * Math.PI) / 180
          
          const x1 = center + radius * Math.cos(startRad)
          const y1 = center + radius * Math.sin(startRad)
          const x2 = center + radius * Math.cos(endRad)
          const y2 = center + radius * Math.sin(endRad)
          
          const largeArc = angle > 180 ? 1 : 0
          
          const pathData = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ')
          
          currentAngle += angle
          
          return (
            <path
              key={key}
              d={pathData}
              fill={colors[key]}
              stroke="#fff"
              strokeWidth="2"
            />
          )
        })}
      </svg>
      
      {/* Legenda */}
      <div className="mt-3">
        {Object.entries(data).map(([key, value]) => (
          value > 0 && (
            <div key={key} className="d-flex align-items-center mb-1 small">
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: colors[key],
                  borderRadius: '2px',
                  marginRight: '8px',
                }}
              />
              <span className="flex-grow-1">{labels[key]}:</span>
              <span className="fw-bold">{value}%</span>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default function RelatorioGrafico() {
  const searchParams = useSearchParams()
  const empresaId = searchParams.get('empresa')
  const [dimensaoSelecionada, setDimensaoSelecionada] = useState<string>('')

  const dimensaoAtual = dadosPorDimensao.find(d => d.dimensao === dimensaoSelecionada) || dadosPorDimensao[0]

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatório Gráfico (Pizza)' subName='Relatórios' />
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
      <PageTitle title='Relatório Gráfico (Pizza)' subName='Relatórios' />

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Dimensão</Form.Label>
            <Form.Select 
              value={dimensaoSelecionada} 
              onChange={(e) => setDimensaoSelecionada(e.target.value)}
            >
              <option value="">Todas as Dimensões</option>
              {dadosPorDimensao.map((d) => (
                <option key={d.dimensao} value={d.dimensao}>{d.dimensao}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Questionário</Form.Label>
            <Form.Select>
              <option>Avaliação de Saúde Mental</option>
              <option>Bem-estar no Trabalho</option>
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

      {/* Visão Geral */}
      <Row className="mb-4">
        <Col md={6}>
          <ComponentContainerCard title="Satisfação Geral">
            <div className="d-flex justify-content-center">
              <PizzaChart data={dadosSatisfacaoGeral} size={250} />
            </div>
            <div className="mt-3 text-center">
              <div className="d-flex justify-content-center gap-4">
                <div className="text-center">
                  <h4 className="text-success mb-0">70%</h4>
                  <small className="text-muted">Satisfeitos</small>
                </div>
                <div className="text-center">
                  <h4 className="text-warning mb-0">18%</h4>
                  <small className="text-muted">Neutros</small>
                </div>
                <div className="text-center">
                  <h4 className="text-danger mb-0">12%</h4>
                  <small className="text-muted">Insatisfeitos</small>
                </div>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={6}>
          <ComponentContainerCard title={`Detalhamento: ${dimensaoAtual.dimensao}`}>
            <div className="d-flex justify-content-center">
              <PizzaChart data={dimensaoAtual.detalhes} size={250} />
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded mb-2">
                <span>Índice de Satisfação:</span>
                <span className={`fw-bold fs-5 ${dimensaoAtual.positivo >= 70 ? 'text-success' : dimensaoAtual.positivo >= 50 ? 'text-warning' : 'text-danger'}`}>
                  {dimensaoAtual.positivo}%
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                <span>Índice de Insatisfação:</span>
                <span className="fw-bold fs-5 text-danger">{dimensaoAtual.negativo}%</span>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Comparativo por Dimensão */}
      <Row>
        {dadosPorDimensao.map((item) => (
          <Col md={3} key={item.dimensao} className="mb-3">
            <ComponentContainerCard title={item.dimensao}>
              <div className="d-flex justify-content-center mb-3">
                <PizzaChart 
                  data={{ 
                    positivo: item.positivo, 
                    negativo: item.negativo 
                  }} 
                  size={150} 
                />
              </div>
              <div className="text-center">
                <div className="d-flex justify-content-center gap-3">
                  <div>
                    <span className="text-success fw-bold">{item.positivo}%</span>
                    <br />
                    <small className="text-muted">Positivo</small>
                  </div>
                  <div>
                    <span className="text-danger fw-bold">{item.negativo}%</span>
                    <br />
                    <small className="text-muted">Negativo</small>
                  </div>
                </div>
              </div>
            </ComponentContainerCard>
          </Col>
        ))}
      </Row>
    </>
  )
}
