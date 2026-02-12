# API Routes - Rumo Saudável
## Documentação Completa dos Endpoints

**Base URL:** `http://localhost:8000/api`  
**Autenticação:** Bearer Token (JWT)

---

## Índice
1. [Autenticação](#1-autenticação)
2. [Admin - Dashboard](#2-admin---dashboard)
3. [Admin - Empresas](#3-admin---empresas)
4. [Admin - Participantes](#4-admin---participantes)
5. [Admin - Programas](#5-admin---programas)
6. [Admin - Questionários](#6-admin---questionários)
7. [Admin - Relatórios](#7-admin---relatórios)
8. [Admin - Usuários](#8-admin---usuários)
9. [Participante](#9-participante)
10. [Empresa](#10-empresa)
11. [Público](#11-público)

---

## 1. AUTENTICAÇÃO

### 1.1 Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "login": "joao.silva",
  "password": "senha123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@empresa.com",
    "login": "joao.silva",
    "type": 2,
    "id_empresa": 5,
    "cadastrado": 1,
    "termo_consentimento": 1,
    "log": "2026-02-04 10:30:00",
    "empresa": {
      "id": 5,
      "nome": "Empresa XYZ",
      "cor": "#FF6600",
      "logotipo": "logo.png",
      "slug": "empresa-xyz"
    }
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Credenciais inválidas",
  "error": "Login ou senha incorretos"
}
```

---

### 1.2 Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

### 1.3 Esqueci Minha Senha
```http
POST /api/auth/forgot-password
Content-Type: application/json
```

**Request:**
```json
{
  "email": "joao@empresa.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Email de recuperação enviado"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Email não encontrado"
}
```

---

### 1.4 Resetar Senha
```http
POST /api/auth/reset-password
Content-Type: application/json
```

**Request:**
```json
{
  "token": "abc123token",
  "password": "novaSenha123",
  "password_confirmation": "novaSenha123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

**Response Error (422):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "password": ["As senhas não conferem"]
  }
}
```

---

### 1.5 Dados do Usuário Logado
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@empresa.com",
    "login": "joao.silva",
    "type": 2,
    "id_empresa": 5,
    "cadastrado": 1,
    "empresa": {
      "id": 5,
      "nome": "Empresa XYZ",
      "cor": "#FF6600",
      "logotipo": "logo.png"
    }
  }
}
```

---

## 2. ADMIN - DASHBOARD

### 2.1 Estatísticas do Dashboard
```http
GET /api/adm/dashboard
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "empresas": 15,
    "participantes": 1250,
    "questionarios": 25
  }
}
```

---

## 3. ADMIN - EMPRESAS

### 3.1 Listar Todas as Empresas
```http
GET /api/adm/empresas
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `search` - Busca por nome
- `page` - Página atual (default: 1)
- `per_page` - Itens por página (default: 20)

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Empresa ABC",
      "introducao": "<p>Bem-vindo...</p>",
      "cor": "#FF6600",
      "logotipo": "logo-abc.png",
      "slug": "empresa-abc",
      "termo_consentimento": "s",
      "id_campo_dashboard_heatmap_1": null,
      "id_campo_dashboard_heatmap_2": null,
      "total_cadastrados": 150,
      "total_respondentes": 89,
      "total_questionarios_finalizados": 267,
      "created_at": "2026-01-15 10:00:00",
      "updated_at": "2026-02-01 14:30:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 20,
    "total": 100
  }
}
```

---

### 3.2 Criar Empresa
```http
POST /api/adm/empresas
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**
```javascript
// FormData
{
  "nome": "Empresa XYZ",
  "introducao": "<p>Texto de boas-vindas...</p>",
  "cor": "#00AA00",
  "termo_consentimento": true,
  "logotipo": [File], // arquivo de imagem
  "slug": "empresa-xyz", // opcional, gerado automaticamente
  "campos_padrao": ["nome", "faixa_etaria", "sexo"],
  "campos_extra": [
    {
      "nome": "Setor",
      "tipo": "radio",
      "alternativas": ["TI", "RH", "Financeiro"]
    },
    {
      "nome": "Matrícula",
      "tipo": "text"
    }
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Empresa criada com sucesso",
  "data": {
    "id": 6,
    "nome": "Empresa XYZ",
    "slug": "empresa-xyz",
    "cor": "#00AA00",
    "created_at": "2026-02-04 11:00:00"
  }
}
```

**Response Error (422):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "nome": ["O campo nome é obrigatório"],
    "cor": ["O campo cor é obrigatório"]
  }
}
```

---

### 3.3 Obter Empresa Específica
```http
GET /api/adm/empresas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Empresa ABC",
    "introducao": "<p>Bem-vindo...</p>",
    "cor": "#FF6600",
    "logotipo": "logo-abc.png",
    "slug": "empresa-abc",
    "termo_consentimento": "s",
    "id_campo_dashboard_heatmap_1": null,
    "id_campo_dashboard_heatmap_2": null,
    "created_at": "2026-01-15 10:00:00",
    "updated_at": "2026-02-01 14:30:00"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Empresa não encontrada"
}
```

---

### 3.4 Atualizar Empresa
```http
PUT /api/adm/empresas/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:** (mesmo formato da criação, campos opcionais)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Empresa atualizada com sucesso",
  "data": {
    "id": 1,
    "nome": "Empresa ABC Atualizada",
    "updated_at": "2026-02-04 15:30:00"
  }
}
```

---

### 3.5 Deletar Empresa
```http
DELETE /api/adm/empresas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Empresa deletada com sucesso"
}
```

---

### 3.6 Listar Participantes da Empresa
```http
GET /api/adm/empresas/:id/participantes
Authorization: Bearer {token}
```

**Query Parameters (opcional):**
- `search` - Busca por login ou nome
- `page` - Página atual
- `per_page` - Itens por página

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "login": "participante1",
      "name": "João Silva",
      "email": "joao@empresa.com",
      "id_empresa": 1,
      "termo_consentimento": 1,
      "cadastrado": 1,
      "log": "2026-02-04 09:00:00",
      "faixa_etaria": "25-34 anos",
      "termometro_cor": "verde",
      "termometro_bg": "#00AA00",
      "depressao": null,
      "ansiedade": null,
      "questionarios_finalizados": 3,
      "suicidio": "não respondeu",
      "created_at": "2026-01-20 10:00:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 8,
    "per_page": 20,
    "total": 150
  }
}
```

---

### 3.7 Listar Campos Personalizados da Empresa
```http
GET /api/adm/empresas/:id/campos
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "id_empresa": 1,
      "campo": "Faixa Etária",
      "tipo": "radio",
      "pos": 1,
      "alternativas": [
        "18-24 anos",
        "25-34 anos",
        "35-44 anos"
      ],
      "created_at": "2026-01-15 10:00:00"
    },
    {
      "id": 2,
      "id_empresa": 1,
      "campo": "Setor",
      "tipo": "text",
      "pos": 2,
      "alternativas": [],
      "created_at": "2026-01-15 10:00:00"
    }
  ]
}
```

---

### 3.8 Criar Login de Empresa (Gestor)
```http
POST /api/adm/empresas/:id/logins
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "login": "gestor.empresa",
  "password": "senhaSegura123",
  "email": "gestor@empresa.com",
  "acessa_dash": true,
  "acessa_relatorios": true,
  "campos_permitidos": [1, 2, 3] // IDs dos campos para filtro
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Login criado com sucesso",
  "data": {
    "id": 25,
    "login": "gestor.empresa",
    "email": "gestor@empresa.com",
    "type": 3,
    "id_empresa": 1,
    "created_at": "2026-02-04 11:00:00"
  }
}
```

---

### 3.9 Configurar Filtros do Dashboard
```http
POST /api/adm/empresas/:id/filtros
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "id_campo_dashboard_heatmap_1": 1, // ID do campo para heatmap
  "id_campo_dashboard_heatmap_2": null // ID do campo para semáforo (ou null)
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Filtros configurados com sucesso"
}
```

---

### 3.10 Deletar Campo Personalizado
```http
DELETE /api/adm/campos-empresas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Campo deletado com sucesso"
}
```

---

## 4. ADMIN - PARTICIPANTES

### 4.1 Adicionar Participantes em Lote
```http
POST /api/adm/participantes/batch
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (Modo Texto):**
```javascript
// FormData
{
  "empresa_id": "1",
  "logins": "user1;user2;user3", // separados por ; ou ,
  "senha_padrao": "rumo2026" // opcional
}
```

**Request (Modo Arquivo):**
```javascript
// FormData
{
  "empresa_id": "1",
  "arquivo": [File], // Excel .xlsx, .xls ou .csv
  "senha_padrao": "rumo2026" // opcional
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Participantes criados com sucesso",
  "data": {
    "criados": 3,
    "duplicados": ["user2"], // logins que já existiam
    "total": 3
  }
}
```

---

### 4.2 Obter Dados do Participante
```http
GET /api/adm/participantes/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 10,
      "name": "João Silva",
      "email": "joao@empresa.com",
      "login": "participante1",
      "id_empresa": 1,
      "cadastrado": 1,
      "termo_consentimento": 1,
      "log": "2026-02-04 09:00:00",
      "created_at": "2026-01-20 10:00:00"
    },
    "dados_pessoais": [
      {
        "campo": "Faixa Etária",
        "resposta": "25-34 anos"
      },
      {
        "campo": "Setor",
        "resposta": "TI"
      }
    ],
    "historico_coaching": [
      {
        "id": 1,
        "data": "2026-02-01",
        "texto": "<p>Primeira sessão...</p>",
        "arquivos": [
          {
            "id": 1,
            "nome": "relatorio.pdf",
            "url": "/storage/arquivos/relatorio.pdf"
          }
        ],
        "created_at": "2026-02-01 14:00:00"
      }
    ],
    "contatos": [
      {
        "id": 1,
        "data": "2026-02-03",
        "hora_inicio": "09:00",
        "hora_final": "09:30",
        "tipo_contato": "Telefone",
        "contato": "Ligação para agendamento",
        "created_at": "2026-02-03 09:30:00"
      }
    ]
  }
}
```

---

### 4.3 Adicionar Histórico de Coaching
```http
POST /api/adm/participantes/:id/historico-coaching
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**
```javascript
// FormData
{
  "data": "2026-02-04",
  "texto": "<p>Observações da sessão...</p>",
  "arquivos": [File, File] // múltiplos arquivos opcionais
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Histórico adicionado com sucesso",
  "data": {
    "id": 5,
    "data": "2026-02-04",
    "texto": "<p>Observações da sessão...</p>",
    "arquivos": [
      {
        "id": 3,
        "nome": "documento.pdf",
        "url": "/storage/arquivos/documento.pdf"
      }
    ],
    "created_at": "2026-02-04 16:00:00"
  }
}
```

---

### 4.4 Atualizar Histórico de Coaching
```http
PUT /api/adm/historico-coaching/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request:**
```javascript
// FormData
{
  "data": "2026-02-04",
  "texto": "<p>Texto atualizado...</p>",
  "arquivos": [File] // novos arquivos (opcional)
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Histórico atualizado com sucesso",
  "data": {
    "id": 5,
    "data": "2026-02-04",
    "texto": "<p>Texto atualizado...</p>"
  }
}
```

---

### 4.5 Deletar Histórico de Coaching
```http
DELETE /api/adm/historico-coaching/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Histórico deletado com sucesso"
}
```

---

### 4.6 Adicionar Contato
```http
POST /api/adm/participantes/:id/contatos
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "data": "2026-02-04",
  "hora_inicio": "14:00",
  "hora_final": "14:30",
  "tipo_contato": "Email",
  "contato": "Email enviado sobre agendamento"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Contato registrado com sucesso",
  "data": {
    "id": 2,
    "data": "2026-02-04",
    "hora_inicio": "14:00",
    "hora_final": "14:30",
    "tipo_contato": "Email",
    "contato": "Email enviado sobre agendamento",
    "created_at": "2026-02-04 16:30:00"
  }
}
```

---

### 4.7 Deletar Contato
```http
DELETE /api/adm/contatos/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Contato deletado com sucesso"
}
```

---

### 4.8 Simular Acesso (Login como Participante)
```http
POST /api/adm/participantes/:id/simular-acesso
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Acesso simulado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 10,
      "name": "João Silva",
      "type": 2,
      "id_empresa": 1
    }
  }
}
```

---

### 4.9 Pesquisar Usuários
```http
GET /api/adm/pesquisar-usuarios
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` - Termo de busca
- `page` - Página atual
- `per_page` - Itens por página (default: 20)

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "login": "participante1",
      "name": "João Silva",
      "email": "joao@empresa.com",
      "empresa": "Empresa ABC",
      "cadastrado": 1,
      "link": "/adm/info-participante/10"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

---

## 5. ADMIN - PROGRAMAS

### 5.1 Listar Todos os Programas
```http
GET /api/adm/programas
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Programa de Saúde Mental 2026",
      "introducao": "<p>Bem-vindo ao programa...</p>",
      "ordenacao_questionarios": "1,2,3",
      "empresas": [
        {
          "id": 1,
          "nome": "Empresa ABC",
          "logotipo": "logo-abc.png",
          "intervalo_inicio": "2026-01-01",
          "intervalo_termino": "2026-12-31",
          "intervalo_tipo": null
        },
        {
          "id": 2,
          "nome": "Empresa XYZ",
          "logotipo": "logo-xyz.png",
          "intervalo_inicio": null,
          "intervalo_termino": null,
          "intervalo_tipo": "indeterminado"
        }
      ],
      "created_at": "2026-01-01 08:00:00"
    }
  ]
}
```

---

### 5.2 Criar Programa
```http
POST /api/adm/programas
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "nome": "Novo Programa",
  "introducao": "<p>Descrição do programa...</p>",
  "questionarios": [1, 2, 3], // IDs dos questionários
  "ordenacao_questionarios": "3,1,2" // ordem de exibição (opcional)
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Programa criado com sucesso",
  "data": {
    "id": 5,
    "nome": "Novo Programa",
    "created_at": "2026-02-04 11:00:00"
  }
}
```

---

### 5.3 Obter Programa Específico
```http
GET /api/adm/programas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Programa de Saúde Mental 2026",
    "introducao": "<p>Bem-vindo...</p>",
    "ordenacao_questionarios": "1,2,3",
    "questionarios": [
      {
        "id": 1,
        "nome": "Questionário PHQ-9",
        "nome_site": "Avaliação de Saúde Mental"
      }
    ],
    "empresas": [...],
    "created_at": "2026-01-01 08:00:00"
  }
}
```

---

### 5.4 Atualizar Programa
```http
PUT /api/adm/programas/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "nome": "Programa Atualizado",
  "introducao": "<p>Nova descrição...</p>",
  "questionarios": [1, 2], // nova lista de questionários
  "ordenacao_questionarios": "2,1"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Programa atualizado com sucesso"
}
```

---

### 5.5 Deletar Programa
```http
DELETE /api/adm/programas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Programa deletado com sucesso"
}
```

---

### 5.6 Duplicar Programa
```http
POST /api/adm/programas/:id/duplicar
Authorization: Bearer {token}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Programa duplicado com sucesso",
  "data": {
    "id": 6,
    "nome": "Programa de Saúde Mental 2026 (Cópia)",
    "created_at": "2026-02-04 11:30:00"
  }
}
```

---

### 5.7 Vincular Empresa ao Programa
```http
POST /api/adm/programas/:id/empresas
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "id_empresa": 3
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Empresa vinculada com sucesso",
  "data": {
    "id": 10,
    "id_programa": 1,
    "id_empresa": 3,
    "created_at": "2026-02-04 11:00:00"
  }
}
```

---

### 5.8 Remover Vínculo Empresa-Programa
```http
DELETE /api/adm/programas/:id/empresas/:empresaId
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Vínculo removido com sucesso"
}
```

---

### 5.9 Configurar Intervalo do Programa
```http
POST /api/adm/programas/:id/empresas/:empresaId/intervalo
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "intervalo_inicio": "2026-03-01",
  "intervalo_termino": "2026-06-30"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Intervalo configurado com sucesso"
}
```

---

### 5.10 Tornar Intervalo Indeterminado
```http
DELETE /api/adm/programas/:id/empresas/:empresaId/intervalo
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Intervalo definido como indeterminado"
}
```

---

### 5.11 Listar Acessos de Participantes
```http
GET /api/adm/empresas/:empresaId/programas/:programaId/acessos
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "name": "João Silva",
      "login": "participante1",
      "tem_acesso": true // false se estiver em controle_acessos
    },
    {
      "id": 11,
      "name": "Maria Souza",
      "login": "participante2",
      "tem_acesso": false
    }
  ]
}
```

---

### 5.12 Atualizar Acesso de Participante
```http
POST /api/adm/empresas/:empresaId/programas/:programaId/acessos
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "id_user": 11,
  "tem_acesso": true // true = permite acesso, false = bloqueia
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Acesso atualizado com sucesso"
}
```

---

## 6. ADMIN - QUESTIONÁRIOS

### 6.1 Listar Todos os Questionários
```http
GET /api/adm/questionarios
Authorization: Bearer {token}
```

**Query Parameters:**
- `search` - Busca por nome
- `page` - Página atual

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "PHQ-9",
      "nome_site": "Avaliação de Depressão",
      "descricao": "<p>Questionário PHQ-9...</p>",
      "tipo_resultado": "soma_pontos_termometro",
      "qtd_perguntas": 9,
      "created_at": "2026-01-10 08:00:00"
    }
  ]
}
```

---

### 6.2 Criar Questionário
```http
POST /api/adm/questionarios
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "nome": "Novo Questionário",
  "nome_site": "Nome para o Participante",
  "descricao": "<p>Introdução do questionário...</p>",
  "info_adm": "<p>Informações para admin...</p>"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Questionário criado com sucesso",
  "data": {
    "id": 10,
    "nome": "Novo Questionário",
    "created_at": "2026-02-04 12:00:00"
  }
}
```

---

### 6.3 Obter Questionário Específico
```http
GET /api/adm/questionarios/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "PHQ-9",
    "nome_site": "Avaliação de Depressão",
    "descricao": "<p>Questionário...</p>",
    "info_adm": "<p>Info admin...</p>",
    "tipo_resultado": "soma_pontos_termometro",
    "texto_depressao": "<p>Texto sobre depressão...</p>",
    "texto_ansiedade": "<p>Texto sobre ansiedade...</p>",
    "exibir_somente_texto_relatorios": 0,
    "created_at": "2026-01-10 08:00:00",
    "updated_at": "2026-02-01 10:00:00"
  }
}
```

---

### 6.4 Atualizar Questionário
```http
PUT /api/adm/questionarios/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "nome": "PHQ-9 Atualizado",
  "nome_site": "Avaliação de Saúde Mental",
  "descricao": "<p>Nova descrição...</p>",
  "info_adm": "<p>Nova info...</p>"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Questionário atualizado com sucesso"
}
```

---

### 6.5 Deletar Questionário (Soft Delete)
```http
DELETE /api/adm/questionarios/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Questionário movido para lixeira"
}
```

---

### 6.6 Duplicar Questionário
```http
POST /api/adm/questionarios/:id/duplicar
Authorization: Bearer {token}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Questionário duplicado com sucesso",
  "data": {
    "id": 11,
    "nome": "PHQ-9 (Cópia)",
    "created_at": "2026-02-04 12:30:00"
  }
}
```

---

### 6.7 Exportar Questionário
```http
GET /api/adm/questionarios/:id/exportar
Authorization: Bearer {token}
```

**Response Success (200):**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- File: `questionario.docx`

---

### 6.8 Definir Tipo de Resultado
```http
POST /api/adm/questionarios/:id/tipo-resultado
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "tipo_resultado": "soma_pontos_termometro"
}
```

**Tipos válidos:**
- `soma_alternativas_pizza`
- `soma_pontos_pizza`
- `soma_pontos_termometro`
- `media_pontos_fontesdestress`
- `grupo_perguntas_me`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Tipo de resultado atualizado"
}
```

