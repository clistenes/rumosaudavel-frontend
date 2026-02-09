'use client'

import ComponentContainerCard from '@/components/ComponentContainerCard'
import PageTitle from '@/components/PageTitle'
import { useState } from 'react'
import { Row, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

const participantesData = [
  { id: 1, login: 'joao.silva', empresa: 'Empresa A', ultimoAcesso: '10/02/2025', termometro: 'verde', risco: false },
  { id: 2, login: 'maria.santos', empresa: 'Empresa A', ultimoAcesso: '09/02/2025', termometro: 'amarelo', risco: false },
  { id: 3, login: 'pedro.oliveira', empresa: 'Empresa B', ultimoAcesso: '08/02/2025', termometro: 'vermelho', risco: true },
]

const TodosParticipantes = () => {
  const [participantes] = useState(participantesData)

  const getTermometroColor = (cor: string) => {
    const colors: { [key: string]: string } = {
      verde: 'success',
      amarelo: 'warning',
      vermelho: 'danger',
    }
    return colors[cor] || 'secondary'
  }

  return (
    <>
      <PageTitle title='Todos os Participantes' subName='Participantes' />
      <Row>
        <ComponentContainerCard title="Participantes Cadastrados">
          <div className="table-responsive">
            <Table className="mb-0 table-centered">
              <thead className="table-light">
                <tr>
                  <th>Login</th>
                  <th>Empresa</th>
                  <th>Último Acesso</th>
                  <th>Termômetro</th>
                  <th>Risco</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map((item) => (
                  <tr key={item.id}>
                    <td>{item.login}</td>
                    <td>{item.empresa}</td>
                    <td>{item.ultimoAcesso}</td>
                    <td>
                      <Badge bg={getTermometroColor(item.termometro)}>{item.termometro}</Badge>
                    </td>
                    <td>
                      {item.risco ? (
                        <Badge bg="danger">Sim</Badge>
                      ) : (
                        <Badge bg="success">Não</Badge>
                      )}
                    </td>
                    <td>
                      <IconifyIcon icon="iconoir:page" className="fs-18 m-1 align-text-bottom text-primary cursor-pointer" />
                      <IconifyIcon icon="iconoir:user-badge-check" className="fs-18 m-1 align-text-bottom text-primary cursor-pointer" />
                      <IconifyIcon icon="iconoir:trash" className="fs-18 m-1 align-text-bottom text-danger cursor-pointer" />
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

export default TodosParticipantes
