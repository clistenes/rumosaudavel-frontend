# Plano de Sprints - Demo 100% Funcional

## Objetivo
Concluir a implementação da demo com todos os fluxos críticos funcionais (CRUDs, botões de ação, relatórios, jornada de participante e empresa), sem ações quebradas e com persistência local.

## Definição de Pronto (DoD) da Demo
- Nenhum botão principal sem ação real.
- Nenhuma tela crítica usando dado fixo local fora do estado demo.
- Fluxos ponta a ponta funcionando para `Admin`, `Participante` e `Empresa`.
- Estado demo persistido em `localStorage`.
- Mensagens de sucesso/erro padronizadas.

---

## Sprint 1 - Fundação Demo + Empresas (status: em andamento)
### Objetivo
Consolidar base de estado demo e fechar módulo de empresas.

### Escopo
- Tipagem central da demo.
- Persistência do `DemoContext`.
- `Empresas`: listar, criar, editar, excluir, exportar.

### Entregáveis
- `src/types/demo.ts`
- `src/context/DemoContext.tsx` com persistência.
- Telas de empresas em modo demo funcional.

### Critérios de aceite
- CRUD de empresas funcional e refletido na listagem sem reload.
- Dados persistem após refresh.

---

## Sprint 2 - Programas + Vínculos
### Objetivo
Fechar gestão de programas e vínculo com questionários.

### Escopo
- `lista-programas`, `adicionar-programa`, `editar-programa`.
- `vincular-questionarios/[programaId]`.
- Duplicação, exclusão, ativação/inativação.

### Entregáveis
- Fluxo completo Programa -> Vincular Questionários -> Salvar.

### Critérios de aceite
- Todos botões dessas telas executam ação real.
- Alterações refletidas no estado demo e persistidas.

---

## Sprint 3 - Questionários (CRUD completo)
### Objetivo
Fechar administração de questionários em modo demo.

### Escopo
- `lista-questionarios`, `novo-questionario`, `visualizar-questionario`.
- Perguntas: criar/editar/excluir.
- Alternativas, intervalos, textos complementares.
- Duplicar questionário.

### Entregáveis
- CRUD completo de questionários e perguntas.

### Critérios de aceite
- Estrutura do questionário salva e reaparece corretamente em reabertura.

---

## Sprint 4 - Dependências + Ordenação (DnD)
### Objetivo
Fechar regras de ordenação e perguntas dependentes.

### Escopo
- Drag and drop com persistência: dimensões, grupos e perguntas.
- Tela de pergunta dependente com criação/edição funcional.
- Reordenação refletida no fluxo de resposta.

### Entregáveis
- Mecanismo único de ordenação para todo questionário.

### Critérios de aceite
- Ordem e dependências permanecem corretas após refresh.

---

## Sprint 5 - Participantes + Importação
### Objetivo
Fechar gestão de participantes e importações.

### Escopo
- `lista-participantes`, `lista-participantes/[empresaId]`, `adicionar-participante`, `info-participante`.
- Importação texto/CSV/Excel no demo.
- Edição e exclusão de participante.

### Entregáveis
- Pipeline de importação funcional com resumo (`importados`, `duplicados`, `erros`).

### Critérios de aceite
- Participantes importados aparecem imediatamente.
- Validação evita registros inválidos/duplicados.

---

## Sprint 6 - Jornada do Participante
### Objetivo
Fechar fluxo completo de uso do participante.

### Escopo
- Dashboard do participante com dados dinâmicos demo.
- Responder questionário com progresso e dependências.
- Geração de relatório por questionário.
- Prontuário e contatos.

### Entregáveis
- Fluxo ponta a ponta: `home -> responder -> finalizar -> relatório`.

### Critérios de aceite
- Respostas gravadas no estado demo.
- Relatório reflete respostas reais.

---

## Sprint 7 - Dashboard/Relatórios da Empresa
### Objetivo
Tornar área empresa totalmente funcional com dados demo calculados.

### Escopo
- `empresa/page.tsx`
- Relatórios: `geral`, `graficos`, `semaforo`, `heatmap`.
- Filtros funcionando e exportação CSV.

### Entregáveis
- Indicadores e gráficos derivados das respostas demo.

### Critérios de aceite
- Filtros alteram resultados visivelmente.
- Dados coerentes com participantes da empresa.

---

## Sprint 8 - Relatórios Admin (Analítico, Gráfico, Termômetro, Semáforo, Heatmap, Individual)
### Objetivo
Eliminar dados hardcoded dos relatórios admin.

### Escopo
- `adm/relatorios/analitico`
- `adm/relatorios/grafico`
- `adm/relatorios/termometro`
- `adm/relatorios/semaforo-heatmap`
- `adm/relatorios/individual`

### Entregáveis
- Camada de cálculo central para relatórios demo.

### Critérios de aceite
- Relatórios admin e empresa convergem para os mesmos dados base.

---

## Sprint 9 - Usuários, Acessos e Simulação
### Objetivo
Fechar administração de usuários e recursos avançados da demo.

### Escopo
- `lista-usuarios`, `novo-usuario`, `lista-acessos`.
- Simular acesso (`impersonação demo`).
- Ajuste de permissões e navegação por perfil.

### Entregáveis
- Fluxo funcional de criação/edição/exclusão de usuários e controle de acesso.

### Critérios de aceite
- Mudanças de acesso impactam menus e rotas imediatamente.

---

## Sprint 10 - Hardening, QA e Fechamento
### Objetivo
Finalizar qualidade da demo e remover pendências.

### Escopo
- Revisão de botões sem ação.
- Padronização de loading/erro/empty-state.
- Revisão de copy/encoding.
- Checklist QA por perfil (Admin/Participante/Empresa).

### Entregáveis
- Documento de checklist final validado.
- Demo estável para apresentação.

### Critérios de aceite
- 0 ações críticas quebradas.
- 0 telas críticas dependentes de mock local isolado.
- Fluxos principais validados de ponta a ponta.

---

## Ordem Recomendada de Execução
1. Sprint 1
2. Sprint 2
3. Sprint 3
4. Sprint 4
5. Sprint 5
6. Sprint 6
7. Sprint 7
8. Sprint 8
9. Sprint 9
10. Sprint 10

## Risco Principal
Duplicação de lógica entre páginas.  
Mitigação: centralizar cálculos e mutações demo em `context` + `hooks`.
