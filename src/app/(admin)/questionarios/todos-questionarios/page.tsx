'use client'

import React, { useMemo } from 'react'
import { Row, Table, Spinner, Alert, Button } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useQuestionarios } from '@/hooks/api/useQuestionarios'

const formatarCriacao = (item: any) => {
  const raw =
    item.created_at ||
    item.createdAt ||
    item.dataCriacao ||
    item.dataCadastro ||
    item.criado_em ||
    item.created_on
  if (!raw) return '-'

  const dt = new Date(raw)
  if (Number.isNaN(dt.getTime())) return String(raw)
  return dt.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim()

const getTitulo = (item: any) => {
  const descricaoSemHtml = typeof item.descricao === 'string' ? stripHtml(item.descricao) : ''
  return item.nome || item.nome_site || item.titulo || item.codigo || descricaoSemHtml || `Questionario ${item.id}`
}

const getQtdPerguntas = (item: any) => {
  const qtd =
    item.qtd_perguntas ??
    item.totalPerguntas ??
    item.numeroQuestoes ??
    item.total_perguntas ??
    item.perguntas_count ??
    item.total_questoes ??
    item.quantidade_perguntas ??
    item.perguntas?.length ??
    item.questoes?.length ??
    0
  return Number(qtd) || 0
}

const TodosQuestionarios = () => {
  const { data, loading, error, refetch } = useQuestionarios({ perPage: 500 })

  const questionariosTabela = useMemo(() => {
    const lista = (data?.data || []) as any[]
    return lista
      .map((item) => ({
        id: Number(item.id),
        titulo: getTitulo(item),
        criacao: formatarCriacao(item),
        qtd_perguntas: getQtdPerguntas(item),
      }))
      .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
  }, [data])

  return (
    <>
      <PageTitle title='Todos Questionarios' subName='Questionarios' />
      <Row>
        <ComponentContainerCard title=''>
          {loading && (
            <div className='d-flex justify-content-center py-4'>
              <Spinner animation='border' />
            </div>
          )}

          {!loading && error && (
            <Alert variant='danger' className='mb-0'>
              <div className='d-flex justify-content-between align-items-center'>
                <span>Erro ao carregar questionarios: {error.message}</span>
                <Button variant='outline-danger' size='sm' onClick={refetch}>Tentar novamente</Button>
              </div>
            </Alert>
          )}

          {!loading && !error && (
            <div className='table-responsive'>
              <Table className='mb-0 table-centered align-middle'>
                <thead className='table-light'>
                  <tr>
                    <th style={{ width: '58%' }}>Questionario</th>
                    <th style={{ width: '22%' }}>Criacao</th>
                    <th style={{ width: '10%' }}>Qtd Perguntas</th>
                    <th style={{ width: '10%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {questionariosTabela.map((item) => (
                    <tr key={item.id}>
                      <td className='fs-5'>{item.titulo}</td>
                      <td className='fs-5'>{item.criacao}</td>
                      <td className='fs-5'>{item.qtd_perguntas}</td>
                      <td>
                        <div className='d-flex gap-1'>
                          <Button variant='secondary' size='sm' className='px-2 py-1'>
                            <IconifyIcon icon='iconoir:search' className='fs-18 text-white' />
                          </Button>
                          <Button variant='secondary' size='sm' className='px-2 py-1'>
                            <IconifyIcon icon='iconoir:menu-scale' className='fs-18 text-white' />
                          </Button>
                          <Button variant='secondary' size='sm' className='px-2 py-1'>
                            <IconifyIcon icon='iconoir:multiple-pages-plus' className='fs-18 text-white' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </ComponentContainerCard>
      </Row>
    </>
  )
}

export default TodosQuestionarios
