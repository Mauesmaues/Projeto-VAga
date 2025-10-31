import { Usuario, TipoUsuario } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export class FabricaUsuario {
  static criar(nome: string, senha: string, tipo: TipoUsuario): Usuario {
    return {
      id: uuidv4(),
      nome,
      senha,
      tipo
    };
  }
}
