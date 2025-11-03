

import { AuthService } from '../services/authService';

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = AuthService.getToken();

  if (token && AuthService.isTokenExpired(token)) {
    console.warn('Token expirado, redirecionando para login...');
    AuthService.logout();
    throw new Error('Token expirado');
  }

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('Enviando Authorization:', `Bearer ${token}`);
  }

  try {
    const response = await fetch(input, { ...init, headers });

    if (response.status === 401) {
      console.warn('Resposta 401, token inválido');
      AuthService.logout();
      throw new Error('Não autorizado');
    }

    return response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}
