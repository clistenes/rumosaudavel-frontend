'use client'

import { useMemo, useState } from 'react'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { getEmpresaAtual, getEmpresaParticipantes } from '@/utils/demo-reports'
import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { exportCsv } from '@/utils/demo-export'

type IntervaloRisco = {
  id: number
  cor: string
  legenda: string
  inicio: number
  fim: number
  texto: string
}

const intervalosTermometro: IntervaloRisco[] = [
  { id: 1, cor: '#28a745', legenda: 'Baixo Risco', inicio: 0, fim: 30, texto: 'Manter acompanhamento regular' },
  { id: 2, cor: '#ffc107', legenda: 'Risco Moderado', inicio: 31, fim: 60, texto: 'Atencao preventiva recomendada' },
  { id: 3, cor: '#fd7e14', legenda: 'Risco Elevado', inicio: 61, fim: 80, texto: 'Intervencao recomendada' },
  { id: 4, cor: '#dc3545', legenda: 'Alto Risco', inicio: 81, fim: 100, texto: 'Intervencao imediata' },
]

const calcularPontuacao = (phq9: number, gad7: number) => {
  const phqEscala = (Number(phq9 || 0) / 27) * 100
  const gadEscala = (Number(gad7 || 0) / 21) * 100
  return Math.round(Math.max(phqEscala, gadEscala))
}

const getIntervalo = (pontuacao: number) => intervalosTermometro.find((item) => pontuacao >= item.inicio && pontuacao <= item.fim) || intervalosTermometro[0]

const TermometroBarra = ({ valor }: { valor: number }) => {
  const intervalo = getIntervalo(valor)
  return (
    <div className='d-flex align-items-center gap-2'>
      <div style={{ minWidth: 52 }} className='fw-bold'>{valor}</div>
      <div className='progress flex-grow-1' style={{ height: 18 }}>
        <div className='progress-bar' style={{ width: `${valor}%`, backgroundColor: intervalo.cor }}>
          {valor}%
        </div>
      </div>
    </div>
  )
}

export default function RelatorioTermometro() {
  const searchParams = useSearchParams()
  const empresaId = Number(searchParams.get('empresa') || 0)
  const { empresas, participantes } = useDemo()
  const [filtroSetor, setFiltroSetor] = useState('')

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Relatorio Termometro' subName='Relatorios' />
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
  const participantesEmpresa = getEmpresaParticipantes(participantes as any, empresaId) as any[]
  const setores = Array.from(new Set(participantesEmpresa.map((item) => item.departamento || 'Geral')))

  const dadosParticipantes = useMemo(() => {
    const base = filtroSetor
      ? participantesEmpresa.filter((item) => (item.departamento || 'Geral') === filtroSetor)
      : participantesEmpresa

    return base.map((item) => ({
      id: item.id,
      nome: item.nome,
      login: String(item.email || item.nome).split('@')[0],
      setor: item.departamento || 'Geral',
      pontuacao: calcularPontuacao(Number(item.phq9Score || 0), Number(item.gad7Score || 0)),
      phq9: Number(item.phq9Score || 0),
      gad7: Number(item.gad7Score || 0),
    }))
  }, [participantesEmpresa, filtroSetor])

  const total = dadosParticipantes.length
  const media = total > 0 ? Math.round(dadosParticipantes.reduce((acc, item) => acc + item.pontuacao, 0) / total) : 0
  const maior = total > 0 ? Math.max(...dadosParticipantes.map((item) => item.pontuacao)) : 0
  const menor = total > 0 ? Math.min(...dadosParticipantes.map((item) => item.pontuacao)) : 0

  const distribuicao = intervalosTermometro.map((intervalo) => ({
    ...intervalo,
    quantidade: dadosParticipantes.filter((item) => item.pontuacao >= intervalo.inicio && item.pontuacao <= intervalo.fim).length,
  }))

  return (
    <>
      <PageTitle title='Relatorio Termometro' subName='Relatorios' />

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
            <Form.Select value={filtroSetor} onChange={(event) => setFiltroSetor(event.target.value)}>
              <option value=''>Todos os setores</option>
              {setores.map((setor) => (
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
              exportCsv('relatorio-termometro.csv', dadosParticipantes.map((item) => ({
                login: item.login,
                nome: item.nome,
                setor: item.setor,
                phq9: item.phq9,
                gad7: item.gad7,
                pontuacao: item.pontuacao,
                intervalo: getIntervalo(item.pontuacao).legenda,
              })))
            }}
            disabled={!dadosParticipantes.length}
          >
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={3}>
          <ComponentContainerCard title='Total Participantes'>
            <div className='text-center'><h2 className='text-primary mb-0'>{total}</h2></div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title='Media de Pontuacao'>
            <div className='text-center'><h2 className='mb-0'>{media}</h2></div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title='Maior Pontuacao'>
            <div className='text-center'><h2 className='text-danger mb-0'>{maior}</h2></div>
          </ComponentContainerCard>
        </Col>
        <Col md={3}>
          <ComponentContainerCard title='Menor Pontuacao'>
            <div className='text-center'><h2 className='text-success mb-0'>{menor}</h2></div>
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={4}>
          <ComponentContainerCard title='Intervalos de Risco'>
            {distribuicao.map((item) => (
              <div key={item.id} className='d-flex justify-content-between align-items-center p-2 mb-2 rounded' style={{ backgroundColor: `${item.cor}22` }}>
                <div>
                  <div className='fw-bold small'>{item.legenda}</div>
                  <div className='text-muted small'>{item.inicio} - {item.fim}</div>
                </div>
                <Badge bg='secondary'>{item.quantidade}</Badge>
              </div>
            ))}
          </ComponentContainerCard>
        </Col>

        <Col md={8}>
          <ComponentContainerCard title='Participantes por Pontuacao'>
            <div className='table-responsive'>
              <Table className='mb-0'>
                <thead className='table-light'>
                  <tr>
                    <th>Login</th>
                    <th>Nome</th>
                    <th>Setor</th>
                    <th>PHQ-9</th>
                    <th>GAD-7</th>
                    <th>Pontuacao</th>
                    <th style={{ width: 250 }}>Termometro</th>
                    <th>Intervalo</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosParticipantes
                    .slice()
                    .sort((a, b) => b.pontuacao - a.pontuacao)
                    .map((item) => {
                      const intervalo = getIntervalo(item.pontuacao)
                      return (
                        <tr key={item.id}>
                          <td>{item.login}</td>
                          <td>{item.nome}</td>
                          <td>{item.setor}</td>
                          <td>{item.phq9}</td>
                          <td>{item.gad7}</td>
                          <td className='fw-bold'>{item.pontuacao}</td>
                          <td><TermometroBarra valor={item.pontuacao} /></td>
                          <td>
                            <Badge style={{ backgroundColor: intervalo.cor, color: intervalo.cor === '#ffc107' ? '#000' : '#fff' }}>
                              {intervalo.legenda}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
              {!dadosParticipantes.length && (
                <div className='text-center text-muted py-4'>
                  Nenhum participante encontrado para o filtro selecionado.
                </div>
              )}
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
