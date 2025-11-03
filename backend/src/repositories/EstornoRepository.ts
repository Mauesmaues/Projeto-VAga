import { supabase } from '../services/supabaseClient';
import type { Estorno, CriarEstornoDTO } from '../models/Estorno';

export class EstornoRepository {

  async criarEstorno(dto: CriarEstornoDTO, usuarioId: number): Promise<Estorno> {
    console.log('🔵 INICIANDO PROCESSO DE ESTORNO');
    console.log('DTO:', dto);
    console.log('Usuario ID:', usuarioId);

    try {

      console.log('1️⃣ Buscando venda...');
      const { data: venda, error: vendaError } = await supabase
        .from('vendas')
        .select('*')
        .eq('id', dto.venda_id)
        .single();

      if (vendaError || !venda) {
        console.error('❌ Venda não encontrada:', vendaError);
        throw new Error('Venda não encontrada');
      }

      console.log('✅ Venda encontrada:', venda);

      console.log('2️⃣ Buscando itens da venda...');
      const { data: itensVenda, error: itensError } = await supabase
        .from('itens_venda')
        .select('*')
        .eq('venda_id', dto.venda_id);

      if (itensError || !itensVenda || itensVenda.length === 0) {
        console.error('❌ Itens da venda não encontrados:', itensError);
        throw new Error('Itens da venda não encontrados');
      }

      console.log('✅ Itens da venda encontrados:', itensVenda.length, 'itens');
      console.log('Itens:', JSON.stringify(itensVenda, null, 2));

      console.log('3️⃣ Verificando se já foi estornada...');
      const { data: estornoExistente } = await supabase
        .from('estornos')
        .select('id')
        .eq('venda_id', dto.venda_id)
        .single();

      if (estornoExistente) {
        console.error('❌ Venda já foi estornada');
        throw new Error('Esta venda já foi estornada');
      }

      console.log('✅ Venda não foi estornada ainda');

      console.log('4️⃣ Criando registro de estorno...');
      const { data: estorno, error: estornoError } = await supabase
        .from('estornos')
        .insert({
          venda_id: dto.venda_id,
          usuario_id: usuarioId,
          motivo: dto.motivo,
          valor_estornado: venda.valor_total,
        })
        .select()
        .single();

      if (estornoError) {
        console.error('❌ Erro ao criar estorno:', estornoError);
        throw new Error('Erro ao criar estorno: ' + estornoError.message);
      }

      console.log('✅ Registro de estorno criado:', estorno);
      console.log('5️⃣ Iniciando devolução ao estoque...');

      for (const item of itensVenda) {
        console.log('====================================');
        console.log('Processando item:', JSON.stringify(item, null, 2));

        const { data: produto, error: produtoError } = await supabase
          .from('produtos')
          .select('quantidade, nome')
          .eq('id', item.produto_id)
          .single();

        if (produtoError) {
          console.error('Erro ao buscar produto:', produtoError);
          throw new Error(`Erro ao buscar produto ID ${item.produto_id}: ${produtoError.message}`);
        }

        if (!produto) {
          console.error('Produto não encontrado:', item.produto_id);
          throw new Error(`Produto ID ${item.produto_id} não encontrado`);
        }

        console.log(`Produto: ${produto.nome}`);
        console.log(`Quantidade atual: ${produto.quantidade}`);
        console.log(`Quantidade a devolver: ${item.quantidade}`);

        const novaQuantidade = produto.quantidade + item.quantidade;
        
        console.log(`Nova quantidade calculada: ${novaQuantidade}`);

        const { data: updateData, error: updateError } = await supabase
          .from('produtos')
          .update({ quantidade: novaQuantidade })
          .eq('id', item.produto_id)
          .select();

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError);
          throw new Error('Erro ao atualizar estoque: ' + updateError.message);
        }

        console.log('Dados após update:', updateData);
        console.log('✅ Estoque atualizado com sucesso!');
        console.log('====================================');
      }

      console.log('🎉 Todos os itens foram devolvidos ao estoque!');

      return estorno;
    } catch (error) {
      console.error('❌ Erro no processo de estorno:', error);
      throw error;
    }
  }

  async buscarPorVendaId(vendaId: string | number): Promise<Estorno | null> {
    const { data, error } = await supabase
      .from('estornos')
      .select('*')
      .eq('venda_id', vendaId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error('Erro ao buscar estorno: ' + error.message);
    }

    return data;
  }

  async listarTodos(): Promise<Estorno[]> {
    const { data, error } = await supabase
      .from('estornos')
      .select('*, vendas(*), usuarios(nome)')
      .order('data_estorno', { ascending: false });

    if (error) {
      throw new Error('Erro ao listar estornos: ' + error.message);
    }

    return data || [];
  }

  async vendaFoiEstornada(vendaId: string | number): Promise<boolean> {
    const { data } = await supabase
      .from('estornos')
      .select('id')
      .eq('venda_id', vendaId)
      .single();

    return !!data;
  }
}
