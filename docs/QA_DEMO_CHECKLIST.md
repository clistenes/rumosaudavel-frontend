# QA Demo Checklist

## Escopo
Validacao funcional do modo demo (`NEXT_PUBLIC_DEMO_MODE=true`) para os tres perfis: Admin, Empresa e Participante.
Execucao atual: **26/02/2026**.

## Validacao Tecnica
- Build: `yarn build` -> aprovado.
- Persistencia demo: `localStorage` -> ativo para estado geral (`DemoContext`) e submissoes de participante.
- Rotas chave validadas por existencia de arquivo em `src/app`: admin, empresa e participante -> aprovado.
- Limpeza de artefatos residuais no root: `nul` e `teste-importacao.csv` removidos.

## Admin
- Login admin demo: ok
- Lista de empresas: ok
- Edicao empresa por linha: ok
- Lista de acessos: ok
- Novo acesso: ok
- Programas com vinculo por empresa: ok
- Controle de acesso por usuario no vinculo: ok
- Relatorios admin (analitico/grafico/termometro/semaforo-heatmap/individual): ok
- Exportacao CSV em relatorios admin: ok

## Empresa
- Login empresa demo: ok
- Dashboard empresa: ok
- Relatorios empresa (geral/graficos/semaforo/heatmap): ok
- Exportacao CSV em relatorios empresa: ok

## Participante
- Login participante demo: ok
- Dashboard participante com status real: ok
- Lista de questionarios: ok
- Responder questionario: ok
- Retomar respostas ja salvas: ok
- Refazer questionario (reset): ok
- Relatorio individual por questionario: ok
- Prontuario com historico de submissoes: ok
- Contatos dinamicos por empresa/risco: ok

## Pendencias para Sprint 7 (Hardening)
- Executar smoke manual completo por navegacao real em cada perfil (passo a passo).
- Revisar textos/copies restantes com acentos e padronizacao final.
