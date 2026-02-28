# Modo Demo

Este projeto roda com modo demo local por padrao.

## Estado atual
- `NEXT_PUBLIC_DEMO_MODE=true` em `.env.local`.
- Fonte unica de dados demo: `src/assets/data/demo-db.json`.
- Persistencia: `localStorage` usando chave versionada `rumosaudavel:demo-db:v2`.
- O estado e gerenciado por `src/services/demo-db.service.ts`.

## Importante
- Nao existe rota `/api/demo` no App Router.
- Em modo demo, o frontend nao deve depender de chamadas HTTP reais para CRUD/fluxo.
- Os servicos de dominio (`empresa`, `participante`, `programa`, `questionario`) usam a base demo local quando `NEXT_PUBLIC_DEMO_MODE=true`.

## Credenciais demo
Acesse `/auth/login`:
- Admin: `admin` / `admin123`
- Empresa: `empresa` / `empresa123`
- Participante: `participante` / `participante123`

## Alternar para API real
Para usar backend real:
```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Reset do banco demo
- Pela tela `/demo-funcional` (botao `Resetar banco demo`), ou
- Via `demoDbService.resetState()`.
