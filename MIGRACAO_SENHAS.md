# 🔄 Migração de Senhas Existentes

## ⚠️ IMPORTANTE: Atualizar Senhas no Banco

Como agora usamos **hash bcrypt**, todas as senhas existentes no banco de dados precisam ser atualizadas.

---

## 📋 Opções de Migração

### Opção 1: Reset Completo (Recomendado para Desenvolvimento)

```bash
# 1. Delete todos os usuários existentes no Supabase
# SQL no Supabase Dashboard:
DELETE FROM usuarios;

# 2. Crie novo admin com hash
cd backend
npm run create-admin
```

Credenciais:
- Email: `admin@anbfarma.com`
- Senha: `admin123`

---

### Opção 2: Script de Migração Automática

Use este script para atualizar senhas de usuários existentes:

```typescript
// backend/src/scripts/migrarSenhas.ts
import { PasswordService } from '../services/passwordService';
import { supabase } from '../services/supabaseClient';
import dotenv from 'dotenv';

dotenv.config();

// Mapeamento: email -> senha em texto
const senhasExistentes = {
  'admin@anbfarma.com': 'admin123',
  'operador@anbfarma.com': 'operador123',
  // Adicione outros usuários aqui
};

async function migrarSenhas() {
  console.log('🔄 Iniciando migração de senhas...\n');

  for (const [email, senhaTexto] of Object.entries(senhasExistentes)) {
    try {
      // Gerar hash
      const senhaHash = await PasswordService.hash(senhaTexto);

      // Atualizar no banco
      const { data, error } = await supabase
        .from('usuarios')
        .update({ senha: senhaHash })
        .eq('email', email);

      if (error) {
        console.log(`❌ Erro ao atualizar ${email}:`, error.message);
      } else {
        console.log(`✅ Senha atualizada para: ${email}`);
      }
    } catch (err) {
      console.log(`❌ Erro ao processar ${email}:`, err);
    }
  }

  console.log('\n✅ Migração concluída!');
  process.exit(0);
}

migrarSenhas();
```

#### Como usar:

```bash
# 1. Criar o arquivo
# Copie o script acima para: backend/src/scripts/migrarSenhas.ts

# 2. Adicionar script no package.json
# Em "scripts":
"migrate-passwords": "ts-node src/scripts/migrarSenhas.ts"

# 3. Executar
npm run migrate-passwords
```

---

### Opção 3: Atualização Manual no Supabase

```sql
-- 1. Gere hashes no terminal:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));"

-- 2. Atualize no Supabase SQL Editor:
UPDATE usuarios 
SET senha = '$2b$10$...' -- Hash gerado acima
WHERE email = 'admin@anbfarma.com';

UPDATE usuarios 
SET senha = '$2b$10$...' -- Outro hash
WHERE email = 'operador@anbfarma.com';
```

---

## 🔐 Após a Migração

### 1. Teste o Login

```bash
# Inicie o servidor
cd backend
npm run dev

# Teste via curl
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@anbfarma.com","senha":"admin123"}'

# Deve retornar token JWT
```

### 2. Teste no Frontend

1. Acesse http://localhost:5173/login
2. Entre com: `admin@anbfarma.com` / `admin123`
3. Deve redirecionar para dashboard

---

## 🚨 Checklist de Migração

### Antes de Rodar em Produção:

- [ ] Backup do banco de dados
- [ ] Lista de todos os usuários existentes
- [ ] Senhas atuais conhecidas/registradas
- [ ] Script de migração testado localmente
- [ ] Comunicação com usuários sobre reset de senha
- [ ] Plano de rollback pronto

### Executar:

- [ ] Backup completo
- [ ] Executar script de migração
- [ ] Testar login de todos os usuários
- [ ] Notificar usuários
- [ ] Monitorar logs

### Após Migração:

- [ ] Todos os logins funcionando
- [ ] Senhas antigas não funcionam mais
- [ ] Novos cadastros com hash
- [ ] Logs sem erros
- [ ] Documentação atualizada

---

## 🔄 Rollback (Se necessário)

### Se algo der errado:

```sql
-- Restaurar do backup
-- Supabase Dashboard > Database > Backups > Restore

-- OU manualmente:
UPDATE usuarios 
SET senha = 'senha_antiga_texto' 
WHERE email = 'email@exemplo.com';
```

⚠️ **Atenção:** Após rollback, o código com bcrypt não funcionará.

---

## 📧 Comunicação com Usuários

### Template de Email:

```
Assunto: Atualização de Segurança - Sistema ANB Farma

Olá,

Implementamos melhorias de segurança no sistema. Suas credenciais de acesso 
permanecem as mesmas, mas agora as senhas são protegidas com criptografia 
bcrypt.

Suas credenciais:
Email: [email do usuário]
Senha: [senha atual]

Recomendamos alterar sua senha após o primeiro login.

Atenciosamente,
Equipe ANB Farma
```

---

## 💡 Dicas Importantes

### Para Desenvolvimento:
- Use `npm run create-admin` para criar usuário rapidamente
- Delete e recrie usuários conforme necessário
- Mantenha `.env` com credenciais de teste

### Para Produção:
- **SEMPRE** faça backup antes
- Teste em ambiente de staging primeiro
- Migre em horário de baixo uso
- Tenha plano de rollback
- Monitore logs após migração
- Comunique usuários com antecedência

---

## 🔑 Gerando Hashes Manualmente

### Via Node.js:

```javascript
const bcrypt = require('bcrypt');

// Gerar hash
bcrypt.hash('minha_senha', 10).then(hash => {
  console.log('Hash:', hash);
});

// Verificar hash
bcrypt.compare('minha_senha', '$2b$10$...').then(match => {
  console.log('Match:', match);
});
```

### Via Terminal:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
```

---

## ❓ FAQ

**P: As senhas antigas vão parar de funcionar?**
R: Sim, depois da migração apenas senhas com hash bcrypt funcionam.

**P: Preciso avisar os usuários?**
R: Depende. Se a senha continua a mesma, é opcional. Se for resetar, sim.

**P: Posso migrar usuários aos poucos?**
R: Não recomendado. Faça tudo de uma vez para evitar inconsistências.

**P: E se eu perder as senhas originais?**
R: Sem backup, será necessário resetar senhas de todos os usuários.

**P: O script é seguro?**
R: Sim, mas execute apenas em servidor confiável. Não commite senhas no Git.

---

**✅ Após completar a migração, delete este arquivo ou mova para documentação.**
