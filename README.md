# Projeto MVP - TypeScript, Vue.js, Express

Projeto fullstack com frontend em Vue.js + TypeScript e backend em Express + TypeScript, seguindo padrão MVP.

## 🏗️ Estrutura
- `frontend/`: Vue.js + TypeScript + Vuetify
- `backend/`: Express + TypeScript + Supabase

## ✨ Funcionalidades
- ✅ Sistema de autenticação JWT com hash bcrypt
- ✅ Validação de dados com Joi
- ✅ Guards de rotas no frontend
- ✅ Validação de expiração de token
- ✅ Tela de login (com modal e tratamento de erros)
- ✅ Usuários: admin, operador
- ✅ CRUD de produtos
- ✅ Enum de tipos de usuário
- ✅ Controller, factory e view de usuário

## 🔐 Segurança
- Hash de senhas com bcrypt
- JWT com variáveis de ambiente
- Validação de entrada com Joi
- Guards de rotas automáticas
- Verificação de expiração de token

## 🚀 Como rodar

### Backend
```bash
cd backend
npm install
# Copie .env.example para .env e configure suas variáveis
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 Variáveis de Ambiente
Configure o arquivo `.env` no backend com:
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor
- `SUPABASE_URL`: URL do Supabase
- `SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_KEY`: Chave de serviço do Supabase
