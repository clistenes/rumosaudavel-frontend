# 📋 DOCUMENTO DE MIGRAÇÃO - LARAVEL TO REACT
## Rumo Saudável - Sistema de Questionários de Saúde Ocupacional

**Versão:** 1.0  
**Data:** 04/02/2026  
**Status:** Documento de Referência para Migração

---

## 📑 ÍNDICE

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Estrutura de Dados (Banco de Dados)](#2-estrutura-de-dados-banco-de-dados)
3. [Fluxo de Autenticação e Permissões](#3-fluxo-de-autenticação-e-permissões)
4. [Páginas e Componentes](#4-páginas-e-componentes)
5. [API Endpoints Necessários](#5-api-endpoints-necessários)
6. [Lógicas de Negócio Complexas](#6-lógicas-de-negócio-complexas)
7. [Checklist de Implementação](#7-checklist-de-implementação)

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1 Descrição
O **Rumo Saudável** é uma plataforma web para gestão de programas de saúde ocupacional e bem-estar. Permite que empresas criem questionários psicológicos, vinculem colaboradores e acompanhem resultados através de relatórios e dashboards analíticos.

### 1.2 Perfis de Usuário

| Tipo | Descrição | Permissões |
|------|-----------|------------|
| **Admin (1)** | Administrador da plataforma | Full access - gerencia empresas, programas, questionários e usuários |
| **Participante (2)** | Colaborador da empresa | Responde questionários, visualiza relatórios pessoais |
| **Empresa (3)** | Gestor da empresa | Acessa relatórios da empresa, visualiza participantes |

### 1.3 Módulos Principais

```
┌─────────────────────────────────────────────────────────────┐
│                    RUMO SAUDÁVEL                             │
├─────────────┬───────────────┬───────────────┬───────────────┤
│  QUESTIONÁRIOS │   PROGRAMAS   │   EMPRESAS    │   RELATÓRIOS  │
├─────────────┼───────────────┼───────────────┼───────────────┤
│ • Criar     │ • Criar       │ • Cadastrar   │ • Dashboard   │
│ • Editar    │ • Editar      │ • Editar      │ • Gráficos    │
│ • Visualizar│ • Vincular    │ • Participantes│ • Analíticos │
│ • Ordenar   │ • Intervalos  │ • Acessos     │ • Individuais │
│ • Dependências│ • Duplicar  │ • Termos      │ • Exportar    │
└─────────────┴───────────────┴───────────────┴───────────────┘
```

---

## 2. ESTRUTURA DE DADOS (BANCO DE DADOS)

### 2.1 Diagrama Entidade-Relacionamento

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│    EMPRESAS     │◄────┤  PROGRAMAS_EMPRESAS  ├────►│    PROGRAMAS    │
├─────────────────┤     ├──────────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)              │     │ id (PK)         │
│ nome            │     │ id_empresa (FK)      │     │ nome            │
│ introducao      │     │ id_programa (FK)     │     │ introducao      │
│ cor             │     │ intervalo_inicio     │     │ ordenacao_q...  │
│ logotipo        │     │ intervalo_termino    │     └────────┬────────┘
│ slug            │     └──────────────────────┘              │
│ termo_cons...   │                                          │
└────────┬────────┘                              ┌────────────┴────────┐
         │                                       │ PROGRAMAS_QUESTION  │
         │         ┌──────────────────┐          ├─────────────────────┤
         │         │   QUESTIONARIOS  │◄─────────┤ id (PK)             │
         │         ├──────────────────┤          │ id_programa (FK)    │
         │         │ id (PK)          │          │ id_questionario(FK) │
         │         │ nome             │          └─────────────────────┘
         │         │ nome_site        │
         │         │ descricao        │
         │         │ tipo_resultado   │
         │         │ deleted          │
         │         └────────┬─────────┘
         │                  │
         │    ┌─────────────┼─────────────┐
         │    │             │             │
         │    ▼             ▼             ▼
         │ ┌──────────┐ ┌──────────────┐ ┌──────────────────┐
         │ │ PERGUNTAS│ │ ALTERNATIVAS │ │ QUESTIONARIO_    │
         │ ├──────────┤ ├──────────────┤ │ INTERVALOS       │
         │ │id (PK)   │ │id (PK)       │ ├──────────────────┤
         │ │id_quest..│ │id_pergunta   │ │id (PK)           │
         │ │nome      │ │id_quest..    │ │id_questionario   │
         │ │tipo      │ │alternativa   │ │intervalo_inicio  │
         │ │pos       │ │pontuacao     │ │intervalo_termino │
         │ │id_depend │ │tipo          │ │cor               │
         │ │tipo_depe │ │comentario    │ │legenda           │
         │ │grupo_nome│ └──────────────┘ │texto             │
         │ │grupo_pos │                  └──────────────────┘
         │ └──────────┘
         │
         │    ┌──────────────────────────────┐
         └───►│            USERS             │
              ├──────────────────────────────┤
              │ id (PK)                      │
              │ name                         │
              │ email                        │
              │ login                        │
              │ password                     │
              │ type (1/2/3)                 │
              │ id_empresa (FK)              │
              │ cadastrado                   │
              └──────────┬───────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│PARTICIPANTES_   │ │PARTICIPANTES_   │ │PARTICIPANTES_       │
│QUESTIONARIOS    │ │RESPOSTAS        │ │CONTATOS             │
├─────────────────┤ ├─────────────────┤ ├─────────────────────┤
│id (PK)          │ │id (PK)          │ │id (PK)              │
│id_user (FK)     │ │id_user (FK)     │ │id_user (FK)         │
│id_questionario  │ │id_questionario  │ │data                 │
│id_programa      │ │id_programa      │ │hora_inicio          │
│termometro_cor   │ │id_pergunta      │ │hora_final           │
│termometro_bg    │ │tipo_pergunta    │ │tipo_contato         │
│depressao        │ │id_alternativa   │ │contato              │
│ansiedade        │ │s_n              │ └─────────────────────┘
└─────────────────┘ │dissertativa     │
                    └─────────────────┘
```

### 2.2 Tabelas e Colunas Detalhadas

#### 2.2.1 Tabela: `users`
**Descrição:** Armazena todos os usuários do sistema (admins, participantes, gestores)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | BIGINT UNSIGNED | PK Auto | ID único do usuário |
| `name` | VARCHAR(255) | Sim | Nome completo |
| `email` | VARCHAR(255) | Sim | Email único |
| `login` | VARCHAR(255) | Sim | Login para acesso |
| `password` | VARCHAR(255) | Sim | Senha hash |
| `type` | TINYINT | Sim | 1=Admin, 2=Participante, 3=Empresa |
| `id_empresa` | BIGINT | FK | Referência à empresa (null para admins) |
| `cadastrado` | TINYINT | | 1=Completou cadastro, null=Não |
| `remember_token` | VARCHAR(100) | | Token para "lembrar-me" |
| `log` | TIMESTAMP | | Último login do participante |
| `termo_consentimento` | TINYINT | | Aceitou termo de consentimento |
| `created_at` | TIMESTAMP | | Data de criação |
| `updated_at` | TIMESTAMP | | Data de atualização |

**Índices:**
- PRIMARY KEY (`id`)
- UNIQUE (`email`)
- INDEX (`id_empresa`, `type`)

---

#### 2.2.2 Tabela: `empresas`
**Descrição:** Cadastro de empresas clientes

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | BIGINT | PK | ID único |
| `nome` | VARCHAR(255) | Sim | Nome da empresa |
| `introducao` | TEXT | | Texto de boas-vindas |
| `cor` | VARCHAR(255) | Sim | Cor tema (ex: #FF6600) |
| `logotipo` | VARCHAR(255) | | Nome do arquivo do logo |
| `slug` | VARCHAR(255) | | URL amigável (ex: empresa-x) |
| `termo_consentimento` | VARCHAR(1) | | 's' ou 'n' |
| `id_campo_dashboard_heatmap_1` | BIGINT | | Campo para filtro heatmap |
| `id_campo_dashboard_heatmap_2` | BIGINT | | Campo para filtro semáforo |
| `created_at` | TIMESTAMP | | |
| `updated_at` | TIMESTAMP | | |

---

#### 2.2.3 Tabela: `campos_empresas`
**Descrição:** Campos personalizados do cadastro de participantes por empresa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | ID único |
| `id_empresa` | BIGINT FK | Referência empresa |
| `campo` | VARCHAR(255) | Nome do campo (ex: "Faixa Etária") |
| `tipo` | VARCHAR(255) | 'text' ou 'radio' |
| `pos` | INT | Ordem de exibição |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.4 Tabela: `campos_empresas_respostas`
**Descrição:** Respostas dos participantes aos campos personalizados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | ID único |
| `id_campo` | BIGINT FK | Referência campo |
| `id_empresa` | BIGINT FK | Referência empresa |
| `id_user` | BIGINT FK | Referência usuário |
| `tipo_pergunta` | VARCHAR | 'radio' ou 'dissertativa' |
| `resposta` | TEXT | Valor da resposta |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.5 Tabela: `programas`
**Descrição:** Programas de saúde/bem-estar

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | ID único |
| `nome` | VARCHAR(255) | Nome do programa |
| `introducao` | TEXT | Texto introdutório |
| `ordenacao_questionarios` | TEXT | Ordem dos questionários (IDs separados por vírgula) |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.6 Tabela: `programas_empresas`
**Descrição:** Vínculo entre programas e empresas com datas de disponibilidade

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_programa` | BIGINT FK | Referência programa |
| `id_empresa` | BIGINT FK | Referência empresa |
| `intervalo_inicio` | DATE | Data início do programa na empresa |
| `intervalo_termino` | DATE | Data término |
| `intervalo_tipo` | VARCHAR | 'indeterminado' ou null |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.7 Tabela: `programas_questionarios`
**Descrição:** Questionários vinculados a cada programa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_programa` | BIGINT FK | Referência programa |
| `id_questionario` | BIGINT FK | Referência questionário |
| `deleted` | VARCHAR | Soft delete flag |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.8 Tabela: `questionarios`
**Descrição:** Questionários/Formulários

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `nome` | VARCHAR(255) | Nome interno (admin) |
| `nome_site` | VARCHAR(255) | Nome exibido para participantes |
| `descricao` | TEXT | Introdução do questionário |
| `info_adm` | TEXT | Informações para admin |
| `tipo_resultado` | VARCHAR(255) | Tipo de resultado (ver seção 6.1) |
| `texto_depressao` | TEXT | Texto específico para depressão |
| `texto_ansiedade` | TEXT | Texto específico para ansiedade |
| `exibir_somente_texto_relatorios` | TINYINT | Flag para modo texto apenas |
| `deleted` | VARCHAR | Soft delete (1=deletado, 2=deletado permanente) |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.9 Tabela: `perguntas`
**Descrição:** Perguntas dos questionários

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_questionario` | BIGINT FK | Referência questionário |
| `nome` | TEXT | Texto da pergunta (admin) |
| `nome_site` | TEXT | Texto exibido ao participante |
| `nome_curto` | VARCHAR(255) | Nome curto para relatórios |
| `explicacao` | TEXT | Explicação adicional (tooltip) |
| `tipo` | VARCHAR(50) | 'me', 'sn', 'dissertativa' |
| `pos` | INT | Ordem na lista |
| `grupo_nome` | VARCHAR(255) | Nome do grupo (ex: "Estresse") |
| `grupo_pos` | INT | Ordem do grupo |
| `dimensao_nome` | VARCHAR(255) | Nome da dimensão (ex: "Psicológico") |
| `dimensao_pos` | INT | Ordem da dimensão |
| `tipo_dependente` | VARCHAR | 's', 'n', 'me' ou null |
| `id_dependente` | BIGINT | ID da pergunta/alternativa pai |
| `escolha_hipotese` | VARCHAR | '1' para escolha única, null para múltipla |
| `s_pontuacao` | DECIMAL | Pontos para resposta "Sim" |
| `s_tipo` | VARCHAR | Tipo "Sim" ('positivo', 'negativo') |
| `s_comentario` | TEXT | Comentário para "Sim" |
| `n_pontuacao` | DECIMAL | Pontos para resposta "Não" |
| `n_tipo` | VARCHAR | Tipo "Não" |
| `n_comentario` | TEXT | Comentário para "Não" |
| `flag` | VARCHAR | Flag especial (ex: 'depressao_indice') |
| `flag_ansiedade` | VARCHAR | Flag ansiedade |
| `id_clonagem` | BIGINT | ID original ao duplicar |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.10 Tabela: `alternativas`
**Descrição:** Alternativas de resposta para perguntas de múltipla escolha

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_pergunta` | BIGINT FK | Referência pergunta |
| `id_questionario` | BIGINT FK | Referência questionário |
| `alternativa` | TEXT | Texto da alternativa |
| `pontuacao` | DECIMAL | Valor em pontos |
| `tipo` | VARCHAR | 'positivo', 'negativo', 'neutro' |
| `comentario` | TEXT | Comentário associado |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.11 Tabela: `questionario_intervalos`
**Descrição:** Intervalos de pontuação para resultados (ex: termômetro)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_questionario` | BIGINT FK | Referência questionário |
| `intervalo_inicio` | DECIMAL | Pontuação mínima |
| `intervalo_termino` | DECIMAL | Pontuação máxima |
| `cor` | VARCHAR | Cor hex (ex: #00AA00) |
| `legenda` | VARCHAR | Label (ex: "verde", "baixo") |
| `texto` | TEXT | Texto do resultado para este intervalo |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.12 Tabela: `participantes_questionarios`
**Descrição:** Registro de questionários completados por participantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_user` | BIGINT FK | Referência usuário |
| `id_questionario` | BIGINT FK | Referência questionário |
| `id_programa` | BIGINT FK | Referência programa |
| `termometro_cor` | VARCHAR | Cor do termômetro (ex: "verde") |
| `termometro_bg` | VARCHAR | Cor hex do termômetro |
| `depressao` | VARCHAR | 'sim' ou null |
| `ansiedade` | VARCHAR | 'sim' ou null |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.13 Tabela: `participantes_respostas`
**Descrição:** Respostas individuais dos participantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_empresa` | BIGINT FK | Referência empresa |
| `id_user` | BIGINT FK | Referência usuário |
| `id_programa` | BIGINT FK | Referência programa |
| `id_questionario` | BIGINT FK | Referência questionário |
| `id_pergunta` | BIGINT FK | Referência pergunta |
| `tipo_pergunta` | VARCHAR | 'me', 'sn', 'dissertativa' |
| `id_alternativa_resposta` | BIGINT | ID alternativa escolhida |
| `multiplas_respostas` | TINYINT | 1 se múltiplas alternativas |
| `s_n` | VARCHAR | 's' ou 'n' para sim/não |
| `dissertativa` | TEXT | Resposta dissertativa |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.14 Tabela: `participantes_contatos`
**Descrição:** Histórico de contatos com participantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_user` | BIGINT FK | Referência usuário |
| `data` | DATE | Data do contato |
| `hora_inicio` | TIME | Hora início |
| `hora_final` | TIME | Hora término |
| `tipo_contato` | VARCHAR | Tipo (ex: "Telefone", "Email") |
| `contato` | TEXT | Descrição do contato |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.15 Tabela: `participante_historico_coaching`
**Descrição:** Histórico de sessões de coaching

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_user` | BIGINT FK | Referência usuário |
| `data` | DATE | Data da sessão |
| `texto` | TEXT | Anotações da sessão |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.16 Tabela: `upload_historico_coaching`
**Descrição:** Arquivos anexados ao histórico de coaching

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_user` | BIGINT FK | Referência usuário |
| `id_historico` | BIGINT FK | Referência histórico |
| `nome` | VARCHAR | Nome do arquivo |
| `arquivo` | VARCHAR | Nome do arquivo no servidor |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.17 Tabela: `controle_acessos`
**Descrição:** Controle de acesso negado a programas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `id_user` | BIGINT FK | Referência usuário |
| `id_programa` | BIGINT FK | Referência programa |
| `id_empresa` | BIGINT FK | Referência empresa |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.18 Tabela: `configuracao`
**Descrição:** Configurações de acesso para usuários empresa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `user_id` | BIGINT FK | Referência usuário |
| `empresa_id` | BIGINT FK | Referência empresa |
| `acessa_dash` | TINYINT | Acesso a dashboard analítico |
| `acessa_relatorios` | TINYINT | Acesso a relatórios gráficos |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.19 Tabela: `termo_consentimento`
**Descrição:** Termo de consentimento padrão

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `texto` | TEXT | Conteúdo do termo |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

#### 2.2.20 Tabela: `log_errors`
**Descrição:** Log de erros do sistema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT PK | |
| `erro` | TEXT | Mensagem de erro |
| `url` | VARCHAR | URL onde ocorreu |
| `arquivo` | VARCHAR | Arquivo/arquivos relacionados |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

---

## 3. FLUXO DE AUTENTICAÇÃO E PERMISSÕES

### 3.1 Fluxograma de Login

```
┌─────────────┐
│   Login     │
│   Page      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ POST /api/login │
│ {login, password}│
└───────┬─────────┘
        │
        ▼
┌──────────────────┐
│ Validar Credenciais│
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
  Sucesso   Falha
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│Gerar   │ │Retornar  │
│JWT     │ │Erro 401  │
│Token   │ │          │
└───┬────┘ └──────────┘
    │
    ▼
┌────────────────┐
│ Redirecionar   │
│ baseado no     │
│ user.type:     │
│ • 1 → /adm     │
│ • 2 → /participante│
│ • 3 → /empresa │
└────────────────┘
```

### 3.2 Middleware de Permissões

```javascript
// Estrutura de middlewares necessários
const middlewares = {
  auth: (req, res, next) => {
    // Verificar JWT válido
  },
  
  admin: (req, res, next) => {
    // Verificar req.user.type === 1
  },
  
  participante: (req, res, next) => {
    // Verificar req.user.type === 2
    // Verificar se cadastrado
  },
  
  empresa: (req, res, next) => {
    // Verificar req.user.type === 3
    // Verificar se tem acesso ao recurso
  },
  
  checkEmpresaOwnership: (req, res, next) => {
    // Verificar se user.id_empresa === recurso.id_empresa
  }
};
```

### 3.3 Rotas Protegidas

```
Públicas:
├── POST /api/auth/login
├── POST /api/auth/forgot-password
├── POST /api/auth/reset-password
└── GET /api/empresas/:slug (portal login)

Admin (type=1):
├── /adm/* (todas as rotas)
├── GET /api/adm/dashboard
├── CRUD /api/adm/empresas
├── CRUD /api/adm/programas
├── CRUD /api/adm/questionarios
├── CRUD /api/adm/usuarios
└── GET /api/adm/relatorios/*

Participante (type=2):
├── /participante/*
├── GET /api/participante/home
├── GET /api/participante/questionario/:id
├── POST /api/participante/resposta
├── GET /api/participante/relatorio/:id
└── GET /api/participante/prontuario

Empresa (type=3):
├── /empresa/*
├── GET /api/empresa/dashboard
├── GET /api/empresa/relatorios
└── GET /api/empresa/participantes
```

---

## 4. PÁGINAS E COMPONENTES

### 4.1 Estrutura de Pastas do Projeto React

```
src/
├── components/
│   ├── Layout/
│   │   ├── AdminLayout.jsx
│   │   ├── ParticipantLayout.jsx
│   │   ├── CompanyLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Card.jsx
│   │   ├── Alert.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── DatePicker.jsx
│   │   ├── RichTextEditor.jsx
│   │   ├── FileUpload.jsx
│   │   ├── Loading.jsx
│   │   └── Tooltip.jsx
│   ├── Charts/
│   │   ├── PieChart.jsx
│   │   ├── BarChart.jsx
│   │   ├── HeatmapChart.jsx
│   │   ├── TermometerChart.jsx
│   │   └── RiskChart.jsx
│   ├── Questionario/
│   │   ├── QuestionForm.jsx
│   │   ├── QuestionList.jsx
│   │   ├── AlternativeForm.jsx
│   │   ├── DependentQuestion.jsx
│   │   ├── SortableQuestion.jsx
│   │   └── IntervalForm.jsx
│   └── Relatorios/
│       ├── ReportPie.jsx
│       ├── ReportTermometer.jsx
│       ├── ReportHeatmap.jsx
│       ├── ReportRisk.jsx
│       └── ReportTable.jsx
├── pages/
│   ├── Public/
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   ├── Admin/
│   │   ├── Dashboard.jsx
│   │   ├── Empresas/
│   │   │   ├── List.jsx
│   │   │   ├── Create.jsx
│   │   │   ├── Edit.jsx
│   │   │   └── Participants.jsx
│   │   ├── Programas/
│   │   │   ├── List.jsx
│   │   │   ├── Create.jsx
│   │   │   └── Edit.jsx
│   │   ├── Questionarios/
│   │   │   ├── List.jsx
│   │   │   ├── Create.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── View.jsx
│   │   │   └── Intervals.jsx
│   │   ├── Usuarios/
│   │   │   ├── List.jsx
│   │   │   └── Create.jsx
│   │   └── Relatorios/
│   │       ├── Dashboard.jsx
│   │       ├── Graficos.jsx
│   │       └── Individual.jsx
│   ├── Participante/
│   │   ├── Home.jsx
│   │   ├── Welcome.jsx
│   │   ├── Cadastro.jsx
│   │   ├── Questionario.jsx
│   │   ├── Relatorio.jsx
│   │   ├── Prontuario.jsx
│   │   └── Contatos.jsx
│   └── Empresa/
│       ├── Dashboard.jsx
│       └── Relatorios.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   ├── useQuestionario.js
│   ├── useEmpresa.js
│   └── useRelatorio.js
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── NotificationContext.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── empresaService.js
│   ├── programaService.js
│   ├── questionarioService.js
│   ├── participanteService.js
│   └── relatorioService.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   ├── validators.js
│   └── formatters.js
└── styles/
    ├── global.css
    ├── variables.css
    └── components/
```

### 4.2 Páginas Detalhadas

#### 4.2.1 PÁGINA: Login (`/portal/:slug?`)

**Rota:** `/`, `/portal`, `/portal/:slug`
**Layout:** Público (sem sidebar)

**Props/State:**
```javascript
// State
const [login, setLogin] = useState('');
const [password, setPassword] = useState('');
const [empresa, setEmpresa] = useState(null); // se houver slug
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

// Se slug presente na URL, buscar empresa para branding
// GET /api/empresas/by-slug/:slug
```

**Funcionalidades:**
1. Formulário de login (login + senha)
2. Link "Esqueci minha senha"
3. Se slug presente, mostrar branding da empresa (logo, cor)
4. Validação client-side
5. Submissão para `/api/auth/login`
6. Redirecionamento baseado no tipo de usuário

**Componentes:**
- `LoginForm`
- `CompanyBranding` (condicional)
- `Alert` (para erros)

**API Calls:**
```javascript
// Carregar empresa (se slug)
GET /api/empresas/by-slug/:slug

// Login
POST /api/auth/login
Body: { login, password }
Response: { token, user: { id, name, type, id_empresa } }
```

---

#### 4.2.2 PÁGINA: Admin Dashboard (`/adm`)

**Rota:** `/adm`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
// Data
const [stats, setStats] = useState({
  empresas: 0,
  participantes: 0,
  questionarios: 0
});

// GET /api/adm/dashboard
```

**Funcionalidades:**
1. Cards animados com estatísticas
2. Links rápidos para seções
3. Acesso ao manual de uso

**Componentes:**
- `StatCard` × 4
- `AnimatedContainer`

**API Calls:**
```javascript
GET /api/adm/dashboard
Response: {
  empresas: number,
  participantes: number,
  questionarios: number
}
```

---

#### 4.2.3 PÁGINA: Lista de Questionários (`/adm/lista-questionarios`)

**Rota:** `/adm/lista-questionarios`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [questionarios, setQuestionarios] = useState([]);
const [loading, setLoading] = useState(true);

// GET /api/adm/questionarios
```

**Funcionalidades:**
1. Tabela DataTable com:
   - Nome do questionário
   - Data de criação
   - Quantidade de perguntas
   - Ações: Visualizar, Relatórios (intervalos), Duplicar
2. Ordenação e busca
3. Paginação

**Componentes:**
- `DataTable`
- `ActionButtons`
- `LoadingSpinner`

**API Calls:**
```javascript
GET /api/adm/questionarios
Response: [{
  id,
  nome,
  created_at,
  qtd_perguntas
}]

POST /api/adm/questionarios/:id/duplicar
```

---

#### 4.2.4 PÁGINA: Visualizar Questionário (`/adm/visualizar-questionario/:id`)

**Rota:** `/adm/visualizar-questionario/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [questionario, setQuestionario] = useState(null);
const [perguntas, setPerguntas] = useState([]);
const [dimensoes, setDimensoes] = useState([]);
const [tipoResultado, setTipoResultado] = useState('');

// GET /api/adm/questionarios/:id
// GET /api/adm/questionarios/:id/perguntas
// GET /api/adm/questionarios/:id/dimensoes (se tipo_resultado === 'grupo_perguntas_me')
```

**Funcionalidades:**
1. **Cabeçalho:**
   - Nome do questionário
   - Descrição
   - Botões: Apagar, Expandir/Recolher, Info Adm, Exportar, Tipo Resultado

2. **Seção Dimensões/Grupos** (se tipo_resultado === 'grupo_perguntas_me'):
   - Listagem de dimensões
   - Cada dimensão contém grupos
   - Drag-and-drop para ordenar
   - Botão "Nova Dimensão"
   - Botão "Novo Grupo"

3. **Lista de Perguntas:**
   - Drag-and-drop sortable
   - Mostrar: posição, nome, tipo
   - Expandir para ver alternativas (se ME)
   - Botões: Editar, Nova Pergunta Dependente
   - Indicador de perguntas dependentes

4. **Ações:**
   - "Salvar Ordenação" (POST perguntas/reordenar)
   - "Nova Pergunta" → redireciona para /adm/nova-pergunta/:id

**Componentes:**
- `QuestionarioHeader`
- `DimensoesManager` (drag-drop)
- `SortableQuestionList`
- `QuestionCard` (expandable)
- `TipoResultadoModal`

**API Calls:**
```javascript
// Carregar questionário
GET /api/adm/questionarios/:id
Response: {
  id, nome, nome_site, descricao, tipo_resultado, info_adm
}

// Carregar perguntas
GET /api/adm/questionarios/:id/perguntas
Response: [{
  id, nome, nome_site, tipo, pos, grupo_nome, grupo_pos,
  dimensao_nome, dimensao_pos, id_dependente, tipo_dependente,
  alternativas: [...]
}]

// Salvar ordenação
POST /api/adm/questionarios/:id/ordenar
Body: [{
  dimensao_nome,
  dimensao_pos,
  grupos: [{
    grupo_nome,
    grupo_pos,
    perguntas: [{ id, pos }]
  }]
}]

// Definir tipo resultado
POST /api/adm/questionarios/:id/tipo-resultado
Body: { tipo_resultado }

// Apagar questionário (soft delete)
DELETE /api/adm/questionarios/:id

// Duplicar
POST /api/adm/questionarios/:id/duplicar

// Exportar
GET /api/adm/questionarios/:id/exportar
Response: arquivo .docx
```

---

#### 4.2.5 PÁGINA: Nova/Editar Pergunta (`/adm/nova-pergunta/:questionarioId`, `/adm/editar-pergunta/:id`)

**Rota:** 
- Nova: `/adm/nova-pergunta/:questionarioId`
- Editar: `/adm/editar-pergunta/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [pergunta, setPergunta] = useState({
  nome: '',
  nome_site: '',
  nome_curto: '',
  explicacao: '',
  tipo: 'me', // 'me', 'sn', 'dissertativa'
  escolha_hipotese: '1', // '1' = única, 'n' = múltipla
  // Para tipo 'sn':
  s_pontuacao: 0,
  s_tipo: 'positivo',
  s_comentario: '',
  n_pontuacao: 0,
  n_tipo: 'negativo',
  n_comentario: '',
  // Para tipo 'me':
  alternativas: [
    { alternativa: '', pontuacao: 0, tipo: 'positivo', comentario: '' }
  ]
});

// GET /api/adm/perguntas/:id (se editar)
// GET /api/adm/questionarios/:id (para link de voltar)
```

**Funcionalidades:**
1. **Campos Básicos:**
   - Nome (admin)
   - Nome site (participante)
   - Nome curto (relatórios)
   - Explicação (tooltip)

2. **Tipo de Pergunta (radio):**
   - Dissertativa (texto livre)
   - Sim/Não
   - Múltipla Escolha

3. **Se Sim/Não:**
   - Configuração para "Sim": pontuação, tipo, comentário
   - Configuração para "Não": pontuação, tipo, comentário

4. **Se Múltipla Escolha:**
   - Escolha da hipótese: Única ou Múltipla
   - Lista dinâmica de alternativas
   - Cada alternativa: texto, pontuação, tipo (positivo/negativo/neutro), comentário
   - Botão "Nova Alternativa"
   - Sugestões de alternativas em datalist

5. **Ações:**
   - Salvar
   - Apagar (se editar)

**Componentes:**
- `QuestionTypeSelector`
- `SimNaoConfig`
- `AlternativaForm` (array dinâmico)
- `RichTextEditor` (para explicação)

**API Calls:**
```javascript
// Criar pergunta
POST /api/adm/questionarios/:id/perguntas
Body: {
  nome, nome_site, nome_curto, explicacao, tipo,
  escolha_hipotese, // se me
  s_pontuacao, s_tipo, s_comentario, // se sn
  n_pontuacao, n_tipo, n_comentario, // se sn
  alternativas: [...] // se me
}

// Atualizar pergunta
PUT /api/adm/perguntas/:id
Body: { ...mesmo formato }

// Apagar pergunta
DELETE /api/adm/perguntas/:id

// Apagar alternativa
DELETE /api/adm/alternativas/:id

// Adicionar alternativa (em pergunta existente)
POST /api/adm/perguntas/:id/alternativas
Body: { alternativa, pontuacao, tipo, comentario }
```

**Lógica Especial:**
- Ao mudar tipo, mostrar/esconder seções correspondentes
- Validar que pelo menos 2 alternativas para ME
- Pontuação pode ser negativa
- Tipos: 'positivo', 'negativo', 'neutro'

---

#### 4.2.6 PÁGINA: Pergunta Dependente (`/adm/pergunta-dependente/:tipo/:id`)

**Rota:** `/adm/pergunta-dependente/:tipo/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Descrição:** Cria pergunta que só aparece baseada em resposta anterior

**Props/State:**
```javascript
const { tipo, id } = useParams(); // tipo: 's', 'n', ou 'me'
const [perguntaPai, setPerguntaPai] = useState(null);
const [alternativaPai, setAlternativaPai] = useState(null); // se tipo='me'

// Se tipo='s' ou 'n': GET /api/adm/perguntas/:id
// Se tipo='me': GET /api/adm/alternativas/:id (e buscar pergunta pai)
```

**Funcionalidades:**
1. Mostrar pergunta pai e resposta que dispara
   - Se tipo='s': mostra "Quando responder 'Sim'"
   - Se tipo='n': mostra "Quando responder 'Não'"
   - Se tipo='me': mostra alternativa específica

2. Form igual à nova pergunta (seção 4.2.5)

3. Salvar com:
   - tipo_dependente = tipo ('s', 'n', 'me')
   - id_dependente = id

**API Calls:**
```javascript
POST /api/adm/perguntas/dependente
Body: {
  id_questionario,
  id_dependente,
  tipo_dependente, // 's', 'n', 'me'
  nome, nome_site, tipo,
  alternativas: [...] // se me
  // ... demais campos
}
```

---

#### 4.2.7 PÁGINA: Configurar Intervalos (`/adm/intervalo/:questionarioId`)

**Rota:** `/adm/intervalo/:questionarioId`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [questionario, setQuestionario] = useState(null);
const [intervalos, setIntervalos] = useState([]);
const [editingIntervalo, setEditingIntervalo] = useState(null);
const [formData, setFormData] = useState({
  cor: '#00AA00',
  legenda: '',
  intervalo_inicio: 0,
  intervalo_termino: 0,
  texto: ''
});

// GET /api/adm/questionarios/:id/intervalos
// GET /api/adm/questionarios/:id
```

**Funcionalidades:**
1. **Formulário de Intervalo:**
   - Color picker para cor
   - Legenda (ex: "verde", "baixo")
   - Intervalo numérico (início e fim)
   - Texto do resultado (WYSIWYG)

2. **Lista de Intervalos:**
   - Mostrar todos os intervalos configurados
   - Ordenar por intervalo_inicio
   - Editar e Apagar

3. **Se tipo_resultado === 'soma_pontos_termometro':**
   - Campos adicionais:
     - Texto para depressão
     - Texto para ansiedade

**Validações:**
- Intervalos não podem se sobrepor
- Todos os campos obrigatórios

**Componentes:**
- `IntervalForm`
- `IntervalList`
- `ColorPicker`
- `RichTextEditor`

**API Calls:**
```javascript
// Listar intervalos
GET /api/adm/questionarios/:id/intervalos
Response: [{
  id, cor, legenda, intervalo_inicio, intervalo_termino, texto
}]

// Criar intervalo
POST /api/adm/questionarios/:id/intervalos
Body: { cor, legenda, intervalo_inicio, intervalo_termino, texto }

// Atualizar intervalo
PUT /api/adm/intervalos/:id
Body: { ... }

// Apagar intervalo
DELETE /api/adm/intervalos/:id

// Salvar textos depressão/ansiedade
POST /api/adm/questionarios/:id/textos
Body: { texto_depressao, texto_ansiedade }
```

---

#### 4.2.8 PÁGINA: Lista de Empresas (`/adm/lista-empresas`)

**Rota:** `/adm/lista-empresas`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [empresas, setEmpresas] = useState([]);

// GET /api/adm/empresas
```

**Funcionalidades:**
1. Tabela com:
   - Logo da empresa
   - Nome (com borda na cor da empresa)
   - Termo de Consentimento (sim/não)
   - Botões: Analíticos, Gráficos
   - Contadores: Cadastrados, Respondentes, Questionários Finalizados
   - Link para portal (copiável)
   - Botão Editar

2. Botão "Nova Empresa"

**API Calls:**
```javascript
GET /api/adm/empresas
Response: [{
  id, nome, logotipo, cor, termo_consentimento, slug,
  total_cadastrados, total_respondentes, total_questionarios
}]
```

---

#### 4.2.9 PÁGINA: Nova/Editar Empresa (`/adm/adicionar-empresa`, `/adm/editar-empresa/:id`)

**Rota:**
- Nova: `/adm/adicionar-empresa`
- Editar: `/adm/editar-empresa/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [empresa, setEmpresa] = useState({
  nome: '',
  introducao: '',
  cor: '#FF6600',
  termo_consentimento: false,
  logotipo: null,
  slug: '',
  // Campos padrão
  campos_padrao: ['nome', 'faixa_etaria', 'sexo', 'estado_civil', 'celular'],
  // Campos customizados
  campos_extra: []
});

// GET /api/adm/empresas/:id (se editar)
// GET /api/adm/empresas/:id/campos (se editar)
```

**Funcionalidades:**

1. **Informações Básicas:**
   - Nome da empresa
   - Introdução (WYSIWYG)
   - Cor (color picker)
   - Logo (upload de imagem)
   - Termo de Consentimento (toggle)

2. **Link de Acesso:** (somente edição)
   - Mostrar slug atual
   - Botão para alterar slug

3. **Campos Padrão (checkboxes):**
   - Nome
   - Faixa Etária
   - Sexo
   - Estado Civil
   - Celular/Celular 2

4. **Campos Personalizados:**
   - Lista dinâmica
   - Cada campo: Nome, Tipo (texto ou radio)
   - Se radio: lista de alternativas
   - Ordenar por drag-and-drop
   - Deletar campo

5. **Configurações de Dashboard** (somente edição):
   - Campo para filtro Heatmap
   - Campo para filtro Semáforo

6. **Ações:**
   - Criar login de empresa (modal)
   - Salvar
   - Deletar empresa

**Componentes:**
- `EmpresaForm`
- `ColorPicker`
- `FileUpload`
- `CamposPadrao`
- `CamposExtraManager` (drag-drop)
- `CampoExtraForm`

**API Calls:**
```javascript
// Criar empresa
POST /api/adm/empresas
Body: FormData {
  nome, introducao, cor, termo_consentimento, logotipo,
  campos_padrao: [],
  campos_extra: [{ nome, tipo, alternativas: [] }]
}

// Atualizar empresa
PUT /api/adm/empresas/:id
Body: FormData { ... }

// Deletar campo personalizado
DELETE /api/adm/campos-empresas/:id

// Criar login empresa
POST /api/adm/empresas/:id/logins
Body: { login, password, email, campos_permitidos: [] }

// Configurar filtros dashboard
POST /api/adm/empresas/:id/filtros
Body: { id_campo_dashboard_heatmap_1, id_campo_dashboard_heatmap_2 }
```

---

#### 4.2.10 PÁGINA: Participantes da Empresa (`/adm/lista-participantes/:empresaId`)

**Rota:** `/adm/lista-participantes/:empresaId`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [empresa, setEmpresa] = useState(null);
const [participantes, setParticipantes] = useState([]);

// GET /api/adm/empresas/:id/participantes
```

**Funcionalidades:**
1. Tabela com participantes:
   - Login
   - Último acesso
   - Empresa
   - Botões: Relatórios, Dados Pessoais
   - Indicador risco suicida
   - Faixa etária
   - Termômetro (cor baseada em termometro_bg)
   - Indicadores depressão e ansiedade
   - Simular acesso (login como participante)
   - Deletar

2. Botão "Deletar Todos os Usuários"
3. Botão "Novo Participante"

**Componentes:**
- `ParticipantsTable`
- `TermometroIndicator`
- `DepressionAnxietyBadges`
- `SimulateAccessButton`

**API Calls:**
```javascript
GET /api/adm/empresas/:id/participantes
Response: [{
  id, login, log, id_empresa, termo_consentimento,
  faixa_etaria, depressao, ansiedade, termometro_cor, termometro_bg
}]

// Simular acesso
POST /api/adm/participantes/:id/simular-acesso
Response: { token }
```

---

#### 4.2.11 PÁGINA: Adicionar Participantes (`/adm/adicionar-participante`)

**Rota:** `/adm/adicionar-participante`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [empresaId, setEmpresaId] = useState('');
const [logins, setLogins] = useState(''); // texto separado por ; ou ,
const [arquivo, setArquivo] = useState(null);
const [senhaPadrao, setSenhaPadrao] = useState('');
const [empresas, setEmpresas] = useState([]);

// GET /api/adm/empresas (dropdown)
```

**Funcionalidades:**
1. Seleção da empresa (dropdown)
2. **Modo texto:**
   - Textarea para múltiplos logins (separados por vírgula ou ponto-e-vírgula)
3. **Modo arquivo:**
   - Upload de Excel (.xlsx, .xls, .csv)
   - Formato esperado: coluna "login"
4. Senha padrão (opcional, senão gera automaticamente)
5. Validação de duplicados
6. Mensagem de logins já existentes

**Componentes:**
- `EmpresaSelect`
- `LoginsInput`
- `FileUpload`

**API Calls:**
```javascript
POST /api/adm/participantes/batch
Body: FormData {
  empresa_id,
  logins: '', // texto
  arquivo: File, // ou arquivo
  senha_padrao
}
Response: {
  criados: number,
  duplicados: [login1, login2, ...]
}
```

---

#### 4.2.12 PÁGINA: Info Participante (`/adm/info-participante/:id`)

**Rota:** `/adm/info-participante/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [usuario, setUsuario] = useState(null);
const [dadosPessoais, setDadosPessoais] = useState([]);
const [historicoCoaching, setHistoricoCoaching] = useState([]);
const [contatos, setContatos] = useState([]);

// GET /api/adm/participantes/:id
// GET /api/adm/participantes/:id/dados-pessoais
// GET /api/adm/participantes/:id/historico-coaching
// GET /api/adm/participantes/:id/contatos
```

**Funcionalidades:**

1. **Dados Pessoais:**
   - Tabela com campos e respostas

2. **Histórico de Coaching:**
   - Tabela com: Data, Texto (preview), Arquivos, Ações
   - Modal para adicionar/editar:
     - Date picker
     - Rich text editor
     - Upload múltiplo de arquivos
   - Botão visualizar (expandir texto)
   - Botão deletar

3. **Histórico de Contatos:**
   - Tabela com: Data, Hora Início, Hora Fim, Tipo, Contato
   - Modal para adicionar
   - Botão deletar

**Componentes:**
- `DadosPessoaisTable`
- `CoachingHistory`
- `CoachingFormModal`
- `ContatosTable`
- `ContatoFormModal`
- `FileUpload`

**API Calls:**
```javascript
// Dados do participante
GET /api/adm/participantes/:id

// Histórico coaching
GET /api/adm/participantes/:id/historico-coaching
POST /api/adm/participantes/:id/historico-coaching
Body: FormData { data, texto, arquivos: [] }
PUT /api/adm/historico-coaching/:id
DELETE /api/adm/historico-coaching/:id

// Contatos
GET /api/adm/participantes/:id/contatos
POST /api/adm/participantes/:id/contatos
Body: { data, hora_inicio, hora_final, tipo_contato, contato }
DELETE /api/adm/contatos/:id
```

---

#### 4.2.13 PÁGINA: Lista de Programas (`/adm/lista-programas`)

**Rota:** `/adm/lista-programas`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [programas, setProgramas] = useState([]);
const [empresas, setEmpresas] = useState([]);

// GET /api/adm/programas
// GET /api/adm/empresas (para modal vincular)
```

**Funcionalidades:**
1. Cards animados para cada programa:
   - Nome e data de criação
   - Botão Configurar (editar)
   - Botão Vincular Empresa (abre modal)

2. Para cada empresa vinculada:
   - Logo e nome
   - Intervalo (data início - data fim) ou "indeterminado"
   - Botão Acesso Público (modal com link)
   - Botão Controlar Acesso
   - Botão Configurar Intervalo (modal date picker)
   - Botão Remover vínculo

**Modais:**
- **Vincular Empresa:** Dropdown de empresas disponíveis
- **Acesso Público:** Mostrar URL completa (portal/empresa/:slug)
- **Configurar Intervalo:** Date pickers início/fim, botão "Indeterminado"

**API Calls:**
```javascript
GET /api/adm/programas
Response: [{
  id, nome, created_at,
  empresas: [{
    id, nome, logotipo, intervalo_inicio, intervalo_termino, intervalo_tipo
  }]
}]

// Vincular empresa
POST /api/adm/programas/:id/empresas
Body: { id_empresa }

// Configurar intervalo
POST /api/adm/programas/:id/empresas/:empresaId/intervalo
Body: { intervalo_inicio, intervalo_termino }

// Tornar indeterminado
DELETE /api/adm/programas/:id/empresas/:empresaId/intervalo

// Remover vínculo
DELETE /api/adm/programas/:id/empresas/:empresaId
```

---

#### 4.2.14 PÁGINA: Novo/Editar Programa (`/adm/adicionar-programa`, `/adm/editar-programa/:id`)

**Rota:**
- Nova: `/adm/adicionar-programa`
- Editar: `/adm/editar-programa/:id`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [programa, setPrograma] = useState({
  nome: '',
  introducao: '',
  questionarios: [], // array de IDs
  ordenacao_questionarios: ''
});
const [questionariosDisponiveis, setQuestionariosDisponiveis] = useState([]);

// GET /api/adm/questionarios (lista disponíveis)
// GET /api/adm/programas/:id (se editar)
```

**Funcionalidades:**
1. Nome do programa
2. Introdução (WYSIWYG)
3. Lista de checkboxes com todos os questionários
   - Questionários já vinculados vêm pré-marcados
4. Campo de ordenação: textarea com IDs separados por vírgula
5. Ações: Duplicar programa, Apagar programa

**Componentes:**
- `ProgramaForm`
- `QuestionarioCheckboxList`
- `OrdenacaoInput`

**API Calls:**
```javascript
// Criar programa
POST /api/adm/programas
Body: {
  nome, introducao,
  questionarios: [id1, id2, ...],
  ordenacao_questionarios
}

// Atualizar
PUT /api/adm/programas/:id
Body: { ... }

// Duplicar
POST /api/adm/programas/:id/duplicar

// Apagar
DELETE /api/adm/programas/:id
```

---

#### 4.2.15 PÁGINA: Controle de Acesso (`/adm/controlar-acesso/:empresaId/:programaId`)

**Rota:** `/adm/controlar-acesso/:empresaId/:programaId`
**Layout:** AdminLayout
**Permissão:** type=1

**Props/State:**
```javascript
const [participantes, setParticipantes] = useState([]);
const [empresa, setEmpresa] = useState(null);
const [programa, setPrograma] = useState(null);

// GET /api/adm/empresas/:empresaId/participantes
// GET /api/adm/empresas/:empresaId
// GET /api/adm/programas/:programaId
```

**Funcionalidades:**
1. Mostrar nome da empresa e programa
2. Tabela com todos os participantes da empresa:
   - Checkbox para cada participante
   - Checked = tem acesso (não está em controle_acessos)
   - Unchecked = acesso negado
3. Salvar automaticamente via AJAX ao marcar/desmarcar

**API Calls:**
```javascript
// Carregar participantes com status de acesso
GET /api/adm/empresas/:empresaId/programas/:programaId/acessos
Response: [{
  id, name, login, tem_acesso: boolean
}]

// Atualizar acesso
POST /api/adm/empresas/:empresaId/programas/:programaId/acessos
Body: { id_user, tem_acesso: boolean }
```

---

#### 4.2.16 PÁGINAS DE RELATÓRIOS ADMIN

**Dashboard Analítico** (`/adm/relatorioadm/:empresaId/dashboard`)
- Tabela com soma de alternativas
- Filtros por campos personalizados
- Agrupamento por grupos de perguntas (se NR1)

**Dashboard Gráfico** (`/adm/relatorioadm/:empresaId/grafico`)
- Gráfico de pizza por intervalos
- Gráfico de semáforo (risco por grupo)
- Heatmap (exposição ao risco)

**Ver arquivo `routes/web.php` linhas 176-214 para todas as rotas de relatório detalhadas**

---

#### 4.2.17 PÁGINA: Home do Participante (`/participante`)

**Rota:** `/participante`
**Layout:** ParticipantLayout
**Permissão:** type=2

**Props/State:**
```javascript
const [questionarios, setQuestionarios] = useState([]);
const [foraPrazo, setForaPrazo] = useState(false);
const [respondeu, setRespondeu] = useState(0);
const [totalQuestionarios, setTotalQuestionarios] = useState(0);
const [alerta, setAlerta] = useState(null);

// GET /api/participante/home
```

**Funcionalidades:**
1. Se usuário não cadastrado: redirecionar para `/boas-vindas`
2. Se sem programas: mostrar mensagem
3. Alerta se fora do prazo
4. Lista de questionários com:
   - Número sequencial
   - Nome do questionário
   - Status: Finalizado (com data) ou Em Andamento
   - Barra de progresso para não finalizados
   - Botão "Iniciar" ou "Continuar"
   - Botão "Relatório" para finalizados

**Regras de Negócio:**
- Questionários ordenados conforme `programa.ordenacao_questionarios`
- Verificar intervalo de datas do programa
- Verificar se usuário está em `controle_acessos` (bloqueado)
- Progresso = perguntas respondidas / total de perguntas

**Componentes:**
- `QuestionarioListItem`
- `ProgressBar`
- `AlertBox`

**API Calls:**
```javascript
GET /api/participante/home
Response: {
  questionarios: [{
    id, nome, nome_site, id_programa,
    finalizado: boolean,
    data_finalizacao: date|null,
    progresso: number // 0-100
  }],
  fora_prazo: boolean,
  respondeu: number,
  total_questionarios: number
}
```

---

#### 4.2.18 PÁGINA: Boas-vindas (`/boas-vindas/:idprograma?/:idempresa?`)

**Rota:** `/boas-vindas/:idprograma?/:idempresa?`
**Layout:** ParticipantLayout ou Público
**Permissão:** Público (com slug) ou Participante

**Props/State:**
```javascript
const [empresa, setEmpresa] = useState(null);
const { idprograma, idempresa } = useParams();

// GET /api/empresas/:id (ou by slug)
```

**Funcionalidades:**
1. Mostrar introdução da empresa (texto rico)
2. Botão "Avançar" para cadastro
3. Se vier de campanha (sem auth): redirecionar para `/participante` após cadastro

**API Calls:**
```javascript
GET /api/empresas/:id
```

---

#### 4.2.19 PÁGINA: Cadastro (`/participante/cadastro`)

**Rota:** `/participante/cadastro`
**Layout:** ParticipantLayout
**Permissão:** Participante (não cadastrado)

**Props/State:**
```javascript
const [campos, setCampos] = useState([]);
const [empresa, setEmpresa] = useState(null);
const [termo, setTermo] = useState(null);
const [formData, setFormData] = useState({
  // Campos dinâmicos baseados em `campos`
});
const [termoAceito, setTermoAceito] = useState(false);

// GET /api/participante/campos
// GET /api/empresas/:id
// GET /api/termo-consentimento
```

**Funcionalidades:**
1. **Modo Participante (já logado):**
   - Mostrar campos personalizados da empresa
   - Campo senha atual (para troca na primeira vez)
   - Email para recuperação
   - Checkbox de termo de consentimento

2. **Modo Campanha (público):**
   - Campos: Login, Senha, Confirmar Senha
   - Todos os campos personalizados
   - Termo de consentimento

3. Campos dinâmicos baseados em `campos_empresas`:
   - Texto: input text
   - Radio: radio buttons

4. Validações:
   - Email válido
   - Senha e confirmação iguais
   - Campos obrigatórios preenchidos
   - Termo aceito

5. Ao salvar:
   - Atualizar `users.cadastrado = 1`
   - Salvar respostas em `campos_empresas_respostas`
   - Redirecionar para `/participante`

**Componentes:**
- `DynamicForm`
- `CampoTexto`
- `CampoRadio`
- `TermoConsentimentoModal`

**API Calls:**
```javascript
GET /api/participante/campos
Response: [{
  id, campo, tipo, pos,
  alternativas: [] // se tipo='radio'
}]

POST /api/participante/cadastro
Body: {
  email,
  senha_atual, // se troca
  nova_senha,  // se troca
  consentimento: boolean,
  respostas: {
    [campoId]: valor
  }
}
```

---

#### 4.2.20 PÁGINA: Responder Questionário (`/participante/questionario/:questionarioId/:programaId`)

**Rota:** `/participante/questionario/:questionarioId/:programaId`
**Layout:** ParticipantLayout
**Permissão:** type=2

**Props/State:**
```javascript
const [pergunta, setPergunta] = useState(null);
const [alternativas, setAlternativas] = useState([]);
const [questionario, setQuestionario] = useState(null);
const [programa, setPrograma] = useState(null);
const [respostasData, setRespostasData] = useState({
  alternativa: '', // ou alternativas: [] para múltipla
  dissertativa: '',
  sn_resposta: ''
});
const [progresso, setProgresso] = useState({ atual: 0, total: 0, percentual: 0 });
const [totalRespostas, setTotalRespostas] = useState(0);

// GET /api/participante/questionario/:id/:programaId
```

**Funcionalidades:**

1. **Verificação Inicial:**
   - Verificar se programa/quest pertence à empresa do usuário
   - Verificar se questionário está disponível no intervalo de datas
   - Verificar se não está em `controle_acessos` (bloqueado)

2. **Buscar Próxima Pergunta:**
   - Se primeira vez: primeira pergunta (ordenada por dimensao_pos, grupo_pos, pos)
   - Se retornando: última pergunta respondida + 1
   - Verificar se há pergunta dependente a ser respondida

3. **Exibir Pergunta:**
   - Se pergunta dependente: mostrar pergunta pai e resposta que a ativou
   - Nome da pergunta (nome_site)
   - Tooltip com explicação (se houver)

4. **Tipos de Resposta:**
   - **Múltipla Escolha (ME):**
     - Única: radio buttons
     - Múltipla: checkboxes
   - **Sim/Não (SN):** dois radio buttons
   - **Dissertativa:** textarea

5. **Progresso:**
   - Barra de progresso animada
   - Mostra percentual completo

6. **Submissão:**
   - POST resposta
   - Redirecionar para próxima pergunta (mesma URL, recarrega)
   - Ou redirecionar para home se completou

7. **Botão "Voltar para Home"**

**Lógica de Dependência:**
```javascript
// Após resposta, verificar se ativa pergunta dependente
if (pergunta.tipo === 'sn') {
  // Buscar pergunta com id_dependente = pergunta.id E tipo_dependente = resposta.s_n
}
if (pergunta.tipo === 'me') {
  // Buscar pergunta com id_dependente = alternativa.id E tipo_dependente = 'me'
}
```

**Componentes:**
- `QuestionDisplay`
- `RespostaME` (radio ou checkbox)
- `RespostaSN`
- `RespostaDissertativa`
- `PerguntaDependenteInfo`
- `ProgressBar`

**API Calls:**
```javascript
// Carregar próxima pergunta
GET /api/participante/questionario/:questionarioId/:programaId
Response: {
  pergunta: {
    id, nome, nome_site, explicacao, tipo,
    escolha_hipotese, // '1' ou 'n'
    // Se dependente:
    pergunta_pai: { nome, resposta_ativadora }
  },
  alternativas: [{
    id, alternativa
  }],
  questionario: { nome, descricao },
  programa: { id, nome },
  progresso: { atual, total, percentual },
  total_respostas: number
}

// Enviar resposta
POST /api/participante/resposta
Body: {
  id_questionario,
  id_programa,
  id_pergunta,
  tipo, // 'me', 'sn', 'dissertativa'
  alternativa, // ID (se ME única)
  alternativas: [], // IDs (se ME múltipla)
  sn_resposta, // 's' ou 'n'
  dissertativa
}

// Após enviar, redirecionar para mesma URL (próxima pergunta)
// Ou se retornar null para pergunta, ir para /participante (completo)
```

**Regras de Negócio Importantes:**
- Validar dupla submissão (evitar enviar 2x a mesma pergunta)
- Se já respondeu pergunta, buscar a próxima não respondida
- Se pergunta dependente, verificar se condição ainda é válida
- Ao completar, inserir em `participantes_questionarios`
- Calcular índices de depressão e ansiedade (se questionário tipo_termometro)
- Calcular cor do termômetro

---

#### 4.2.21 PÁGINA: Relatório do Participante (`/participante/relatorio/:questionarioId`)

**Rota:** `/participante/relatorio/:questionarioId`
**Layout:** ParticipantLayout
**Permissão:** type=2

**Props/State:**
```javascript
const [relatorio, setRelatorio] = useState(null);
const [loading, setLoading] = useState(true);
const [emailModalOpen, setEmailModalOpen] = useState(false);
const [email, setEmail] = useState('');

// GET /api/participante/relatorio/:questionarioId
```

**Funcionalidades:**

1. **Cabeçalho:**
   - Botão "Voltar para Home"
   - Botão "Enviar por Email" (abre modal)
   - Botão "Imprimir/Salvar" (window.print())

2. **Conteúdo do Relatório** (baseado em `tipo_resultado`):

   a) **soma_alternativas_pizza:**
   - Gráfico de pizza: Aspectos Positivos vs Melhorar
   - Lista de pontos fortes e aspectos a melhorar com comentários

   b) **soma_pontos_pizza:**
   - Similar ao anterior, mas baseado em pontos

   c) **soma_pontos_termometro:**
   - Imagem do termômetro (verde, amarelo, laranja, vermelho)
   - Texto do intervalo correspondente
   - Alertas de depressão/ansiedade (se aplicável)

   d) **media_pontos_fontesdestress:**
   - Agrupar perguntas por nível de risco
   - Mostrar média por grupo

   e) **grupo_perguntas_me:**
   - Agrupar por dimensões e grupos
   - Heatmap ou semáforo

3. **Modal Email:**
   - Input para email
   - Enviar cópia do relatório

4. **Responsivo para impressão**

**Componentes:**
- `RelatorioHeader`
- `ReportPieChart`
- `ReportTermometro`
- `ReportHeatmap`
- `ReportSemaforo`
- `ReportTexto`
- `EmailModal`

**API Calls:**
```javascript
// Carregar relatório
GET /api/participante/relatorio/:questionarioId
Response: {
  questionario: { id, nome, nome_site, tipo_resultado },
  tipo_resultado: string,
  texto_resultado: string, // do intervalo
  aspectos: {
    positivo: number,
    negativo: number
  },
  respostas: [{
    pergunta: { nome, tipo },
    resposta: string, // texto da resposta
    comentario: string,
    tipo_aspecto: 'positivo'|'negativo'
  }],
  // Se termômetro:
  termometro: {
    cor: string,
    bg: string,
    legenda: string
  },
  depressao: boolean,
  ansiedade: boolean
}

// Enviar por email
POST /api/participante/relatorio/:questionarioId/email
Body: { email }
```

---

#### 4.2.22 PÁGINA: Dashboard da Empresa (`/empresa`)

**Rota:** `/empresa`
**Layout:** CompanyLayout
**Permissão:** type=3

**Props/State:**
```javascript
const [dashboard, setDashboard] = useState({
  percentual: 0, // % que respondeu pelo menos 1
  total: 0, // total respondentes
  usuarios: 0, // total cadastrados
  campos_filtro: [],
  riskAnalysis: [],
  riskAnalysisSemaforo: [],
  riskAnalysisGeneral: [],
  heatmapData: [],
  checkCampanha: false
});

// GET /api/empresa/dashboard
```

**Funcionalidades:**
1. Cards com estatísticas:
   - Participação na Pesquisa (X%)
   - Quantidade de Respondentes
   - Usuários Cadastrados

2. **Gráfico de Semáforo:** (se configurado e não fora de campanha)
   - Gráfico de barras horizontais
   - Por grupo: % Alto Risco, % Risco Moderado, % Ausência Risco
   - Cores: vermelho, amarelo, verde

3. **Gráfico Heatmap:** (se configurado e não fora de campanha)
   - Mapa de calor por grupo
   - Eixo X: respostas do campo filtro
   - Eixo Y: grupos de perguntas
   - Cores: baixo → médio → alto → crítico

4. **Tabela de Filtros:**
   - Mostrar distribuição por campo personalizado
   - % de participação

5. **Links para Relatórios:**
   - Resultados Gráficos
   - Resultados Analíticos
   (se configurado em `configuracao`)

**Componentes:**
- `StatCard` × 3
- `SemaforoChart`
- `HeatmapChart`
- `FiltroTable`
- `ReportLinks`

**API Calls:**
```javascript
GET /api/empresa/dashboard
Response: {
  percentual: number,
  total: number,
  usuarios: number,
  total_respostas: number,
  campos_filtro: [{
    id_campo, nome_campo,
    valores: [{ resposta, total, percentual }]
  }],
  semaforo: {
    groups: [],
    altoRisco: [],
    riscoModerado: [],
    ausenciaRisco: []
  },
  heatmap: {
    series: []
  },
  configuracoes: {
    acessa_dash: boolean,
    acessa_relatorios: boolean
  },
  checkCampanha: boolean
}
```

---

### 4.3 Componentes Reutilizáveis Detalhados

#### 4.3.1 RichTextEditor

**Biblioteca sugerida:** React-Quill ou TinyMCE

**Props:**
```javascript
{
  value: string,
  onChange: (html: string) => void,
  placeholder?: string,
  height?: string
}
```

**Configuração mínima:**
- Toolbar: bold, italic, underline, list, link
- Limpar formatação ao colar

---

#### 4.3.2 SortableList (Drag and Drop)

**Biblioteca sugerida:** @dnd-kit/sortable ou react-beautiful-dnd

**Props:**
```javascript
{
  items: Array<{ id, ... }>,
  onReorder: (items: Array) => void,
  renderItem: (item) => ReactNode,
  axis?: 'x' | 'y'
}
```

**Uso:** Ordenação de perguntas, dimensões, grupos, campos personalizados

---

#### 4.3.3 DataTable

**Biblioteca sugerida:** TanStack Table (React Table) v8

**Props:**
```javascript
{
  data: Array,
  columns: Array<ColumnDef>,
  pagination?: boolean,
  sorting?: boolean,
  filtering?: boolean,
  pageSize?: number
}
```

**Funcionalidades:**
- Ordenação por coluna
- Busca global
- Paginação
- Seleção de linhas

---

#### 4.3.4 ColorPicker

**Biblioteca sugerida:** react-colorful

**Props:**
```javascript
{
  color: string,
  onChange: (color: string) => void,
  presetColors?: string[]
}
```

---

#### 4.3.5 FileUpload

**Props:**
```javascript
{
  accept?: string, // 'image/*', '.xlsx,.csv'
  multiple?: boolean,
  onUpload: (files: FileList) => void,
  preview?: boolean,
  existingFile?: string
}
```

---

#### 4.3.6 Charts

**Biblioteca sugerida:** Recharts ou Chart.js com react-chartjs-2

**PieChart Props:**
```javascript
{
  data: [{ label, value, color }],
  showLegend?: boolean
}
```

**Heatmap Props:**
```javascript
{
  data: [{
    name: string, // grupo
    data: [{ x, y }] // x=resposta, y=percentual
  }],
  colorScale: [{ from, to, color, name }]
}
```

---

## 5. API ENDPOINTS NECESSÁRIOS

### 5.1 Autenticação

```yaml
POST /api/auth/login:
  body: { login, password }
  response: { token, user: { id, name, email, type, id_empresa } }

POST /api/auth/logout:
  headers: Authorization: Bearer {token}
  response: { message: 'Logout successful' }

POST /api/auth/forgot-password:
  body: { email }
  response: { message: 'Email sent' }

POST /api/auth/reset-password:
  body: { token, password, password_confirmation }
  response: { message: 'Password reset successful' }

GET /api/auth/me:
  headers: Authorization: Bearer {token}
  response: { user }
```

### 5.2 Admin - Dashboard

```yaml
GET /api/adm/dashboard:
  auth: Admin
  response: {
    empresas: number,
    participantes: number,
    questionarios: number
  }
```

### 5.3 Admin - Empresas

```yaml
GET /api/adm/empresas:
  auth: Admin
  response: [{
    id, nome, logotipo, cor, termo_consentimento, slug,
    total_cadastrados, total_respondentes, total_questionarios
  }]

POST /api/adm/empresas:
  auth: Admin
  content-type: multipart/form-data
  body: {
    nome, introducao, cor, termo_consentimento, logotipo: File,
    campos_padrao: [], campos_extra: []
  }
  response: { id }

GET /api/adm/empresas/:id:
  auth: Admin
  response: { empresa }

PUT /api/adm/empresas/:id:
  auth: Admin
  body: { ... }

DELETE /api/adm/empresas/:id:
  auth: Admin

GET /api/adm/empresas/:id/participantes:
  auth: Admin
  response: [participantes]

GET /api/adm/empresas/:id/campos:
  auth: Admin
  response: [campos]

POST /api/adm/empresas/:id/logins:
  auth: Admin
  body: { login, password, email, campos_permitidos: [] }

POST /api/adm/empresas/:id/filtros:
  auth: Admin
  body: { id_campo_dashboard_heatmap_1, id_campo_dashboard_heatmap_2 }

DELETE /api/adm/campos-empresas/:id:
  auth: Admin
```

### 5.4 Admin - Participantes

```yaml
POST /api/adm/participantes/batch:
  auth: Admin
  body: FormData { empresa_id, logins || arquivo, senha_padrao }
  response: { criados, duplicados: [] }

GET /api/adm/participantes/:id:
  auth: Admin
  response: { usuario, dados_pessoais, historico_coaching, contatos }

GET /api/adm/participantes/:id/dados-pessoais:
  auth: Admin

GET /api/adm/participantes/:id/historico-coaching:
  auth: Admin

POST /api/adm/participantes/:id/historico-coaching:
  auth: Admin
  body: FormData { data, texto, arquivos: [] }

PUT /api/adm/historico-coaching/:id:
  auth: Admin

DELETE /api/adm/historico-coaching/:id:
  auth: Admin

GET /api/adm/participantes/:id/contatos:
  auth: Admin

POST /api/adm/participantes/:id/contatos:
  auth: Admin
  body: { data, hora_inicio, hora_final, tipo_contato, contato }

DELETE /api/adm/contatos/:id:
  auth: Admin

POST /api/adm/participantes/:id/simular-acesso:
  auth: Admin
  response: { token }

GET /api/adm/pesquisar-usuarios:
  auth: Admin
  query: { search, page }
  response: { data, total, page }
```

### 5.5 Admin - Programas

```yaml
GET /api/adm/programas:
  auth: Admin
  response: [{
    id, nome, created_at,
    empresas: [...]
  }]

POST /api/adm/programas:
  auth: Admin
  body: { nome, introducao, questionarios: [], ordenacao_questionarios }

GET /api/adm/programas/:id:
  auth: Admin

PUT /api/adm/programas/:id:
  auth: Admin

DELETE /api/adm/programas/:id:
  auth: Admin

POST /api/adm/programas/:id/duplicar:
  auth: Admin

POST /api/adm/programas/:id/empresas:
  auth: Admin
  body: { id_empresa }

DELETE /api/adm/programas/:id/empresas/:empresaId:
  auth: Admin

POST /api/adm/programas/:id/empresas/:empresaId/intervalo:
  auth: Admin
  body: { intervalo_inicio, intervalo_termino }

DELETE /api/adm/programas/:id/empresas/:empresaId/intervalo:
  auth: Admin

GET /api/adm/empresas/:empresaId/programas/:programaId/acessos:
  auth: Admin
  response: [{ id, name, login, tem_acesso }]

POST /api/adm/empresas/:empresaId/programas/:programaId/acessos:
  auth: Admin
  body: { id_user, tem_acesso }
```

### 5.6 Admin - Questionários

```yaml
GET /api/adm/questionarios:
  auth: Admin
  response: [{ id, nome, created_at, qtd_perguntas }]

POST /api/adm/questionarios:
  auth: Admin
  body: { nome, nome_site, descricao, perguntas: [] }

GET /api/adm/questionarios/:id:
  auth: Admin
  response: { id, nome, nome_site, descricao, tipo_resultado, info_adm }

PUT /api/adm/questionarios/:id:
  auth: Admin

DELETE /api/adm/questionarios/:id:
  auth: Admin

POST /api/adm/questionarios/:id/duplicar:
  auth: Admin

GET /api/adm/questionarios/:id/exportar:
  auth: Admin
  response: Arquivo .docx

POST /api/adm/questionarios/:id/tipo-resultado:
  auth: Admin
  body: { tipo_resultado }

POST /api/adm/questionarios/:id/ordenar:
  auth: Admin
  body: [{ dimensao_nome, dimensao_pos, grupos: [...] }]

GET /api/adm/questionarios/:id/perguntas:
  auth: Admin
  response: [perguntas]

POST /api/adm/questionarios/:id/perguntas:
  auth: Admin
  body: { nome, nome_site, tipo, ... }

GET /api/adm/perguntas/:id:
  auth: Admin

PUT /api/adm/perguntas/:id:
  auth: Admin

DELETE /api/adm/perguntas/:id:
  auth: Admin

POST /api/adm/perguntas/dependente:
  auth: Admin
  body: { id_questionario, id_dependente, tipo_dependente, ... }

POST /api/adm/perguntas/:id/alternativas:
  auth: Admin
  body: { alternativa, pontuacao, tipo, comentario }

DELETE /api/adm/alternativas/:id:
  auth: Admin

GET /api/adm/questionarios/:id/intervalos:
  auth: Admin
  response: [intervalos]

POST /api/adm/questionarios/:id/intervalos:
  auth: Admin
  body: { cor, legenda, intervalo_inicio, intervalo_termino, texto }

PUT /api/adm/intervalos/:id:
  auth: Admin

DELETE /api/adm/intervalos/:id:
  auth: Admin

POST /api/adm/questionarios/:id/textos:
  auth: Admin
  body: { texto_depressao, texto_ansiedade }
```

### 5.7 Admin - Relatórios

```yaml
GET /api/adm/relatorios/:empresaId/dashboard:
  auth: Admin
  query: { idquestionario, idprograma, tipo }
  response: { dados_analiticos }

GET /api/adm/relatorios/:empresaId/grafico:
  auth: Admin
  query: { idquestionario, idprograma, campo, camporesposta }
  response: { dados_graficos }

GET /api/adm/relatorios/:empresaId/semaforo:
  auth: Admin
  query: { idquestionario, idprograma, campo, camporesposta, campo2, camporesposta2 }
  response: { riskAnalysis }

GET /api/adm/relatorios/:empresaId/heatmap:
  auth: Admin
  query: { idquestionario, idprograma, campo }
  response: { riskAnalysis, riskAnalysisGeneral }

GET /api/adm/relatorios/:userId/:questionarioId/individual:
  auth: Admin
  response: { respostas }

GET /api/adm/relatorios/semaforo/filtros:
  auth: Admin
  query: { filter_id, idempresa }
  response: [{ name, total }]
```

### 5.8 Admin - Usuários

```yaml
GET /api/adm/usuarios:
  auth: Admin
  response: [usuarios]

POST /api/adm/usuarios:
  auth: Admin
  body: { nome, login, password }

GET /api/adm/usuarios/:id:
  auth: Admin

PUT /api/adm/usuarios/:id:
  auth: Admin

DELETE /api/adm/usuarios/:id:
  auth: Admin
```

### 5.9 Participante

```yaml
GET /api/participante/home:
  auth: Participante
  response: {
    questionarios: [...],
    fora_prazo: boolean,
    respondeu: number,
    total_questionarios: number
  }

GET /api/participante/campos:
  auth: Participante
  response: [campos]

POST /api/participante/cadastro:
  auth: Participante (ou público com token)
  body: { email, senha_atual, nova_senha, consentimento, respostas: {} }

GET /api/participante/questionario/:questionarioId/:programaId:
  auth: Participante
  response: {
    pergunta, alternativas, questionario, programa,
    progresso, total_respostas
  }

POST /api/participante/resposta:
  auth: Participante
  body: {
    id_questionario, id_programa, id_pergunta, tipo,
    alternativa, alternativas, sn_resposta, dissertativa
  }

GET /api/participante/relatorio/:questionarioId:
  auth: Participante
  response: { relatorio_completo }

POST /api/participante/relatorio/:questionarioId/email:
  auth: Participante
  body: { email }

GET /api/participante/prontuario:
  auth: Participante
  response: { historico_coaching }

GET /api/participante/contatos:
  auth: Participante
  response: { contatos }
```

### 5.10 Empresa

```yaml
GET /api/empresa/dashboard:
  auth: Empresa
  response: {
    percentual, total, usuarios, campos_filtro,
    semaforo, heatmap, configuracoes, checkCampanha
  }

GET /api/empresa/relatorios:
  auth: Empresa
  query: { tipo, idprograma, idquestionario }
  response: { relatorios }
```

### 5.11 Público

```yaml
GET /api/empresas/by-slug/:slug:
  response: { id, nome, logotipo, cor, introducao, slug }

GET /api/termo-consentimento:
  response: { texto }
```

---

## 6. LÓGICAS DE NEGÓCIO COMPLEXAS

### 6.1 Tipos de Resultado de Questionário

| Tipo | Descrição | Cálculo | Visualização |
|------|-----------|---------|--------------|
| **soma_alternativas_pizza** | Conta alternativas positivas/negativas | Contar tipo='positivo' vs 'negativo' nas respostas | Gráfico pizza + lista |
| **soma_pontos_pizza** | Soma pontos das respostas | Somar pontuacao de cada alternativa | Gráfico pizza com base nos pontos |
| **soma_pontos_termometro** | Pontuação total em intervalos | Somar todos os pontos, verificar em qual intervalo está | Imagem termômetro + texto |
| **media_pontos_fontesdestress** | Média por grupo de perguntas | Agrupar por grupo_nome, calcular média | Lista de grupos com nível |
| **grupo_perguntas_me** | NR1 - Agrupado em dimensões | Média por grupo, aplicar escala de risco | Heatmap ou semáforo |

**Implementação:**
```javascript
// Utils/calculaResultado.js
export const calculaResultado = (respostas, questionario) => {
  switch (questionario.tipo_resultado) {
    case 'soma_alternativas_pizza':
      return calculaSomaAlternativas(respostas);
    case 'soma_pontos_pizza':
      return calculaSomaPontos(respostas);
    case 'soma_pontos_termometro':
      return calculaTermometro(respostas, questionario.intervalos);
    case 'media_pontos_fontesdestress':
      return calculaMediaFontesStress(respostas);
    case 'grupo_perguntas_me':
      return calculaGrupoPerguntas(respostas);
    default:
      return null;
  }
};
```

### 6.2 Cálculo de Depressão e Ansiedade (PHQ-9 e GAD-7)

**Lógica Depressão:**
```javascript
// Flags em perguntas: 'depressao_indice' e 'depressao_comp'
function calculaDepressao(respostas) {
  let contadorIndice = 0;
  let contadorComp = 0;
  
  respostas.forEach(resposta => {
    if (resposta.pergunta.flag === 'depressao_indice' && resposta.s_n === 's') {
      // Verificar pergunta dependente
      const respostaDep = buscarRespostaDependente(resposta);
      if (respostaDep && ['algumas vezes', 'muitas vezes'].includes(respostaDep.alternativa)) {
        contadorIndice++;
      }
    }
    
    if (resposta.pergunta.flag === 'depressao_comp' && resposta.s_n === 's') {
      const respostaDep = buscarRespostaDependente(resposta);
      if (respostaDep && ['algumas vezes', 'muitas vezes'].includes(respostaDep.alternativa)) {
        contadorComp++;
      }
    }
  });
  
  // Diagnóstico: pelo menos 1 indice + 3 compostos
  return contadorIndice >= 1 && contadorComp >= 3;
}
```

**Lógica Ansiedade:**
```javascript
// Similar usando flags 'ansiedade_indice' e 'ansiedade_comp'
function calculaAnsiedade(respostas) {
  // Mesma lógica que depressão
}
```

### 6.3 Cálculo de Termômetro

```javascript
function calculaTermometro(respostas, intervalos) {
  let pontos = 0;
  
  respostas.forEach(resposta => {
    if (resposta.tipo_pergunta === 'sn') {
      if (resposta.s_n === 's') {
        pontos += resposta.pergunta.s_pontuacao;
      } else {
        pontos += resposta.pergunta.n_pontuacao;
      }
    }
  });
  
  // Encontrar intervalo correspondente
  const intervalo = intervalos.find(i => 
    pontos >= i.intervalo_inicio && pontos <= i.intervalo_termino
  );
  
  return {
    pontos,
    cor: intervalo?.legenda || '',
    bg: intervalo?.cor || '',
    texto: intervalo?.texto || ''
  };
}
```

### 6.4 Sequência de Perguntas

```javascript
async function buscarProximaPergunta(questionarioId, programaId, userId) {
  // 1. Buscar última resposta
  const ultimaResposta = await api.get(`/participantes-respostas/ultima`, {
    params: { questionarioId, programaId, userId }
  });
  
  if (!ultimaResposta) {
    // Primeira pergunta
    return buscarPrimeiraPergunta(questionarioId);
  }
  
  // 2. Verificar se ativou pergunta dependente
  const perguntaDependente = await buscarPerguntaDependente(ultimaResposta);
  if (perguntaDependente) {
    return perguntaDependente;
  }
  
  // 3. Buscar próxima pergunta sequencial
  return buscarProximaSequencial(ultimaResposta.pergunta, questionarioId);
}

function buscarPerguntaDependente(resposta) {
  if (resposta.tipo_pergunta === 'sn') {
    return api.get(`/perguntas/dependente`, {
      params: {
        id_dependente: resposta.id_pergunta,
        tipo_dependente: resposta.s_n
      }
    });
  }
  
  if (resposta.tipo_pergunta === 'me') {
    return api.get(`/perguntas/dependente`, {
      params: {
        id_dependente: resposta.id_alternativa_resposta,
        tipo_dependente: 'me'
      }
    });
  }
}
```

### 6.5 Gráfico de Semáforo (Risk Analysis)

```javascript
function calculaRiskAnalysis(respostas, grupos) {
  const resultado = {};
  
  grupos.forEach(grupo => {
    const respostasGrupo = respostas.filter(r => r.pergunta.grupo_nome === grupo);
    const total = respostasGrupo.length;
    
    const altoRisco = respostasGrupo.filter(r => 
      r.alternativa?.tipo === 'negativo'
    ).length;
    
    const riscoModerado = respostasGrupo.filter(r => 
      r.alternativa?.tipo === 'neutro'
    ).length;
    
    const ausenciaRisco = respostasGrupo.filter(r => 
      r.alternativa?.tipo === 'positivo'
    ).length;
    
    resultado[grupo] = {
      percentual_alto_risco: (altoRisco / total) * 100,
      percentual_risco_moderado: (riscoModerado / total) * 100,
      percentual_ausencia_risco: (ausenciaRisco / total) * 100
    };
  });
  
  return resultado;
}
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### 7.1 Setup e Configuração

- [ ] Criar projeto React (Vite ou CRA)
- [ ] Configurar ESLint + Prettier
- [ ] Configurar React Router v6
- [ ] Configurar Axios para API calls
- [ ] Configurar Context API ou Redux para estado global
- [ ] Configurar autenticação JWT (login, refresh token, logout)
- [ ] Configurar interceptors para headers de auth
- [ ] Configurar tratamento de erros globais
- [ ] Configurar notificações (toast)
- [ ] Configurar tema e variáveis CSS

### 7.2 Componentes Base

- [ ] Layout/AdminLayout
- [ ] Layout/ParticipantLayout
- [ ] Layout/CompanyLayout
- [ ] UI/Button (variants: primary, secondary, danger)
- [ ] UI/Input (text, password, email, textarea)
- [ ] UI/Select
- [ ] UI/Modal
- [ ] UI/Alert (success, error, warning, info)
- [ ] UI/Loading/Spinner
- [ ] UI/Loading/Skeleton
- [ ] UI/Table
- [ ] UI/Pagination
- [ ] UI/FileUpload
- [ ] UI/ColorPicker
- [ ] UI/RichTextEditor
- [ ] UI/DatePicker
- [ ] UI/ProgressBar
- [ ] UI/Tooltip

### 7.3 Páginas Públicas

- [ ] Login
- [ ] ForgotPassword
- [ ] ResetPassword

### 7.4 Páginas Admin

- [ ] Dashboard
- [ ] Empresas/List
- [ ] Empresas/Create
- [ ] Empresas/Edit
- [ ] Empresas/Participants
- [ ] Participantes/Add
- [ ] Participantes/Info
- [ ] Programas/List
- [ ] Programas/Create
- [ ] Programas/Edit
- [ ] Questionarios/List
- [ ] Questionarios/Create
- [ ] Questionarios/View
- [ ] Questionarios/Edit
- [ ] Questionarios/Intervals
- [ ] Perguntas/New
- [ ] Perguntas/Edit
- [ ] Perguntas/Dependent
- [ ] Usuarios/List
- [ ] Usuarios/Create
- [ ] Acessos/Control
- [ ] Relatorios/Dashboard
- [ ] Relatorios/Graficos

### 7.5 Páginas Participante

- [ ] Home
- [ ] Welcome
- [ ] Cadastro
- [ ] Questionario (responder)
- [ ] Relatorio
- [ ] Prontuario
- [ ] Contatos

### 7.6 Páginas Empresa

- [ ] Dashboard
- [ ] Relatorios

### 7.7 Funcionalidades Complexas

- [ ] Drag-and-drop de perguntas
- [ ] Drag-and-drop de dimensões/grupos
- [ ] Drag-and-drop de campos personalizados
- [ ] Upload de arquivos (logo, Excel, anexos)
- [ ] Exportação de relatórios (PDF, Word, Excel)
- [ ] Gráficos (pizza, barras, heatmap)
- [ ] Rich text editor
- [ ] Color picker
- [ ] Data tables com ordenação/filtro
- [ ] Cálculo de termômetro
- [ ] Cálculo de depressão/ansiedade
- [ ] Sequência de perguntas com dependências
- [ ] Simular acesso (login como outro usuário)

### 7.8 Testes

- [ ] Configurar Jest + React Testing Library
- [ ] Testes de componentes UI
- [ ] Testes de páginas principais
- [ ] Testes de hooks customizados
- [ ] Testes de integração (API)
- [ ] Testes E2E com Cypress (opcional)

### 7.9 Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Build otimizado
- [ ] Configurar CI/CD
- [ ] Deploy em servidor/staging
- [ ] Testes em produção

---

## APÊNDICE A: ESTRUTURA DE ROTAS REACT

```javascript
// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ParticipantLayout from './layouts/ParticipantLayout';
import CompanyLayout from './layouts/CompanyLayout';

// Pages...

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/portal" element={<Login />} />
          <Route path="/portal/:slug" element={<Login />} />
          <Route path="/esqueci-minha-senha" element={<ForgotPassword />} />
          <Route path="/esqueci-reset/:token" element={<ResetPassword />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedTypes={[1]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/adm" element={<AdminDashboard />} />
              <Route path="/adm/lista-empresas" element={<EmpresasList />} />
              <Route path="/adm/adicionar-empresa" element={<EmpresasCreate />} />
              <Route path="/adm/editar-empresa/:id" element={<EmpresasEdit />} />
              <Route path="/adm/lista-participantes/:id" element={<EmpresasParticipants />} />
              <Route path="/adm/adicionar-participante" element={<ParticipantesAdd />} />
              <Route path="/adm/info-participante/:id" element={<ParticipantesInfo />} />
              <Route path="/adm/lista-programas" element={<ProgramasList />} />
              <Route path="/adm/adicionar-programa" element={<ProgramasCreate />} />
              <Route path="/adm/editar-programa/:id" element={<ProgramasEdit />} />
              <Route path="/adm/controlar-acesso/:empresaId/:programaId" element={<AcessosControl />} />
              <Route path="/adm/lista-questionarios" element={<QuestionariosList />} />
              <Route path="/adm/adicionar-questionario" element={<QuestionariosCreate />} />
              <Route path="/adm/visualizar-questionario/:id" element={<QuestionariosView />} />
              <Route path="/adm/editar-questionario/:id" element={<QuestionariosEdit />} />
              <Route path="/adm/intervalo/:questionarioId" element={<QuestionariosIntervals />} />
              <Route path="/adm/nova-pergunta/:questionarioId" element={<PerguntasNew />} />
              <Route path="/adm/editar-pergunta/:id" element={<PerguntasEdit />} />
              <Route path="/adm/pergunta-dependente/:tipo/:id" element={<PerguntasDependent />} />
              <Route path="/adm/lista-usuarios" element={<UsuariosList />} />
              <Route path="/adm/adicionar-usuario" element={<UsuariosCreate />} />
              <Route path="/adm/editar-usuario/:id" element={<UsuariosCreate />} />
              <Route path="/adm/relatorioadm/:empresaId/:tipo" element={<RelatoriosDashboard />} />
              {/* ... mais rotas de relatórios */}
            </Route>
          </Route>
          
          {/* Participant Routes */}
          <Route element={<ProtectedRoute allowedTypes={[2]} />}>
            <Route element={<ParticipantLayout />}>
              <Route path="/participante" element={<ParticipantHome />} />
              <Route path="/participante/cadastro" element={<ParticipantCadastro />} />
              <Route path="/participante/questionario/:questionarioId/:programaId" element={<ParticipantQuestionario />} />
              <Route path="/participante/relatorio/:questionarioId" element={<ParticipantRelatorio />} />
              <Route path="/participante/prontuario" element={<ParticipantProntuario />} />
              <Route path="/participante/contato" element={<ParticipantContatos />} />
            </Route>
          </Route>
          
          {/* Company Routes */}
          <Route element={<ProtectedRoute allowedTypes={[3]} />}>
            <Route element={<CompanyLayout />}>
              <Route path="/empresa" element={<CompanyDashboard />} />
            </Route>
          </Route>
          
          {/* Public/Welcome */}
          <Route path="/boas-vindas" element={<Welcome />} />
          <Route path="/boas-vindas/:idprograma/:idempresa" element={<Welcome />} />
          <Route path="/indisponivel" element={<Indisponivel />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## APÊNDICE B: STACK TECNOLÓGICO RECOMENDADO

### Frontend
- **Framework:** React 18+
- **Bundler:** Vite (recomendado) ou Create React App
- **Router:** React Router v6
- **State Management:** Context API + useReducer (suficiente) ou Redux Toolkit
- **HTTP Client:** Axios
- **UI Components:** 
  - Option 1: Material-UI (MUI) v5
  - Option 2: Chakra UI
  - Option 3: Ant Design
  - Option 4: Tailwind CSS + Headless UI (mais customizável)
- **Forms:** React Hook Form + Yup/Zod (validação)
- **Tables:** TanStack Table (React Table) v8
- **Charts:** Recharts ou Chart.js
- **Date/Time:** date-fns
- **Rich Text:** React-Quill
- **Drag & Drop:** @dnd-kit
- **Testing:** Jest + React Testing Library

### Backend (para API)
- **Opção 1:** Manter Laravel e criar API REST
- **Opção 2:** Node.js + Express
- **Opção 3:** NestJS
- **Database:** MySQL (manter)
- **Auth:** JWT

### DevOps
- **Version Control:** Git
- **CI/CD:** GitHub Actions ou GitLab CI
- **Deploy:** Vercel/Netlify (frontend) + VPS/Cloud (backend)

---

**FIM DO DOCUMENTO**

Este documento serve como referência completa para a migração do sistema Rumo Saudável de Laravel para React. Todas as páginas, rotas, lógicas de negócio e estruturas de dados estão documentadas para facilitar o desenvolvimento.
