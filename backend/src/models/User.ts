import { TipoUsuario } from './UserType';

export interface Usuario {
  id: string;
  nome: string;
  senha: string;
  tipo: TipoUsuario;
}

export { TipoUsuario } from './UserType';
