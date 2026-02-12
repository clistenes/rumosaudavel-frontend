'use client'

import { useState, useCallback } from 'react'
import { Card, Form, Button, Row, Col, Alert, Badge, Table, Tabs, Tab, Spinner } from 'react-bootstrap'
import { useRouter, useSearchParams } from 'next/navigation'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTitle from '@/components/PageTitle'
import FileUpload from '@/components/FileUpload'
import { useEmpresas } from '@/hooks/api/useEmpresas'
import { useImportarParticipantesTexto, useImportarParticipantesExcel } from '@/hooks/api/useParticipantes'
import { useNotificationContext } from '@/context/useNotificationContext'

export default function AdicionarParticipante() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const empresaParam = searchParams.get('empresa')
  const { showNotification } = useNotificationContext()
  
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
  } | null>(null)

  // Buscar empresas do backend
  const { data: empresasData, loading: loadingEmpresas } = useEmpresas({ perPage: 1000 })
  const empresas = empresasData?.data || []

  // Hooks de mutação
  const { mutateAsync: importarTexto, loading: loadingTexto } = useImportarParticipantesTexto()
  const { mutateAsync: importarExcel, loading: loadingExcel } = useImportarParticipantesExcel()

  const processando = loadingTexto || loadingExcel

  const processarLogins = useCallback((texto: string): string[] => {
    return texto
      .split(/[,;\n]+/)
      .map(l => l.trim())
      .filter(l => l.length > 0)
  }, [])

  const handleTextoChange = (texto: string) => {
    setLoginsTexto(texto)
    const logins = processarLogins(texto)
    setPreview(logins.slice(0, 10)) // Mostra primeiros 10
  }

  const handleProcessar = async () => {
    if (!empresaSelecionada) {
      alert('Selecione uma empresa!')
      return
    }

    const logins = activeTab === 'texto' 
      ? processarLogins(loginsTexto)
      : [] // TODO: processar Excel

    if (logins.length === 0 && arquivoExcel.length === 0) {
      alert('Informe pelo menos um login ou faça upload de um arquivo!')
      return
    }

    try {
      let response

      if (activeTab === 'texto') {
        // Importar via texto/CSV
        response = await importarTexto({
          texto: loginsTexto,
          empresaId: parseInt(empresaSelecionada),
          formato: 'lista'
        })
      } else {
        // Importar via Excel
        if (arquivoExcel.length > 0) {
          response = await importarExcel({
            arquivo: arquivoExcel[0],
            empresaId: parseInt(empresaSelecionada)
          })
        }
      }

      if (response) {
        setResultado({
          criados: (response as any).importados || (response as any).criados || 0,
          duplicados: (response as any).log || (response as any).duplicados || [],
          total: logins.length || arquivoExcel.length,
        })

        showNotification({
          message: `${(response as any).importados || (response as any).criados || 0} participantes importados com sucesso!`,
          variant: 'success'
        })
      }
    } catch (error) {
      showNotification({
        message: 'Erro ao importar participantes. Tente novamente.',
        variant: 'danger'
      })
    }
  }

  const handleUploadExcel = (files: File[]) => {
    setArquivoExcel(files)
    // Aqui processaria o Excel e mostraria preview
  }

  return (
    <>
      <PageTitle title="Adicionar Participantes" subName="Participantes" />

      {resultado && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>
            <IconifyIcon icon="iconoir:check-circle" className="me-2" />
            Processamento Concluído!
          </Alert.Heading>
          <div className="d-flex gap-4 mt-3">
            <div className="text-center">
              <h4 className="text-success mb-0">{resultado.criados}</h4>
              <small>Participantes criados</small>
            </div>
            <div className="text-center">
              <h4 className="text-warning mb-0">{resultado.duplicados.length}</h4>
              <small>Duplicados (ignorados)</small>
            </div>
            <div className="text-center">
              <h4 className="mb-0">{resultado.total}</h4>
              <small>Total processado</small>
            </div>
          </div>
          {resultado.duplicados.length > 0 && (
            <div className="mt-3">
              <small className="text-muted">Logins duplicados:</small>
              <div className="small text-warning">
                {resultado.duplicados.slice(0, 5).join(', ')}
                {resultado.duplicados.length > 5 && ` e mais ${resultado.duplicados.length - 5}...`}
              </div>
            </div>
          )}
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Empresa *</Form.Label>
                <Form.Select
                  value={empresaSelecionada}
                  onChange={(e) => setEmpresaSelecionada(e.target.value)}
                  required
                  disabled={loadingEmpresas}
                >
                  <option value="">
                    {loadingEmpresas ? 'Carregando empresas...' : 'Selecione uma empresa...'}
                  </option>
                  {empresas.map((emp: { id: number; nome: string }) => (
                    <option key={emp.id} value={emp.id}>{emp.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'texto')}
                className="mb-4"
              >
                <Tab eventKey="texto" title="Modo Texto">
                  <Form.Group className="mb-3">
                    <Form.Label>Logins (separados por vírgula, ponto-e-vírgula ou quebra de linha)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={loginsTexto}
                      onChange={(e) => handleTextoChange(e.target.value)}
                      placeholder="joao.silva&#10;maria.santos&#10;pedro.oliveira&#10;ana.costa"
                    />
                    <Form.Text className="text-muted">
                      Exemplo: joao.silva, maria.santos, pedro.oliveira
                    </Form.Text>
                  </Form.Group>

                  {preview.length > 0 && (
                    <Alert variant="info">
                      <strong>Preview:</strong> {preview.length > 10 ? `Mostrando 10 de ${processarLogins(loginsTexto).length} logins` : `${preview.length} logins encontrados`}
                      <div className="mt-2 small">
                        {preview.join(', ')}
                        {processarLogins(loginsTexto).length > 10 && '...'}
                      </div>
                    </Alert>
                  )}
                </Tab>

                <Tab eventKey="excel" title="Upload Excel">
                  <Alert variant="info" className="mb-3">
                    <IconifyIcon icon="iconoir:info-circle" className="me-2" />
                    O arquivo Excel deve conter uma coluna chamada &quot;login&quot; com os logins dos participantes.
                  </Alert>
                  
                  <FileUpload
                    tipo="excel"
                    maxSize={5}
                    onUpload={handleUploadExcel}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label className="fw-bold">Senha Padrão (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  value={senhaPadrao}
                  onChange={(e) => setSenhaPadrao(e.target.value)}
                  placeholder="Deixe em branco para gerar automaticamente"
                />
                <Form.Text className="text-muted">
                  Se não informada, será gerada uma senha aleatória para cada participante.
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-light">
            <Card.Body>
              <h6 className="mb-3">Instruções</h6>
              <ul className="list-unstyled small">
                <li className="mb-2">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2" />
                  Selecione a empresa onde os participantes serão cadastrados
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2" />
                  Informe os logins no modo texto ou faça upload de planilha
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2" />
                  Opcional: defina uma senha padrão para todos
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2" />
                  O sistema verifica duplicados automaticamente
                </li>
                <li className="mb-2">
                  <IconifyIcon icon="iconoir:check" className="text-success me-2" />
                  Após o processamento, você verá o resumo dos resultados
                </li>
              </ul>

              <hr className="my-3" />

              <h6 className="mb-2">Formato Excel</h6>
              <Table bordered size="sm" className="bg-white">
                <thead className="table-light">
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

      {/* Botões de Ação */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="outline-secondary"
          onClick={() => router.back()}
        >
          <IconifyIcon icon="iconoir:navigate-left" className="me-2" />
          Voltar
        </Button>
        
        <Button
          variant="success"
          onClick={handleProcessar}
          disabled={processando || !empresaSelecionada || loadingEmpresas}
          size="lg"
        >
          {processando ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Processando...
            </>
          ) : (
            <>
              <IconifyIcon icon="iconoir:plus" className="me-2" />
              Criar Participantes
            </>
          )}
        </Button>
      </div>
    </>
  )
}
