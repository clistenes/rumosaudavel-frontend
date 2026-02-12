# 🧪 Modo Demo - Teste sem API

O projeto possui um modo demo que permite testar o sistema **sem precisar do backend Laravel** rodando.

## 🚀 Como ativar

O modo demo já está ativado por padrão no arquivo `.env.local`:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

## 👤 Credenciais de Teste

Acesse `http://localhost:3000/auth/login` e use uma das contas:

### Administrador (Tipo 1)
- **Login:** `admin`
- **Senha:** `admin123`
- **Acesso:** `/adm` - Dashboard administrativo

### Participante (Tipo 2)
- **Login:** `participante`
- **Senha:** `participante123`
- **Acesso:** `/participante` - Área do participante

### Empresa (Tipo 3)
- **Login:** `empresa`
- **Senha:** `empresa123`
- **Acesso:** `/empresa` - Dashboard da empresa

## 🔧 Como desativar (usar API real)

Para usar o backend Laravel real, altere no `.env.local`:

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📝 Notas

- No modo demo, as chamadas à API retornarão dados mockados
- As funcionalidades de CRUD são simuladas (não persistem dados)
- Perfeito para desenvolvimento frontend e testes de UI

## 🎨 Funcionalidades Testáveis

✅ Login com diferentes perfis  
✅ Proteção de rotas por tipo de usuário  
✅ Redirecionamento automático após login  
✅ Layouts específicos por perfil  
✅ Logout  

---

**Para testar agora:**
```bash
yarn dev
```

Acesse `http://localhost:3000/` e faça login com qualquer conta de teste!
