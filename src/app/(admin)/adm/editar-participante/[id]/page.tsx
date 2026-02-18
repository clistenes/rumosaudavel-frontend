'use client'

import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function EditarParticipantePage() {
  const params = useParams()
  const router = useRouter()
  const { showNotification } = useNotificationContext()
  const { participantes, empresas, updateParticipante, deleteParticipante } = useDemo()

  const participanteId = Number(params.id)
  const participante = useMemo(
    () => participantes.find((item: any) => item.id === participanteId),
    [participantes, participanteId]
  )

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cargo, setCargo] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo')
  const [riscoSaude, setRiscoSaude] = useState<'baixo' | 'medio' | 'alto'>('baixo')
  const [phq9Score, setPhq9Score] = useState(0)
  const [gad7Score, setGad7Score] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (!participante) return
    setNome(participante.nome || '')
    setEmail(participante.email || '')
    setCpf(participante.cpf || '')
    setTelefone(participante.telefone || '')
    setCargo(participante.cargo || '')
    setDepartamento(participante.departamento || '')
    setEmpresaId(String(participante.empresaId || ''))
    setStatus((participante.status || 'ativo') as 'ativo' | 'inativo')
    setRiscoSaude((participante.riscoSaude || 'baixo') as 'baixo' | 'medio' | 'alto')
    setPhq9Score(Number(participante.phq9Score || 0))
    setGad7Score(Number(participante.gad7Score || 0))
  }, [participante])

  const handleSalvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!nome.trim() || !email.trim() || !empresaId) {
      showNotification({ message: 'Preencha nome, email e empresa.', variant: 'warning' })
      return
    }

    updateParticipante(participanteId, {
      nome: nome.trim(),
      email: email.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      cargo: cargo.trim(),
      departamento: departamento.trim(),
      empresaId: Number(empresaId),
      status,
      riscoSaude,
      phq9Score,
      gad7Score,
      ultimaAvaliacao: new Date().toISOString().split('T')[0],
    })

    showNotification({ message: 'Participante atualizado com sucesso.', variant: 'success' })
    router.push('/adm/lista-participantes')
  }

  const handleExcluir = () => {
    deleteParticipante(participanteId)
    showNotification({ message: 'Participante excluido com sucesso.', variant: 'success' })
    router.push('/adm/lista-participantes')
  }

  if (!participante) {
    return (
      <>
        <PageTitle title='Editar Participante' subName='Administracao' />
        <Alert variant='warning'>Participante nao encontrado.</Alert>
      </>
    )
  }

  return (
    <>
      <PageTitle title='Editar Participante' subName='Administracao' />

      <Card>
        <Card.Body>
          <Form onSubmit={handleSalvar}>
            <Row>
              <Col md={6} className='mb-3'>
                <Form.Label>Nome</Form.Label>
                <Form.Control value={nome} onChange={(event) => setNome(event.target.value)} required />
              </Col>
              <Col md={6} className='mb-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' value={email} onChange={(event) => setEmail(event.target.value)} required />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>CPF</Form.Label>
                <Form.Control value={cpf} onChange={(event) => setCpf(event.target.value)} />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Telefone</Form.Label>
                <Form.Control value={telefone} onChange={(event) => setTelefone(event.target.value)} />
              </Col>
              <Col md={4} className='mb-3'>
                <Form.Label>Empresa</Form.Label>
                <Form.Select value={empresaId} onChange={(event) => setEmpresaId(event.target.value)} required>
                  <option value=''>Selecione</option>
                  {empresas.map((empresa: any) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nomeCurto || empresa.nome}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className='mb-3'>
                <Form.Label>Cargo</Form.Label>
                <Form.Control value={cargo} onChange={(event) => setCargo(event.target.value)} />
              </Col>
              <Col md={6} className='mb-3'>
                <Form.Label>Departamento</Form.Label>
                <Form.Control value={departamento} onChange={(event) => setDepartamento(event.target.value)} />
              </Col>
              <Col md={3} className='mb-3'>
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(event) => setStatus(event.target.value as 'ativo' | 'inativo')}>
                  <option value='ativo'>Ativo</option>
                  <option value='inativo'>Inativo</option>
                </Form.Select>
              </Col>
              <Col md={3} className='mb-3'>
                <Form.Label>Risco</Form.Label>
                <Form.Select value={riscoSaude} onChange={(event) => setRiscoSaude(event.target.value as 'baixo' | 'medio' | 'alto')}>
                  <option value='baixo'>Baixo</option>
                  <option value='medio'>Medio</option>
                  <option value='alto'>Alto</option>
                </Form.Select>
              </Col>
              <Col md={3} className='mb-3'>
                <Form.Label>PHQ-9</Form.Label>
                <Form.Control type='number' min={0} max={27} value={phq9Score} onChange={(event) => setPhq9Score(Number(event.target.value) || 0)} />
              </Col>
              <Col md={3} className='mb-3'>
                <Form.Label>GAD-7</Form.Label>
                <Form.Control type='number' min={0} max={21} value={gad7Score} onChange={(event) => setGad7Score(Number(event.target.value) || 0)} />
              </Col>
            </Row>

            <div className='d-flex justify-content-between mt-3'>
              <Button variant='outline-danger' onClick={() => setShowDelete(true)}>
                <IconifyIcon icon='iconoir:trash' className='me-2' />
                Excluir
              </Button>
              <div className='d-flex gap-2'>
                <Button type='button' variant='secondary' onClick={() => router.push('/adm/lista-participantes')}>
                  Cancelar
                </Button>
                <Button type='submit' variant='primary'>
                  <IconifyIcon icon='iconoir:check' className='me-2' />
                  Salvar
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {showDelete && (
        <Card className='mt-3 border-danger'>
          <Card.Body>
            <p className='mb-3'>Deseja realmente excluir este participante?</p>
            <div className='d-flex gap-2'>
              <Button variant='secondary' onClick={() => setShowDelete(false)}>Cancelar</Button>
              <Button variant='danger' onClick={handleExcluir}>Confirmar Exclusao</Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  )
}
