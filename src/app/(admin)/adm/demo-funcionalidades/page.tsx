'use client'

import { useState } from 'react'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import { Row, Col, Button, Alert } from 'react-bootstrap'
import ColorPicker from '@/components/ColorPicker'
import FileUpload from '@/components/FileUpload'
import PerguntaDependente from '@/components/PerguntaDependente'
import SimpleDragDrop from '@/components/SimpleDragDrop'

export default function DemoFuncionalidades() {
  const [selectedColor, setSelectedColor] = useState('#FF6600')
  const [showAlert, setShowAlert] = useState(false)

  return (
    <>
      <PageTitle title='Demo - Funcionalidades Complexas' subName='Seção 3' />
      
      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)} className="mb-4">
          <strong>Modo Demo Ativado!</strong> Todas as funcionalidades estão disponíveis para teste.
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <ComponentContainerCard title="Color Picker">
            <ColorPicker
              label="Cor do Tema"
              value={selectedColor}
              onChange={setSelectedColor}
            />
            <div className="mt-3 p-3 rounded" style={{ backgroundColor: selectedColor + '20', border: `2px solid ${selectedColor}` }}>
              <p className="mb-0" style={{ color: selectedColor }}>
                Preview da cor selecionada
              </p>
            </div>
          </ComponentContainerCard>
        </Col>

        <Col md={6}>
          <ComponentContainerCard title="Upload de Excel">
            <FileUpload
              tipo="excel"
              maxSize={5}
              onUpload={(files) => {
                console.log('Arquivos enviados:', files)
                setShowAlert(true)
              }}
            />
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <ComponentContainerCard title="Upload de Imagem">
            <FileUpload
              tipo="imagem"
              maxSize={2}
              onUpload={(files) => {
                console.log('Imagens enviadas:', files)
              }}
            />
          </ComponentContainerCard>
        </Col>

        <Col md={6}>
          <ComponentContainerCard title="Anexos">
            <FileUpload
              tipo="anexo"
              maxSize={10}
              onUpload={(files) => {
                console.log('Anexos enviados:', files)
              }}
            />
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <ComponentContainerCard title="Drag & Drop de Perguntas">
            <p className="text-muted mb-3">
              Arraste as perguntas para reordenar ou use as setas
            </p>
            <SimpleDragDrop 
              onReorder={(perguntas) => {
                console.log('Nova ordem:', perguntas)
              }}
            />
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <ComponentContainerCard title="Pergunta Dependente (Condicional)">
            <PerguntaDependente />
          </ComponentContainerCard>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12} className="text-center">
          <Button variant="primary" size="lg" onClick={() => setShowAlert(true)}>
            Testar Todas as Funcionalidades
          </Button>
        </Col>
      </Row>
    </>
  )
}
