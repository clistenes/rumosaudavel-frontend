'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import React, { useState } from 'react'
import { Row, Table } from 'react-bootstrap'
import { questionariosData } from './data'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import type { QuestionarioType } from './type'

// export const metadata = { title: 'Todos Questionários' }
const TodosQuestionarios = () => {
  const [questionarios, setQuestionarios] = useState<QuestionarioType[]>(questionariosData)

  const handleDuplicate = (id: number) => {
    const questionarioToDuplicate = questionarios.find((q) => q.id === id)
    if (questionarioToDuplicate) {
      const newQuestionario: QuestionarioType = {
        ...questionarioToDuplicate,
        id: Math.max(...questionarios.map((q) => q.id)) + 1,
        titulo: `${questionarioToDuplicate.titulo} (Cópia)`,
        criacao: new Date().toLocaleString('pt-BR'),
      }
      setQuestionarios([...questionarios, newQuestionario])
    }
  }

  return (
     <>
      <PageTitle title='Todos Questionários' subName='Questionários'  />
      <Row>
        <ComponentContainerCard title="">
      <div className="table-responsive">
        <Table className="mb-0 table-centered">
          <thead className="table-light">
            <tr>
              <th>Questionários</th>
              <th>Criação</th>
              <th>Qtd Perguntas</th>
              <th></th>
   
            </tr>
          </thead>
          <tbody>
            {questionarios.map((item, idx) => (
              <tr key={idx}>
                <td>

                  {item.titulo}
                </td>
                <td>{item.criacao}</td>
                <td>
                  {item.qtd_perguntas}
                </td>

                <td className="">
                    <IconifyIcon icon="iconoir:doc-magnifying-glass-in" className="fs-18 m-1 align-text-bottom text-primary" />
                    <IconifyIcon icon="iconoir:menu-scale" className="fs-18 m-1 align-text-bottom text-primary" />
                    <IconifyIcon icon="iconoir:multiple-pages-plus" className="fs-18 m-1 align-text-bottom text-primary cursor-pointer" onClick={() => handleDuplicate(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </ComponentContainerCard>
      </Row>
    </>
  )
}

export default TodosQuestionarios