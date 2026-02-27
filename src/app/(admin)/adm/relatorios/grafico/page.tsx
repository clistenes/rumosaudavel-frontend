'use client'

import { useMemo, useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaAtual, getEmpresaParticipantes, getEmpresaResumo, getSetoresResumo } from '@/utils/demo-reports'
import { Button, Col, Form, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { exportCsv } from '@/utils/demo-export'

type ChartSegment = {
  label: string
  value: number
  color: string
}

const PieChart = ({ data, size = 220 }: { data: ChartSegment[]; size?: number }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = size / 2 - 8
  const center = size / 2
  let currentAngle = 0

  return (
    <div className='d-flex flex-column align-items-center'>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((item) => {
          if (item.value <= 0 || total <= 0) return null

          const angle = (item.value / total) * 360
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

          return <path key={item.label} d={pathData} fill={item.color} stroke='#fff' strokeWidth='2' />
        })}
      </svg>

      <div className='mt-3 w-100'>
        {data.map((item) => (
          <div key={item.label} className='d-flex align-items-center justify-content-between mb-1 small'>
            <div className='d-flex align-items-center'>
              <div
                className='me-2'
                style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
            <span className='fw-bold'>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RelatorioGrafico() {
  const searchParams = useSearchParams()
  const empresaId = Number(searchParams.get('empresa') || 0)
  const { empresas, participantes } = useDemo()
  const [setorSelecionado, setSetorSelecionado] = useState('')

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatorio Grafico (Pizza)' subName='Relatorios' />
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

  const empresa = getEmpresaAtual(empresas as any, empresaId)
  const participantesEmpresa = getEmpresaParticipantes(participantes as any, empresaId)
  const resumo = getEmpresaResumo(participantesEmpresa as any)
  const setores = getSetoresResumo(participantesEmpresa as any)

  const setoresOptions = setores.map((item) => item.setor)
  const setorAtual = setores.find((item) => item.setor === setorSelecionado) || setores[0]

  const distribuicaoGeral: ChartSegment[] = [
    { label: 'Baixo risco', value: resumo.baixo, color: '#28a745' },
    { label: 'Medio risco', value: resumo.medio, color: '#ffc107' },
    { label: 'Alto risco', value: resumo.alto, color: '#dc3545' },
  ]

  const distribuicaoSetor: ChartSegment[] = setorAtual
    ? [
      { label: 'Baixo risco', value: setorAtual.baixo, color: '#28a745' },
      { label: 'Medio risco', value: setorAtual.medio, color: '#ffc107' },
      { label: 'Alto risco', value: setorAtual.alto, color: '#dc3545' },
    ]
    : distribuicaoGeral

  return (
    <>
      <PageTitle title='Relatorio Grafico (Pizza)' subName='Relatorios' />

      <Row className='mb-4'>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Empresa</Form.Label>
            <Form.Control value={empresa?.nomeCurto || empresa?.nome || ''} disabled />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Setor</Form.Label>
            <Form.Select value={setorSelecionado} onChange={(event) => setSetorSelecionado(event.target.value)}>
              <option value=''>Todos os setores</option>
              {setoresOptions.map((setor) => (
                <option key={setor} value={setor}>{setor}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className='mb-3'>
        <Col className='d-flex justify-content-end'>
          <Button
            variant='primary'
            size='sm'
            onClick={() => {
              exportCsv('relatorio-grafico-resumo.csv', setores.map((setor) => ({
                setor: setor.setor,
                total: setor.total,
                baixo: setor.baixo,
                medio: setor.medio,
                alto: setor.alto,
                phq9_medio: setor.mediaPhq9.toFixed(1),
                gad7_medio: setor.mediaGad7.toFixed(1),
              })))
            }}
            disabled={!setores.length}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      {!resumo.total && (
        <div className='alert alert-info'>
          Nenhum participante encontrado para esta empresa.
        </div>
      )}

      <Row className='mb-4'>
        <Col md={6}>
          <ComponentContainerCard title='Distribuicao geral de risco'>
            <div className='d-flex justify-content-center'>
              <PieChart data={distribuicaoGeral} size={250} />
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={6}>
          <ComponentContainerCard title={`Detalhamento por setor${setorAtual ? `: ${setorAtual.setor}` : ''}`}>
            <div className='d-flex justify-content-center'>
              <PieChart data={distribuicaoSetor} size={250} />
            </div>
            {setorAtual && (
              <div className='mt-3'>
                <div className='d-flex justify-content-between p-2 bg-light rounded mb-2'>
                  <span>PHQ-9 medio</span>
                  <strong>{setorAtual.mediaPhq9.toFixed(1)}</strong>
                </div>
                <div className='d-flex justify-content-between p-2 bg-light rounded'>
                  <span>GAD-7 medio</span>
                  <strong>{setorAtual.mediaGad7.toFixed(1)}</strong>
                </div>
              </div>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row>
        {setores.map((item) => {
          const total = item.total || 1
          const positivo = Math.round(((item.baixo + item.medio * 0.5) / total) * 100)
          const negativo = Math.max(0, 100 - positivo)

          return (
            <Col md={3} key={item.setor} className='mb-3'>
              <ComponentContainerCard title={item.setor}>
                <div className='d-flex justify-content-center mb-3'>
                  <PieChart
                    data={[
                      { label: 'Positivo', value: positivo, color: '#28a745' },
                      { label: 'Negativo', value: negativo, color: '#dc3545' },
                    ]}
                    size={160}
                  />
                </div>
                <div className='text-center'>
                  <span className='text-success fw-bold me-3'>{positivo}% positivo</span>
                  <span className='text-danger fw-bold'>{negativo}% negativo</span>
                </div>
              </ComponentContainerCard>
            </Col>
          )
        })}
      </Row>
    </>
  )
}
