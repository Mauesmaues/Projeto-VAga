import { supabase } from '../services/supabaseClient';
import { Venda, VendaInput } from '../models/Venda';

export class VendaRepository {
  static async listarTodas(): Promise<Venda[]> {
    const { data, error } = await supabase
      .from('vendas')
      .select(`
        *,
        usuarios!vendas_usuario_id_fkey(nome)
      `)
      .order('data_venda', { ascending: false });
    
    if (error || !data) {
      console.error('Erro ao listar vendas:', error);
      return [];
    }
    
    return data.map((venda: any) => ({
      id: venda.id,
      usuario_id: venda.usuario_id,
      usuario_nome: venda.usuarios?.nome,
      data_venda: venda.data_venda,
      valor_total: venda.valor_total,
      forma_pagamento: venda.forma_pagamento
    }));
  }

  static async criar(vendaInput: VendaInput): Promise<Venda | null> {
    try {
      // 1. Primeiro, atualizar o estoque de cada produto
      for (const item of vendaInput.itens) {
        // Buscar produto atual
        const { data: produto, error: produtoError } = await supabase
          .from('produtos')
          .select('quantidade')
          .eq('id', item.produto_id)
          .single();

        if (produtoError || !produto) {
          console.error(`Produto ${item.produto_id} não encontrado`);
          return null;
        }

        // Verificar se há estoque suficiente
        if (produto.quantidade < item.quantidade) {
          console.error(`Estoque insuficiente para produto ${item.produto_id}`);
          return null;
        }

        // Descontar do estoque
        const novaQuantidade = produto.quantidade - item.quantidade;
        const { error: updateError } = await supabase
          .from('produtos')
          .update({ quantidade: novaQuantidade })
          .eq('id', item.produto_id);

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError);
          return null;
        }
      }

      // 2. Criar a venda
      const { data, error } = await supabase
        .from('vendas')
        .insert([{
          usuario_id: vendaInput.usuario_id,
          valor_total: vendaInput.valor_total,
          forma_pagamento: vendaInput.forma_pagamento
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar venda:', error);
        return null;
      }

      // 3. Inserir os itens da venda na tabela itens_venda
      const itensParaInserir = vendaInput.itens.map(item => ({
        venda_id: data.id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        total_item: item.quantidade * item.preco_unitario
      }));

      const { error: itensError } = await supabase
        .from('itens_venda')
        .insert(itensParaInserir);

      if (itensError) {
        console.error('Erro ao inserir itens da venda:', itensError);
        return null;
      }
      
      return data as Venda;
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      return null;
    }
  }

  static async buscarPorId(id: string): Promise<Venda | null> {
    const { data, error } = await supabase
      .from('vendas')
      .select(`
        *,
        usuarios!vendas_usuario_id_fkey(nome)
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      usuario_id: data.usuario_id,
      usuario_nome: data.usuarios?.nome,
      data_venda: data.data_venda,
      valor_total: data.valor_total,
      forma_pagamento: data.forma_pagamento
    };
  }
}
