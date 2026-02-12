# Integração com API Backend

## 📋 Visão Geral

Este documento descreve a integração do frontend com a API backend do projeto Rumo Saudável.

## 🔄 Modo de Funcionamento

O sistema suporta dois modos de operação:

### 1. Modo Demo (Atual)
- Dados são mockados localmente
- Todas as funcionalidades funcionam sem backend
- Ideal para desenvolvimento e demonstrações
- Ativado por: `NEXT_PUBLIC_DEMO_MODE=true` no `.env.local`

### 2. Modo Produção (Com API)
- Integração completa com backend
- Dados persistidos em banco de dados
- Requer API rodando em servidor

## 🚀 Migrando para Produção

### Passo 1: Configurar Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Passo 2: Estrutura de Endpoints

A API segue a estrutura REST:

```
/api
  /auth
    POST /login
    POST /logout
    POST /refresh
    GET  /me
  
  /empresas
    GET    /          (listar)
    POST   /          (criar)
    GET    /:id       (buscar)
    PUT    /:id       (atualizar)
    DELETE /:id       (remover)
    GET    /:id/participantes
    POST   /:id/campos
  
  /participantes
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    GET    /:id/prontuario
    GET    /:id/relatorios
    POST   /importar
  
  /programas
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    POST   /:id/questionarios
    DELETE /:id/questionarios/:questionarioId
  
  /questionarios
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    GET    /:id/perguntas
    POST   /:id/perguntas
    POST   /:id/respostas
  
  /relatorios
    GET /analitico
    GET /grafico
    GET /termometro
    GET /semaforo
    GET /individual/:participanteId
    POST /exportar
  
  /notificacoes
    GET  /
    POST /enviar
    GET  /templates
    POST /agendar
  
  /configuracoes
    GET  /
    PUT  /
    POST /backup
    POST /exportar
```

### Passo 3: Formato de Resposta

Todas as respostas da API seguem o formato:

```typescript
{
  "success": boolean,
  "data": T,
  "message": string,
  "errors": [
    {
      "field": string,
      "message": string,
      "code": string
    }
  ],
  "meta": {
    "page": number,
    "perPage": number,
    "total": number,
    "totalPages": number
  }
}
```

### Passo 4: Autenticação

A API usa JWT (JSON Web Token):

1. Login retorna `token` e `refreshToken`
2. Token deve ser enviado no header: `Authorization: Bearer <token>`
3. Token expira em 24h
4. Use refreshToken para renovar

## 📦 Serviços Disponíveis

### HTTP Base
```typescript
import { http, API_ENDPOINTS } from '@/services'

// GET
const response = await http.get('/endpoint')

// POST
const response = await http.post('/endpoint', { data })

// PUT
const response = await http.put('/endpoint', { data })

// DELETE
const response = await http.delete('/endpoint')
```

### Serviços Específicos

```typescript
import { 
  empresaService,
  participanteService,
  programaService,
  questionarioService,
  relatorioService 
} from '@/services'

// Empresas
const empresas = await empresaService.listar({ page: 1, perPage: 10 })
const empresa = await empresaService.buscarPorId(1)
await empresaService.criar({ nome: 'Nova Empresa', cnpj: '...' })

// Participantes
const participantes = await participanteService.listar()
await participanteService.criar({ nome: 'João', email: '...', empresaId: 1 })
await participanteService.importarExcel(arquivo, empresaId)

// Programas
const programas = await programaService.listar()
await programaService.vincularQuestionario(programaId, {
  questionarioId: 1,
  ordem: 1,
  obrigatorio: true
})

// Questionários
const questionarios = await questionarioService.listar()
await questionarioService.responder(questionarioId, {
  respostas: [{ perguntaId: 1, valor: 3 }]
})

// Relatórios
const analitico = await relatorioService.analitico()
const grafico = await relatorioService.grafico({ tipo: 'phq9', periodo: '30d' })
const blob = await relatorioService.exportar({ formato: 'pdf', tipo: 'analitico' })
```

