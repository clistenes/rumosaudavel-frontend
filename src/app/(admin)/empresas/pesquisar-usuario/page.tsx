'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, Form, Table } from 'react-bootstrap'
import PageTitle from '@/components/PageTitle'
import { useDemo } from '@/context/DemoContext'

const getCadastroLabel = (participante: any) => {
  if (participante.status === 'inativo') return 'nao'
  return 'sim'
}

export default function PesquisarUsuarioPage() {
  const { participantes, empresas } = useDemo()
  const [busca, setBusca] = useState('')

  const linhas = useMemo(() => {
    return participantes
      .map((participante: any) => {
        const empresa = empresas.find((item: any) => item.id === participante.empresaId)

        return {
          id: participante.id,
          login: participante.login || participante.email?.split('@')[0] || '-',
          nome: participante.nome || '-',
          empresa: empresa?.nome || '-',
          email: participante.email || '-',
          cadastrado: getCadastroLabel(participante),
        }
      })
      .filter((linha) => {
        if (!busca.trim()) return true
        const termo = busca.toLowerCase()

        return (
          linha.login.toLowerCase().includes(termo) ||
          linha.nome.toLowerCase().includes(termo) ||
          linha.empresa.toLowerCase().includes(termo) ||
          linha.email.toLowerCase().includes(termo)
        )
      })
  }, [participantes, empresas, busca])

  return (
    <>
      <PageTitle title='Pesquisar' subName='Acessos' />

      <Card>
        <Card.Body className='p-0'>
          <div className='d-flex justify-content-end border-bottom p-3'>
            <div style={{ width: '360px' }}>
              <Form.Control
                type='text'
                placeholder='Pesquisar'
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>
          </div>

          <div className='table-responsive'>
            <Table className='mb-0'>
              <thead>
                <tr>
                  <th className='text-center'>login</th>
                  <th className='text-center'>nome</th>
                  <th className='text-center'>empresa</th>
                  <th className='text-center'>email</th>
                  <th className='text-center'>cadastrado</th>
                  <th className='text-center'>link</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => (
                  <tr key={linha.id}>
                    <td className='text-center'>{linha.login}</td>
                    <td className='text-center'>{linha.nome}</td>
                    <td className='text-center'>{linha.empresa}</td>
                    <td className='text-center'>{linha.email}</td>
                    <td className='text-center'>{linha.cadastrado}</td>
                    <td className='text-center'>
                      <Link href={`/adm/info-participante/${linha.id}`} className='text-decoration-none'>
                        + info
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {linhas.length === 0 && (
            <div className='text-center py-4 text-muted'>Nenhum resultado encontrado.</div>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
