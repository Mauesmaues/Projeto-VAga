import { AuthService } from './authService';

export type UserType = 'admin' | 'operador';

export class PermissionService {
  
  static isAdmin(): boolean {
    const user = AuthService.getUser();
    return user?.tipo === 'admin';
  }

  static isOperador(): boolean {
    const user = AuthService.getUser();
    return user?.tipo === 'operador';
  }

  static canModify(): boolean {
    return this.isAdmin();
  }

  static canOnlyView(): boolean {
    return this.isOperador();
  }

  static canSell(): boolean {

    return this.isAdmin() || this.isOperador();
  }

  static canManageUsers(): boolean {
    return this.isAdmin();
  }

  static canManageStock(): boolean {
    return this.isAdmin();
  }

  static canCreateProducts(): boolean {
    return this.isAdmin();
  }

  static canEditProducts(): boolean {
    return this.isAdmin();
  }

  static canDeleteProducts(): boolean {
    return this.isAdmin();
  }

  static getUserType(): UserType | null {
    const user = AuthService.getUser();
    return user?.tipo || null;
  }
}
