# 🏪 Sistema de Gestão Farmacêutica - ANB Farma

Sistema completo de gestão para farmácias com controle de estoque, vendas, usuários e estornos. Desenvolvido com **TypeScript**, **Vue 3**, **Express** e **Supabase**.

---

## 📋 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Arquitetura](#-arquitetura)
- [Segurança](#-segurança)
- [API Endpoints](#-api-endpoints)
- [Sistema de Permissões](#-sistema-de-permissões)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Melhorias Futuras](#-melhorias-futuras)

---

## ✨ Funcionalidades

### 🔐 Autenticação e Autorização
- ✅ Login com JWT (expiração: 2 horas)
- ✅ Hash de senhas com bcrypt (10 salt rounds)
- ✅ Sistema de permissões baseado em roles (Admin/Operador)
- ✅ Guards de rotas no frontend e middleware no backend
- ✅ Validação automática de token expirado
- ✅ Logout com limpeza de sessão

### 👥 Gestão de Usuários
- ✅ CRUD completo (apenas admin)
- ✅ Dois tipos: **Administrador** e **Operador**
- ✅ Validação de email e senha
- ✅ Atualização de senha com hash
- ✅ Listagem com busca e ordenação
- ✅ Visualização de permissões por tipo

### 📦 Gestão de Produtos
- ✅ CRUD completo (apenas admin)
- ✅ Controle de estoque em tempo real
- ✅ Adição de estoque (apenas admin)
- ✅ Validação de estoque antes de venda
- ✅ Preços com formatação BRL
- ✅ Busca e filtros

### 💰 Sistema de Vendas
- ✅ Criação de vendas (admin e operador)
- ✅ Múltiplos itens por venda
- ✅ Formas de pagamento: Dinheiro, Cartão, PIX
- ✅ Desconto automático do estoque
- ✅ Validação de estoque disponível
- ✅ Visualização de quantidade em estoque no momento da venda
- ✅ Prevenção de venda com estoque insuficiente
- ✅ Histórico completo de vendas

### 🔄 Sistema de Estornos
- ✅ Estorno de vendas (apenas admin)
- ✅ Devolução automática ao estoque
- ✅ Registro de motivo do estorno
- ✅ Histórico de estornos
- ✅ Marcação visual de vendas estornadas
- ✅ Filtro de vendas estornadas no histórico
- ✅ Validação para evitar estorno duplicado

### 📊 Dashboard e Relatórios
- ✅ KPIs em tempo real:
  - Total de produtos cadastrados
  - Itens em estoque
  - Vendas do dia
  - Receita do dia
- ✅ Tabela de últimas vendas
- ✅ Histórico de movimentações de estoque
- ✅ Filtros por produto e período
- ✅ Exportação de dados

### 🎨 Interface do Usuário
- ✅ Design moderno com Vuetify 3
- ✅ Tema customizado (azul/branco)
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Sidebar com navegação intuitiva
- ✅ Modais para ações importantes
- ✅ Feedback visual em todas as ações
- ✅ Chips coloridos para status
- ✅ Ícones Material Design

---

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** (API REST)
- **TypeScript** (tipagem estática)
- **Supabase** (PostgreSQL)
- **JWT** (autenticação)
- **Bcrypt** (hash de senhas)
- **Joi** (validação de dados)
- **dotenv** (variáveis de ambiente)

### Frontend
- **Vue 3** (Composition API)
- **TypeScript** (tipagem completa)
- **Vuetify 3** (Material Design)
- **Vue Router** (navegação)
- **Vite** (build tool)

### Banco de Dados
- **PostgreSQL** (via Supabase)
- **UUID** para chaves primárias
- **Foreign Keys** com cascata
- **Índices** otimizados

---

## 📁 Estrutura do Projeto

```
Projeto-VAga/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── factories/         # Factories para criação de entidades
│   │   ├── middlewares/       # Autenticação e autorização
│   │   ├── models/            # Interfaces e tipos
│   │   ├── repositories/      # Acesso ao banco de dados
│   │   ├── routes/            # Definição de rotas
│   │   ├── scripts/           # Scripts utilitários
│   │   ├── services/          # Serviços (bcrypt, Supabase)
│   │   ├── types/             # Tipos TypeScript
│   │   ├── validators/        # Schemas Joi
│   │   └── index.ts           # Servidor Express
│   ├── .env.example           # Exemplo de variáveis
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes globais
│   │   ├── models/            # Tipos compartilhados
│   │   ├── modules/           # Módulos por feature
│   │   │   ├── dashboard/     # Dashboard e KPIs
│   │   │   ├── estoque/       # Histórico de estoque
│   │   │   ├── produtos/      # Gestão de produtos
│   │   │   ├── usuarios/      # Gestão de usuários
│   │   │   └── vendas/        # Sistema de vendas
│   │   ├── router/            # Rotas e guards
│   │   ├── services/          # Auth e permissões
│   │   ├── types/             # Interfaces TypeScript
│   │   ├── utils/             # Utilitários (authFetch)
│   │   ├── views/             # Páginas principais
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ e npm
- Conta no Supabase (ou PostgreSQL local)

### 1. Backend

```bash
cd backend
npm install
```

Credenciais padrão:
- **Email:** admin@anbfarma.com
- **Senha:** admin123

Inicie o servidor:

```bash
npm run dev
```

Servidor rodando em: **http://localhost:3000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação rodando em: **http://localhost:5173**

---

## 🏛️ Arquitetura

### Backend - Padrão MVP (Model-View-Presenter)

```
Request → Route → Middleware → Controller → Repository → Database
                     ↓
                 Validator
```

- **Routes:** Definição de endpoints e middlewares
- **Middlewares:** Autenticação, autorização, validação
- **Controllers:** Lógica de negócio e orquestração
- **Repositories:** Acesso aos dados (Supabase)
- **Models:** Interfaces e tipos
- **Services:** Funcionalidades reutilizáveis (bcrypt, JWT)
- **Validators:** Schemas de validação (Joi)

### Frontend - Módulos por Feature

```
View → Component → API → Backend
  ↓
Services (Auth, Permissions)
  ↓
Router Guards
```

- **Views:** Páginas principais
- **Components:** Componentes reutilizáveis
- **Modules:** Organização por funcionalidade
- **Services:** Autenticação e permissões
- **Utils:** Funções auxiliares (authFetch)
- **Router:** Rotas e guards de navegação

---

## 🔐 Segurança

### ✅ Implementado
- Hash de senhas com **bcrypt** (10 salt rounds)
- JWT com **expiração de 2 horas**
- **JWT_SECRET** em variável de ambiente
- Senhas **nunca retornadas** nas respostas
- Validação de entrada com **Joi** em todas as rotas
- Middleware de **autenticação global**
- Guards de **autorização** (admin/operador)
- Validação de **token expirado** no frontend
- Interceptor HTTP com **logout automático** (401)
- CORS configurado

### 🔄 Melhorias Futuras
- [ ] Refresh token
- [ ] Rate limiting
- [ ] Logs de auditoria
- [ ] 2FA (autenticação em dois fatores)
- [ ] Criptografia de dados sensíveis
- [ ] Sanitização de HTML

---

## 📡 API Endpoints

### Autenticação (Público)
```
POST /login
Body: { "email": "admin@anbfarma.com", "senha": "admin123" }
Response: { "sucesso": true, "token": "...", "usuario": {...} }
```

### Usuários (Autenticado)
```
GET    /usuarios          # Listar (admin/operador)
POST   /usuarios          # Criar (admin)
GET    /usuarios/:id      # Buscar (admin/operador)
PUT    /usuarios/:id      # Atualizar (admin)
DELETE /usuarios/:id      # Deletar (admin)
```

### Produtos (Autenticado)
```
GET    /produtos          # Listar (admin/operador)
POST   /produtos          # Criar (admin)
GET    /produtos/:id      # Buscar (admin/operador)
PUT    /produtos/:id      # Atualizar (admin)
POST   /produtos/:id/estoque # Adicionar estoque (admin)
```

### Vendas (Autenticado)
```
GET    /vendas            # Listar (admin/operador)
POST   /vendas            # Criar (admin/operador)
GET    /vendas/:id        # Buscar (admin/operador)
```

### Estornos (Admin apenas)
```
POST   /estornos          # Criar estorno
GET    /estornos/venda/:id # Buscar por venda
GET    /estornos/verificar/:id # Verificar se estornada
GET    /estornos          # Listar todos
```

### Dashboard (Autenticado)
```
GET    /dashboard/estatisticas # KPIs do dia
```

### Histórico (Autenticado)
```
GET    /historico-estoque      # Listar movimentações
GET    /historico-estoque/produto/:id # Por produto
```

---

## 👤 Sistema de Permissões

### Administrador
- ✅ Todas as funcionalidades
- ✅ Gestão de usuários
- ✅ Gestão de produtos
- ✅ Adicionar estoque
- ✅ Realizar vendas
- ✅ Estornar vendas
- ✅ Visualizar relatórios

### Operador
- ❌ Gestão de usuários
- ❌ Gestão de produtos
- ❌ Adicionar estoque
- ✅ Realizar vendas
- ❌ Estornar vendas
- ✅ Visualizar relatórios (apenas leitura)

---

## 📜 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento (ts-node-dev)
npm run build        # Compilar TypeScript
npm start            # Produção (dist/)
npm run create-admin # Criar usuário admin
```

### Frontend
```bash
npm run dev          # Desenvolvimento (Vite)
npm run build        # Build de produção
npm run preview      # Preview do build
```
---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e uso interno da ANB Farma.

---

## 👨‍💻 Desenvolvedor

**Sistema de Gestão Farmacêutica**  
Desenvolvido por Marcos Maues

---

**Status:** ✅ Em Produção  
**Versão:** 1.0.0  
**Última atualização:** Novembro 2025

