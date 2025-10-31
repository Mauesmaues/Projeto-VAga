import { TipoUsuario } from './UserType';

export interface Usuario {
  id: string;
  nome: string;
  tipo: TipoUsuario;
}
