# Padrão de Mensagens de Commit

Este documento define o padrão de mensagens de commit para o projeto Projeto-VAga.

## Estrutura da Mensagem

```
<tipo>(<escopo>): <descrição curta>

<descrição detalhada (opcional)>

<rodapé (opcional)>
```

## Tipos de Commit

### 📦 feat (Feature)
Adição de novas funcionalidades, telas ou componentes

**Exemplos:**
```
feat(usuarios): implementa módulo completo de gestão de usuários

- Cria tela de listagem com pesquisa e filtros
- Adiciona CRUD completo (criar, editar, deletar)
- Implementa ordenação por data (crescente/decrescente)
- Adiciona validações de formulário
- Integra com API backend
```

```
feat(produtos): adiciona modal de cadastro de produtos

- Cria componente ModalCadastrarProduto
- Implementa validação de campos obrigatórios
- Adiciona integração com API
```

### 🔧 fix (Correção)
Correção de bugs e problemas

**Exemplos:**
```
fix(vendas): corrige cálculo de total da venda

- Ajusta lógica de soma dos itens
- Adiciona validação para valores nulos
```

```
fix(auth): resolve erro de token expirado

- Implementa refresh automático do token
- Adiciona tratamento de erro 401
```

### 🎨 style (Estilo)
Alterações de estilo, layout e formatação (não afetam lógica)

**Exemplos:**
```
style(dashboard): ajusta responsividade dos cards

- Melhora layout em telas pequenas
- Ajusta espaçamento entre elementos
```

```
style(global): padroniza cores e tipografia

- Aplica paleta de cores definida no design
- Atualiza fonte padrão
```

### ♻️ refactor (Refatoração)
Reestruturação de código sem alterar funcionalidade

**Exemplos:**
```
refactor(usuarios): extrai lógica de validação para serviço

- Move validações para classe ValidationService
- Remove código duplicado
- Melhora legibilidade
```

### 📝 docs (Documentação)
Adição ou atualização de documentação

**Exemplos:**
```
docs(api): adiciona documentação das rotas de usuários

- Documenta endpoints CRUD
- Adiciona exemplos de request/response
```

### 🧪 test (Testes)
Adição ou correção de testes

**Exemplos:**
```
test(produtos): adiciona testes unitários para ProdutoService

- Testa criação de produto
- Testa validações
- Testa integração com repositório
```

### 🚀 chore (Manutenção)
Atualizações de build, dependências, configurações

**Exemplos:**
```
chore(deps): atualiza dependências do projeto

- Atualiza Vue para versão 3.4.0
- Atualiza Vuetify para versão 3.5.0
```

## Regras de Negócio

Quando adicionar ou modificar regras de negócio, seja específico:

```
feat(vendas): implementa regra de desconto progressivo

Regras de negócio adicionadas:
- Desconto de 5% para compras acima de R$ 100
- Desconto de 10% para compras acima de R$ 500
- Desconto de 15% para compras acima de R$ 1000

Validações implementadas:
- Verifica estoque disponível antes de finalizar venda
- Bloqueia venda se produto estiver inativo
- Valida quantidade mínima de 1 item
```

```
feat(usuarios): adiciona controle de acesso por tipo

Regras de negócio:
- ADMIN: acesso total ao sistema
- VENDEDOR: pode gerenciar vendas e produtos
- USUARIO: apenas visualização de relatórios

Implementado:
- Middleware de autorização no backend
- Guards de rota no frontend
- Ocultação de botões conforme permissão
```

## Exemplos Completos de Commits Recentes

### Criação de Módulo Completo
```
feat(usuarios): implementa módulo completo de gestão de usuários

Criado:
- UsuarioView.vue: Tela principal com listagem e ações
- UsuarioHeader.vue: Cabeçalho com botão de adicionar
- UsuarioTabela.vue: Tabela com pesquisa, filtros e ordenação
- ModalCadastrarUsuario.vue: Modal para criar usuário
- ModalEditarUsuario.vue: Modal para editar usuário
- api.ts: Funções de integração com backend

Funcionalidades:
- Listagem completa de usuários
- Pesquisa por nome e email
- Filtro de ordenação por data (crescente/decrescente)
- CRUD completo (Create, Read, Update, Delete)
- Validações de formulário (email, senha mínima)
- Confirmação antes de excluir
- Feedback visual (snackbar) para ações

Regras de negócio:
- Senha deve ter no mínimo 6 caracteres
- Email deve ser válido
- Tipos de usuário: ADMIN, VENDEDOR, USUARIO
- Senha opcional ao editar (mantém anterior se vazio)
```

### Criação de Tela com Regras
```
feat(produtos): adiciona validação de estoque ao cadastrar venda

Regras de negócio implementadas:
- Verifica quantidade disponível em estoque
- Bloqueia venda se estoque insuficiente
- Atualiza estoque automaticamente após venda
- Registra histórico de movimentação

Componentes afetados:
- VendaService: adiciona lógica de validação
- ProdutoRepository: implementa método de atualização de estoque
- ModalNovaVenda: adiciona feedback de erro

Validações:
- Quantidade solicitada <= quantidade em estoque
- Produto deve estar ativo
- Preço deve ser maior que zero
```

## Boas Práticas

1. **Seja descritivo**: Explique o "o quê" e "por quê"
2. **Use verbos no presente**: "adiciona" ao invés de "adicionado"
3. **Primeira linha com no máximo 72 caracteres**
4. **Separe título do corpo com linha em branco**
5. **Liste mudanças importantes no corpo**
6. **Mencione breaking changes no rodapé**

## Emojis Opcionais (se usar)

- ✨ `:sparkles:` - Nova funcionalidade
- 🐛 `:bug:` - Correção de bug
- 📝 `:memo:` - Documentação
- 🎨 `:art:` - Melhorias de estilo/formatação
- ♻️ `:recycle:` - Refatoração
- 🚀 `:rocket:` - Performance
- 🔒 `:lock:` - Segurança
- ⬆️ `:arrow_up:` - Upgrade de dependências
- ⬇️ `:arrow_down:` - Downgrade de dependências
