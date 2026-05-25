'use client'

import { useMemo, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useCriarPrograma } from '@/hooks/api/useProgramas'
import { isDemoMode } from '@/utils/env'

export default function AdicionarProgramaPage() {
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const { questionarios, addPrograma } = useDemo()
  const { mutateAsync: criarPrograma, loading: salvando } = useCriarPrograma()

  const [nome, setNome] = useState('')
  const [introducao, setIntroducao] = useState('')
  const [questionariosSelecionados, setQuestionariosSelecionados] = useState<number[]>([])

  const questionariosDisponiveis = useMemo(() => {
    return questionarios.filter((q: any) => q.status === 'ativo')
  }, [questionarios])

  const toggleQuestionario = (id: number) => {
    setQuestionariosSelecionados(prev => prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id])
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

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      showNotification({ message: 'Informe o nome do programa.', variant: 'warning' })
      return
    }

    try {
      if (demoMode) {
        addPrograma({
          nome,
          descricao: introducao,
          status: 'ativo',
          duracaoMeses: 12,
          dataInicio: new Date().toISOString().split('T')[0],
          dataFim: '',
          empresasParticipantes: [],
          participantesTotal: 0,
          participantesAtivos: 0,
          custoPorParticipante: 0,
          avaliacaoMedia: 0,
          sessoesRealizadas: 0,
          consultasRealizadas: 0,
          questionariosVinculados: questionariosSelecionados.map((questionarioId, index) => ({
            id: Date.now() + index,
            questionarioId,
            ordem: index + 1,
            obrigatorio: true,
            permiteReavaliacao: false,
            intervaloDias: 0,
          })),
        })
      } else {
        await criarPrograma({
          nome,
          introducao,
          questionarios: questionariosSelecionados,
          ordenacao_questionarios: questionariosSelecionados.join(','),
        })
      }

      showNotification({ message: 'Programa criado com sucesso!', variant: 'success' })
      router.push('/adm/lista-programas')
    } catch {
      showNotification({ message: 'Erro ao criar programa. Tente novamente.', variant: 'danger' })
    }
  }

  const getQuestionarioById = (id: number) => questionariosDisponiveis.find((q: any) => q.id === id)

  return (
    <>
      <PageTitle title='Adicionar Programa' subName='Criar novo programa' />

      <Row>
        <Col xl={8}>
          <ComponentContainerCard title='Dados do Programa'>
            <Form onSubmit={handleSalvar}>
              <Row>
                <Col md={12} className='mb-3'>
                  <Form.Label>Nome do Programa <span className='text-danger'>*</span></Form.Label>
                  <Form.Control
                    type='text'
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder='Ex: Programa de Bem-estar 2026'
                    required
                  />
                </Col>
                <Col md={12} className='mb-3'>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    value={introducao}
                    onChange={(e) => setIntroducao(e.target.value)}
                    placeholder='Descreva os objetivos do programa...'
                  />
                </Col>
              </Row>

              <hr className='my-4' />
              <h5 className='mb-3'>Questionários do Programa</h5>

              <Row>
                <Col md={6}>
                  <Card className='mb-3'>
                    <Card.Header className='bg-light'>
                      <strong>Questionários Disponíveis</strong>
                    </Card.Header>
                    <ListGroup variant='flush' style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {questionariosDisponiveis.map((q: any) => (
                        <ListGroup.Item
                          key={q.id}
                          action
                          active={questionariosSelecionados.includes(q.id)}
                          onClick={() => toggleQuestionario(q.id)}
                          className='d-flex justify-content-between align-items-center'
                        >
                          <div>
                            <div className='fw-medium'>{q.codigo} - {q.nome}</div>
                            <small className='text-muted'>{q.tipo}</small>
                          </div>
                          {questionariosSelecionados.includes(q.id) && (
                            <IconifyIcon icon='iconoir:check' className='text-success' />
                          )}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <Card.Header className='bg-light'>
                      <strong>Ordem de Aplicação</strong>
                      <small className='d-block text-muted'>{questionariosSelecionados.length} selecionado(s)</small>
                    </Card.Header>
                    <ListGroup variant='flush' style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {questionariosSelecionados.length === 0 && (
                        <ListGroup.Item className='text-muted text-center py-4'>Selecione questionários</ListGroup.Item>
                      )}
                      {questionariosSelecionados.map((id, index) => {
                        const q = getQuestionarioById(id)
                        return (
                          <ListGroup.Item key={id} className='d-flex align-items-center'>
                            <Badge bg='secondary' className='me-2'>{index + 1}</Badge>
                            <div className='flex-grow-1'>
                              <div className='fw-medium'>{q?.codigo} - {q?.nome}</div>
                              <small className='text-muted'>{q?.tipo}</small>
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
                  </Card>
                </Col>
              </Row>

              <div className='d-flex justify-content-end gap-2 mt-4'>
                <Link href='/adm/lista-programas' className='btn btn-secondary'>Cancelar</Link>
                <Button type='submit' variant='primary' disabled={salvando}>
                  <IconifyIcon icon='iconoir:check' className='me-1' />
                  Criar Programa
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>

        <Col xl={4}>
          <ComponentContainerCard title='Resumo'>
            <div className='mb-3'>
              <label className='text-muted small'>Nome</label>
              <p className='mb-1 fw-medium'>{nome || '-'}</p>
            </div>
            <div className='mb-3'>
              <label className='text-muted small'>Questionários</label>
              <p className='mb-1 fw-medium'>{questionariosSelecionados.length} selecionados</p>
            </div>
            <Alert variant='info' className='mb-0'>
              <IconifyIcon icon='iconoir:info-circle' className='me-2' />
              Os questionários serão aplicados na ordem definida.
            </Alert>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
