'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, ListGroup, Row, Tab, Table, Tabs } from 'react-bootstrap'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useQuestionarios } from '@/hooks/api/useQuestionarios'
import { useAtualizarPrograma, usePrograma } from '@/hooks/api/useProgramas'
import { isDemoMode } from '@/utils/env'

type Intervalo = {
  id: number
  nome: string
  dias: number
  cor: string
}

export default function EditarProgramaPage() {
  const params = useParams()
  const programaId = Number(params.id as string)
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const { programas, questionarios, updatePrograma } = useDemo()
  const { mutateAsync: atualizarPrograma, loading: salvando } = useAtualizarPrograma()
  const {
    data: programaApi,
    loading: loadingProgramaApi,
    error: errorProgramaApi,
  } = usePrograma(!demoMode && Number.isFinite(programaId) ? programaId : null)
  const { data: questionariosApiData } = useQuestionarios({ perPage: 200 })

  const programa = useMemo(
    () => (demoMode ? programas.find((p: any) => Number(p.id) === Number(programaId)) : (programaApi as any)),
    [demoMode, programas, programaApi, programaId]
  )

  const [activeTab, setActiveTab] = useState('dados')
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('ativo')
  const [questionariosSelecionados, setQuestionariosSelecionados] = useState<number[]>([])
  const [intervalos, setIntervalos] = useState<Intervalo[]>([])

  useEffect(() => {
    if (!programa) return

    setNome(programa.nome || '')
    setDescricao(programa.descricao || programa.introducao || '')
    setStatus(programa.status || 'ativo')

    const vinculados = ((programa as any).questionariosVinculados || [])
      .slice()
      .sort((a: any, b: any) => a.ordem - b.ordem)
      .map((v: any) => v.questionarioId)

    setQuestionariosSelecionados(vinculados)
    setIntervalos((programa as any).intervalos || [])
  }, [programa])

  const questionariosDisponiveis = useMemo(() => {
    if (demoMode) {
      return questionarios.filter((q: any) => q.status === 'ativo')
    }

    const listaApi = questionariosApiData?.data || []
    return listaApi.filter((q: any) => String(q.status || 'ativo') === 'ativo')
  }, [demoMode, questionarios, questionariosApiData])

  const toggleQuestionario = (id: number) => {
    setQuestionariosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    )
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newOrder = [...questionariosSelecionados]
    ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
    setQuestionariosSelecionados(newOrder)
  }

  const moveDown = (index: number) => {
    if (index === questionariosSelecionados.length - 1) return
    const newOrder = [...questionariosSelecionados]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    setQuestionariosSelecionados(newOrder)
  }

  const adicionarIntervalo = () => {
    setIntervalos((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome: 'Novo intervalo',
        dias: 30,
        cor: '#6c757d',
      },
    ])
  }

  const removerIntervalo = (id: number) => {
    setIntervalos((prev) => prev.filter((i) => i.id !== id))
  }

  const atualizarIntervalo = (id: number, campo: keyof Intervalo, valor: string | number) => {
    setIntervalos((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)))
  }

  const getQuestionarioById = (id: number) =>
    questionariosDisponiveis.find((q: any) => Number(q.id) === Number(id))

  const handleSalvar = async () => {
    if (!programa) return

    const payload = {
      nome,
      descricao,
      status,
      questionariosVinculados: questionariosSelecionados.map((questionarioId, index) => ({
        id: Date.now() + index,
        questionarioId,
        ordem: index + 1,
        obrigatorio: true,
        permiteReavaliacao: false,
        intervaloDias: 0,
      })),
      intervalos,
    }

    try {
      if (demoMode) {
        updatePrograma(programaId, payload)
      } else {
        await atualizarPrograma({
          id: programaId,
          data: {
            nome,
            introducao: descricao,
            questionarios: questionariosSelecionados,
            ordenacao_questionarios: questionariosSelecionados.join(','),
          },
        })
      }

      showNotification({ message: 'Programa atualizado com sucesso!', variant: 'success' })
    } catch {
      showNotification({ message: 'Erro ao atualizar programa. Tente novamente.', variant: 'danger' })
    }
  }

  if (!demoMode && loadingProgramaApi) {
    return (
      <>
        <PageTitle title='Editar Programa' subName='Programas' />
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '220px' }}>
          <div className='spinner-border text-primary' role='status' />
        </div>
      </>
    )
  }

  if (!programa) {
    return (
      <>
        <PageTitle title='Editar Programa' subName='Programas' />
        <Alert variant='warning'>{errorProgramaApi?.message || 'Programa nao encontrado.'}</Alert>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Editar Programa' subName={`ID: ${programaId}`} />

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dados')} className='mb-3'>
        <Tab eventKey='dados' title='Dados'>
          <ComponentContainerCard title='Informacoes do Programa'>
            <Row>
              <Col md={8}>
                <Form>
                  <Row>
                    <Col md={12} className='mb-3'>
                      <Form.Label>Nome do Programa</Form.Label>
                      <Form.Control type='text' value={nome} onChange={(e) => setNome(e.target.value)} />
                    </Col>
                    <Col md={12} className='mb-3'>
                      <Form.Label>Descricao</Form.Label>
                      <Form.Control as='textarea' rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    </Col>
                    <Col md={6} className='mb-3'>
                      <Form.Label>Status</Form.Label>
                      <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value='ativo'>Ativo</option>
                        <option value='inativo'>Inativo</option>
                        <option value='pausado'>Pausado</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Form>
              </Col>

              <Col md={4}>
                <Card className='bg-light'>
                  <Card.Body>
                    <h6>Estatisticas</h6>
                    <div className='mb-2'><small className='text-muted'>Empresas:</small><div className='fw-bold'>{programa.empresasParticipantes?.length || 0}</div></div>
                    <div className='mb-2'><small className='text-muted'>Participantes:</small><div className='fw-bold'>{programa.participantesAtivos || 0}</div></div>
                    <div className='mb-2'><small className='text-muted'>Questionarios:</small><div className='fw-bold'>{questionariosSelecionados.length}</div></div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey='questionarios' title='Questionarios'>
          <ComponentContainerCard title='Gerenciar Questionarios'>
            <div className='d-flex justify-content-end mb-3'>
              <Link href={`/adm/vincular-questionarios/${programaId}`} className='btn btn-primary'>
                <IconifyIcon icon='iconoir:link' className='me-1' />
                Vincular Avancado
              </Link>
            </div>
            <Row>
              <Col md={6}>
                <ListGroup style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {questionariosDisponiveis.map((q: any) => (
                    <ListGroup.Item
                      key={q.id}
                      action
                      active={questionariosSelecionados.includes(q.id)}
                      onClick={() => toggleQuestionario(q.id)}
                      className='d-flex justify-content-between align-items-center'
                    >
                      <div>
                        <div className='fw-medium'>{(q as any).codigo || (q as any).titulo || (q as any).nome}</div>
                        <small className='text-muted'>{(q as any).tipo || (q as any).categoria || '-'}</small>
                      </div>
                      {questionariosSelecionados.includes(q.id) && <IconifyIcon icon='iconoir:check' className='text-success' />}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {questionariosSelecionados.length === 0 && (
                    <ListGroup.Item className='text-center text-muted py-4'>Nenhum questionario selecionado</ListGroup.Item>
                  )}
                  {questionariosSelecionados.map((id, index) => {
                    const q = getQuestionarioById(id)
                    return (
                      <ListGroup.Item key={id} className='d-flex align-items-center'>
                        <Badge bg='secondary' className='me-2'>{index + 1}</Badge>
                        <div className='flex-grow-1'>
                          <div className='fw-medium'>{(q as any)?.codigo || (q as any)?.titulo || (q as any)?.nome}</div>
                          <small className='text-muted'>{(q as any)?.tipo || (q as any)?.categoria || '-'}</small>
                        </div>
                        <div className='btn-group btn-group-sm'>
                          <Button variant='outline-secondary' onClick={() => moveUp(index)} disabled={index === 0}>
                            <IconifyIcon icon='iconoir:nav-arrow-up' />
                          </Button>
                          <Button variant='outline-secondary' onClick={() => moveDown(index)} disabled={index === questionariosSelecionados.length - 1}>
                            <IconifyIcon icon='iconoir:nav-arrow-down' />
                          </Button>
                          <Button variant='outline-danger' onClick={() => toggleQuestionario(id)}>
                            <IconifyIcon icon='iconoir:trash' />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    )
                  })}
                </ListGroup>
              </Col>
            </Row>
          </ComponentContainerCard>
        </Tab>

        <Tab eventKey='intervalos' title='Intervalos'>
          <ComponentContainerCard title='Configuracao de Intervalos'>
            <Table responsive className='mb-3'>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Dias</th>
                  <th>Cor</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {intervalos.map((intervalo) => (
                  <tr key={intervalo.id}>
                    <td>
                      <Form.Control type='text' size='sm' value={intervalo.nome} onChange={(e) => atualizarIntervalo(intervalo.id, 'nome', e.target.value)} />
                    </td>
                    <td>
                      <Form.Control type='number' size='sm' value={intervalo.dias} onChange={(e) => atualizarIntervalo(intervalo.id, 'dias', parseInt(e.target.value || '0'))} />
                    </td>
                    <td>
                      <Form.Control type='color' size='sm' value={intervalo.cor} onChange={(e) => atualizarIntervalo(intervalo.id, 'cor', e.target.value)} />
                    </td>
                    <td>
                      <Button variant='outline-danger' size='sm' onClick={() => removerIntervalo(intervalo.id)}>
                        <IconifyIcon icon='iconoir:trash' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button variant='outline-primary' size='sm' onClick={adicionarIntervalo}>
              <IconifyIcon icon='iconoir:plus' className='me-1' />
              Adicionar Intervalo
            </Button>
          </ComponentContainerCard>
        </Tab>
      </Tabs>

      <div className='d-flex justify-content-between'>
        <Link href='/adm/lista-programas' className='btn btn-secondary'>Voltar</Link>
        <Button variant='primary' onClick={handleSalvar} disabled={salvando}>
          <IconifyIcon icon='iconoir:check' className='me-1' />
          Salvar Alteracoes
        </Button>
      </div>
    </>
  )
}
