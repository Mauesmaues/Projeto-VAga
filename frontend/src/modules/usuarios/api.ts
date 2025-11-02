import { authFetch } from '../../utils/authFetch';

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  created_at?: string;
}

export interface UsuarioInput {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

export interface UsuarioUpdate {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
}

const API_URL = 'http://localhost:3000';

export async function listarUsuarios(): Promise<UsuarioResponse[]> {
  const response = await authFetch(`${API_URL}/usuarios`);
  if (!response.ok) {
    throw new Error('Erro ao listar usuários');
  }
  return response.json();
}

export async function criarUsuario(dados: UsuarioInput): Promise<UsuarioResponse> {
  const response = await authFetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) {
    throw new Error('Erro ao criar usuário');
  }
  return response.json();
}

export async function atualizarUsuario(id: string, dados: UsuarioUpdate): Promise<UsuarioResponse> {
  const response = await authFetch(`${API_URL}/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar usuário');
  }
  return response.json();
}

export async function deletarUsuario(id: string): Promise<void> {
  const response = await authFetch(`${API_URL}/usuarios/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao deletar usuário');
  }
}