---

### 6.9 Listar Perguntas do Questionário
```http
GET /api/adm/questionarios/:id/perguntas
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "id_questionario": 1,
      "nome": "Pouco interesse ou prazer...",
      "nome_site": "Nas últimas 2 semanas...",
      "nome_curto": "Interesse",
      "explicacao": "Considere o seu humor geral",
      "tipo": "me",
      "escolha_hipotese": "1",
      "pos": 1,
      "grupo_nome": "Humor",
      "grupo_pos": 1,
      "dimensao_nome": "Psicológico",
      "dimensao_pos": 1,
      "tipo_dependente": null,
      "id_dependente": null,
      "s_pontuacao": 0,
      "s_tipo": null,
      "s_comentario": null,
      "n_pontuacao": 0,
      "n_tipo": null,
      "n_comentario": null,
      "flag": "depressao_indice",
      "flag_ansiedade": null,
      "alternativas": [
        {
          "id": 1,
          "alternativa": "Nenhum dia",
          "pontuacao": 0,
          "tipo": "negativo",
          "comentario": ""
        },
        {
          "id": 2,
          "alternativa": "Vários dias",
          "pontuacao": 1,
          "tipo": "negativo",
          "comentario": ""
        }
      ]
    }
  ]
}
```

---

### 6.10 Criar Pergunta
```http
POST /api/adm/questionarios/:id/perguntas
Authorization: Bearer {token}
Content-Type: application/json
```

