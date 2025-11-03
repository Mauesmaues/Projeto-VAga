import { supabase } from '../services/supabaseClient';

export interface HistoricoEstoque {
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

export class HistoricoEstoqueRepository {
  static async listarHistorico(): Promise<HistoricoEstoque[]> {
    const { data, error } = await supabase
      .from('itens_venda')
      .select(`
        id,
        venda_id,
        produto_id,
        quantidade,
        preco_unitario,
        total_item,
        produtos!itens_venda_produto_id_fkey(nome),
        vendas!itens_venda_venda_id_fkey(data_venda, usuarios!vendas_usuario_id_fkey(nome))
      `)
      .order('vendas(data_venda)', { ascending: false });
    
    if (error || !data) {
      console.error('Erro ao listar histórico:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      venda_id: item.venda_id,
      produto_id: item.produto_id,
      produto_nome: item.produtos?.nome || 'Produto não encontrado',
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      total_item: item.total_item,
      data_venda: item.vendas?.data_venda,
      usuario_nome: item.vendas?.usuarios?.nome || 'Usuário não encontrado'
    }));
  }

  static async listarPorProduto(produto_id: string): Promise<HistoricoEstoque[]> {
    const { data, error } = await supabase
      .from('itens_venda')
      .select(`
        id,
        venda_id,
        produto_id,
        quantidade,
        preco_unitario,
        total_item,
        produtos!itens_venda_produto_id_fkey(nome),
        vendas!itens_venda_venda_id_fkey(data_venda, usuarios!vendas_usuario_id_fkey(nome))
      `)
      .eq('produto_id', produto_id)
      .order('vendas(data_venda)', { ascending: false });
    
    if (error || !data) {
      console.error('Erro ao listar histórico por produto:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      venda_id: item.venda_id,
      produto_id: item.produto_id,
      produto_nome: item.produtos?.nome || 'Produto não encontrado',
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      total_item: item.total_item,
      data_venda: item.vendas?.data_venda,
      usuario_nome: item.vendas?.usuarios?.nome || 'Usuário não encontrado'
    }));
  }
}
