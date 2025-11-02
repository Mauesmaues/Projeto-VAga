import { authFetch } from '../../utils/authFetch';
import type { Venda, VendaInput } from '../../types/venda';

const API_URL = 'http://localhost:3000';

export async function listarVendas(): Promise<Venda[]> {
  const res = await authFetch(`${API_URL}/vendas`);
  if (!res.ok) throw new Error('Erro ao buscar vendas');
  return await res.json();
}

export async function criarVenda(venda: VendaInput): Promise<Venda> {
  const res = await authFetch(`${API_URL}/vendas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venda),
  });
  if (!res.ok) throw new Error('Erro ao criar venda');
  return await res.json();
}
