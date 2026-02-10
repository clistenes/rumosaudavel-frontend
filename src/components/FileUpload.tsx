'use client'

import { useState, useCallback } from 'react'
import { Form, Button, Alert, Table, Badge } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

interface FileUploadProps {
  accept?: string
  maxSize?: number // em MB
  onUpload?: (files: File[]) => void
  tipo?: 'imagem' | 'excel' | 'anexo'
}

export default function FileUpload({ 
  accept = '*', 
  maxSize = 10, 
  onUpload,
  tipo = 'anexo'
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getAcceptTypes = () => {
    switch (tipo) {
      case 'imagem':
        return 'image/*'
      case 'excel':
        return '.xlsx,.xls,.csv'
      case 'anexo':
        return '.pdf,.doc,.docx,.jpg,.jpeg,.png'
      default:
        return accept
    }
  }

  const getTipoLabel = () => {
    switch (tipo) {
      case 'imagem':
        return 'Imagens (JPG, PNG, GIF)'
      case 'excel':
        return 'Planilhas Excel (.xlsx, .xls, .csv)'
      case 'anexo':
        return 'Documentos e Imagens'
      default:
        return 'Arquivos'
    }
  }

  const validateFile = (file: File): boolean => {
    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo ${file.name} excede o tamanho máximo de ${maxSize}MB`)
      return false
    }

    // Verificar tipo (se for Excel)
    if (tipo === 'excel') {
      const validExtensions = ['.xlsx', '.xls', '.csv']
      const hasValidExtension = validExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
      if (!hasValidExtension) {
        setError(`Arquivo ${file.name} não é uma planilha válida`)
        return false
      }
    }

    return true
  }

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(false)
    
    const selectedFiles = Array.from(event.target.files || [])
    
    const validFiles = selectedFiles.filter(validateFile)
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [])

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Selecione pelo menos um arquivo')
      return
    }

    setUploading(true)
    setError(null)

    // Simular upload (modo demo)
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (onUpload) {
      onUpload(files)
    }

    setSuccess(true)
    setUploading(false)
    
    // Limpar após 3 segundos
    setTimeout(() => {
      setFiles([])
      setSuccess(false)
    }, 3000)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="border rounded p-3">
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-3">
          <IconifyIcon icon="iconoir:check" className="me-2" />
          Arquivos enviados com sucesso!
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>
          <IconifyIcon icon="iconoir:upload" className="me-2" />
          Selecionar {getTipoLabel()}
        </Form.Label>
        <Form.Control
          type="file"
          accept={getAcceptTypes()}
          onChange={handleFileChange}
          multiple
        />
        <Form.Text className="text-muted">
          Tamanho máximo: {maxSize}MB por arquivo
        </Form.Text>
      </Form.Group>

      {files.length > 0 && (
        <>
          <Table striped bordered hover size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Arquivo</th>
                <th>Tamanho</th>
                <th>Tipo</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{formatFileSize(file.size)}</td>
                  <td>
                    <Badge bg="secondary">{file.type || 'Desconhecido'}</Badge>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <IconifyIcon icon="iconoir:trash" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">
              {files.length} arquivo(s) selecionado(s)
            </span>
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <IconifyIcon icon="iconoir:upload" className="me-2" />
                  Enviar Arquivos
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
