# 🚀 Guia Rápido de Uso

## 📦 Instalação

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Configuração

### 1. Configure o Backend

Copie o arquivo de exemplo:
```bash
cd backend
cp .env.example .env
```

Edite `.env` com suas credenciais do Supabase e JWT_SECRET.

### 2. Crie o Usuário Admin

```bash
npm run create-admin
```

**Credenciais padrão:**
- Email: `admin@anbfarma.com`
- Senha: `admin123`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 🏃 Executar

### Backend
```bash
cd backend
npm run dev
```
Servidor rodando em: http://localhost:3000

### Frontend
```bash
cd frontend
npm run dev
```
Aplicação rodando em: http://localhost:5173

## 🔐 Fluxo de Autenticação

1. **Login**
   - Acesse http://localhost:5173/login
   - Entre com email e senha
   - Token JWT é gerado e armazenado

2. **Navegação Protegida**
   - Todas as rotas do dashboard são protegidas
   - Token é validado automaticamente
   - Redirecionamento ao expirar

3. **Logout**
   - Clique em "Sair" na sidebar
   - Token e dados são limpos

## 📝 API Endpoints

### Autenticação
```
POST /login
Body: { "email": "admin@anbfarma.com", "senha": "admin123" }
Response: { "sucesso": true, "token": "...", "usuario": {...} }
```

### Usuários (requer autenticação)
```
GET /usuarios
POST /usuarios
Body: { "nome": "...", "email": "...", "senha": "...", "tipo": "admin|operador" }
```

### Produtos (requer autenticação)
```
GET /produtos
POST /produtos
Body: { "nome": "...", "preco": 10.50 }
GET /produtos/:id
```

## 🔍 Validações Implementadas

### Login
- Email válido (formato)
- Senha mínimo 6 caracteres

### Usuário
- Nome: 3-100 caracteres
- Email válido
- Senha mínimo 6 caracteres
- Tipo: "admin" ou "operador"

### Produto
- Nome: 3-200 caracteres
- Preço: número positivo

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev         # Modo desenvolvimento
npm run build       # Compilar TypeScript
npm run start       # Produção
npm run create-admin # Criar usuário admin
```

### Frontend
```bash
npm run dev         # Modo desenvolvimento
npm run build       # Build produção
npm run preview     # Preview do build
```

## 🐛 Troubleshooting

### Token expirado
- Faça logout e login novamente
- Token válido por 2 horas

### Erro 401 nas requisições
- Verifique se está logado
- Limpe localStorage e faça login novamente

### Erro ao criar usuário
- Verifique credenciais do Supabase no .env
- Confirme estrutura da tabela `usuarios`

### Build falha
- Execute `npm install` novamente
- Verifique versão do Node (recomendado: v18+)

## 📊 Estrutura do Banco (Supabase)

### Tabela: usuarios
```sql
id: uuid (PK)
nome: text
email: text (unique)
senha: text (hash bcrypt)
tipo: text ('admin' | 'operador')
criado_em: timestamp
```

### Tabela: produtos
```sql
id: uuid (PK)
nome: text
preco: numeric
criado_em: timestamp
```

## 🔒 Segurança

- ✅ Senhas com hash bcrypt
- ✅ JWT com secret seguro
- ✅ Validação de entrada em todas as rotas
- ✅ Guards de rota no frontend
- ✅ Verificação de expiração de token
- ✅ CORS configurado
- ✅ Variáveis de ambiente

## 📚 Tecnologias

**Backend:**
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL)
- JWT + bcrypt
- Joi (validação)

**Frontend:**
- Vue 3 + TypeScript
- Vuetify 3
- Vue Router
- Composition API

---

**Desenvolvido com ❤️ para ANB Farma**
