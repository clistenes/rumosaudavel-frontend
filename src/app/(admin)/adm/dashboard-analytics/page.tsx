'use client'

import { useState, useMemo } from 'react'
import { Card, Row, Col, Badge, ProgressBar, Table, Dropdown, Button, Alert } from 'react-bootstrap'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { 
  EMPRESAS_DEMO, 
  PARTICIPANTES_DEMO, 
  ALERTAS_DEMO,
  ESTATISTICAS_GLOBAIS,
  EVOLUCAO_MENSAL,
  PROGRAMAS_DEMO 
} from '@/assets/data/demo-data'

interface Metrica {
  label: string
  valor: number
  tendencia: number
  icone: string
  cor: string
  prefixo?: string
  sufixo?: string
}

export default function DashboardAnalyticsPage() {
  const [periodo, setPeriodo] = useState('30d')
  const searchParams = useSearchParams()
  const empresaId = searchParams.get('empresa')

  if (!empresaId) {
    return (
      <>
        <PageTitle title='Dashboard Analytics' subName='Administração' />
        <Alert variant='warning'>
          Esta tela deve ser acessada pela lista de empresas.
          <div className='mt-2'>
            <Link href='/adm/lista-empresas'>
              <Button variant='primary' size='sm'>Voltar para Lista de Empresas</Button>
            </Link>
          </div>
        </Alert>
      </>
    )
  }

  // Calcular métricas reais baseadas nos dados
  const metricas: Metrica[] = useMemo(() => {
    const stats = ESTATISTICAS_GLOBAIS
    const evolucao = EVOLUCAO_MENSAL
    const mesAnterior = evolucao[evolucao.length - 2]
    const mesAtual = evolucao[evolucao.length - 1]
    
    return [
      { 
        label: 'Participantes Ativos', 
        valor: stats.totalParticipantes, 
        tendencia: ((mesAtual.participantesAtivos - mesAnterior.participantesAtivos) / mesAnterior.participantesAtivos) * 100, 
        icone: 'fa:users', 
        cor: 'primary' 
      },
      { 
        label: 'Avaliações Realizadas', 
        valor: stats.avaliacoesRealizadas, 
        tendencia: ((mesAtual.avaliacoesRealizadas - mesAnterior.avaliacoesRealizadas) / mesAnterior.avaliacoesRealizadas) * 100, 
        icone: 'fa:clipboard-check', 
        cor: 'success' 
      },
      { 
        label: 'Taxa de Adesão', 
        valor: stats.taxaAdesaoMedia, 
        tendencia: 2.3, 
        icone: 'fa:chart-line', 
        cor: 'info',
        sufixo: '%'
      },
      { 
        label: 'Alertas Abertos', 
        valor: stats.alertasAbertos, 
        tendencia: -15.0, 
        icone: 'fa:exclamation-triangle', 
        cor: 'warning' 
      },
    ]
  }, [])

  // Top empresas por adesão
  const empresasTop = useMemo(() => {
    return [...EMPRESAS_DEMO]
      .sort((a, b) => b.adesao - a.adesao)
      .slice(0, 5)
      .map((empresa, index) => ({
        id: empresa.id,
        nome: empresa.nomeCurto,
        participantes: empresa.participantes,
        progresso: empresa.adesao,
        satisfacao: 4 + (Math.random() * 0.8), // Simulated satisfaction
        phq9: empresa.phq9Medio,
        gad7: empresa.gad7Medio
      }))
  }, [])

  // Alertas recentes formatados
  const alertasRecentes = useMemo(() => {
    return ALERTAS_DEMO.map(alerta => {
      const empresa = EMPRESAS_DEMO.find(e => e.id === alerta.empresaId)
      const participante = PARTICIPANTES_DEMO.find(p => p.id === alerta.participanteId)
      
      return {
        id: alerta.id,
        tipo: alerta.tipo === 'risco_alto' ? 'risco' : 
              alerta.prioridade === 'critica' ? 'risco' :
              alerta.tipo === 'avaliacao_pendente' ? 'warning' : 'info',
        mensagem: alerta.mensagem,
        data: new Date(alerta.dataCriacao).toLocaleDateString('pt-BR'),
        empresa: empresa?.nomeCurto || 'N/A',
        participante: participante?.nome || 'N/A',
        status: alerta.status,
        prioridade: alerta.prioridade
      }
    })
  }, [])

  // Calcular distribuição por risco
  const distribuicaoRisco = useMemo(() => {
    const stats = ESTATISTICAS_GLOBAIS
    const total = stats.totalParticipantes
    return {
      alto: { valor: stats.participantesRiscoAlto, percentual: (stats.participantesRiscoAlto / total) * 100 },
      medio: { valor: stats.participantesRiscoMedio, percentual: (stats.participantesRiscoMedio / total) * 100 },
      baixo: { valor: stats.participantesRiscoBaixo, percentual: (stats.participantesRiscoBaixo / total) * 100 }
    }
  }, [])

  // Dados de evolução mensal para gráficos
  const dadosEvolucao = useMemo(() => {
    return EVOLUCAO_MENSAL.map(mes => ({
      mes: mes.mesNome.split('/')[0].substring(0, 3),
      phq9: mes.phq9Medio,
      gad7: mes.gad7Medio,
      bemEstar: mes.satisfacao * 20 // Converter satisfação 1-5 para 20-100
    }))
  }, [])

  // Calcular distribuição etária real
  const distribuicaoEtaria = useMemo(() => {
    const hoje = new Date()
    const calcularIdade = (dataNasc: string) => {
      const nasc = new Date(dataNasc)
      let idade = hoje.getFullYear() - nasc.getFullYear()
      const mes = hoje.getMonth() - nasc.getMonth()
      if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--
      return idade
    }

    const idades = PARTICIPANTES_DEMO.map(p => calcularIdade(p.dataNascimento))
    const jovens = idades.filter(i => i >= 18 && i <= 25).length
    const adultos = idades.filter(i => i >= 26 && i <= 40).length
    const maduros = idades.filter(i => i >= 41).length
    const total = PARTICIPANTES_DEMO.length

    return {
      jovens: { valor: jovens, percentual: Math.round((jovens / total) * 100) },
      adultos: { valor: adultos, percentual: Math.round((adultos / total) * 100) },
      maduros: { valor: maduros, percentual: Math.round((maduros / total) * 100) }
    }
  }, [])

  // Calcular distribuição por gênero
  const distribuicaoGenero = useMemo(() => {
    const total = PARTICIPANTES_DEMO.length
    const feminino = PARTICIPANTES_DEMO.filter(p => p.sexo === 'F').length
    const masculino = PARTICIPANTES_DEMO.filter(p => p.sexo === 'M').length
    
    return {
      feminino: Math.round((feminino / total) * 100),
      masculino: Math.round((masculino / total) * 100)
    }
  }, [])

  // Estatísticas dos programas
  const statsProgramas = useMemo(() => {
    return {
      total: PROGRAMAS_DEMO.length,
      participantes: PROGRAMAS_DEMO.reduce((acc, p) => acc + p.participantesAtivos, 0),
      avaliacao: (PROGRAMAS_DEMO.reduce((acc, p) => acc + p.avaliacaoMedia, 0) / PROGRAMAS_DEMO.length).toFixed(1),
      sessoes: PROGRAMAS_DEMO.reduce((acc, p) => acc + p.sessoesRealizadas, 0)
    }
  }, [])

  return (
    <>
      <PageTitle title="Dashboard Analytics" subName="Administração" />

      {/* Header com ações */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">Visão Geral do Programa</h5>
            <small className="text-muted">Dados atualizados em {new Date().toLocaleDateString('pt-BR')}</small>
          </div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="periodo-dropdown">
                <IconifyIcon icon="fa:calendar" className="me-1" />
                Período: Últimos 30 dias
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPeriodo('7d')}>Últimos 7 dias</Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodo('30d')}>Últimos 30 dias</Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodo('90d')}>Últimos 90 dias</Dropdown.Item>
                <Dropdown.Item onClick={() => setPeriodo('1y')}>Este ano</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Link href="/adm/relatorios/geral">
              <Button variant="primary">
                <IconifyIcon icon="fa:file-export" className="me-1" />
                Relatório Completo
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      {/* Cards de métricas */}
      <Row>
        {metricas.map((metrica, index) => (
          <Col xl={3} md={6} key={index}>
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted mb-1">{metrica.label}</h6>
                    <h3 className="mb-0">
                      {metrica.prefixo || ''}
                      {metrica.valor.toLocaleString()}
                      {metrica.sufixo || ''}
                    </h3>
                    <small className={`text-${metrica.tendencia >= 0 ? 'success' : 'danger'}`}>
                      <IconifyIcon icon={`fa:arrow-${metrica.tendencia >= 0 ? 'up' : 'down'}`} className="me-1" />
                      {Math.abs(metrica.tendencia).toFixed(1)}%
                    </small>
                  </div>
                  <div className={`bg-${metrica.cor} bg-opacity-10 p-2 rounded`}>
                    <IconifyIcon icon={metrica.icone} className={`text-${metrica.cor} fs-3`} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Gráficos e Alertas */}
      <Row>
        <Col xl={8}>
          <ComponentContainerCard title="Evolução dos Indicadores de Saúde Mental">
            <div className="mb-4">
              <h6 className="mb-3">PHQ-9 vs GAD-7 (Média Mensal)</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: '200px' }}>
                {dadosEvolucao.map((dado, i) => (
                  <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                    <div className="d-flex gap-1 w-100 justify-content-center" style={{ height: '150px' }}>
                      <div 
                        className="bg-danger rounded-top" 
                        style={{ 
                          width: '16px', 
                          height: `${(dado.phq9 / 20) * 100}%`,
                          opacity: 0.8 
                        }} 
                        title={`PHQ-9: ${dado.phq9.toFixed(1)}`}
                      />
                      <div 
                        className="bg-warning rounded-top" 
                        style={{ 
                          width: '16px', 
                          height: `${(dado.gad7 / 15) * 100}%`,
                          opacity: 0.8 
                        }} 
                        title={`GAD-7: ${dado.gad7.toFixed(1)}`}
                      />
                    </div>
                    <small className="text-muted mt-1">{dado.mes}</small>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center gap-4 mt-2">
                <div className="d-flex align-items-center">
                  <div className="bg-danger rounded me-2" style={{ width: '16px', height: '16px' }} />
                  <small>PHQ-9 (Depressão)</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded me-2" style={{ width: '16px', height: '16px' }} />
                  <small>GAD-7 (Ansiedade)</small>
                </div>
              </div>
              <div className="mt-3 text-center">
                <small className="text-muted">
                  Média atual: PHQ-9: <strong>{ESTATISTICAS_GLOBAIS.phq9MedioGlobal}</strong> | 
                  GAD-7: <strong>{ESTATISTICAS_GLOBAIS.gad7MedioGlobal}</strong>
                </small>
              </div>
            </div>

            <hr />

            <div>
              <h6 className="mb-3">Índice de Satisfação e Bem-estar</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: '150px' }}>
                {dadosEvolucao.map((dado, i) => (
                  <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                    <div 
                      className="bg-success rounded-top w-100" 
                      style={{ height: `${(dado.bemEstar / 100) * 100}%`, opacity: 0.8 }}
                      title={`Satisfação: ${(dado.bemEstar / 20).toFixed(1)}/5`}
                    />
                    <small className="text-muted mt-1">{dado.mes}</small>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <Badge bg="success" className="px-3 py-2">
                  Satisfação Geral: {ESTATISTICAS_GLOBAIS.satisfacaoGeral}/5.0
                </Badge>
              </div>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title="Alertas Recentes">
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {alertasRecentes.map((alerta, index) => (
                <div key={alerta.id} className="d-flex gap-3 mb-3 pb-3 border-bottom last-border-0">
                  <div className={`flex-shrink-0 mt-1`}>
                    <IconifyIcon 
                      icon={`fa:${alerta.tipo === 'risco' ? 'exclamation-circle' : alerta.tipo === 'warning' ? 'exclamation-triangle' : alerta.tipo === 'success' ? 'check-circle' : 'info-circle'}`}
                      className={`text-${alerta.tipo === 'risco' ? 'danger' : alerta.tipo}`}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1 small">{alerta.mensagem}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge 
                        bg={alerta.prioridade === 'critica' ? 'dark' : alerta.prioridade === 'alta' ? 'danger' : 'warning'}
                        className="small"
                      >
                        {alerta.empresa}
                      </Badge>
                      <small className="text-muted">{alerta.data}</small>
                    </div>
                    <small className={`text-${alerta.status === 'pendente' ? 'danger' : alerta.status === 'em_andamento' ? 'warning' : 'success'}`}>
                      {alerta.status === 'pendente' ? '● Pendente' : alerta.status === 'em_andamento' ? '● Em andamento' : '● Resolvido'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/adm/alertas">
              <Button variant="outline-primary" size="sm" className="w-100 mt-2">
                Ver todos os alertas
              </Button>
            </Link>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Distribuição de Risco e Top Empresas */}
      <Row className="mt-3">
        <Col xl={4}>
          <ComponentContainerCard title="Distribuição por Nível de Risco">
            <div className="text-center mb-4">
              <h3 className="mb-0">{ESTATISTICAS_GLOBAIS.totalParticipantes.toLocaleString()}</h3>
              <small className="text-muted">Participantes Ativos</small>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-danger fw-bold">Risco Alto</span>
                <span className="text-danger">{distribuicaoRisco.alto.valor.toLocaleString()} ({distribuicaoRisco.alto.percentual.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                now={distribuicaoRisco.alto.percentual} 
                variant="danger" 
                style={{ height: '20px' }}
              />
              <small className="text-muted">PHQ-9 ≥ 15 ou GAD-7 ≥ 15</small>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-warning fw-bold">Risco Médio</span>
                <span className="text-warning">{distribuicaoRisco.medio.valor.toLocaleString()} ({distribuicaoRisco.medio.percentual.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                now={distribuicaoRisco.medio.percentual} 
                variant="warning" 
                style={{ height: '20px' }}
              />
              <small className="text-muted">PHQ-9 10-14 ou GAD-7 10-14</small>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-success fw-bold">Risco Baixo</span>
                <span className="text-success">{distribuicaoRisco.baixo.valor.toLocaleString()} ({distribuicaoRisco.baixo.percentual.toFixed(1)}%)</span>
              </div>
              <ProgressBar 
                now={distribuicaoRisco.baixo.percentual} 
                variant="success" 
                style={{ height: '20px' }}
              />
              <small className="text-muted">PHQ-9 ≤ 9 e GAD-7 ≤ 9</small>
            </div>

            <hr />
            
            <div className="d-flex justify-content-between align-items-center">
              <span>ROI do Programa</span>
              <Badge bg="success" className="fs-6">{ESTATISTICAS_GLOBAIS.retornoInvestimento}x</Badge>
            </div>
            <small className="text-muted">
              Economia estimada: R$ {(ESTATISTICAS_GLOBAIS.economiaEstimada / 1000000).toFixed(2)}M
            </small>
          </ComponentContainerCard>
        </Col>

        <Col xl={8}>
          <ComponentContainerCard title="Top Empresas - Engajamento e Performance">
            <Table responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Empresa</th>
                  <th className="text-center">Participantes</th>
                  <th className="text-center">Adesão</th>
                  <th className="text-center">PHQ-9 Médio</th>
                  <th className="text-center">GAD-7 Médio</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {empresasTop.map((empresa, i) => (
                  <tr key={empresa.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">#{i + 1}</span>
                        <div>
                          <span className="fw-medium">{empresa.nome}</span>
                          <div className="small text-muted">
                            <IconifyIcon icon="fa:star" className="text-warning me-1" />
                            {empresa.satisfacao.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{empresa.participantes.toLocaleString()}</td>
                    <td className="text-center">
                      <Badge bg={empresa.progresso >= 80 ? 'success' : empresa.progresso >= 60 ? 'warning' : 'danger'}>
                        {empresa.progresso.toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={empresa.phq9 >= 15 ? 'danger' : empresa.phq9 >= 10 ? 'warning' : 'success'}>
                        {empresa.phq9.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={empresa.gad7 >= 15 ? 'danger' : empresa.gad7 >= 10 ? 'warning' : 'success'}>
                        {empresa.gad7.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <IconifyIcon icon="fa:circle-check" className="text-success fs-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="text-center mt-3">
              <Link href="/adm/lista-empresas">
                <Button variant="outline-primary" size="sm">
                  Ver todas as empresas
                </Button>
              </Link>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>

      {/* Demografia e Programas */}
      <Row className="mt-3">
        <Col xl={6}>
          <ComponentContainerCard title="Distribuição Demográfica">
            <Row>
              <Col md={6}>
                <h6 className="mb-3">Por Faixa Etária</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>18-25 anos</small>
                    <small className="fw-bold">{distribuicaoEtaria.jovens.percentual}%</small>
                  </div>
                  <ProgressBar now={distribuicaoEtaria.jovens.percentual} variant="info" style={{ height: '8px' }} />
                  <small className="text-muted">{distribuicaoEtaria.jovens.valor} participantes</small>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>26-40 anos</small>
                    <small className="fw-bold">{distribuicaoEtaria.adultos.percentual}%</small>
                  </div>
                  <ProgressBar now={distribuicaoEtaria.adultos.percentual} variant="success" style={{ height: '8px' }} />
                  <small className="text-muted">{distribuicaoEtaria.adultos.valor} participantes</small>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>41+ anos</small>
                    <small className="fw-bold">{distribuicaoEtaria.maduros.percentual}%</small>
                  </div>
                  <ProgressBar now={distribuicaoEtaria.maduros.percentual} variant="warning" style={{ height: '8px' }} />
                  <small className="text-muted">{distribuicaoEtaria.maduros.valor} participantes</small>
                </div>
              </Col>
              <Col md={6}>
                <h6 className="mb-3">Por Gênero</h6>
                <div className="text-center mb-3">
                  <div className="position-relative d-inline-block mb-2">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e9ecef" strokeWidth="12" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#0d6efd" strokeWidth="12" 
                        strokeDasharray={`${distribuicaoGenero.feminino * 2.51} ${100 * 2.51}`} 
                        strokeDashoffset="0" transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <h5 className="mb-0">{distribuicaoGenero.feminino}%</h5>
                      <small>Fem</small>
                    </div>
                  </div>
                  <p className="small mb-0">
                    <span className="badge bg-primary me-1">Feminino</span>
                    <span className="badge bg-info">Masculino {distribuicaoGenero.masculino}%</span>
                  </p>
                </div>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Col>

        <Col xl={6}>
          <ComponentContainerCard title="Programas Ativos">
            <Row>
              <Col xs={6} className="mb-3 text-center">
                <div className="bg-primary bg-opacity-10 rounded p-3">
                  <h3 className="text-primary mb-1">{statsProgramas.total}</h3>
                  <small className="text-muted">Programas Ativos</small>
                </div>
              </Col>
              <Col xs={6} className="mb-3 text-center">
                <div className="bg-success bg-opacity-10 rounded p-3">
                  <h3 className="text-success mb-1">{statsProgramas.participantes.toLocaleString()}</h3>
                  <small className="text-muted">Total Participantes</small>
                </div>
              </Col>
              <Col xs={6} className="text-center">
                <div className="bg-warning bg-opacity-10 rounded p-3">
                  <h3 className="text-warning mb-1">{statsProgramas.avaliacao}</h3>
                  <small className="text-muted">Avaliação Média</small>
                </div>
              </Col>
              <Col xs={6} className="text-center">
                <div className="bg-info bg-opacity-10 rounded p-3">
                  <h3 className="text-info mb-1">{statsProgramas.sessoes.toLocaleString()}</h3>
                  <small className="text-muted">Sessões Realizadas</small>
                </div>
              </Col>
            </Row>
            
            <hr />
            
            <h6 className="mb-3">Programas em Destaque</h6>
            {PROGRAMAS_DEMO.map(programa => (
              <div key={programa.id} className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <span className="fw-medium">{programa.nome}</span>
                  <small className="d-block text-muted">{programa.empresasParticipantes.length} empresas</small>
                </div>
                <Badge bg="primary">{programa.avaliacaoMedia.toFixed(1)} ★</Badge>
              </div>
            ))}
            
            <div className="text-center mt-3">
              <Link href="/adm/lista-programas">
                <Button variant="outline-primary" size="sm">
                  Gerenciar programas
                </Button>
              </Link>
            </div>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
