import { authFetch } from '../../utils/authFetch';

export interface HistoricoEstoqueItem {
  id: string;
  venda_id: string;
  produto_id: string;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  total_item: number;
  data_venda: string;
  usuario_nome: string;
}

const API_URL = 'http://localhost:3000';

export async function listarHistorico(): Promise<HistoricoEstoqueItem[]> {
  const response = await authFetch(`${API_URL}/historico-estoque`);
  if (!response.ok) {
    throw new Error('Erro ao listar histórico de estoque');
  }
  return response.json();
}

export async function listarPorProduto(produto_id: string): Promise<HistoricoEstoqueItem[]> {
  const response = await authFetch(`${API_URL}/historico-estoque/produto/${produto_id}`);
  if (!response.ok) {
    throw new Error('Erro ao listar histórico do produto');
  }
  return response.json();
}