**Request (Múltipla Escolha):**
```json
{
  "nome": "Pergunta Admin",
  "nome_site": "Pergunta Participante",
  "nome_curto": "Pergunta",
  "explicacao": "Tooltip",
  "tipo": "me",
  "escolha_hipotese": "1",
  "grupo_nome": "Grupo 1",
  "grupo_pos": 1,
  "dimensao_nome": "Dimensão 1",
  "dimensao_pos": 1,
  "alternativas": [
    {
      "alternativa": "Opção 1",
      "pontuacao": 1,
      "tipo": "positivo",
      "comentario": "Comentário"
    }
  ]
}
```

**Request (Sim/Não):**
```json
{
  "nome": "Pergunta SN",
  "nome_site": "Você sente...?",
  "nome_curto": "Sentimento",
  "explicacao": "",
  "tipo": "sn",
  "s_pontuacao": 1,
  "s_tipo": "positivo",
  "s_comentario": "Bom",
  "n_pontuacao": 0,
  "n_tipo": "negativo",
  "n_comentario": "Ruim"
}
```

**Request (Dissertativa):**
```json
{
  "nome": "Pergunta Dissertativa",
  "nome_site": "Descreva...",
  "nome_curto": "Descrição",
  "explicacao": "",
  "tipo": "dissertativa"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pergunta criada com sucesso",
  "data": {
    "id": 15,
    "nome": "Pergunta Admin",
    "created_at": "2026-02-04 13:00:00"
  }
}
```

