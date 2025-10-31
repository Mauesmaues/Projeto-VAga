
import { Request, Response } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import jwt from 'jsonwebtoken';


export class UsuarioController {
  static async login(req: Request, res: Response) {
    const { nome, senha } = req.body;
    const usuario = await UsuarioRepository.buscarPorNome(nome);
    if (usuario && usuario.senha === senha) {
      const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';
      const token = jwt.sign({ id: usuario.id, nome: usuario.nome, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ sucesso: true, token, usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo } });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }
  }

  static async listar(req: Request, res: Response) {
    const usuarios = await UsuarioRepository.listarTodos();
    res.json(usuarios.map(u => ({ id: u.id, nome: u.nome, tipo: u.tipo })));
  }
  static async criar(req: Request, res: Response) {
    const { nome, senha, tipo } = req.body;
    if (!nome || !senha || !tipo) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados obrigatórios não informados.' });
    }
    const usuario = await UsuarioRepository.criar({ nome, senha, tipo });
    if (usuario) {
      res.status(201).json(usuario);
    } else {
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar usuário.' });
    }
  }

  // Métodos obterPorId, atualizar, remover podem ser implementados conforme necessidade
}
