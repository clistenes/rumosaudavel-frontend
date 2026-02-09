import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import React from 'react'
import { Row, Table } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export const metadata = { title: 'Todos os Programas' }

const programasData = [
  { id: 1, nome: 'Programa de Saúde Mental', criacao: '10/01/2025', questionarios: 3, empresas: 5 },
  { id: 2, nome: 'Bem-estar no Trabalho', criacao: '15/01/2025', questionarios: 2, empresas: 3 },
  { id: 3, nome: 'Avaliação de Riscos', criacao: '20/01/2025', questionarios: 4, empresas: 8 },
]

const TodosProgramas = () => {
  return (
    <>
      <PageTitle title='Todos os Programas' subName='Programas' />
      <Row>
        <ComponentContainerCard title="Programas Cadastrados">
          <div className="table-responsive">
            <Table className="mb-0 table-centered">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Criação</th>
                  <th>Questionários</th>
                  <th>Empresas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {programasData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.criacao}</td>
                    <td>{item.questionarios}</td>
                    <td>{item.empresas}</td>
                    <td>
                      <IconifyIcon icon="iconoir:settings" className="fs-18 m-1 align-text-bottom text-primary cursor-pointer" />
                      <IconifyIcon icon="iconoir:company" className="fs-18 m-1 align-text-bottom text-primary cursor-pointer" />
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

export default TodosProgramas