---

### 6.11 Criar Pergunta Dependente
```http
POST /api/adm/perguntas/dependente
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "id_questionario": 1,
  "id_dependente": 5, // ID da pergunta pai ou alternativa
  "tipo_dependente": "s", // 's', 'n', ou 'me'
  "nome": "Pergunta Dependente",
  "nome_site": "Pergunta detalhe",
  "tipo": "me",
  "escolha_hipotese": "1",
  "alternativas": [...]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Pergunta dependente criada"
}
```

---

### 6.12 Obter Pergunta Específica
```http
GET /api/adm/perguntas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Pergunta...",
    "tipo": "me",
    "alternativas": [...]
  }
}
```

---

### 6.13 Atualizar Pergunta
```http
PUT /api/adm/perguntas/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:** (mesmo formato da criação)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pergunta atualizada"
}
```

---

### 6.14 Deletar Pergunta
```http
DELETE /api/adm/perguntas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Pergunta deletada"
}
```

---

### 6.15 Salvar Ordenação de Perguntas
```http
POST /api/adm/questionarios/:id/ordenar
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
[
  {
    "dimensao_nome": "Psicológico",
    "dimensao_pos": 1,
    "grupos": [
      {
        "grupo_nome": "Humor",
        "grupo_pos": 1,
        "perguntas": [
          { "id": 1, "pos": 1 },
          { "id": 2, "pos": 2 }
        ]
      }
    ]
  }
]
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Ordenação salva"
}
```

