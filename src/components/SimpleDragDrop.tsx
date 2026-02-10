'use client'

import { useState } from 'react'
import { ListGroup, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Pergunta {
  id: number
  nome: string
  tipo: string
  posicao: number
  grupo: string
}

interface SimpleDragDropProps {
  perguntasIniciais?: Pergunta[]
  onReorder?: (perguntas: Pergunta[]) => void
}

const perguntasDemo: Pergunta[] = [
  { id: 1, nome: 'Como você se sente hoje?', tipo: 'me', posicao: 1, grupo: 'Bem-estar' },
  { id: 2, nome: 'Você está satisfeito com seu trabalho?', tipo: 'sn', posicao: 2, grupo: 'Satisfação' },
  { id: 3, nome: 'Descreva sua rotina diária', tipo: 'dissertativa', posicao: 3, grupo: 'Rotina' },
  { id: 4, nome: 'Como está sua saúde mental?', tipo: 'me', posicao: 4, grupo: 'Saúde Mental' },
  { id: 5, nome: 'Você pratica atividades físicas?', tipo: 'sn', posicao: 5, grupo: 'Saúde Física' },
]

export default function SimpleDragDrop({ 
  perguntasIniciais,
  onReorder 
}: SimpleDragDropProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>(perguntasIniciais || perguntasDemo)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  const getTipoBadge = (tipo: string) => {
    const badges: { [key: string]: string } = {
      me: 'primary',
      sn: 'success',
      dissertativa: 'info',
    }
    return badges[tipo] || 'secondary'
  }

  const getTipoLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      me: 'Múltipla Escolha',
      sn: 'Sim/Não',
      dissertativa: 'Dissertativa',
    }
    return labels[tipo] || tipo
  }

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, id: number) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === id) return

    const draggedIndex = perguntas.findIndex(p => p.id === draggedItem)
    const targetIndex = perguntas.findIndex(p => p.id === id)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newPerguntas = [...perguntas]
    const [removed] = newPerguntas.splice(draggedIndex, 1)
    newPerguntas.splice(targetIndex, 0, removed)

    // Atualizar posições
    const reordered = newPerguntas.map((item, index) => ({
      ...item,
      posicao: index + 1,
    }))

    setPerguntas(reordered)
    if (onReorder) {
      onReorder(reordered)
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === perguntas.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const newPerguntas = [...perguntas]
    const [removed] = newPerguntas.splice(index, 1)
    newPerguntas.splice(newIndex, 0, removed)

    const reordered = newPerguntas.map((item, idx) => ({
      ...item,
      posicao: idx + 1,
    }))

    setPerguntas(reordered)
    if (onReorder) {
      onReorder(reordered)
    }
  }

  return (
    <ListGroup>
      {perguntas.map((pergunta, index) => (
        <ListGroup.Item
          key={pergunta.id}
          draggable
          onDragStart={(e) => handleDragStart(e, pergunta.id)}
          onDragOver={(e) => handleDragOver(e, pergunta.id)}
          onDragEnd={handleDragEnd}
          className="d-flex justify-content-between align-items-center"
          style={{
            cursor: 'move',
            opacity: draggedItem === pergunta.id ? 0.5 : 1,
          }}
        >
          <div className="d-flex align-items-center">
            <div className="me-3">
              <button
                className="btn btn-sm btn-link p-0"
                onClick={() => moveItem(index, 'up')}
                disabled={index === 0}
                style={{ display: 'block' }}
              >
                <IconifyIcon icon="iconoir:navigate-up" className="fs-16" />
              </button>
              <button
                className="btn btn-sm btn-link p-0"
                onClick={() => moveItem(index, 'down')}
                disabled={index === perguntas.length - 1}
                style={{ display: 'block' }}
              >
                <IconifyIcon icon="iconoir:navigate-down" className="fs-16" />
              </button>
            </div>
            <IconifyIcon 
              icon="iconoir:menu" 
              className="fs-18 me-3 text-muted" 
            />
            <div>
              <span className="me-2 text-muted">#{pergunta.posicao}</span>
              <strong>{pergunta.nome}</strong>
              <div className="small text-muted mt-1">
                Grupo: {pergunta.grupo}
              </div>
            </div>
          </div>
          <Badge bg={getTipoBadge(pergunta.tipo)}>
            {getTipoLabel(pergunta.tipo)}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
