'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ListGroup, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface Pergunta {
  id: number
  nome: string
  tipo: string
  posicao: number
  grupo: string
}

interface SortablePerguntaProps {
  pergunta: Pergunta
}

const SortablePergunta = ({ pergunta }: SortablePerguntaProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pergunta.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ListGroup.Item className="d-flex justify-content-between align-items-center cursor-move">
        <div className="d-flex align-items-center">
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
    </div>
  )
}

interface DragDropPerguntasProps {
  perguntasIniciais?: Pergunta[]
}

const perguntasDemo: Pergunta[] = [
  { id: 1, nome: 'Como você se sente hoje?', tipo: 'me', posicao: 1, grupo: 'Bem-estar' },
  { id: 2, nome: 'Você está satisfeito com seu trabalho?', tipo: 'sn', posicao: 2, grupo: 'Satisfação' },
  { id: 3, nome: 'Descreva sua rotina diária', tipo: 'dissertativa', posicao: 3, grupo: 'Rotina' },
  { id: 4, nome: 'Como está sua saúde mental?', tipo: 'me', posicao: 4, grupo: 'Saúde Mental' },
  { id: 5, nome: 'Você pratica atividades físicas?', tipo: 'sn', posicao: 5, grupo: 'Saúde Física' },
]

export default function DragDropPerguntas({ perguntasIniciais }: DragDropPerguntasProps) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>(perguntasIniciais || perguntasDemo)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPerguntas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Atualizar posições
        return newItems.map((item, index) => ({
          ...item,
          posicao: index + 1,
        }))
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={perguntas.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ListGroup>
          {perguntas.map((pergunta) => (
            <SortablePergunta key={pergunta.id} pergunta={pergunta} />
          ))}
        </ListGroup>
      </SortableContext>
    </DndContext>
  )
}
