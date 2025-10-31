import { Usuario } from '../models/User';

export class UsuarioView {
  static exibir(usuario: Usuario) {
    return {
      id: usuario.id,
      nome: usuario.nome,
      tipo: usuario.tipo
    };
  }

  static exibirLista(usuarios: Usuario[]) {
    return usuarios.map(u => this.exibir(u));
  }
}
