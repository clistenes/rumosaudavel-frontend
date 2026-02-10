'use client'

import { useState } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Campo {
  id: string
  nome: string
  tipo: 'text' | 'email' | 'tel' | 'select' | 'radio' | 'date'
  obrigatorio: boolean
  opcoes?: string[]
}

const camposPadrao: Campo[] = [
  { id: 'nome', nome: 'Nome Completo', tipo: 'text', obrigatorio: true },
  { id: 'email', nome: 'Email', tipo: 'email', obrigatorio: true },
  { id: 'celular', nome: 'Celular', tipo: 'tel', obrigatorio: true },
  { id: 'faixa_etaria', nome: 'Faixa Etária', tipo: 'select', obrigatorio: true, opcoes: ['18-25', '26-35', '36-45', '46-55', '55+'] },
  { id: 'sexo', nome: 'Sexo', tipo: 'radio', obrigatorio: true, opcoes: ['Masculino', 'Feminino', 'Prefiro não informar'] },
  { id: 'estado_civil', nome: 'Estado Civil', tipo: 'select', obrigatorio: false, opcoes: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'] },
]

export default function CadastroParticipante() {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [salvo, setSalvo] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const handleChange = (campoId: string, value: string) => {
    setFormData(prev => ({ ...prev, [campoId]: value }))
    if (errors[campoId]) {
      setErrors(prev => ({ ...prev, [campoId]: false }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}
    camposPadrao.forEach(campo => {
      if (campo.obrigatorio && !formData[campo.id]) {
        newErrors[campo.id] = true
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Dados do cadastro:', formData)
      setSalvo(true)
      setTimeout(() => setSalvo(false), 3000)
    }
  }

  const renderCampo = (campo: Campo) => {
    const hasError = errors[campo.id]

    switch (campo.tipo) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Form.Control
            type={campo.tipo}
            value={formData[campo.id] || ''}
            onChange={(e) => handleChange(campo.id, e.target.value)}
            isInvalid={hasError}
            placeholder={`Digite seu ${campo.nome.toLowerCase()}`}
          />
        )
      
      case 'select':
        return (
          <Form.Select
            value={formData[campo.id] || ''}
            onChange={(e) => handleChange(campo.id, e.target.value)}
            isInvalid={hasError}
          >
            <option value="">Selecione...</option>
            {campo.opcoes?.map(opcao => (
              <option key={opcao} value={opcao}>{opcao}</option>
            ))}
          </Form.Select>
        )
      
      case 'radio':
        return (
          <div>
            {campo.opcoes?.map(opcao => (
              <Form.Check
                key={opcao}
                type="radio"
                name={campo.id}
                label={opcao}
                checked={formData[campo.id] === opcao}
                onChange={() => handleChange(campo.id, opcao)}
                inline
                className="me-3"
              />
            ))}
          </div>
        )
      
      case 'date':
        return (
          <Form.Control
            type="date"
            value={formData[campo.id] || ''}
            onChange={(e) => handleChange(campo.id, e.target.value)}
            isInvalid={hasError}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <IconifyIcon icon="iconoir:user-plus" className="me-2" />
                Complete seu Cadastro
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {salvo && (
                <Alert variant="success" dismissible onClose={() => setSalvo(false)}>
                  <IconifyIcon icon="iconoir:check-circle" className="me-2" />
                  Cadastro salvo com sucesso!
                </Alert>
              )}

              <Alert variant="info" className="mb-4">
                <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                Preencha os dados abaixo para personalizar sua experiência. 
                Campos marcados com * são obrigatórios.
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Row>
                  {camposPadrao.map((campo) => (
                    <Col md={campo.tipo === 'radio' ? 12 : 6} key={campo.id} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          {campo.nome}
                          {campo.obrigatorio && <span className="text-danger">*</span>}
                        </Form.Label>
                        {renderCampo(campo)}
                        {errors[campo.id] && (
                          <Form.Control.Feedback type="invalid">
                            Este campo é obrigatório
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                <div className="d-grid gap-2 mt-4">
                  <Button variant="primary" type="submit" size="lg">
                    <IconifyIcon icon="iconoir:check" className="me-2" />
                    Salvar Cadastro
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}
