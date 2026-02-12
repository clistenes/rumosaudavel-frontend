# 🔌 CONFIGURAÇÃO DA API GO

Este documento explica como configurar o projeto para usar a API em Go hospedada.

---

## 📋 Pré-requisitos

1. URL da API Go hospedada (ex: `https://seudominio.com/rumosaudavel-api`)
2. Credenciais de teste válidas na API
3. Acesso à documentação da API Go (endpoints disponíveis)

---

## 🔧 Configuração

### 1. Editar o arquivo `.env.local`

Substitua a URL da API no arquivo `.env.local`:

```env
# API Go (substitua pelo link real da API hospedada)
NEXT_PUBLIC_API_URL=https://seudominio.com/rumosaudavel-api

# Desativar modo demo
NEXT_PUBLIC_DEMO_MODE=false
```

**Importante:** 
- Substitua `https://seudominio.com/rumosaudavel-api` pela URL real da sua API
- Não inclua a barra final (/) na URL

---

### 2. Formato de Login

A API Go espera o login via **FormData**:

```http
POST https://seudominio.com/rumosaudavel-api/login
Content-Type: multipart/form-data

login=usuario
password=senha123
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nome Usuario",
    "email": "usuario@email.com",
    "login": "usuario",
    "type": 1,
    "id_empresa": 1,
    "cadastrado": 1,
    "termo_consentimento": 1,
    "empresa": {
      "id": 1,
      "nome": "Empresa X",
      "cor": "#FF6600",
      "logotipo": "logo.png",
      "slug": "empresa-x"
    },
    "token": "jwt-token-aqui"
  }
}
```

---

### 3. Testar Conexão

Após configurar, teste o login:

1. Inicie o servidor:
```bash
yarn dev
```

2. Acesse: `http://localhost:3000/auth/login`

3. Faça login com credenciais válidas da API Go

---

## 🔍 Troubleshooting

### Erro: "Network Error"
**Causa:** API não está acessível ou CORS bloqueado
**Solução:** Verifique se a API está online e se permite requisições do localhost

### Erro: "Credenciais inválidas"
**Causa:** Login ou senha incorretos
**Solução:** Verifique se os dados estão corretos e se a API retorna o formato esperado

### Erro: "Cannot read property 'success'"
**Causa:** API retorna formato diferente do esperado
**Solução:** Verifique o formato da resposta da API Go

---

## 📊 Endpoints Necessários

Para o sistema funcionar completamente, a API Go deve ter os seguintes endpoints:

### Autenticação
- `POST /login` - Login com FormData

### Admin (type=1)
- `GET /adm/dashboard` - Estatísticas
- `GET /adm/empresas` - Lista empresas
- `GET /adm/questionarios` - Lista questionários
- `GET /adm/programas` - Lista programas

### Participante (type=2)
- `GET /participante/home` - Lista questionários
- `GET /participante/questionario/:id` - Carregar questionário
- `POST /participante/resposta` - Enviar resposta

### Empresa (type=3)
- `GET /empresa/dashboard` - Dashboard empresa
- `GET /empresa/relatorios` - Relatórios
- `GET /empresa/participantes` - Lista participantes

---

## 🧪 Testar com Modo Demo

Se quiser testar sem a API:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Credenciais de teste:
- **Admin:** admin / admin123
- **Participante:** participante / participante123  
- **Empresa:** empresa / empresa123

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do terminal do Next.js
3. Teste a API diretamente com Postman/Insomnia
4. Verifique se a API Go está retornando o formato correto
