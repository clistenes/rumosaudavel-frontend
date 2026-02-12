'use client'

import { useState, useMemo } from 'react'
import { useDemo } from '@/context/DemoContext'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { Row, Col, Table, Form, Button, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useRouter } from 'next/navigation'

export default function DashboardAnalitico() {
  const router = useRouter()
  const { empresas, participantes, questionarios, programas } = useDemo()
  const [filtroEmpresa, setFiltroEmpresa] = useState('')
  const [filtroPrograma, setFiltroPrograma] = useState('')

  // Filtrar dados
  const dadosFiltrados = useMemo(() => {
    let parts = [...participantes]
    
    if (filtroEmpresa) {
      parts = parts.filter(p => p.empresaId === parseInt(filtroEmpresa))
    }
    
    return parts
  }, [participantes, filtroEmpresa])

  // Estatísticas
  const estatisticas = useMemo(() => {
    const total = dadosFiltrados.length
    const ativos = dadosFiltrados.filter(p => p.status === 'ativo').length
    const riscoAlto = dadosFiltrados.filter(p => p.riscoSaude === 'alto').length
    const riscoMedio = dadosFiltrados.filter(p => p.riscoSaude === 'medio').length
    const riscoBaixo = dadosFiltrados.filter(p => p.riscoSaude === 'baixo').length
    
    const mediaPHQ9 = total > 0 
      ? dadosFiltrados.reduce((acc, p) => acc + (p.phq9Score || 0), 0) / total 
      : 0
    const mediaGAD7 = total > 0 
      ? dadosFiltrados.reduce((acc, p) => acc + (p.gad7Score || 0), 0) / total 
      : 0
    
    return { total, ativos, riscoAlto, riscoMedio, riscoBaixo, mediaPHQ9, mediaGAD7 }
  }, [dadosFiltrados])

  // Participantes em risco
  const participantesRisco = useMemo(() => {
    return dadosFiltrados
      .filter(p => p.riscoSaude === 'alto' || p.riscoSaude === 'medio')
      .sort((a, b) => (b.phq9Score || 0) - (a.phq9Score || 0))
      .slice(0, 10)
  }, [dadosFiltrados])

  const getRiscoBadge = (risco: string) => {
    const config: { [key: string]: { bg: string; text: string } } = {
      baixo: { bg: 'success', text: 'Baixo' },
      medio: { bg: 'warning', text: 'Médio' },
      alto: { bg: 'danger', text: 'Alto' },
    }
    return config[risco] || { bg: 'secondary', text: risco }
  }

  const getEmpresaNome = (empresaId: number) => {
    const empresa = empresas.find(e => e.id === empresaId)
    return empresa?.nomeCurto || 'N/A'
  }

  return (
    <>
      <PageTitle title='Dashboard Analítico' subName='Relatórios' />

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Empresa</Form.Label>
            <Form.Select value={filtroEmpresa} onChange={(e) => setFiltroEmpresa(e.target.value)}>
              <option value="">Todas as Empresas</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nomeCurto}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Programa</Form.Label>
            <Form.Select value={filtroPrograma} onChange={(e) => setFiltroPrograma(e.target.value)}>
              <option value="">Todos os Programas</option>
              {programas.map((p: any) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button 
            variant="outline-secondary" 
            className="w-100"
            onClick={() => {
              setFiltroEmpresa('')
              setFiltroPrograma('')
            }}
          >
            <IconifyIcon icon="iconoir:refresh" className="me-2" />
            Limpar Filtros
          </Button>
        </Col>
      </Row>

      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        <Col md={2}>
          <ComponentContainerCard title="Total">
            <div className="text-center">
              <h3 className="text-primary mb-1">{estatisticas.total}</h3>
              <p className="text-muted small mb-0">Participantes</p>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={2}>
          <ComponentContainerCard title="Ativos">
            <div className="text-center">
              <h3 className="text-success mb-1">{estatisticas.ativos}</h3>
              <p className="text-muted small mb-0">Ativos</p>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={2}>
          <ComponentContainerCard title="PHQ-9 Médio">
            <div className="text-center">
              <h3 className={`mb-1 ${estatisticas.mediaPHQ9 >= 15 ? 'text-danger' : estatisticas.mediaPHQ9 >= 10 ? 'text-warning' : 'text-info'}`}>
                {estatisticas.mediaPHQ9.toFixed(1)}
              </h3>
              <p className="text-muted small mb-0">Depressão</p>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={2}>
          <ComponentContainerCard title="GAD-7 Médio">
            <div className="text-center">
              <h3 className={`mb-1 ${estatisticas.mediaGAD7 >= 15 ? 'text-danger' : estatisticas.mediaGAD7 >= 10 ? 'text-warning' : 'text-info'}`}>
                {estatisticas.mediaGAD7.toFixed(1)}
              </h3>
              <p className="text-muted small mb-0">Ansiedade</p>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={2}>
          <ComponentContainerCard title="Risco Alto">
            <div className="text-center">
              <h3 className="text-danger mb-1">{estatisticas.riscoAlto}</h3>
              <p className="text-muted small mb-0">Casos</p>
            </div>
          </ComponentContainerCard>
        </Col>
        <Col md={2}>
          <ComponentContainerCard title="Risco Médio">
            <div className="text-center">
              <h3 className="text-warning mb-1">{estatisticas.riscoMedio}</h3>
              <p className="text-muted small mb-0">Casos</p>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Distribuição de Risco por Empresa */}
      <Row className="mb-4">
        <Col md={8}>
          <ComponentContainerCard title="Distribuição de Risco por Empresa">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Empresa</th>
                    <th className="text-center">Participantes</th>
                    <th className="text-center">Risco Alto</th>
                    <th className="text-center">Risco Médio</th>
                    <th className="text-center">Risco Baixo</th>
                    <th className="text-center">PHQ-9</th>
                    <th className="text-center">GAD-7</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map((empresa) => {
                    const partsEmpresa = participantes.filter(p => p.empresaId === empresa.id)
                    const riscoAlto = partsEmpresa.filter(p => p.riscoSaude === 'alto').length
                    const riscoMedio = partsEmpresa.filter(p => p.riscoSaude === 'medio').length
                    const riscoBaixo = partsEmpresa.filter(p => p.riscoSaude === 'baixo').length
                    const mediaPHQ9 = partsEmpresa.length > 0 
                      ? partsEmpresa.reduce((acc, p) => acc + (p.phq9Score || 0), 0) / partsEmpresa.length 
                      : 0
                    const mediaGAD7 = partsEmpresa.length > 0 
                      ? partsEmpresa.reduce((acc, p) => acc + (p.gad7Score || 0), 0) / partsEmpresa.length 
                      : 0
                    
                    return (
                      <tr key={empresa.id}>
                        <td>{empresa.nomeCurto}</td>
                        <td className="text-center">{partsEmpresa.length}</td>
                        <td className="text-center">
                          <Badge bg="danger">{riscoAlto}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="warning" text="dark">{riscoMedio}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="success">{riscoBaixo}</Badge>
                        </td>
                        <td className="text-center">
                          <span className={mediaPHQ9 >= 15 ? 'text-danger fw-bold' : mediaPHQ9 >= 10 ? 'text-warning' : 'text-success'}>
                            {mediaPHQ9.toFixed(1)}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={mediaGAD7 >= 15 ? 'text-danger fw-bold' : mediaGAD7 >= 10 ? 'text-warning' : 'text-success'}>
                            {mediaGAD7.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title="Resumo de Riscos">
            <div className="text-center mb-4">
              <h2 className="mb-2">{estatisticas.total}</h2>
              <p className="text-muted">Total de Participantes</p>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-danger">Risco Alto</span>
                <span className="fw-bold">{estatisticas.riscoAlto} ({((estatisticas.riscoAlto / estatisticas.total) * 100).toFixed(1)}%)</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-danger" style={{ width: `${(estatisticas.riscoAlto / estatisticas.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-warning">Risco Médio</span>
                <span className="fw-bold">{estatisticas.riscoMedio} ({((estatisticas.riscoMedio / estatisticas.total) * 100).toFixed(1)}%)</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${(estatisticas.riscoMedio / estatisticas.total) * 100}%` }}></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-success">Risco Baixo</span>
                <span className="fw-bold">{estatisticas.riscoBaixo} ({((estatisticas.riscoBaixo / estatisticas.total) * 100).toFixed(1)}%)</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-success" style={{ width: `${(estatisticas.riscoBaixo / estatisticas.total) * 100}%` }}></div>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Participantes em Risco */}
      <Row>
        <Col>
          <ComponentContainerCard title="Participantes em Situação de Risco">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Empresa</th>
                    <th>Cargo</th>
                    <th className="text-center">PHQ-9</th>
                    <th className="text-center">GAD-7</th>
                    <th className="text-center">Risco</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {participantesRisco.map((item) => {
                    const risco = getRiscoBadge(item.riscoSaude)
                    return (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{getEmpresaNome(item.empresaId)}</td>
                        <td>{item.cargo}</td>
                        <td className="text-center">
                          <Badge bg={item.phq9Score >= 15 ? 'danger' : item.phq9Score >= 10 ? 'warning' : 'success'}>
                            {item.phq9Score}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={item.gad7Score >= 15 ? 'danger' : item.gad7Score >= 10 ? 'warning' : 'success'}>
                            {item.gad7Score}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <span className={`badge bg-${risco.bg}`}>{risco.text}</span>
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => router.push(`/adm/relatorios/individual?participante=${item.id}`)}
                          >
                            <IconifyIcon icon="iconoir:page" />
                          </Button>
                          <Button variant="outline-success" size="sm">
                            <IconifyIcon icon="iconoir:envelope" />
                          </Button>
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