---

### 6.16 Adicionar Alternativa
```http
POST /api/adm/perguntas/:id/alternativas
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "alternativa": "Nova opção",
  "pontuacao": 2,
  "tipo": "positivo",
  "comentario": "Comentário"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 20,
    "alternativa": "Nova opção"
  }
}
```

---

### 6.17 Deletar Alternativa
```http
DELETE /api/adm/alternativas/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Alternativa deletada"
}
```

---

### 6.18 Listar Intervalos do Questionário
```http
GET /api/adm/questionarios/:id/intervalos
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "id_questionario": 1,
      "cor": "#00AA00",
      "legenda": "verde",
      "intervalo_inicio": 0,
      "intervalo_termino": 4,
      "texto": "<p>Resultado baixo...</p>",
      "created_at": "2026-01-15 10:00:00"
    },
    {
      "id": 2,
      "cor": "#FFD700",
      "legenda": "amarelo",
      "intervalo_inicio": 5,
      "intervalo_termino": 9,
      "texto": "<p>Resultado moderado...</p>"
    }
  ]
}
```

---

### 6.19 Criar Intervalo
```http
POST /api/adm/questionarios/:id/intervalos
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "cor": "#FF0000",
  "legenda": "vermelho",
  "intervalo_inicio": 20,
  "intervalo_termino": 27,
  "texto": "<p>Resultado alto...</p>"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "cor": "#FF0000",
    "legenda": "vermelho"
  }
}
```

---

### 6.20 Atualizar Intervalo
```http
PUT /api/adm/intervalos/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:** (mesmo formato da criação)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Intervalo atualizado"
}
```

---

### 6.21 Deletar Intervalo
```http
DELETE /api/adm/intervalos/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Intervalo deletado"
}
```

---

### 6.22 Salvar Textos de Depressão/Ansiedade
```http
POST /api/adm/questionarios/:id/textos
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "texto_depressao": "<p>Texto sobre depressão...</p>",
  "texto_ansiedade": "<p>Texto sobre ansiedade...</p>"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Textos atualizados"
}
```

---

## 7. ADMIN - RELATÓRIOS

### 7.1 Dashboard Analítico
```http
GET /api/adm/relatorios/:empresaId/dashboard
Authorization: Bearer {token}
```

**Query Parameters:**
- `idquestionario` - ID do questionário
- `idprograma` - ID do programa
- `tipo` - Tipo de relatório (media-pontos, soma-alternativas, etc.)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "questionario": {
      "id": 1,
      "nome": "PHQ-9"
    },
    "total_participantes": 150,
    "total_respostas": 135,
    "resultados": [
      {
        "pergunta": "Pouco interesse...",
        "alternativa": "Nenhum dia",
        "quantidade": 45,
        "percentual": 33.3
      }
    ],
    "por_campo": [
      {
        "campo": "Faixa Etária",
        "valor": "25-34 anos",
        "quantidade": 50,
        "percentual": 37
      }
    ]
  }
}
```

---

### 7.2 Dashboard Gráfico (Pizza)
```http
GET /api/adm/relatorios/:empresaId/grafico
Authorization: Bearer {token}
```

**Query Parameters:**
- `idquestionario` - ID do questionário
- `idprograma` - ID do programa
- `campo` - ID do campo para filtro (opcional)
- `camporesposta` - Valor da resposta do campo (opcional)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "tipo": "soma_alternativas_pizza",
    "aspectos_positivos": 89,
    "aspectos_negativos": 46,
    "total": 135,
    "labels": ["Positivo", "Negativo"],
    "datasets": [
      {
        "data": [89, 46],
        "backgroundColor": ["#00AA00", "#FF0000"]
      }
    ]
  }
}
```

---

