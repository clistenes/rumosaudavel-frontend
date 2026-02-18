'use client'

import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import Link from 'next/link'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'

type ResultadoImportacao = {
  criados: number
  duplicados: string[]
  total: number
}

const normalizarLogin = (valor: string) => {
  const bruto = valor.trim().toLowerCase()
  if (!bruto) return ''
  return bruto.includes('@') ? bruto.split('@')[0] : bruto
}

const nomePorLogin = (login: string) => {
  return login
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ')
}

const extrairLoginsTexto = (texto: string) => {
  return texto
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export default function NovoUsuarioEmpresaPage() {
  const { empresas, participantes, addParticipante } = useDemo()
  const { showNotification } = useNotificationContext()

  const [empresaId, setEmpresaId] = useState('')
  const [loginsTexto, setLoginsTexto] = useState('')
  const [arquivoExcel, setArquivoExcel] = useState<File | null>(null)
  const [senha, setSenha] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null)

  const empresaSelecionada = useMemo(
    () => empresas.find((empresa: any) => String(empresa.id) === empresaId),
    [empresas, empresaId]
  )

  const processarArquivo = async (arquivo: File): Promise<string[]> => {
    const extensao = arquivo.name.split('.').pop()?.toLowerCase() || ''

    if (!['csv', 'txt', 'xlsx', 'xls'].includes(extensao)) {
      throw new Error('Formato invalido. Use CSV, TXT, XLSX ou XLS.')
    }

    if (extensao === 'xlsx' || extensao === 'xls') {
      throw new Error('No modo demo, para processamento automatico use CSV/TXT.')
    }

    const conteudo = await arquivo.text()
    return conteudo
      .split(/\r?\n/)
      .flatMap((linha) => linha.split(/[;,]/))
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .filter((item) => {
        const valor = item.toLowerCase()
        return valor !== 'login' && valor !== 'email'
      })
  }

  const handleSalvar = async () => {
    if (!empresaId) {
      showNotification({ message: 'Selecione a empresa.', variant: 'warning' })
      return
    }

    try {
      setSalvando(true)

      let logins = extrairLoginsTexto(loginsTexto)
      if (arquivoExcel) {
        const loginsArquivo = await processarArquivo(arquivoExcel)
        logins = [...logins, ...loginsArquivo]
      }

      logins = Array.from(new Set(logins.map(normalizarLogin).filter(Boolean)))

      if (logins.length === 0) {
        showNotification({ message: 'Informe logins no texto ou envie arquivo.', variant: 'warning' })
        return
      }

      const existentes = new Set(
        participantes
          .map((participante: any) => normalizarLogin(participante.login || participante.email || ''))
          .filter(Boolean)
      )

      const duplicados: string[] = []
      let criados = 0
      const idEmpresa = Number(empresaId)
      const dominioEmpresa =
        empresaSelecionada?.email?.split('@')?.[1] ||
        `${String(empresaSelecionada?.nome || 'empresa').toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br`

      logins.forEach((login, index) => {
        if (existentes.has(login)) {
          duplicados.push(login)
          return
        }

        existentes.add(login)
        const sufixo = String(Date.now() + index).slice(-6)

        addParticipante({
          empresaId: idEmpresa,
          login,
          nome: nomePorLogin(login) || `Participante ${index + 1}`,
          cpf: `000.000.${sufixo.slice(0, 3)}-${sufixo.slice(3)}`,
          email: `${login}@${dominioEmpresa}`,
          telefone: '',
          cargo: 'Colaborador',
          departamento: 'Geral',
          dataNascimento: '1990-01-01',
          dataAdmissao: new Date().toISOString().split('T')[0],
          sexo: 'N/A',
          estadoCivil: 'Nao informado',
          cidade: empresaSelecionada?.cidade || '',
          estado: empresaSelecionada?.estado || '',
          status: 'ativo',
          riscoSaude: 'baixo',
          phq9Score: 0,
          gad7Score: 0,
          ultimaAvaliacao: '',
          alertasPendentes: 0,
          senha: senha.trim() || undefined,
        })

        criados += 1
      })

      const resumo = { criados, duplicados, total: logins.length }
      setResultado(resumo)

      showNotification({
        message: `${criados} acesso(s) criado(s) com sucesso.`,
        variant: criados > 0 ? 'success' : 'warning',
      })
    } catch (error) {
      showNotification({
        message: error instanceof Error ? error.message : 'Erro ao criar acessos.',
        variant: 'danger',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <PageTitle title='Novo Acesso' subName='Cadastrar participantes em lote' />

      {resultado && (
        <Alert variant='success' className='mb-4'>
          <strong>Processamento concluido:</strong> {resultado.criados} criados, {resultado.duplicados.length} duplicados, {resultado.total} processados.
        </Alert>
      )}

      <Row>
        <Col xl={12}>
          <ComponentContainerCard title='Novo Login'>
            <Form>
              <Form.Group className='mb-4'>
                <Form.Label>Empresa</Form.Label>
                <Form.Select
                  value={empresaId}
                  onChange={(event) => setEmpresaId(event.target.value)}
                >
                  <option value=''>digite o nome da empresa aqui</option>
                  {empresas.map((empresa: any) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Logins</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={7}
                  value={loginsTexto}
                  onChange={(event) => setLoginsTexto(event.target.value)}
                  placeholder='Adicione vários logins separando por ponto e vírgula'
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Importação através de uma planilha de excel:</Form.Label>
                <Form.Control
                  type='file'
                  accept='.xlsx,.xls,.csv,.txt'
                  onChange={(event) => {
                    const input = event.target as HTMLInputElement
                    setArquivoExcel(input.files?.[0] || null)
                  }}
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type='text'
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder='Digite a primeira senha de acesso do usuário(s)'
                />
              </Form.Group>

              <div className='d-flex justify-content-between align-items-center'>
                <Link href='/empresas/pesquisar-usuario' className='btn btn-outline-secondary'>
                  Voltar
                </Link>
                <Button type='button' variant='success' onClick={handleSalvar} disabled={salvando}>
                  {salvando ? 'salvando...' : 'salvar'}
                  <IconifyIcon icon='iconoir:floppy-disk' className='ms-2' />
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
