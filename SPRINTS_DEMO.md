# SPRINTS_DEMO - Plano de Fechamento do Modo Demo

## Objetivo
Deixar a aplicacao 100% funcional em modo demo (`NEXT_PUBLIC_DEMO_MODE=true`) para apresentacao ponta a ponta, sem botoes quebrados e sem fluxos incompletos.

## Definicao de Pronto (DoD)
- Todas as telas criticas dos perfis `Admin`, `Empresa` e `Participante` funcionam sem API real.
- Nenhuma acao principal sem efeito (CRUD, filtros, navegacao, exportacao, simulacao).
- Estado demo persiste em `localStorage` e reflete alteracoes apos refresh.
- Feedback visual consistente: loading, sucesso, erro e empty state.
- Build verde (`yarn build`).

---

## Status Atual
- Modo demo: **ATIVO** em `.env.local`.
- Base demo: `DemoContext` com persistencia implementada.
- Listagens principais admin: **funcionais** (empresas, participantes, programas, questionarios, usuarios, acessos).
- Ponto de atencao: ainda existem telas com dados fixos/acoes parciais fora do fluxo central do `DemoContext`.

---

## Sprint 1 - Base Demo e Consistencia Global
Status: **Concluido**

Escopo:
- Tipagem demo central.
- Persistencia `DemoContext`.
- Padrao de fallback demo nas telas principais.

Aceite:
- Dados persistem apos refresh.
- Alteracoes basicas de CRUD aparecem sem reload.

---

## Sprint 2 - Admin Core (Empresas, Programas, Questionarios)
Status: **Concluido**

Escopo:
- Fechar CRUD completo de empresas, programas e questionarios no demo.
- Garantir que duplicar/excluir/editar e vinculos funcionem em todas as telas relacionadas.
- Validar ordenacao e estrutura de questionario em modo demo.

Entregas:
- Duplicacao de questionario com clonagem de estrutura completa (perguntas, alternativas, dimensoes e grupos) no `DemoContext`.
- Exclusao de questionario removendo vinculos em programas.
- Robustez de navegação por empresa na listagem admin (sem `id` indefinido nos atalhos de editar/analytics/notificacao/relatorios).

Aceite:
- Todos os botoes dessas telas geram efeito real no estado demo.

---

## Sprint 3 - Participantes e Importacao
Status: **Concluido**

Escopo:
- Fechar `adicionar-participante`, `lista-participantes`, `info-participante`, `lista-participantes/[empresaId]`.
- Implementar pipeline demo de importacao (texto/csv/excel) com resumo:
  - `importados`
  - `duplicados`
  - `erros`

Entregas:
- Importacao demo por texto e arquivo (`CSV/TXT/XLS/XLSX`) concluida.
- Relatorio de erros com `linha/posicao` e exportacao CSV.
- Resumo por tipo de inconsistencia (`login vazio`, `formato invalido`, `duplicado`) em `Adicionar Participantes` e `Novo Acesso`.

Aceite:
- Participantes importados aparecem de imediato.
- Regras minimas de validacao para evitar duplicidade basica.

---

## Sprint 4 - Usuarios, Acessos e Permissoes Demo
Status: **Concluido**

Escopo:
- `novo-usuario`, `lista-usuarios`, `lista-acessos`, `novo-acesso`.
- Simulacao de acesso por perfil com impacto em menu/rotas.
- Encerramento de sessao demo e estado de acesso consistente.

Entregas:
- `/adm/novo-acesso` implementado com criacao real no `DemoContext` (usuario/login/senha).
- Consistencia de `login` garantida em `addUsuario` e em `novo-usuario`.
- Duplicacao de usuario ajustada para gerar `login` e `email` validos no demo.
- Simulacao de acesso por perfil implementada em `lista-usuarios` com troca de sessao demo (Admin/Empresa/Participante), refletindo menu e rotas.

Aceite:
- Usuario criado/alterado/removido afeta listagem e permissao imediatamente.

---

## Sprint 5 - Relatorios Admin e Empresa
Status: **Em progresso**

Escopo:
- Centralizar calculo de indicadores demo para:
  - Admin: analitico, grafico, termometro, semaforo, heatmap, individual.
  - Empresa: geral, graficos, semaforo, heatmap.
- Remover hardcode isolado em paginas de relatorio.

Entregas parciais:
- Base de calculo de relatorios demo centralizada em `src/utils/demo-reports.ts`.
- Relatorios da area Empresa (`geral`, `graficos`, `semaforo`, `heatmap`) migrados de placeholder para dados reais do `DemoContext`.
- Relatorios da area Admin (`analitico`, `grafico`, `termometro`, `semaforo-heatmap`, `individual`) migrados para dados reais do `DemoContext`.
- Filtro por programa aplicado no `analitico` considerando empresas vinculadas ao programa no estado demo.
- Exportacao CSV implementada nos relatorios principais (Admin e Empresa).
- Empty states adicionados para cenarios sem dados por empresa/filtro.

Aceite:
- Todos os relatorios usam a mesma base de dados demo.
- Filtros mudam os numeros de forma coerente.

---

## Sprint 6 - Jornada Participante
Status: **Concluido**

Escopo:
- Home participante, resposta de questionario, progresso e finalizacao.
- Relatorio individual por questionario.
- Prontuario e contatos com dados do estado demo.

Entregas parciais:
- Jornada participante migrada para estado demo persistido em `localStorage` via `src/utils/demo-participante.ts`.
- Dashboard participante (`/participante`) com status real de questionarios respondidos.
- Lista de questionarios (`/participante/questionarios`) funcional com pendente/finalizado.
- Fluxo de resposta (`/participante/questionario/[id]`) salvando submissao e atualizando indicadores do participante no `DemoContext`.
- Relatorio por questionario (`/participante/relatorio/[questionarioId]`) consumindo submissao salva.
- Prontuario (`/participante/prontuario`) com historico real das submisses do participante.
- Contatos (`/participante/contatos`) dinamico por participante/empresa, com recomendacao por risco e atalhos de acompanhamento.
- UX da jornada participante refinada:
  - retomada de respostas ja salvas ao reabrir questionario
  - status coerente `disponivel | pendente | finalizado` no dashboard e lista de questionarios
  - acao de refazer no relatorio individual do questionario

Aceite:
- Fluxo completo: `entrar -> responder -> finalizar -> visualizar resultado`.

---

## Sprint 7 - Hardening e QA Final
Status: **Em progresso**

Escopo:
- Revisao de acoes sem implementacao.
- Revisao de loading/erro/empty state.
- Revisao de copy e navegacao.
- Smoke test por perfil.

Checklist minimo:
- Admin: login, CRUDs principais, relatorios.
- Empresa: dashboard e relatorios.
- Participante: responder questionario e ver resultado.
- Evidencias de QA registradas em `docs/QA_DEMO_CHECKLIST.md`.
- Limpeza de artefatos residuais concluida (`nul`, `teste-importacao.csv`).

Aceite:
- `yarn build` ok.
- Zero acao critica quebrada.

---

## Ordem Recomendada de Execucao
1. Sprint 2
2. Sprint 3
3. Sprint 4
4. Sprint 5
5. Sprint 6
6. Sprint 7

---

## Proxima Fase (execucao imediata)
Fase atual recomendada: **Sprint 5**.

Backlog imediato:
1. Revisar exportacoes e empty states dos relatorios.
2. Validar coerencia fina de calculos entre paginas (amostras pequenas e casos sem participantes).
3. Preparar inicio da Sprint 6 (jornada completa do participante).