### 7.3 Relatório Semáforo
```http
GET /api/adm/relatorios/:empresaId/semaforo
Authorization: Bearer {token}
```

**Query Parameters:**
- `idquestionario` - ID do questionário
- `idprograma` - ID do programa
- `campo` - ID do campo para filtro
- `camporesposta` - Valor da resposta
- `campo2` - Segundo campo (opcional)
- `camporesposta2` - Valor do segundo campo (opcional)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "labels": ["Grupo 1", "Grupo 2", "Grupo 3"],
    "datasets": [
      {
        "label": "Alto Risco",
        "data": [10, 20, 15],
        "backgroundColor": "#FF0000"
      },
      {
        "label": "Risco Moderado",
        "data": [30, 25, 35],
        "backgroundColor": "#FFD700"
      },
      {
        "label": "Ausência Risco",
        "data": [60, 55, 50],
        "backgroundColor": "#00AA00"
      }
    ]
  }
}
```

---

### 7.4 Relatório Heatmap
```http
GET /api/adm/relatorios/:empresaId/heatmap
Authorization: Bearer {token}
```

**Query Parameters:**
- `idquestionario` - ID do questionário
- `idprograma` - ID do programa
- `campo` - ID do campo para filtro

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "series": [
      {
        "name": "Grupo 1",
        "data": [
          { "x": "18-24 anos", "y": 15 },
          { "x": "25-34 anos", "y": 25 },
          { "x": "35-44 anos", "y": 35 }
        ]
      },
      {
        "name": "Grupo 2",
        "data": [
          { "x": "18-24 anos", "y": 20 },
          { "x": "25-34 anos", "y": 30 },
          { "x": "35-44 anos", "y": 40 }
        ]
      }
    ],
    "dt_ultima_pergunta": "04/02/2026",
    "campo_nome": "Faixa Etária"
  }
}
```

---

### 7.5 Relatório Individual do Participante
```http
GET /api/adm/relatorios/:userId/:questionarioId/individual
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 10,
      "name": "João Silva",
      "login": "participante1"
    },
    "questionario": {
      "id": 1,
      "nome": "PHQ-9",
      "tipo_resultado": "soma_pontos_termometro"
    },
    "respostas": [
      {
        "id": 1,
        "pergunta": "Pouco interesse...",
        "tipo_pergunta": "me",
        "resposta": "Vários dias",
        "pontuacao": 1,
        "alternativa_tipo": "negativo",
        "comentario": "",
        "dependente": null
      },
      {
        "id": 2,
        "pergunta": "Pergunta dependente",
        "tipo_pergunta": "me",
        "resposta": "Sim",
        "dependente": {
          "pergunta_pai": "Você respondeu 'Sim'?",
          "resposta_ativadora": "Sim"
        }
      }
    ],
    "total_pontos": 8,
    "termometro": {
      "cor": "amarelo",
      "bg": "#FFD700",
      "legenda": "moderado"
    }
  }
}
```

---

### 7.6 Filtros do Semáforo
```http
GET /api/adm/relatorios/semaforo/filtros
Authorization: Bearer {token}
```

