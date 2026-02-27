# API Contract Matrix (Frontend x Backend)

## Objective
Matrix to freeze API contracts used by frontend integration and track gaps against `MIGRACAO_REACT.md`.

## Contract Source
- Primary source: backend real contract (Swagger/Postman) - pending import/version pin.
- Secondary source: `MIGRACAO_REACT.md`.
- Last reviewed: 2026-02-18.

## Environment
- Demo mode: `NEXT_PUBLIC_DEMO_MODE=true`
- API mode: `NEXT_PUBLIC_DEMO_MODE=false`
- Base API URL: `NEXT_PUBLIC_API_URL`
- Authenticated transport: `/api/proxy/*`

## Domains

## Auth
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/login` | POST | Public | `login`, `password` (urlencoded) | `{ token, type, ... }` | Implemented in NextAuth |
| `/auth/forgot-password` | POST | Public | `{ email }` | envelope | Implemented (`auth.ts`) |
| `/auth/reset-password` | POST | Public | `{ token, password, password_confirmation }` | envelope | Implemented (`auth.ts`) |
| `/auth/me` | GET | Bearer | - | `{ user }` | Implemented (`auth.ts`) |

## Empresas
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/adm/empresas` | GET | Admin | query filters | list/paginated | Implemented |
| `/adm/empresas` | POST | Admin | multipart | created | Implemented |
| `/adm/empresas/{id}` | GET | Admin | - | detail | Implemented |
| `/adm/empresas/{id}` | PUT/POST | Admin | multipart | updated | Implemented |
| `/adm/empresas/{id}` | DELETE | Admin | - | success | Implemented |
| `/adm/empresas/{id}/participantes` | GET | Admin | query | list | Implemented |
| `/adm/empresas/{id}/campos` | GET | Admin | - | list | Implemented |
| `/adm/empresas/{id}/logins` | POST | Admin | json | success | Implemented |
| `/adm/empresas/{id}/filtros` | POST | Admin | json | success | Implemented |
| `/adm/campos-empresas/{id}` | DELETE | Admin | - | success | Implemented |

## Participantes
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/adm/participantes/batch` | POST | Admin | multipart | import summary | Implemented |
| `/adm/participantes/{id}` | GET | Admin | - | detail | Implemented |
| `/adm/participantes/{id}/dados-pessoais` | GET | Admin | - | list | Implemented |
| `/adm/participantes/{id}/historico-coaching` | GET/POST | Admin | json/multipart | list/item | Implemented |
| `/adm/historico-coaching/{id}` | PUT/DELETE | Admin | multipart/- | updated/success | Implemented |
| `/adm/participantes/{id}/contatos` | GET/POST | Admin | json | list/item | Implemented |
| `/adm/contatos/{id}` | DELETE | Admin | - | success | Implemented |
| `/adm/participantes/{id}/simular-acesso` | POST | Admin | - | token+user | Implemented |
| `/adm/pesquisar-usuarios` | GET | Admin | query | list | Implemented |

## Programas
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/adm/programas` | GET/POST | Admin | query/json | list/create | Implemented |
| `/adm/programas/{id}` | GET/PUT/DELETE | Admin | json | detail/update/success | Implemented |
| `/adm/programas/{id}/duplicar` | POST | Admin | - | created copy | Implemented |
| `/adm/programas/{id}/empresas` | POST | Admin | `{ id_empresa }` | success | Implemented |
| `/adm/programas/{id}/empresas/{empresaId}` | DELETE | Admin | - | success | Implemented |
| `/adm/programas/{id}/empresas/{empresaId}/intervalo` | POST/DELETE | Admin | `{ intervalo_inicio, intervalo_termino }` | success | Implemented |
| `/adm/empresas/{empresaId}/programas/{programaId}/acessos` | GET/POST | Admin | query/json | list/success | Implemented |

## Questionarios
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/adm/questionarios` | GET/POST | Admin | query/json | list/create | Implemented |
| `/adm/questionarios/{id}` | GET/PUT/DELETE | Admin | json | detail/update/success | Implemented |
| `/adm/questionarios/{id}/duplicar` | POST | Admin | - | created copy | Implemented |
| `/adm/questionarios/{id}/exportar` | GET | Admin | - | file/blob | Implemented |
| `/adm/questionarios/{id}/tipo-resultado` | POST | Admin | `{ tipo_resultado }` | success | Implemented |
| `/adm/questionarios/{id}/ordenar` | POST | Admin | array | success | Implemented |
| `/adm/questionarios/{id}/perguntas` | GET/POST | Admin | json | list/create | Implemented |
| `/adm/perguntas/{id}` | GET/PUT/DELETE | Admin | json | detail/update/success | Implemented |
| `/adm/perguntas/dependente` | POST | Admin | json | created | Implemented |
| `/adm/perguntas/{id}/alternativas` | POST | Admin | json | created | Implemented |
| `/adm/alternativas/{id}` | DELETE | Admin | - | success | Implemented |
| `/adm/questionarios/{id}/intervalos` | GET/POST | Admin | json | list/create | Implemented |
| `/adm/intervalos/{id}` | PUT/DELETE | Admin | json | update/success | Implemented |
| `/adm/questionarios/{id}/textos` | POST | Admin | json | success | Implemented |

## Relatorios
| Endpoint | Method | Auth | Request | Expected Response | Front Status |
|---|---|---|---|---|---|
| `/adm/relatorios/{empresaId}/dashboard` | GET | Admin | query | dashboard data | Implemented |
| `/adm/relatorios/{empresaId}/grafico` | GET | Admin | query | chart data | Implemented |
| `/adm/relatorios/{empresaId}/semaforo` | GET | Admin | query | risk data | Implemented |
| `/adm/relatorios/{empresaId}/heatmap` | GET | Admin | query | heatmap data | Implemented |
| `/adm/relatorios/{userId}/{questionarioId}/individual` | GET | Admin | - | report | Implemented |
| `/adm/relatorios/semaforo/filtros` | GET | Admin | query | list | Implemented |

## Known Gaps
1. Backend Swagger/Postman file is not versioned in this repository.
2. Legacy pages can still have field naming mismatches between UI and backend payload.
3. Some report endpoints still need functional QA against real production payload.

## Validation Checklist
- [ ] Swagger/Postman version pinned (`docs/contracts/<version>.json`).
- [ ] Smoke test in API mode for Admin.
- [ ] Smoke test in API mode for Participante.
- [ ] Smoke test in API mode for Empresa.
- [ ] 401/403/422/500 user-facing behavior validated.
- [ ] Multipart uploads validated via `/api/proxy`.
