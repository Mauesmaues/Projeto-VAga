import { Request, Response } from 'express';

import { FabricaUsuario } from '../factories/UserFactory';
import { TipoUsuario } from '../models/User';

const usuarios = [
  FabricaUsuario.criar('admin', 'admin123', TipoUsuario.ADMIN),
  FabricaUsuario.criar('operador', 'operador123', TipoUsuario.OPERADOR)
];

export class UserController {
  static login(req: Request, res: Response) {
    const { nome, senha } = req.body;
    const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);
    if (usuario) {
      res.json({ sucesso: true, usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo } });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    }
  }

  static listar(req: Request, res: Response) {
    res.json(usuarios.map(u => ({ id: u.id, nome: u.nome, tipo: u.tipo })));
  }
}
