'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'
import { Row, Col, Button, ListGroup, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const perguntasData = [
  { id: 1, nome: 'Como você se sente hoje?', tipo: 'me', posicao: 1, grupo: 'Bem-estar' },
  { id: 2, nome: 'Você está satisfeito com seu trabalho?', tipo: 'sn', posicao: 2, grupo: 'Satisfação' },
  { id: 3, nome: 'Descreva sua rotina diária', tipo: 'dissertativa', posicao: 3, grupo: 'Rotina' },
]

const VisualizarQuestionario = () => {
  const [questionario] = useState({
    nome: 'Avaliação de Saúde Mental',
    descricao: 'Questionário para avaliar o bem-estar psicológico dos colaboradores',
    tipoResultado: 'soma_pontos',
    qtdPerguntas: 3,
  })

  const [perguntas] = useState(perguntasData)

  const getTipoLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      me: 'Múltipla Escolha',
      sn: 'Sim/Não',
      dissertativa: 'Dissertativa',
    }
    return labels[tipo] || tipo
  }

  const getTipoBadge = (tipo: string) => {
    const badges: { [key: string]: string } = {
      me: 'primary',
      sn: 'success',
      dissertativa: 'info',
    }
    return badges[tipo] || 'secondary'
  }

  return (
    <>
      <PageTitle title={questionario.nome} subName='Questionários' />
      
      <Row className="mb-3">
        <Col>
          <Button variant="danger" className="me-2">
            <IconifyIcon icon="iconoir:trash" className="me-1" /> Apagar
          </Button>
          <Button variant="primary" className="me-2">
            <IconifyIcon icon="iconoir:expand" className="me-1" /> Expandir
          </Button>
          <Button variant="info" className="me-2">
            <IconifyIcon icon="iconoir:page" className="me-1" /> Info Adm
          </Button>
          <Button variant="success" className="me-2">
            <IconifyIcon icon="iconoir:download" className="me-1" /> Exportar
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <ComponentContainerCard title="Perguntas">
            <ListGroup>
              {perguntas.map((pergunta) => (
                <ListGroup.Item key={pergunta.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="me-2 text-muted">#{pergunta.posicao}</span>
                    <strong>{pergunta.nome}</strong>
                    <div className="small text-muted mt-1">
                      Grupo: {pergunta.grupo}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Badge bg={getTipoBadge(pergunta.tipo)} className="me-2">
                      {getTipoLabel(pergunta.tipo)}
                    </Badge>
                    <IconifyIcon 
                      icon="iconoir:edit-pencil" 
                      className="fs-18 ms-2 text-primary cursor-pointer" 
                    />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            
            <Button variant="primary" className="mt-3 w-100">
              <IconifyIcon icon="iconoir:plus" className="me-1" /> Nova Pergunta
            </Button>
          </ComponentContainerCard>
        </Col>

        <Col md={4}>
          <ComponentContainerCard title="Informações">
            <p><strong>Descrição:</strong></p>
            <p className="text-muted">{questionario.descricao}</p>
            
            <hr />
            
            <p><strong>Tipo de Resultado:</strong></p>
            <Badge bg="primary">{questionario.tipoResultado}</Badge>
            
            <hr />
            
            <p><strong>Quantidade de Perguntas:</strong> {questionario.qtdPerguntas}</p>
          </ComponentContainerCard>

          <ComponentContainerCard title="Ações">
            <Button variant="outline-primary" className="w-100 mb-2">
              <IconifyIcon icon="iconoir:settings" className="me-1" /> Configurar Intervalos
            </Button>
            <Button variant="outline-success" className="w-100">
              <IconifyIcon icon="iconoir:copy" className="me-1" /> Duplicar Questionário
            </Button>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}

export default VisualizarQuestionario
