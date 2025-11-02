export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'operador';
}

export interface LoginResponse {
  sucesso: boolean;
  token: string;
  usuario: Usuario;
}

export interface ErrorResponse {
  sucesso: false;
  mensagem: string;
  erros?: Array<{
    campo: string;
    mensagem: string;
  }>;
}

export interface JWTPayload {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  iat: number;
  exp: number;
}
