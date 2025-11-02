// API utilitário para Produtos
import { authFetch } from '../../utils/authFetch';
import type { Produto, ProdutoInput } from '../../types/produto';

const API_URL = 'http://localhost:3000';

export async function listarProdutos(): Promise<Produto[]> {
  const res = await authFetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error('Erro ao buscar produtos');
  return await res.json();
}

export async function criarProduto(produto: ProdutoInput): Promise<Produto> {
  const res = await authFetch(`${API_URL}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!res.ok) throw new Error('Erro ao criar produto');
  return await res.json();
}

export async function atualizarProduto(id: string, produto: Partial<ProdutoInput>): Promise<Produto> {
  const res = await authFetch(`${API_URL}/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(produto),
  });
  if (!res.ok) throw new Error('Erro ao atualizar produto');
  return await res.json();
}

export async function deletarProduto(id: string): Promise<void> {
  const res = await authFetch(`${API_URL}/produtos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar produto');
}
