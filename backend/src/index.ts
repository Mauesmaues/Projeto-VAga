import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes';
import produtoRoutes from './routes/produtoRoutes';
import vendaRoutes from './routes/vendaRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import historicoEstoqueRoutes from './routes/historicoEstoqueRoutes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from './types/api';

dotenv.config();

// Extensão do tipo Request para incluir 'usuario' e 'user'
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
      user?: JWTPayload;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado no arquivo .env');
}

// Middleware de autenticação JWT
app.use((req, res, next) => {
  // Permitir login e docs sem autenticação
  if (
    req.path === '/login' ||
    (req.method === 'GET' && req.path === '/docs')
  ) {
    return next();
  }

  // Log do header Authorization para depuração
  console.log('Authorization header:', req.headers['authorization']);

  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.usuario = payload;
    req.user = payload; // Adicionar também como 'user' para VendaController
    next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido.' });
  }
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'Bem-vindo à API! Sessão válida.' });
});

// Documentação das rotas da API
app.get('/docs', (req, res) => {
  res.json({
    rotas: [
      { method: 'POST', path: '/login', body: '{ nome, senha }', desc: 'Autentica usuário e retorna token JWT.' },
      { method: 'GET', path: '/usuarios', auth: true, desc: 'Lista todos os usuários.' },
      { method: 'POST', path: '/usuarios', auth: true, body: '{ nome, senha, tipo }', desc: 'Cria novo usuário.' },
      { method: 'GET', path: '/produtos', auth: true, desc: 'Lista todos os produtos.' },
      { method: 'POST', path: '/produtos', auth: true, body: '{ nome, preco, descricao }', desc: 'Cria novo produto.' },
      { method: 'GET', path: '/produtos/:id', auth: true, desc: 'Busca produto por ID.' },
      { method: 'GET', path: '/vendas', auth: true, desc: 'Lista todas as vendas.' },
      { method: 'POST', path: '/vendas', auth: true, body: '{ valor_total, forma_pagamento, itens }', desc: 'Cria nova venda.' },
      { method: 'GET', path: '/vendas/:id', auth: true, desc: 'Busca venda por ID.' },
      { method: 'GET', path: '/dashboard/estatisticas', auth: true, desc: 'Estatísticas do dashboard.' }
    ]
  });
});

app.use('/', usuarioRoutes);
app.use('/', produtoRoutes);
app.use('/vendas', vendaRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/', historicoEstoqueRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
