# 🛠️ Comandos Úteis

## 🚀 Desenvolvimento

### Backend

```bash
# Instalar dependências
cd backend
npm install

# Modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Criar usuário admin
npm run create-admin

# Verificar erros TypeScript
npx tsc --noEmit
```

### Frontend

```bash
# Instalar dependências
cd frontend
npm install

# Modo desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar erros TypeScript
npx vue-tsc --noEmit
```

---

## 🔧 Configuração

### Primeira vez

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais

# 2. Criar admin
npm run create-admin

# 3. Frontend
cd ../frontend
npm install

# 4. Iniciar tudo
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## 🗄️ Banco de Dados (Supabase)

### Criar tabelas

```sql
-- Tabela de usuários
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('admin', 'operador')),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  preco NUMERIC(10, 2) NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_produtos_nome ON produtos(nome);
```

---

## 🧪 Testes (quando implementado)

### Backend
```bash
# Rodar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em watch mode
npm run test:watch

# Testes específicos
npm test -- usuarioController
```

### Frontend
```bash
# Rodar todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage
```

---

## 📦 Build e Deploy

### Backend

```bash
# Build otimizado
npm run build

# Deploy (exemplo Heroku)
git push heroku main

# Deploy (exemplo Railway)
railway up

# Deploy (exemplo Render)
render deploy
```

### Frontend

```bash
# Build otimizado
npm run build

# Deploy Vercel
vercel --prod

# Deploy Netlify
netlify deploy --prod

# Deploy manual (build + servidor)
npm run build
npx serve dist
```

---

## 🔍 Debug

### Backend

```bash
# Com breakpoints (VS Code)
# Adicione configuração launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "port": 9229,
  "skipFiles": ["<node_internals>/**"]
}

# Logs detalhados
DEBUG=* npm run dev
```

### Frontend

```bash
# Abrir DevTools no navegador
# Usar Vue DevTools extension

# Source maps habilitados
npm run dev
```

---

## 🧹 Limpeza

```bash
# Backend
cd backend
rm -rf node_modules dist
npm install

# Frontend
cd frontend
rm -rf node_modules dist
npm install

# Limpar cache npm
npm cache clean --force
```

---

## 🔐 Segurança

### Verificar vulnerabilidades

```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

### Atualizar dependências

```bash
# Ver atualizações disponíveis
npm outdated

# Atualizar patch versions
npm update

# Atualizar major versions (cuidado!)
npx npm-check-updates -u
npm install
```

---

## 📊 Análise de Código

### TypeScript

```bash
# Backend
cd backend
npx tsc --noEmit

# Frontend
cd frontend
npx vue-tsc --noEmit
```

### Linting (quando configurado)

```bash
# ESLint
npx eslint . --ext .ts,.vue

# Prettier
npx prettier --check "src/**/*.{ts,vue}"
npx prettier --write "src/**/*.{ts,vue}"
```

---

## 🌐 Variáveis de Ambiente

### Desenvolvimento
```bash
# Backend
cp .env.example .env
# Edite .env

# Frontend (se necessário)
cp .env.example .env.local
# Edite .env.local
```

### Produção
```bash
# Configurar no serviço de deploy
# Heroku
heroku config:set JWT_SECRET=seu_secret

# Vercel/Netlify
# Configurar via dashboard
```

---

## 🔄 Git

### Workflow comum

```bash
# Criar branch
git checkout -b feature/nova-funcionalidade

# Fazer commits
git add .
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade

# Merge (após aprovação)
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

### Commits semânticos

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas gerais
```

---

## 📈 Monitoramento (quando implementado)

```bash
# Ver logs
# Heroku
heroku logs --tail

# Vercel
vercel logs

# PM2 (servidor próprio)
pm2 logs
pm2 monit
```

---

## 🆘 Troubleshooting

```bash
# Portas em uso
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Permissões
# Windows (admin)
# Linux/Mac
sudo npm install

# Node version
node -v
npm -v
nvm use 18
```

---

## 🎯 Comandos Rápidos

```bash
# Reiniciar tudo
cd backend && npm run dev &
cd frontend && npm run dev

# Build completo
cd backend && npm run build
cd frontend && npm run build

# Limpar + instalar + rodar
rm -rf node_modules && npm install && npm run dev
```

---

**💡 Dica:** Adicione alias no seu terminal para comandos frequentes!

```bash
# Bash/Zsh (.bashrc ou .zshrc)
alias dev-backend="cd ~/Projeto-VAga/backend && npm run dev"
alias dev-frontend="cd ~/Projeto-VAga/frontend && npm run dev"
alias dev-all="cd ~/Projeto-VAga && code . && npm run dev-all"
```