**Query Parameters:**
- `filter_id` - ID do campo
- `idempresa` - ID da empresa

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    { "name": "18-24 anos", "total": 30 },
    { "name": "25-34 anos", "total": 50 },
    { "name": "35-44 anos", "total": 40 }
  ]
}
```

---

## 8. ADMIN - USUÁRIOS

### 8.1 Listar Usuários Administrativos
```http
GET /api/adm/usuarios
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin Master",
      "email": "admin@rumosaudavel.com",
      "login": "admin",
      "type": 1,
      "created_at": "2026-01-01 08:00:00"
    }
  ]
}
```

---

### 8.2 Criar Usuário Administrativo
```http
POST /api/adm/usuarios
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Novo Admin",
  "email": "novo@rumosaudavel.com",
  "login": "novo.admin",
  "password": "senhaSegura123"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Usuário criado",
  "data": {
    "id": 5,
    "name": "Novo Admin"
  }
}
```

---

### 8.3 Obter Usuário
```http
GET /api/adm/usuarios/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin Master",
    "email": "admin@rumosaudavel.com",
    "login": "admin",
    "type": 1
  }
}
```

---

### 8.4 Atualizar Usuário
```http
PUT /api/adm/usuarios/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Admin Master Atualizado",
  "email": "admin@rumosaudavel.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Usuário atualizado"
}
```

---

### 8.5 Deletar Usuário
```http
DELETE /api/adm/usuarios/:id
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Usuário deletado"
}
```

---

## 9. PARTICIPANTE

### 9.1 Home do Participante
```http
GET /api/participante/home
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "questionarios": [
      {
        "id": 1,
        "nome": "PHQ-9",
        "nome_site": "Avaliação de Saúde Mental",
        "id_programa": 1,
        "nome_programa": "Programa 2026",
        "finalizado": true,
        "data_finalizacao": "2026-02-01 14:00:00",
        "progresso": 100
      },
      {
        "id": 2,
        "nome": "GAD-7",
        "nome_site": "Avaliação de Ansiedade",
        "id_programa": 1,
        "finalizado": false,
        "data_finalizacao": null,
        "progresso": 40
      }
    ],
    "fora_prazo": false,
    "respondeu": 1,
    "total_questionarios": 2,
    "empresa": {
      "id": 1,
      "nome": "Empresa ABC",
      "cor": "#FF6600"
    }
  }
}
```

**Response Error (302):**
```json
{
  "success": false,
  "redirect": "/boas-vindas",
  "message": "Usuário não cadastrado"
}
```

---

### 9.2 Listar Campos de Cadastro
```http
GET /api/participante/campos
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "campo": "Faixa Etária",
      "tipo": "radio",
      "pos": 1,
      "alternativas": [
        "18-24 anos",
        "25-34 anos",
        "35-44 anos"
      ]
    },
    {
      "id": 2,
      "campo": "Setor",
      "tipo": "text",
      "pos": 2,
      "alternativas": []
    }
  ],
  "empresa": {
    "id": 1,
    "nome": "Empresa ABC",
    "cor": "#FF6600",
    "termo_consentimento": "s"
  },
  "termo": {
    "texto": "<p>Termo de consentimento...</p>"
  }
}
```

---

### 9.3 Salvar Cadastro
```http
POST /api/participante/cadastro
Authorization: Bearer {token}
Content-Type: application/json
```

**Request (Participante já logado - Primeiro Acesso):**
```json
{
  "email": "joao@empresa.com",
  "senha_atual": "rumo2026", // senha padrão
  "nova_senha": "novaSenha123",
  "consentimento": true,
  "respostas": {
    "1": "25-34 anos",
    "2": "TI"
  }
}
```

**Request (Campanha - Novo Usuário):**
```json
{
  "login": "novo.participante",
  "password": "senha123",
  "password_confirmation": "senha123",
  "email": "novo@empresa.com",
  "consentimento": true,
  "respostas": {
    "1": "25-34 anos",
    "2": "TI"
  },
  "id_empresa": 1
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 100,
      "name": "",
      "login": "novo.participante",
      "type": 2,
      "cadastrado": 1
    }
  }
}
```

---

### 9.4 Obter Próxima Pergunta
```http
GET /api/participante/questionario/:questionarioId/:programaId
Authorization: Bearer {token}
```

**Query Parameters:**
- `retorno` - 1 se está retornando ao questionário

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "pergunta": {
      "id": 1,
      "nome": "Pouco interesse ou prazer em fazer as coisas",
      "nome_site": "Nas últimas 2 semanas, com que frequência você se sentiu com pouco interesse ou prazer em fazer as coisas?",
      "explicacao": "Considere seu humor geral",
      "tipo": "me",
      "escolha_hipotese": "1",
      "grupo_nome": "Humor",
      "dependencia": null
    },
    "alternativas": [
      {
        "id": 1,
        "alternativa": "Nenhum dia",
        "pontuacao": 0,
        "tipo": "negativo"
      },
      {
        "id": 2,
        "alternativa": "Vários dias",
        "pontuacao": 1,
        "tipo": "negativo"
      },
      {
        "id": 3,
        "alternativa": "Mais da metade dos dias",
        "pontuacao": 2,
        "tipo": "negativo"
      },
      {
        "id": 4,
        "alternativa": "Quase todos os dias",
        "pontuacao": 3,
        "tipo": "negativo"
      }
    ],
    "questionario": {
      "id": 1,
      "nome": "PHQ-9",
      "nome_site": "Avaliação de Saúde Mental",
      "descricao": "<p>Este questionário avalia...</p>"
    },
    "programa": {
      "id": 1,
      "nome": "Programa 2026"
    },
    "progresso": {
      "atual": 1,
      "total": 9,
      "percentual": 11.1
    },
    "total_respostas": 0,
    "primeira_pergunta": true
  }
}
```

**Response Pergunta Dependente (200):**
```json
{
  "success": true,
  "data": {
    "pergunta": {
      "id": 5,
      "nome": "Se sim, qual frequência?",
      "tipo": "me",
      "dependencia": {
        "pergunta_pai": "Você sentiu vontade de chorar?",
        "resposta_ativadora": "Sim"
      }
    },
    "alternativas": [...]
  }
}
```

**Response Questionário Completo (200):**
```json
{
  "success": true,
  "redirect": "/participante",
  "message": "Questionário finalizado",
  "alerta": "Você tem um próximo questionário",
  "status": "Você finalizou este questionário. Clique no botão [relatório] para conferir seu resultado."
}
```

---

### 9.5 Enviar Resposta
```http
POST /api/participante/resposta
Authorization: Bearer {token}
Content-Type: application/json
```

**Request (Múltipla Escolha Única):**
```json
{
  "id_questionario": 1,
  "id_programa": 1,
  "id_pergunta": 1,
  "tipo": "me",
  "alternativa": 2
}
```

**Request (Múltipla Escolha Múltipla):**
```json
{
  "id_questionario": 1,
  "id_programa": 1,
  "id_pergunta": 1,
  "tipo": "me",
  "alternativas": [1, 2, 3]
}
```

**Request (Sim/Não):**
```json
{
  "id_questionario": 1,
  "id_programa": 1,
  "id_pergunta": 10,
  "tipo": "sn",
  "sn_resposta": "s"
}
```

**Request (Dissertativa):**
```json
{
  "id_questionario": 1,
  "id_programa": 1,
  "id_pergunta": 15,
  "tipo": "dissertativa",
  "dissertativa": "Texto da resposta..."
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Resposta salva",
  "redirect": "/participante/questionario/1/1"
}
```

**Response Error - Dupla Submissão (422):**
```json
{
  "success": false,
  "message": "Você já respondeu esta pergunta",
  "error": "duplicate_response"
}
```

---

### 9.6 Relatório do Participante
```http
GET /api/participante/relatorio/:questionarioId
Authorization: Bearer {token}
```

