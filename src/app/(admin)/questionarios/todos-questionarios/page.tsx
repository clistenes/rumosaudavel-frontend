'use client'

import React, { useMemo } from 'react'
import { Row, Table } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

const TodosQuestionarios = () => {
  const { questionarios, perguntas, duplicarQuestionario } = useDemo()
  const { showNotification } = useNotificationContext()

  const handleDuplicate = (id: number) => {
    duplicarQuestionario(id)
    showNotification({ message: 'Questionario duplicado com sucesso.', variant: 'success' })
  }

  const formatarCriacao = (item: any) => {
    const raw = item.created_at || item.createdAt || item.dataCadastro || item.dataCriacao
    if (!raw) return '-'

    const dt = new Date(raw)
    if (Number.isNaN(dt.getTime())) return String(raw)

    return dt.toLocaleString('pt-BR')
  }

  const questionariosTabela = useMemo(() => {
    return (questionarios as any[]).map((item) => ({
      id: Number(item.id),
      titulo: item.titulo || item.nome || item.codigo || `Questionario ${item.id}`,
      criacao: formatarCriacao(item),
      qtd_perguntas: (perguntas as any[]).filter(
        (pergunta) => Number(pergunta.id_questionario) === Number(item.id)
      ).length,
    }))
  }, [questionarios, perguntas])

  return (
    <>
      <PageTitle title='Todos Questionarios' subName='Questionarios' />
      <Row>
        <ComponentContainerCard title=''>
          <div className='table-responsive'>
            <Table className='mb-0 table-centered'>
              <thead className='table-light'>
                <tr>
                  <th>Questionarios</th>
                  <th>Criacao</th>
                  <th>Qtd Perguntas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {questionariosTabela.map((item) => (
                  <tr key={item.id}>
                    <td>{item.titulo}</td>
                    <td>{item.criacao}</td>
                    <td>{item.qtd_perguntas}</td>
                    <td>
                      <IconifyIcon icon='iconoir:doc-magnifying-glass-in' className='fs-18 m-1 align-text-bottom text-primary' />
                      <IconifyIcon icon='iconoir:menu-scale' className='fs-18 m-1 align-text-bottom text-primary' />
                      <IconifyIcon
                        icon='iconoir:multiple-pages-plus'
                        className='fs-18 m-1 align-text-bottom text-primary cursor-pointer'
                        onClick={() => handleDuplicate(item.id)}
                      />
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
