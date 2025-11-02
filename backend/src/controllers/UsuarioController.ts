
import { Request, Response } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { FabricaUsuario } from '../factories/UserFactory';
import { PasswordService } from '../services/passwordService';
import jwt from 'jsonwebtoken';

export class UsuarioController {
  static async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Email e senha são obrigatórios.' });
    }
    // Buscar usuário por email
    const usuario = await UsuarioRepository.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos.' });
    }
    // Validação de senha com bcrypt
    const senhaValida = await PasswordService.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Usuário ou senha inválidos.' });
    }
    // Gerar token JWT
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '2h' });
    // Não retornar senha!
    const { senha: _, ...usuarioSeguro } = usuario;
    return res.json({ sucesso: true, token, usuario: usuarioSeguro });
  }

  static async listar(req: Request, res: Response) {
    const usuarios = await UsuarioRepository.listarTodos();
    res.json(usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email, tipo: u.tipo })));
  }

  static async criar(req: Request, res: Response) {
    const { nome, email, senha, tipo } = req.body;
    if (!nome || !senha || !tipo || !email) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados obrigatórios não informados.' });
    }

    // Hash da senha antes de criar
    const senhaHash = await PasswordService.hash(senha);
    const usuarioModal = FabricaUsuario.criar(nome, email, senhaHash, tipo);

    try {
      const usuario = await UsuarioRepository.criar(usuarioModal);
      if (usuario) {
        // Não retornar senha
        const { senha: _, ...usuarioSeguro } = usuario;
        res.status(201).json(usuarioSeguro);
      } else {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar usuário. Verifique o log do servidor para detalhes.' });
      }
    } catch (err: any) {
      console.error('Erro inesperado ao criar usuário:', err);
      res.status(500).json({ sucesso: false, mensagem: 'Erro inesperado ao criar usuário.', detalhes: err?.message || err });
    }
  }

  // Métodos obterPorId, atualizar, remover podem ser implementados conforme necessidade
}