**Response Success (200) - Tipo Pizza:**
```json
{
  "success": true,
  "data": {
    "questionario": {
      "id": 1,
      "nome": "Avaliação Geral",
      "nome_site": "Avaliação de Saúde Mental",
      "tipo_resultado": "soma_alternativas_pizza"
    },
    "tipo_resultado": "soma_alternativas_pizza",
    "texto_resultado": "<p>Seu resultado indica...</p>",
    "aspectos": {
      "positivo": 15,
      "negativo": 5
    },
    "respostas": [
      {
        "pergunta": "Você dorme bem?",
        "tipo": "sn",
        "resposta": "Sim",
        "comentario": "Bom sono é essencial",
        "tipo_aspecto": "positivo"
      },
      {
        "pergunta": "Você se sente estressado?",
        "tipo": "sn",
        "resposta": "Sim",
        "comentario": "Procure ajuda",
        "tipo_aspecto": "negativo"
      }
    ],
    "pontos_fortes": ["Dormir bem", "Alimentação saudável"],
    "aspectos_melhorar": ["Gerenciar estresse"]
  }
}
```

**Response Success (200) - Tipo Termômetro:**
```json
{
  "success": true,
  "data": {
    "questionario": {
      "id": 1,
      "nome": "PHQ-9",
      "tipo_resultado": "soma_pontos_termometro"
    },
    "tipo_resultado": "soma_pontos_termometro",
    "texto_resultado": "<p>Depressão moderada...</p>",
    "total_pontos": 12,
    "termometro": {
      "cor": "amarelo",
      "bg": "#FFD700",
      "legenda": "moderado"
    },
    "depressao": false,
    "ansiedade": false,
    "texto_depressao": "<p>Informações sobre depressão...</p>",
    "texto_ansiedade": "<p>Informações sobre ansiedade...</p>"
  }
}
```

---

### 9.7 Enviar Relatório por Email
```http
POST /api/participante/relatorio/:questionarioId/email
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "email": "joao@email.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Relatório enviado para joao@email.com"
}
```

---

### 9.8 Prontuário (Histórico Coaching)
```http
GET /api/participante/prontuario
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "data": "2026-02-01",
      "texto": "<p>Primeira sessão de coaching...</p>",
      "arquivos": [
        {
          "id": 1,
          "nome": "relatorio.pdf",
          "url": "/storage/arquivos/relatorio.pdf"
        }
      ],
      "created_at": "2026-02-01 14:00:00"
    }
  ]
}
```

---

### 9.9 Contatos
```http
GET /api/participante/contatos
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "data": "2026-02-03",
      "hora_inicio": "09:00",
      "hora_final": "09:30",
      "tipo_contato": "Telefone",
      "contato": "Ligação para agendamento",
      "created_at": "2026-02-03 09:30:00"
    }
  ]
}
```

---

## 10. EMPRESA

### 10.1 Dashboard da Empresa
```http
GET /api/empresa/dashboard
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "percentual": 65.5,
    "total": 98,
    "usuarios": 150,
    "total_respostas": 450,
    "campos_filtro": [
      {
        "id_campo": 1,
        "nome_campo": "Faixa Etária",
        "valores": [
          {
            "resposta": "25-34 anos",
            "total": 45,
            "percentual": 45.9
          },
          {
            "resposta": "35-44 anos",
            "total": 35,
            "percentual": 35.7
          }
        ]
      }
    ],
    "semaforo": {
      "groups": ["Grupo 1 (98)", "Grupo 2 (98)", "Grupo 3 (98)"],
      "altoRisco": [10.0, 20.0, 15.0],
      "riscoModerado": [30.0, 25.0, 35.0],
      "ausenciaRisco": [60.0, 55.0, 50.0]
    },
    "heatmap": {
      "series": [
        {
          "name": "Grupo 1",
          "data": [
            { "x": "18-24 anos", "y": 15.0 },
            { "x": "25-34 anos", "y": 25.0 }
          ]
        }
      ]
    },
    "configuracoes": {
      "acessa_dash": true,
      "acessa_relatorios": true
    },
    "checkCampanha": false,
    "empresa": {
      "id": 1,
      "nome": "Empresa ABC",
      "cor": "#FF6600",
      "logotipo": "logo.png"
    }
  }
}
```

---

### 10.2 Relatórios da Empresa
```http
GET /api/empresa/relatorios
Authorization: Bearer {token}
```

**Query Parameters:**
- `tipo` - grafico ou dashboard
- `idprograma` - ID do programa
- `idquestionario` - ID do questionário

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "tipo": "grafico",
    "resultados": [...]
  }
}
```

---

## 11. PÚBLICO

### 11.1 Obter Empresa por Slug
```http
GET /api/empresas/by-slug/:slug
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Empresa ABC",
    "introducao": "<p>Bem-vindo...</p>",
    "cor": "#FF6600",
    "logotipo": "logo-abc.png",
    "slug": "empresa-abc",
    "termo_consentimento": "s"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Empresa não encontrada"
}
```

---

### 11.2 Obter Termo de Consentimento
```http
GET /api/termo-consentimento
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "texto": "<p>Termo de consentimento...</p>"
  }
}
```

---

## CÓDIGOS DE STATUS HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso na requisição |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Sucesso sem conteúdo |
| 302 | Found - Redirecionamento |
| 400 | Bad Request - Erro na requisição |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 422 | Unprocessable Entity - Dados inválidos |
| 500 | Internal Server Error - Erro no servidor |

---

## ESTRUTURA PADRÃO DE RESPOSTAS

### Sucesso
```json
{
  "success": true,
  "message": "Mensagem descritiva",
  "data": { ... },
  "meta": { // Para listas paginadas
    "current_page": 1,
    "last_page": 10,
    "per_page": 20,
    "total": 200
  }
}
```

### Erro
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Código do erro",
  "errors": { // Para validação
    "campo": ["Mensagem de erro"]
  }
}
```

---

**FIM DA DOCUMENTAÇÃO**

Todas as rotas documentadas incluem:
- Método HTTP
- URL
- Headers necessários
- Parâmetros da requisição
- Exemplos de request
- Exemplos de response (sucesso e erro)
- Códigos de status
