import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes';
import produtoRoutes from './routes/produtoRoutes';
import jwt from 'jsonwebtoken';

// Extensão do tipo Request para incluir 'usuario'
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// Middleware de autenticação JWT
app.use((req, res, next) => {
  if (req.path === '/login' || (req.method === 'GET' && req.path === '/docs')) {
    return next();
  }
  const auth = req.headers['authorization'];
  if (!auth) {
    return res.status(401).json({ mensagem: 'Token não fornecido.' });
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
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
      { method: 'GET', path: '/produtos/:id', auth: true, desc: 'Busca produto por ID.' }
    ]
  });
});

app.use('/', usuarioRoutes);
app.use('/', produtoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
