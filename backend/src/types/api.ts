import { Request } from 'express';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  sucesso: boolean;
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
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
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}
