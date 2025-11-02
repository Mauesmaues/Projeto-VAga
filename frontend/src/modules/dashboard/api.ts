import { authFetch } from '../../utils/authFetch';

const API_URL = 'http://localhost:3000';

export interface Estatisticas {
  totalProdutos: number;
  totalEstoque: number;
  vendasDoDia: number;
  receitaDiaria: number;
}

export async function getEstatisticas(): Promise<Estatisticas> {
  const res = await authFetch(`${API_URL}/dashboard/estatisticas`);
  if (!res.ok) throw new Error('Erro ao buscar estatísticas');
  return await res.json();
}