## 🎣 Hooks Customizados

### useFetch - Buscar dados
```typescript
import { useFetch } from '@/hooks/api'
import { empresaService } from '@/services'

function MeuComponente() {
  const { data, loading, error, refetch } = useFetch(
    () => empresaService.buscarPorId(1)
  )
  
  if (loading) return <Loading />
  if (error) return <Erro message={error.message} />
  
  return <div>{data?.nome}</div>
}
```

### useMutation - Criar/Atualizar/Remover
```typescript
import { useMutation } from '@/hooks/api'
import { empresaService } from '@/services'

function MeuComponente() {
  const { mutate, loading, error } = useMutation(
    (data) => empresaService.criar(data)
  )
  
  const handleSubmit = async (formData) => {
    const result = await mutate(formData)
    if (result) {
      // Sucesso
    }
  }
}
```

### usePaginatedFetch - Listagem paginada
```typescript
import { usePaginatedFetch } from '@/hooks/api'
import { empresaService } from '@/services'

function ListaEmpresas() {
  const { 
    data, 
    meta, 
    loading, 
    nextPage, 
    prevPage, 
    goToPage 
  } = usePaginatedFetch((page, perPage) => 
    empresaService.listar({ page, perPage })
  )
  
  return (
    <div>
      {data?.map(empresa => <EmpresaCard key={empresa.id} {...empresa} />)}
      <Pagination 
        currentPage={meta?.page}
        totalPages={meta?.totalPages}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  )
}
```

## 🔐 Tratamento de Erros

Os erros da API são automaticamente tratados e lançados como exceções:

```typescript
try {
  await empresaService.criar(dados)
} catch (error) {
  if (error.status === 401) {
    // Token expirado, redirecionar para login
  }
  if (error.status === 400 && error.errors) {
    // Erros de validação
    error.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`)
    })
  }
  if (error.status === 500) {
    // Erro interno do servidor
  }
}
```

## 📊 Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autorizado (token inválido/expirado)
- `403` - Proibido (sem permissão)
- `404` - Não encontrado
- `422` - Entidade não processável (dados inválidos)
- `500` - Erro interno do servidor

## 📝 Exemplos de Uso

### Listar com Filtros
```typescript
const { data } = useEmpresas({
  search: 'tech',
  cidade: 'São Paulo',
  status: 'ativo',
  ordenarPor: 'nome',
  ordem: 'asc'
})
```

### Importar Participantes
```typescript
const { mutate: importar } = useImportarParticipantesExcel()

const handleFileUpload = async (arquivo: File) => {
  const resultado = await importar({ arquivo, empresaId: 1 })
  console.log(`${resultado?.importados} participantes importados`)
}
```

### Responder Questionário
```typescript
const { mutate: responder } = useMutation(
  (data) => questionarioService.responder(questionarioId, data)
)

const handleSubmit = async (respostas) => {
  const resultado = await responder({ respostas })
  console.log(`Pontuação: ${resultado?.pontuacao}`)
}
```

### Exportar Relatório
```typescript
const handleExport = async () => {
  const blob = await relatorioService.exportar({
    formato: 'excel',
    tipo: 'analitico',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31'
  })
  
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio.xlsx'
  a.click()
}
```

## 🧪 Testes

Para testar a integração com a API:

1. Suba o backend localmente
2. Atualize `.env.local` com a URL da API
3. Execute o frontend: `yarn dev`
4. Verifique o console para logs de requisições

## 📚 Recursos Adicionais

- [Documentação da API Backend](./API_ROUTES.md)
- [Tipos TypeScript](../types/api/index.ts)
- [Serviços](../services/index.ts)
- [Hooks](../hooks/api/index.ts)

---

## ✨ Notas

- Em modo demo, as requisições não são enviadas à API
- Os dados são mockados nos componentes
- Para produção, certifique-se de configurar corretamente as variáveis de ambiente
- Sempre trate erros nas requisições para melhor UX
