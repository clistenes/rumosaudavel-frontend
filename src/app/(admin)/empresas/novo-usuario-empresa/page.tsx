'use client'

import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import Link from 'next/link'
import PageTitle from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useDemo } from '@/context/DemoContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import {
  extractLoginCandidatesDetailedFromFile,
  extractLoginCandidatesDetailedFromText,
  normalizeLogin,
  type LoginCandidate,
} from '@/utils/login-import'

type ResultadoImportacao = {
  criados: number
  duplicados: string[]
  total: number
  erros: { valor: string; motivo: string; linha?: number; coluna?: number }[]
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
  return extractLoginCandidatesDetailedFromText(texto)
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

  const handleSalvar = async () => {
    if (!empresaId) {
      showNotification({ message: 'Selecione a empresa.', variant: 'warning' })
      return
    }

    try {
      setSalvando(true)

      let loginsBrutos: LoginCandidate[] = extrairLoginsTexto(loginsTexto)
      if (arquivoExcel) {
        const loginsArquivo = await extractLoginCandidatesDetailedFromFile(arquivoExcel)
        loginsBrutos = [...loginsBrutos, ...loginsArquivo]
      }

      if (loginsBrutos.length === 0) {
        showNotification({ message: 'Informe logins no texto ou envie arquivo.', variant: 'warning' })
        return
      }

      const existentes = new Set(
        participantes
          .map((participante: any) => normalizeLogin(participante.login || participante.email || ''))
          .filter(Boolean)
      )

      const duplicados: string[] = []
      const erros: { valor: string; motivo: string; linha?: number; coluna?: number }[] = []
      const loginsLote = new Set<string>()
      let criados = 0
      const idEmpresa = Number(empresaId)
      const dominioEmpresa =
        empresaSelecionada?.email?.split('@')?.[1] ||
        `${String(empresaSelecionada?.nome || 'empresa').toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br`

      loginsBrutos.forEach((item, index) => {
        const loginOriginal = item.value
        const login = normalizeLogin(loginOriginal)
        if (!login) {
          erros.push({ valor: loginOriginal, motivo: 'Login vazio', linha: item.line, coluna: item.column })
          return
        }

        if (!/^[a-z0-9._-]{3,}$/.test(login)) {
          erros.push({ valor: loginOriginal, motivo: 'Formato invalido', linha: item.line, coluna: item.column })
          return
        }

        if (loginsLote.has(login) || existentes.has(login)) {
          duplicados.push(login)
          return
        }

        loginsLote.add(login)
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

      const resumo = { criados, duplicados, total: loginsBrutos.length, erros }
      setResultado(resumo)

      showNotification({
        message: `${criados} acesso(s) criado(s). ${duplicados.length} duplicados e ${erros.length} erros.`,
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

  const baixarRelatorioErros = () => {
    if (!resultado || resultado.erros.length === 0) return

    const linhas = [
      ['valor', 'motivo', 'linha', 'posicao'],
      ...resultado.erros.map((erro) => [
        erro.valor || '',
        erro.motivo,
        erro.linha ? String(erro.linha) : '',
        erro.coluna ? String(erro.coluna) : '',
      ]),
    ]

    const escaparCsv = (valor: string) => `"${valor.replace(/"/g, '""')}"`
    const csv = linhas.map((linha) => linha.map(escaparCsv).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio-erros-importacao.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageTitle title='Novo Acesso' subName='Cadastrar participantes em lote' />

      {resultado && (
        <Alert variant='success' className='mb-4'>
          <strong>Processamento concluido:</strong> {resultado.criados} criados, {resultado.duplicados.length} duplicados, {resultado.erros.length} erros, {resultado.total} processados.
          <div className='small mt-2'>
            <strong>Resumo de inconsistencias:</strong>{' '}
            login vazio: {resultado.erros.filter((erro) => erro.motivo === 'Login vazio').length},{' '}
            formato invalido: {resultado.erros.filter((erro) => erro.motivo === 'Formato invalido').length},{' '}
            duplicado: {resultado.duplicados.length}
          </div>
          {resultado.erros.length > 0 && (
            <div className='small text-danger mt-2'>
              {resultado.erros.slice(0, 5).map((erro, index) => (
                <div key={`${erro.valor}-${index}`}>
                  {erro.valor || '(vazio)'}: {erro.motivo}
                  {erro.linha ? ` (linha ${erro.linha}` : ''}
                  {erro.coluna ? `, posicao ${erro.coluna}` : ''}
                  {erro.linha ? ')' : ''}
                </div>
              ))}
              <Button variant='outline-danger' size='sm' className='mt-2' onClick={baixarRelatorioErros}>
                <IconifyIcon icon='iconoir:download' className='me-2' />
                Baixar relatorio de erros (CSV)
              </Button>
            </div>
          )}
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
                <Form.Text className='text-muted'>
                  Formatos aceitos: CSV, TXT, XLS e XLSX.
                </Form.Text>
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

