import { authFetch } from '../../utils/authFetch';
import type { Venda, VendaInput, Estorno, CriarEstornoDTO } from '../../types/venda';

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

export async function criarEstorno(dto: CriarEstornoDTO): Promise<Estorno> {
  const res = await authFetch(`${API_URL}/estornos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.erro || 'Erro ao criar estorno');
  }
  return await res.json();
}

export async function verificarEstorno(vendaId: string | number): Promise<boolean> {
  const res = await authFetch(`${API_URL}/estornos/verificar/${vendaId}`);
  if (!res.ok) throw new Error('Erro ao verificar estorno');
  const data = await res.json();
  return data.estornada;
}
