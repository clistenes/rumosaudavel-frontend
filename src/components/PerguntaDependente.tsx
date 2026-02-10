'use client'

import { useState } from 'react'
import { Form, Row, Col, Badge, Button } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Pergunta {
  id: number
  nome: string
  tipo: string
}

interface PerguntaDependenteProps {
  perguntaId?: number
  perguntasDisponiveis?: Pergunta[]
}

const perguntasDemo: Pergunta[] = [
  { id: 1, nome: 'Você trabalha no setor administrativo?', tipo: 'sn' },
  { id: 2, nome: 'Você tem mais de 5 anos de empresa?', tipo: 'sn' },
  { id: 3, nome: 'Você já participou de treinamentos?', tipo: 'sn' },
]

export default function PerguntaDependente({ 
  perguntaId, 
  perguntasDisponiveis 
}: PerguntaDependenteProps) {
  const [isDependente, setIsDependente] = useState(false)
  const [perguntaMae, setPerguntaMae] = useState<number | ''>('')
  const [respostaEsperada, setRespostaEsperada] = useState('sim')
  const [tipoDependencia, setTipoDependencia] = useState('mostrar')

  const perguntas = perguntasDisponiveis || perguntasDemo

  return (
    <div className="border rounded p-3 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <IconifyIcon icon="iconoir:tree-structure" className="me-2" />
          Pergunta Dependente
        </h6>
        <Form.Check
          type="switch"
          id="pergunta-dependente-switch"
          label="Ativar"
          checked={isDependente}
          onChange={(e) => setIsDependente(e.target.checked)}
        />
      </div>

      {isDependente && (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Pergunta Pai</Form.Label>
                <Form.Select
                  value={perguntaMae}
                  onChange={(e) => setPerguntaMae(Number(e.target.value))}
                >
                  <option value="">Selecione uma pergunta...</option>
                  {perguntas
                    .filter(p => p.id !== perguntaId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Resposta Esperada</Form.Label>
                <Form.Select
                  value={respostaEsperada}
                  onChange={(e) => setRespostaEsperada(e.target.value)}
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tipo de Dependência</Form.Label>
                <Form.Select
                  value={tipoDependencia}
                  onChange={(e) => setTipoDependencia(e.target.value)}
                >
                  <option value="mostrar">Mostrar quando resposta for</option>
                  <option value="esconder">Esconder quando resposta for</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {perguntaMae && (
            <div className="alert alert-info">
              <strong>Lógica:</strong>{' '}
              Esta pergunta será{' '}
              <Badge bg={tipoDependencia === 'mostrar' ? 'success' : 'danger'}>
                {tipoDependencia === 'mostrar' ? 'MOSTRADA' : 'ESCONDIDA'}
              </Badge>{' '}
              quando a pergunta "
              {perguntas.find(p => p.id === perguntaMae)?.nome}" 
              tiver resposta "
              {respostaEsperada === 'sim' ? 'Sim' : 'Não'}"
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="outline-secondary" size="sm" className="me-2">
              <IconifyIcon icon="iconoir:cancel" className="me-1" />
              Cancelar
            </Button>
            <Button variant="primary" size="sm">
              <IconifyIcon icon="iconoir:check" className="me-1" />
              Salvar Dependência
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
