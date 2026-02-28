'use client'

import { useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Spinner, Table } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { demoDbService } from '@/services/demo-db.service'
import { saveSubmissaoQuestionario, getSubmissaoByQuestionario, normalizeRisco } from '@/utils/demo-participante'
import type { DemoIntegrityIssue } from '@/types/demo'

type SmokeStep = {
  id: string
  label: string
  status: 'pending' | 'ok' | 'fail'
  details?: string
}

const INITIAL_STEPS: SmokeStep[] = [
  { id: 'integrity', label: 'Integridade referencial dos dados seed', status: 'pending' },
  { id: 'create_empresa', label: 'Criacao de empresa no estado demo', status: 'pending' },
  { id: 'vinculo_programa', label: 'Vinculo da nova empresa a programa', status: 'pending' },
  { id: 'create_participante', label: 'Criacao de participante para a nova empresa', status: 'pending' },
  { id: 'submit_questionario', label: 'Submissao de questionario e atualizacao de risco', status: 'pending' },
  { id: 'persistencia', label: 'Persistencia no localStorage via demo-db.service', status: 'pending' },
]

export default function DemoFuncionalPage() {
  const {
    empresas,
    programas,
    participantes,
    questionarios,
    addEmpresa,
    vincularEmpresaPrograma,
    addParticipante,
    updateParticipante,
    resetDemoState,
    validateDemoState,
  } = useDemo()

  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<SmokeStep[]>(INITIAL_STEPS)
  const [issues, setIssues] = useState<DemoIntegrityIssue[]>([])
  const [summary, setSummary] = useState<string>('')

  const stepStats = useMemo(() => {
    const ok = steps.filter((step) => step.status === 'ok').length
    const fail = steps.filter((step) => step.status === 'fail').length
    return { ok, fail, total: steps.length }
  }, [steps])

  const setStep = (id: string, status: SmokeStep['status'], details?: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, status, details } : step))
    )
  }

  const handleReset = () => {
    resetDemoState()
    setIssues([])
    setSummary('Banco demo resetado para o seed JSON com sucesso.')
    setSteps(INITIAL_STEPS)
  }

  const runSmoke = async () => {
    setRunning(true)
    setSteps(INITIAL_STEPS)
    setIssues([])
    setSummary('')

    try {
      const localSteps = INITIAL_STEPS.map((item) => ({ ...item }))
      const updateLocalStep = (id: string, status: SmokeStep['status'], details?: string) => {
        const index = localSteps.findIndex((step) => step.id === id)
        if (index >= 0) {
          localSteps[index] = { ...localSteps[index], status, details }
        }
        setStep(id, status, details)
      }

      const integrityIssues = validateDemoState()
      setIssues(integrityIssues)

      if (integrityIssues.length === 0) {
        updateLocalStep('integrity', 'ok', 'Nenhuma quebra referencial encontrada.')
      } else {
        updateLocalStep('integrity', 'fail', `${integrityIssues.length} inconsistencias encontradas.`)
      }

      const empresasBefore = [...(empresas as any[])]
      const programasBefore = [...(programas as any[])]
      const participantesBefore = [...(participantes as any[])]

      addEmpresa({
        nome: 'Empresa Smoke Flow',
        nomeCurto: 'Smoke Flow',
        cnpj: '99.999.999/0001-99',
        cidade: 'Sao Paulo',
        estado: 'SP',
        email: 'smoke@empresa.local',
        telefone: '(11) 99999-9999',
        status: 'ativo',
      })

      const stateAfterEmpresa = demoDbService.getState()
      const novaEmpresa = [...stateAfterEmpresa.empresas].sort((a, b) => Number(b.id) - Number(a.id))[0]
      if (novaEmpresa && (stateAfterEmpresa.empresas.length === empresasBefore.length + 1)) {
        updateLocalStep('create_empresa', 'ok', `Empresa criada com id ${novaEmpresa.id}.`)
      } else {
        updateLocalStep('create_empresa', 'fail', 'Falha ao criar empresa no estado demo.')
      }

      const programaBase = programasBefore[0]
      if (programaBase && novaEmpresa) {
        vincularEmpresaPrograma(Number(programaBase.id), Number(novaEmpresa.id))
        const stateAfterVinculo = demoDbService.getState()
        const programaAtualizado = stateAfterVinculo.programas.find((item) => Number(item.id) === Number(programaBase.id)) as any
        const vinculado = (programaAtualizado?.empresasVinculadas || []).some((v: any) => Number(v.empresaId) === Number(novaEmpresa.id))
        updateLocalStep('vinculo_programa', vinculado ? 'ok' : 'fail', vinculado ? 'Empresa vinculada ao programa.' : 'Vinculo nao foi persistido.')
      } else {
        updateLocalStep('vinculo_programa', 'fail', 'Nao foi possivel obter programa base para vinculo.')
      }

      if (novaEmpresa) {
        addParticipante({
          empresaId: Number(novaEmpresa.id),
          nome: 'Participante Smoke',
          email: 'participante.smoke@demo.local',
          cpf: '000.111.222-33',
          cargo: 'Analista',
          departamento: 'Operacoes',
          dataNascimento: '1990-01-01',
          status: 'ativo',
          riscoSaude: 'baixo',
          phq9Score: 0,
          gad7Score: 0,
          alertasPendentes: 0,
        })
      }

      const stateAfterParticipante = demoDbService.getState()
      const novoParticipante = [...stateAfterParticipante.participantes].sort((a, b) => Number(b.id) - Number(a.id))[0] as any
      if (novoParticipante && stateAfterParticipante.participantes.length === participantesBefore.length + 1) {
        updateLocalStep('create_participante', 'ok', `Participante criado com id ${novoParticipante.id}.`)
      } else {
        updateLocalStep('create_participante', 'fail', 'Falha ao criar participante no estado demo.')
      }

      const questionarioBase = (questionarios as any[])[0]
      if (novoParticipante && questionarioBase) {
        const participanteKey = String(novoParticipante.email || `participante:${novoParticipante.id}`).toLowerCase()
        const respostas = [
          { perguntaId: 1, pergunta: 'Pergunta 1', resposta: 'Alguns dias', valor: 1 },
          { perguntaId: 2, pergunta: 'Pergunta 2', resposta: 'Mais da metade dos dias', valor: 2 },
          { perguntaId: 3, pergunta: 'Pergunta 3', resposta: 'Quase todos os dias', valor: 3 },
        ]
        const score = respostas.reduce((acc, item) => acc + Number(item.valor), 0)

        saveSubmissaoQuestionario({
          participanteKey,
          participanteId: Number(novoParticipante.id),
          questionarioId: Number(questionarioBase.id),
          score,
          respostas,
          submittedAt: new Date().toISOString(),
        })

        updateParticipante(Number(novoParticipante.id), {
          phq9Score: score,
          gad7Score: 0,
          riscoSaude: normalizeRisco(score, 0),
          ultimaAvaliacao: new Date().toISOString().split('T')[0],
        })

        const submissao = getSubmissaoByQuestionario(participanteKey, Number(questionarioBase.id))
        const stateAfterResposta = demoDbService.getState()
        const participanteAtualizado = stateAfterResposta.participantes.find((item) => Number(item.id) === Number(novoParticipante.id)) as any

        const ok = !!submissao && Number(participanteAtualizado?.phq9Score || -1) === score
        updateLocalStep('submit_questionario', ok ? 'ok' : 'fail', ok ? `Submissao registrada com score ${score}.` : 'Submissao/atualizacao nao refletiu no estado.')
      } else {
        updateLocalStep('submit_questionario', 'fail', 'Nao foi possivel executar submissao de questionario.')
      }

      const persisted = demoDbService.getState()
      const persistedEmpresa = persisted.empresas.some((item) => String(item.nome) === 'Empresa Smoke Flow')
      const persistedParticipante = persisted.participantes.some((item) => String(item.email || '').toLowerCase() === 'participante.smoke@demo.local')
      const persistenceOk = persistedEmpresa && persistedParticipante
      updateLocalStep('persistencia', persistenceOk ? 'ok' : 'fail', persistenceOk ? 'Dados salvos em localStorage com sucesso.' : 'Dados nao encontrados no estado persistido.')

      const finalFails = localSteps.filter((step) => step.status === 'fail').map((step) => step.id)
      setSummary(finalFails.length === 0 ? 'Smoke test executado com sucesso.' : 'Smoke test finalizado com falhas. Revise os passos marcados em vermelho.')
    } catch (error) {
      setSummary(error instanceof Error ? error.message : 'Erro inesperado ao executar smoke test.')
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <PageTitle title='Smoke Test Demo' subName='Validacao End-to-End' />

      <Alert variant='info' className='mb-4'>
        <div className='d-flex align-items-center'>
          <IconifyIcon icon='iconoir:warning-circle' className='me-2 fs-4' />
          Esta tela valida o fluxo critico da demo usando o banco JSON central e estado persistido em localStorage.
        </div>
      </Alert>

      <Row className='g-3 mb-3'>
        <Col md={4}>
          <Card>
            <Card.Body>
              <small className='text-muted d-block'>Checks OK</small>
              <h3 className='mb-0 text-success'>{stepStats.ok}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <small className='text-muted d-block'>Checks com falha</small>
              <h3 className='mb-0 text-danger'>{stepStats.fail}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <small className='text-muted d-block'>Total de checks</small>
              <h3 className='mb-0'>{stepStats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className='mb-3'>
        <Card.Body className='d-flex gap-2 flex-wrap'>
          <Button variant='primary' onClick={runSmoke} disabled={running}>
            {running ? <Spinner size='sm' className='me-2' /> : <IconifyIcon icon='iconoir:play-solid' className='me-2' />}
            Executar smoke completo
          </Button>
          <Button variant='outline-danger' onClick={handleReset} disabled={running}>
            <IconifyIcon icon='iconoir:refresh' className='me-2' />
            Resetar banco demo
          </Button>
        </Card.Body>
      </Card>

      <Card className='mb-3'>
        <Card.Header>
          <h5 className='mb-0'>Resultado dos checks</h5>
        </Card.Header>
        <Card.Body className='p-0'>
          <Table responsive hover className='mb-0'>
            <thead className='table-light'>
              <tr>
                <th>Check</th>
                <th style={{ width: '140px' }}>Status</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step.id}>
                  <td>{step.label}</td>
                  <td>
                    {step.status === 'ok' && <Badge bg='success'>OK</Badge>}
                    {step.status === 'fail' && <Badge bg='danger'>FAIL</Badge>}
                    {step.status === 'pending' && <Badge bg='secondary'>PENDING</Badge>}
                  </td>
                  <td>{step.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {issues.length > 0 && (
        <Card className='mb-3 border-danger'>
          <Card.Header className='bg-danger-subtle'>
            <h6 className='mb-0 text-danger'>Inconsistencias de integridade</h6>
          </Card.Header>
          <Card.Body>
            {issues.map((issue) => (
              <div key={`${issue.code}-${issue.entity}-${issue.id}`} className='small text-danger mb-1'>
                [{issue.code}] {issue.message}
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {summary && (
        <Alert variant={stepStats.fail > 0 ? 'danger' : 'success'}>
          {summary}
        </Alert>
      )}
    </>
  )
}
