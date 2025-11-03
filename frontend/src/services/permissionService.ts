import { AuthService } from './authService';

export type UserType = 'admin' | 'operador';

export class PermissionService {
  /**
   * Verifica se o usuário é admin
   */
  static isAdmin(): boolean {
    const user = AuthService.getUser();
    return user?.tipo === 'admin';
  }

  /**
   * Verifica se o usuário é operador
   */
  static isOperador(): boolean {
    const user = AuthService.getUser();
    return user?.tipo === 'operador';
  }

  /**
   * Verifica se o usuário pode criar/editar/deletar registros
   */
  static canModify(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se o usuário pode apenas visualizar
   */
  static canOnlyView(): boolean {
    return this.isOperador();
  }

  /**
   * Verifica se o usuário pode realizar vendas
   */
  static canSell(): boolean {
    // Tanto admin quanto operador podem realizar vendas
    return this.isAdmin() || this.isOperador();
  }

  /**
   * Verifica se o usuário pode acessar a gestão de usuários
   */
  static canManageUsers(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se o usuário pode adicionar ao estoque
   */
  static canManageStock(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se o usuário pode criar produtos
   */
  static canCreateProducts(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se o usuário pode editar produtos
   */
  static canEditProducts(): boolean {
    return this.isAdmin();
  }

  /**
   * Verifica se o usuário pode deletar produtos
   */
  static canDeleteProducts(): boolean {
    return this.isAdmin();
  }

  /**
   * Obtém o tipo do usuário atual
   */
  static getUserType(): UserType | null {
    const user = AuthService.getUser();
    return user?.tipo || null;
  }
}
