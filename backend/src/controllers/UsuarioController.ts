
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
    console.log('Endpoint /usuarios chamado');
    const usuarios = await UsuarioRepository.listarTodos();
    console.log('Usuários encontrados:', usuarios.length);
    const resultado = usuarios.map(u => ({ 
      id: u.id, 
      nome: u.nome, 
      email: u.email, 
      tipo: u.tipo,
      created_at: u.created_at 
    }));
    console.log('Retornando:', resultado);
    res.json(resultado);
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

  static async obterPorId(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = await UsuarioRepository.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
    }
    const { senha: _, ...usuarioSeguro } = usuario;
    res.json(usuarioSeguro);
  }

  static async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, email, senha, tipo } = req.body;

    const dados: any = {};
    if (nome) dados.nome = nome;
    if (email) dados.email = email;
    if (tipo) dados.tipo = tipo;
    
    // Só atualiza a senha se foi fornecida
    if (senha) {
      dados.senha = await PasswordService.hash(senha);
    }

    try {
      const usuario = await UsuarioRepository.atualizar(id, dados);
      if (usuario) {
        const { senha: _, ...usuarioSeguro } = usuario;
        res.json(usuarioSeguro);
      } else {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
      }
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar usuário.', detalhes: err?.message || err });
    }
  }

  static async remover(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const sucesso = await UsuarioRepository.deletar(id);
      if (sucesso) {
        res.json({ sucesso: true, mensagem: 'Usuário removido com sucesso.' });
      } else {
        res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
      }
    } catch (err: any) {
      console.error('Erro ao remover usuário:', err);
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover usuário.', detalhes: err?.message || err });
    }
  }
}
