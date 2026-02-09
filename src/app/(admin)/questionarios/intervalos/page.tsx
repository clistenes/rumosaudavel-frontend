'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'
import { Row, Col, Button, Form, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const intervalosData = [
  { id: 1, cor: '#00AA00', legenda: 'Baixo', inicio: 0, fim: 30, texto: 'Risco baixo - mantenha as práticas atuais' },
  { id: 2, cor: '#FFCC00', legenda: 'Médio', inicio: 31, fim: 60, texto: 'Risco médio - atenção necessária' },
  { id: 3, cor: '#FF0000', legenda: 'Alto', inicio: 61, fim: 100, texto: 'Risco alto - intervenção imediata recomendada' },
]

const IntervalosQuestionario = () => {
  const [intervalos, setIntervalos] = useState(intervalosData)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    cor: '#00AA00',
    legenda: '',
    inicio: 0,
    fim: 0,
    texto: '',
  })

  const handleEdit = (intervalo: typeof intervalos[0]) => {
    setEditingId(intervalo.id)
    setFormData({
      cor: intervalo.cor,
      legenda: intervalo.legenda,
      inicio: intervalo.inicio,
      fim: intervalo.fim,
      texto: intervalo.texto,
    })
  }

  const handleDelete = (id: number) => {
    setIntervalos(intervalos.filter(i => i.id !== id))
  }

  const handleSave = () => {
    if (editingId) {
      setIntervalos(intervalos.map(i => 
        i.id === editingId ? { ...i, ...formData } : i
      ))
      setEditingId(null)
    } else {
      setIntervalos([...intervalos, { 
        id: Math.max(...intervalos.map(i => i.id)) + 1, 
        ...formData 
      }])
    }
    setFormData({ cor: '#00AA00', legenda: '', inicio: 0, fim: 0, texto: '' })
  }

  return (
    <>
      <PageTitle title='Configurar Intervalos' subName='Questionários' />
      
      <Row>
        <Col md={7}>
          <ComponentContainerCard title="Intervalos Configurados">
            <div className="table-responsive">
              <Table className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cor</th>
                    <th>Legenda</th>
                    <th>Intervalo</th>
                    <th>Texto</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {intervalos.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div 
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            backgroundColor: item.cor,
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }} 
                        />
                      </td>
                      <td>
                        <Badge bg="secondary">{item.legenda}</Badge>
                      </td>
                      <td>{item.inicio} - {item.fim}</td>
                      <td className="text-truncate" style={{ maxWidth: '200px' }}>
                        {item.texto}
                      </td>
                      <td>
                        <IconifyIcon 
                          icon="iconoir:edit-pencil" 
                          className="fs-18 me-2 text-primary cursor-pointer"
                          onClick={() => handleEdit(item)}
                        />
                        <IconifyIcon 
                          icon="iconoir:trash" 
                          className="fs-18 text-danger cursor-pointer"
                          onClick={() => handleDelete(item.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={5}>
          <ComponentContainerCard title={editingId ? 'Editar Intervalo' : 'Novo Intervalo'}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Cor</Form.Label>
                <Form.Control 
                  type="color" 
                  value={formData.cor}
                  onChange={(e) => setFormData({...formData, cor: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Legenda</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ex: Baixo, Médio, Alto"
                  value={formData.legenda}
                  onChange={(e) => setFormData({...formData, legenda: e.target.value})}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Início</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={formData.inicio}
                      onChange={(e) => setFormData({...formData, inicio: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Fim</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={formData.fim}
                      onChange={(e) => setFormData({...formData, fim: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Texto do Resultado</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="Texto exibido quando o resultado estiver neste intervalo"
                  value={formData.texto}
                  onChange={(e) => setFormData({...formData, texto: e.target.value})}
                />
              </Form.Group>

              <Button variant="success" className="w-100" onClick={handleSave}>
                <IconifyIcon icon="iconoir:check" className="me-1" /> 
                {editingId ? 'Atualizar' : 'Adicionar'}
              </Button>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default IntervalosQuestionario
