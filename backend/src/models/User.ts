import { TipoUsuario } from './UserType';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
}

export { TipoUsuario } from './UserType';
