# Documentação do Sistema de Questionários

## Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Models](#models)
4. [Controllers](#controllers)
5. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
6. [Sistema de Drag and Drop](#sistema-de-drag-and-drop)
7. [Views e Templates](#views-e-templates)
8. [Funcionalidades](#funcionalidades)
9. [API e Endpoints](#api-e-endpoints)
10. [Considerações Técnicas](#considerações-técnicas)

---

## Visão Geral

O sistema de questionários é uma aplicação Laravel (PHP) com interface em Blade templates e JavaScript vanilla. Permite a criação, edição e organização de questionários com perguntas, alternativas e estrutura hierárquica de dimensões e grupos.

### Arquitetura
- **Backend:** Laravel (PHP 7.x/8.x)
- **Frontend:** Blade Templates + jQuery + SortableJS
- **Banco de Dados:** MySQL
- **Autenticação:** Sistema nativo Laravel com middlewares

---

## Estrutura do Banco de Dados

### Tabela: `questionarios`
```sql
- id (PK)
- nome (string) - Nome interno do questionário
- nome_site (string) - Nome exibido para usuários
- descricao (text) - Descrição HTML
- info_adm (text) - Informações administrativas
- deleted (tinyint) - Soft delete (0=ativo, 1=excluído, 2=excluído definitivo)
- tipo_resultado (enum) - Tipo de processamento dos resultados
- texto_depressao (text) - Texto específico para depressão
- texto_ansiedade (text) - Texto específico para ansiedade
- exibir_somente_texto_relatorios (boolean)
- created_at / updated_at
```

### Tabela: `perguntas`
```sql
- id (PK)
- id_questionario (FK) - Referência ao questionário
- pos (int) - Posição/ordem da pergunta
- nome (text) - Texto da pergunta
- tipo (enum: 'sn', 'me', 'dissertativa') - Tipo da pergunta
  * 'sn' = Sim/Não
  * 'me' = Múltipla Escolha
  * 'dissertativa' = Texto livre
- s_pontuacao / n_pontuacao (int) - Pontuação para Sim/Não
- s_tipo / n_tipo (string) - Tipo/classificação
- s_comentario / n_comentario (text) - Comentários
- tipo_dependente (enum: 's', 'n', 'me') - Tipo de dependência
- id_dependente (int) - ID da pergunta/alternativa pai
- escolha_hipotese (enum: '1', 'n') - Múltipla escolha (1=uma opção, n=múltiplas)
- flag / flag_ansiedade (string) - Flags especiais
- id_clonagem (int) - ID original ao duplicar
- grupo_nome (string) - Nome do grupo (NR1)
- grupo_pos (int) - Posição do grupo
- dimensao_nome (string) - Nome da dimensão
- dimensao_pos (int) - Posição da dimensão
- nome_curto (string) - Nome abreviado
- explicacao (text) - Explicação da pergunta
- created_at / updated_at
```

### Tabela: `alternativas`
```sql
- id (PK)
- id_pergunta (FK) - Referência à pergunta
- id_questionario (FK) - Referência ao questionário
- alternativa (text) - Texto da alternativa
- pontuacao (int) - Pontos atribuídos
- tipo (string) - Classificação
- comentario (text) - Comentário
- created_at / updated_at
```

### Tabela: `questionarios_intervalos`
```sql
- id (PK)
- id_questionario (FK)
- cor (string) - Cor do intervalo
- legenda (string) - Legenda descritiva
- intervalo_inicio (int) - Valor inicial
- intervalo_termino (int) - Valor final
- texto (text) - Texto explicativo
- created_at / updated_at
```

---

## Models

### Questionarios (`app/Questionarios.php`)
```php
class Questionarios extends Model
{
    protected $table = 'questionarios';
    protected $fillable = [
        'id', 'nome', 'nome_site', 'descricao', 'info_adm', 
        'deleted', 'tipo_resultado', 'texto_depressao', 
        'texto_ansiedade', 'exibir_somente_texto_relatorios'
    ];

    // Retorna quantidade de perguntas
    public function qtdperguntas($id)
    
    // Retorna todas as perguntas do questionário
    public function perguntas($id)
}
```

### Perguntas (`app/Perguntas.php`)
```php
class Perguntas extends Model
{
    protected $table = 'perguntas';
    protected $fillable = [
        'id', 'id_questionario', 'pos', 'nome', 'tipo',
        's_pontuacao', 's_tipo', 's_comentario',
        'n_pontuacao', 'n_tipo', 'n_comentario',
        'tipo_dependente', 'id_dependente', 'escolha_hipotese',
        'flag', 'flag_ansiedade', 'id_clonagem',
        'grupo_nome', 'grupo_pos', 'nome_curto', 'explicacao'
    ];

    // Converte tipo para texto legível
    public function tipofulltext($tipo)
    
    // Retorna alternativas da pergunta
    public function alternativas($id)
    
    // Verifica se existe pergunta dependente
    public function verificaDependencia($tipo, $id)
    
    // Calcula progresso do participante
    public function consultaProgresso($id_user, $id_questionario)
    
    // Múltiplas funções de relatórios e estatísticas...
}
```

### Alternativas (`app/Alternativas.php`)
Model simples para armazenar alternativas de múltipla escolha.

---

## Controllers

### QuestionarioController (`app/Http/Controllers/QuestionarioController.php`)

#### Principais Métodos:

**CRUD Básico:**
- `lista()` - Lista todos os questionários
- `criar()` - Cria novo questionário
- `visualizar($id)` - Visualização completa com dimensões/grupos
- `editarQuestionario($id)` - Form de edição
- `editarQuestionarioSave(Request $request)` - Salva edição
- `apagarQuestionario($id)` - Soft delete
- `duplicarQuestionario($id)` - Clona questionário com todas as perguntas

**Gestão de Perguntas:**
- `novaPergunta($id)` - Form de nova pergunta
- `addPerguntaNova(Request $request)` - Salva nova pergunta
- `editarPergunta($id)` - Form de edição
- `editarPerguntaSave(Request $request)` - Salva edição
- `apagarPergunta($id)` - Remove pergunta

**Perguntas Dependentes:**
- `perguntaDependente($tipo, $id)` - Form para criar pergunta dependente
- `perguntaDependenteSave(Request $request)` - Salva pergunta dependente
- `apagarPerguntaDependente($tipo, $id)` - Remove dependência
- `consultaPerguntaDependente($tipo, $id)` - Visualiza dependência

**Ordenação (Drag and Drop):**
- `salvarOrdemQuestionario(Request $request, $id)` - Salva estrutura hierárquica
- `ordenacao(Request $request)` - Atualiza posições simples

**Intervalos e Resultados:**
- `intervalo($id, $idintervalo)` - Gestão de intervalos de pontuação
- `intervaloSave(Request $request)` - Salva intervalo
- `tipoResultado(Request $request)` - Define tipo de resultado

**Exportação:**
- `exportar($id)` - Exporta para Word/HTML

---

## Fluxo de Funcionamento

### 1. Criação de Questionário
```
1. Admin acessa "Adicionar Questionário"
2. Preenche nome, nome_site e descrição
3. Define tipo de resultado (opcional)
4. Adiciona primeira pergunta automaticamente
5. Redireciona para visualização
```

### 2. Estrutura Hierárquica (Modo NR1)
```
Questionário
├── Dimensão 1 (ex: "Bem-estar Físico")
│   ├── Grupo A (ex: "Alimentação")
│   │   ├── Pergunta 1
│   │   ├── Pergunta 2
│   │   └── Pergunta 3
│   └── Grupo B (ex: "Sono")
│       ├── Pergunta 4
│       └── Pergunta 5
├── Dimensão 2 (ex: "Bem-estar Mental")
│   └── Grupo C
│       └── Pergunta 6
└── Perguntas sem dimensão/grupo
```

### 3. Tipos de Perguntas

**Sim/Não (`tipo = 'sn'`):**
- Cada opção tem: pontuação, tipo e comentário
- Pode ter perguntas dependentes

**Múltipla Escolha (`tipo = 'me'`):**
- Múltiplas alternativas com pontuação
- Escolha de hipótese: 1 opção ou múltiplas
- Alternativas podem ter perguntas dependentes

**Dissertativa (`tipo = 'dissertativa'`):**
- Campo de texto livre
- Não tem alternativas
- Não pode ter dependentes

### 4. Perguntas Dependentes
Permitem criar fluxos condicionais:
- Se usuário responde "Sim" → mostra Pergunta X
- Se usuário escolhe "Alternativa A" → mostra Pergunta Y

---

## Sistema de Drag and Drop

### Bibliotecas Utilizadas
- **SortableJS** (`public/js/Sortable.js`) - Core do drag and drop
- **jQuery Sortable** (`public/js/jquery-sortable.js`) - Wrapper jQuery
- **Arquivo Custom** (`public/js/sortable-groups.js`) - Lógica específica

### Hierarquia de Arraste

```
Nível 1: Dimensões
  └── Podem ser reordenadas entre si
  └── Container: #dimensionsContainer

Nível 2: Grupos
  └── Podem ser movidos entre dimensões
  └── Podem ser reordenados dentro da dimensão
  └── Container: .groups-sortable-list

Nível 3: Perguntas
  └── Podem ser movidas entre grupos
  └── Podem ser reordenadas dentro do grupo
  └── Container: .questions-sortable-list
  └── Lista de disponíveis: #availableQuestionsList
```

### Funcionalidades do Drag and Drop

**1. Criar Dimensão:**
- Botão "Adicionar Dimensão"
- Modal solicita nome
- Validação: nome único
- Cria elemento DOM dinamicamente

**2. Criar Grupo:**
- Botão "Adicionar Grupo"
- Modal solicita nome
- Validação: nome único por dimensão
- Requer pelo menos uma dimensão criada

**3. Mover Elementos:**
- Drag handle (ícone) em cada elemento
- Ghost visual durante arraste
- Animação suave (150ms)
- Validação de drop zones

**4. Editar Nomes:**
- Clique no ícone de edição
- Transforma texto em input
- Validação ao salvar (blur ou Enter)
- Cancela com Escape

**5. Excluir:**
- **Grupo:** Confirmação → perguntas voltam para "disponíveis"
- **Dimensão:** Confirmação → grupos vão para área principal
- **Pergunta:** Remove do banco (não é soft delete)

### Validações Antes de Salvar

```javascript
validateForOrder() {
  1. Deve haver pelo menos uma dimensão
  2. Todos os grupos devem estar em dimensões
  3. Cada dimensão deve ter pelo menos um grupo
  4. Cada grupo deve ter pelo menos uma pergunta
  5. Todas as perguntas devem estar alocadas em grupos
}
```

### Persistência

**Formato do JSON enviado:**
```json
[
  {
    "dimensao_nome": "Bem-estar Físico",
    "dimensao_pos": 1,
    "grupos": [
      {
        "grupo_nome": "Alimentação",
        "grupo_pos": 1,
        "perguntas": [
          {"id": 1, "pos": 1},
          {"id": 2, "pos": 2}
        ]
      }
    ]
  }
]
```

**Endpoint:** `POST /adm/salvar-ordem-questionario/{id}`

**Processo no Controller:**
1. Limpa todos os campos de ordenação do questionário
2. Atualiza cada pergunta com:
   - `dimensao_nome` e `dimensao_pos`
   - `grupo_nome` e `grupo_pos`
   - `pos` (posição dentro do grupo)

---

## Views e Templates

### Estrutura de Views
```
resources/views/questionario/
├── visualizar-questionario.blade.php      # Visualização principal
├── visualizar-questionario-backup.blade.php
├── editar-questionario.blade.php          # Edição básica
├── adicionar-questionario.blade.php       # Criação
├── nova-pergunta.blade.php                # Form nova pergunta
├── editar-pergunta.blade.php              # Form editar pergunta
├── _perguntas.blade.php                   # Template de pergunta (include)
├── pergunta-dependente.blade.php          # Form dependência
├── visualiza-pergunta-dependente.blade.php
├── lista-questionarios.blade.php          # Lista todos
├── intervalo.blade.php                    # Gestão de intervalos
└── info.blade.php                         # Info administrativa
```

### Layout Principal (`visualizar-questionario.blade.php`)

**Seções:**
1. **Header:** Título, botões de ação, exportar
2. **Dimensões e Grupos:** (se tipo_resultado = 'grupo_perguntas_me')
   - Container: `#mainDropArea`
   - Botões: Adicionar Dimensão/Grupo
   - Lista de dimensões com grupos aninhados
3. **Perguntas:**
   - Lista disponível: `#availableQuestionsList`
   - Botão: Adicionar nova pergunta
4. **Botão Salvar:** `#getOrderBtn`

### Template de Pergunta (`_perguntas.blade.php`)

**Estrutura:**
```html
<div class="list-group-item" data-id="{{ $pergunta->id }}">
  <div class="accordion">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-md-8">
            <i class="fas fa-arrows-alt handle"></i>
            <span class="position-label"></span>
            <b>{{ $pergunta->nome }}</b>
            <!-- Ícone de expandir (se não for dissertativa) -->
          </div>
          <div class="col-md-4 text-right">
            <!-- Tipo da pergunta -->
            <!-- Botão editar -->
          </div>
        </div>
      </div>
      
      <!-- Corpo colapsável (para sn/me) -->
      <div class="collapse">
        <div class="card-body">
          <table class="table">
            <!-- Alternativas ou Sim/Não -->
            <!-- Botões para perguntas dependentes -->
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Funcionalidades

### 1. Tipos de Resultado
Configurados em `tipo_resultado`:
- `soma_alternativas_pizza` - Gráfico pizza por alternativas
- `soma_pontos_pizza` - Gráfico pizza por pontos
- `soma_pontos_termometro` - Visual termômetro
- `media_pontos_fontesdestress` - Média ponderada
- `grupo_perguntas_me` - Agrupado por dimensões/grupos (NR1)

### 2. Duplicação de Questionário
- Replica questionário com sufixo "cópia"
- Copia todas as perguntas (com `id_clonagem`)
- Copia todas as alternativas
- Copia intervalos
- Reconecta dependências entre perguntas clonadas

### 3. Soft Delete
- `deleted = 1` - Excluído (vai para logs)
- `deleted = 2` - Excluído definitivamente
- Permite recuperação (`recuperar()`)

### 4. Exportação
- Gera arquivo Word (.docx) via PHPWord
- Inclui: nome, descrição, todas as perguntas
- Formatação: tabelas para alternativas

### 5. Intervalos de Pontuação
- Define faixas de pontuação com:
  - Cor (visual)
  - Legenda
  - Intervalo (início-fim)
  - Texto explicativo

---

## API e Endpoints

### Rotas Principais (web.php)

```php
// Listagem e CRUD
GET  /adm/lista-questionarios
GET  /adm/adicionar-questionario
POST /adm/add-questionario
GET  /adm/visualizar-questionario/{id}
GET  /adm/editar-questionario/{id}
POST /adm/editar-questionario-save
GET  /adm/apagar-questionario/{id}
GET  /adm/duplicar-questionario/{id}

// Perguntas
GET  /adm/nova-pergunta/{id}
POST /adm/add-pergunta-nova
GET  /adm/editar-pergunta/{id}
POST /adm/editar-pergunta-save
GET  /adm/apagar-pergunta/{id}

// Dependências
GET  /adm/pergunta-dependente/{tipo}/{id}
POST /adm/add-pergunta-dependente
GET  /adm/apagar-pergunta-dependente/{tipo}/{id}
GET  /adm/consulta-pergunta-dependente/{tipo}/{id}

// Ordenação
POST /adm/salvar-ordem-questionario/{id}  // AJAX
POST /adm/ajax-ordenacao-questionario     // Legado

// Outros
GET  /adm/exportar-questionario/{id}
GET  /adm/intervalo/{id}
POST /adm/add-intervalo
GET  /adm/info-questionario/{id}
POST /adm/info-questionario-save
```

---

## Considerações Técnicas

### Pontos Fortes
1. **Estrutura hierárquica flexível** - Dimensões → Grupos → Perguntas
2. **Drag and Drop intuitivo** - Interface visual clara
3. **Perguntas dependentes** - Permite fluxos condicionais complexos
4. **Múltiplos tipos de resultado** - Adaptável a diferentes necessidades
5. **Soft delete** - Segurança contra exclusões acidentais

### Pontos de Atenção
1. **Código JavaScript extenso** - `sortable-groups.js` tem ~950 linhas
2. **Dependência de jQuery** - Código legado, poderia ser modernizado
3. **Validação no frontend** - Poderia ter mais validações no backend
4. **Ausência de testes** - Não há testes unitários/integração visíveis
5. **Documentação inline** - Poucos comentários explicativos

### Possíveis Melhorias
1. **Migrar para React/Vue** - Componentização e estado centralizado
2. **Adicionar TypeScript** - Tipagem forte para evitar erros
3. **Implementar testes** - PHPUnit para backend, Jest para JS
4. **Refatorar JavaScript** - Dividir em módulos menores
5. **Adicionar cache** - Redis para consultas frequentes
6. **API RESTful** - Separar frontend e backend completamente

### Arquivos Importantes
```
app/
├── Questionarios.php
├── Perguntas.php
├── Alternativas.php
└── Http/Controllers/
    └── QuestionarioController.php

resources/views/questionario/
├── visualizar-questionario.blade.php
├── _perguntas.blade.php
└── [outros templates]

public/js/
├── sortable-groups.js         # Lógica principal DnD
├── Sortable.js                # Biblioteca SortableJS
└── jquery-sortable.js         # Wrapper jQuery

routes/
└── web.php                    # Definição de rotas
```

---

## Fluxo de Dados - Ordenação

```
1. Usuário arrasta elementos na interface
   ↓
2. SortableJS atualiza DOM em tempo real
   ↓
3. Usuário clica "Salvar ordenação"
   ↓
4. JavaScript coleta estrutura hierárquica
   ↓
5. Validações são executadas
   ↓
6. JSON é enviado via AJAX
   ↓
7. Controller processa e atualiza banco
   ↓
8. Resposta de sucesso/erro
   ↓
9. Recarrega página (opcional)
```

---

**Documento criado em:** 12/02/2026  
**Versão do sistema:** Laravel (versão não especificada)  
**Última atualização:** Análise baseada no código atual do repositório
