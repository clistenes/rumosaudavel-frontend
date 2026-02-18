'use client'

import { useState, useCallback } from 'react'
import { Card, Form, Button, Row, Col, Alert, Table, Tabs, Tab, Spinner } from 'react-bootstrap'
import { useRouter, useSearchParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import FileUpload from '@/components/FileUpload'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { useImportarParticipantesTexto, useImportarParticipantesExcel } from '@/hooks/api/useParticipantes'
import { useNotificationContext } from '@/context/useNotificationContext'
import { useDemo } from '@/context/DemoContext'
import { isDemoMode } from '@/utils/env'
import {
  extractLoginCandidatesDetailedFromFile,
  extractLoginCandidatesDetailedFromText,
  extractLoginCandidatesFromFile,
  normalizeLogin,
  type LoginCandidate,
} from '@/utils/login-import'

export default function AdicionarParticipante() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaParam = searchParams.get('empresa')
  const { showNotification } = useNotificationContext()
  const demoMode = isDemoMode()
  const demoContext = useDemo()

  const [activeTab, setActiveTab] = useState('texto')
  const [empresaSelecionada, setEmpresaSelecionada] = useState(empresaParam || '')
  const [senhaPadrao, setSenhaPadrao] = useState('')
  const [loginsTexto, setLoginsTexto] = useState('')
  const [arquivoExcel, setArquivoExcel] = useState<File[]>([])
  const [preview, setPreview] = useState<string[]>([])
  const [resultado, setResultado] = useState<{
    criados: number
    duplicados: string[]
    total: number
    erros: { valor: string; motivo: string; linha?: number; coluna?: number }[]
  } | null>(null)

  const { data: empresasData, loading: loadingEmpresas } = useEmpresas({ perPage: 1000 })
  const empresas = demoMode ? demoContext.empresas : (empresasData?.data || [])

  const { mutateAsync: importarTexto, loading: loadingTexto } = useImportarParticipantesTexto()
  const { mutateAsync: importarExcel, loading: loadingExcel } = useImportarParticipantesExcel()

  const processando = !demoMode && (loadingTexto || loadingExcel)

  const processarLogins = useCallback((texto: string): LoginCandidate[] => extractLoginCandidatesDetailedFromText(texto), [])

  const formatarNomePorLogin = useCallback((login: string): string => {
    return login
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(' ')
  }, [])

  const handleTextoChange = (texto: string) => {
    setLoginsTexto(texto)
    const logins = processarLogins(texto)
    setPreview(logins.slice(0, 10).map((item) => item.value))
  }

  const handleProcessar = async () => {
    if (!empresaSelecionada) {
      showNotification({ message: 'Selecione uma empresa.', variant: 'warning' })
      return
    }

    try {
      let loginsBrutos: LoginCandidate[] = []

      if (activeTab === 'texto') {
        loginsBrutos = processarLogins(loginsTexto)
      } else if (arquivoExcel.length > 0 && demoMode) {
        loginsBrutos = await extractLoginCandidatesDetailedFromFile(arquivoExcel[0])
      }

      if (loginsBrutos.length === 0 && arquivoExcel.length === 0) {
        showNotification({ message: 'Informe ao menos um login ou envie um arquivo.', variant: 'warning' })
        return
      }

      if (demoMode) {
        const empresaId = parseInt(empresaSelecionada)
        const empresaAtual = demoContext.empresas.find((empresa: any) => empresa.id === empresaId)
        const dominioEmpresa =
          empresaAtual?.email?.split('@')?.[1] ||
          `${String(empresaAtual?.nome || 'empresa').toLowerCase().replace(/[^a-z0-9]+/g, '')}.com.br`

        const loginsExistentes = new Set(
          demoContext.participantes
            .map((participante: any) => normalizeLogin(participante.login || participante.email || ''))
            .filter(Boolean)
        )

        const erros: { valor: string; motivo: string; linha?: number; coluna?: number }[] = []
        const loginsLote = new Set<string>()
        const duplicados: string[] = []
        let criados = 0

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

          if (loginsExistentes.has(login) || loginsLote.has(login)) {
            duplicados.push(login)
            return
          }

          loginsLote.add(login)
          const nomeFormatado = formatarNomePorLogin(login)
          const sufixo = String(Date.now() + index).slice(-6)

          demoContext.addParticipante({
            empresaId,
            login,
            nome: nomeFormatado || `Participante ${index + 1}`,
            cpf: `000.000.${sufixo.slice(0, 3)}-${sufixo.slice(3)}`,
            email: `${login}@${dominioEmpresa}`,
            telefone: '',
            cargo: 'Colaborador',
            departamento: 'Geral',
            dataNascimento: '1990-01-01',
            dataAdmissao: new Date().toISOString().split('T')[0],
            sexo: 'N/A',
            estadoCivil: 'Nao informado',
            cidade: empresaAtual?.cidade || '',
            estado: empresaAtual?.estado || '',
            status: 'ativo',
            riscoSaude: 'baixo',
            phq9Score: 0,
            gad7Score: 0,
            ultimaAvaliacao: '',
            alertasPendentes: 0,
          })

          criados += 1
        })

        setResultado({
          criados,
          duplicados,
          total: loginsBrutos.length,
          erros,
        })

        showNotification({
          message: `${criados} participantes importados. ${duplicados.length} duplicados e ${erros.length} erros.`,
          variant: criados > 0 ? 'success' : 'warning',
        })

        return
      }

      let response

      if (activeTab === 'texto') {
        response = await importarTexto({
          texto: loginsTexto,
          empresaId: parseInt(empresaSelecionada),
          formato: 'lista',
        })
      } else if (arquivoExcel.length > 0) {
        response = await importarExcel({
          arquivo: arquivoExcel[0],
          empresaId: parseInt(empresaSelecionada),
        })
      }

      if (response) {
        setResultado({
          criados: (response as any).importados || (response as any).criados || 0,
          duplicados: (response as any).log || (response as any).duplicados || [],
          total: loginsBrutos.length || arquivoExcel.length,
          erros: [],
        })

        showNotification({
          message: `${(response as any).importados || (response as any).criados || 0} participantes importados com sucesso!`,
          variant: 'success',
        })
      }
    } catch {
      showNotification({
        message: 'Erro ao importar participantes. Tente novamente.',
        variant: 'danger',
      })
    }
  }

  const handleUploadExcel = (files: File[]) => {
    setArquivoExcel(files)
    if (!demoMode || files.length === 0) return

    extractLoginCandidatesFromFile(files[0])
      .then((logins) => setPreview(logins.slice(0, 10)))
      .catch((error) => {
        setPreview([])
        showNotification({
          message: error instanceof Error ? error.message : 'Arquivo invalido para modo demo.',
          variant: 'warning',
        })
      })
  }

  return (
    <>
      <PageTitle title='Adicionar Participantes' subName='Participantes' />

      {resultado && (
        <Alert variant='success' className='mb-4'>
          <Alert.Heading>
            <IconifyIcon icon='iconoir:check-circle' className='me-2' />
            Processamento Concluido!
          </Alert.Heading>
          <div className='d-flex gap-4 mt-3'>
            <div className='text-center'>
              <h4 className='text-success mb-0'>{resultado.criados}</h4>
              <small>Participantes criados</small>
            </div>
            <div className='text-center'>
              <h4 className='text-warning mb-0'>{resultado.duplicados.length}</h4>
              <small>Duplicados (ignorados)</small>
            </div>
            <div className='text-center'>
              <h4 className='text-danger mb-0'>{resultado.erros.length}</h4>
              <small>Erros</small>
            </div>
            <div className='text-center'>
              <h4 className='mb-0'>{resultado.total}</h4>
              <small>Total processado</small>
            </div>
          </div>
          {resultado.duplicados.length > 0 && (
            <div className='mt-3'>
              <small className='text-muted'>Logins duplicados:</small>
              <div className='small text-warning'>
                {resultado.duplicados.slice(0, 5).join(', ')}
                {resultado.duplicados.length > 5 && ` e mais ${resultado.duplicados.length - 5}...`}
              </div>
            </div>
          )}
          {resultado.erros.length > 0 && (
            <div className='mt-3'>
              <small className='text-muted'>Erros encontrados:</small>
              <div className='small text-danger'>
                {resultado.erros.slice(0, 5).map((erro, index) => (
                  <div key={`${erro.valor}-${index}`}>
                    {erro.valor || '(vazio)'}: {erro.motivo}
                    {erro.linha ? ` (linha ${erro.linha}` : ''}
                    {erro.coluna ? `, posicao ${erro.coluna}` : ''}
                    {erro.linha ? ')' : ''}
                  </div>
                ))}
                {resultado.erros.length > 5 && <div>e mais {resultado.erros.length - 5}...</div>}
              </div>
            </div>
          )}
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <Card className='mb-4'>
            <Card.Body>
              <Form.Group className='mb-4'>
                <Form.Label className='fw-bold'>Empresa *</Form.Label>
                <Form.Select
                  value={empresaSelecionada}
                  onChange={(e) => setEmpresaSelecionada(e.target.value)}
                  required
                  disabled={loadingEmpresas}
                >
                  <option value=''>
                    {loadingEmpresas ? 'Carregando empresas...' : 'Selecione uma empresa...'}
                  </option>
                  {empresas.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'texto')}
                className='mb-4'
              >
                <Tab eventKey='texto' title='Modo Texto'>
                  <Form.Group className='mb-3'>
                    <Form.Label>Logins (separados por virgula, ponto-e-virgula ou quebra de linha)</Form.Label>
                    <Form.Control
                      as='textarea'
                      rows={8}
                      value={loginsTexto}
                      onChange={(e) => handleTextoChange(e.target.value)}
                      placeholder={'joao.silva\nmaria.santos\npedro.oliveira\nana.costa'}
                    />
                    <Form.Text className='text-muted'>
                      Exemplo: joao.silva, maria.santos, pedro.oliveira
                    </Form.Text>
                  </Form.Group>

                  {preview.length > 0 && (
                    <Alert variant='info'>
                      <strong>Preview:</strong> {preview.length > 10 ? `Mostrando 10 de ${processarLogins(loginsTexto).length} logins` : `${preview.length} logins encontrados`}
                      <div className='mt-2 small'>
                        {preview.join(', ')}
                        {processarLogins(loginsTexto).length > 10 && '...'}
                      </div>
                    </Alert>
                  )}
                </Tab>

                <Tab eventKey='excel' title='Upload Excel'>
                  <Alert variant='info' className='mb-3'>
                    <IconifyIcon icon='iconoir:info-circle' className='me-2' />
                    Suporta CSV, TXT, XLS e XLSX. Se houver coluna "login" ou "email", ela sera priorizada.
                  </Alert>

                  <FileUpload
                    tipo='excel'
                    maxSize={5}
                    onUpload={handleUploadExcel}
                  />

                  {activeTab === 'excel' && preview.length > 0 && (
                    <Alert variant='secondary' className='mt-3 mb-0'>
                      <strong>Preview arquivo:</strong> {preview.join(', ')}
                    </Alert>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label className='fw-bold'>Senha Padrao (opcional)</Form.Label>
                <Form.Control
                  type='text'
                  value={senhaPadrao}
                  onChange={(e) => setSenhaPadrao(e.target.value)}
                  placeholder='Deixe em branco para gerar automaticamente'
                />
                <Form.Text className='text-muted'>
                  Se nao informada, sera gerada uma senha aleatoria para cada participante.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='bg-light'>
            <Card.Body>
              <h6 className='mb-3'>Instrucoes</h6>
              <ul className='list-unstyled small'>
                <li className='mb-2'>
                  <IconifyIcon icon='iconoir:check' className='text-success me-2' />
                  Selecione a empresa onde os participantes serao cadastrados
                </li>
                <li className='mb-2'>
                  <IconifyIcon icon='iconoir:check' className='text-success me-2' />
                  Informe os logins no modo texto ou faca upload de planilha
                </li>
                <li className='mb-2'>
                  <IconifyIcon icon='iconoir:check' className='text-success me-2' />
                  Opcional: defina uma senha padrao para todos
                </li>
                <li className='mb-2'>
                  <IconifyIcon icon='iconoir:check' className='text-success me-2' />
                  O sistema verifica duplicados automaticamente
                </li>
                <li className='mb-2'>
                  <IconifyIcon icon='iconoir:check' className='text-success me-2' />
                  Apos o processamento, voce vera o resumo dos resultados
                </li>
              </ul>

              <hr className='my-3' />

              <h6 className='mb-2'>Formato CSV</h6>
              <Table bordered size='sm' className='bg-white'>
                <thead className='table-light'>
                  <tr>
                    <th>login</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>joao.silva</td></tr>
                  <tr><td>maria.santos</td></tr>
                  <tr><td>pedro.oliveira</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className='d-flex justify-content-between mt-4'>
        <Button
          variant='outline-secondary'
          onClick={() => router.back()}
        >
          <IconifyIcon icon='iconoir:navigate-left' className='me-2' />
          Voltar
        </Button>

        <Button
          variant='success'
          onClick={handleProcessar}
          disabled={processando || !empresaSelecionada || loadingEmpresas}
          size='lg'
        >
          {processando ? (
            <>
              <Spinner animation='border' size='sm' className='me-2' />
              Processando...
            </>
          ) : (
            <>
              <IconifyIcon icon='iconoir:plus' className='me-2' />
              Criar Participantes
            </>
          )}
        </Button>
      </div>
    </>
  )
}

