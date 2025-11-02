import { supabase } from '../services/supabaseClient';
import { Produto } from '../models/Produto';

export class ProdutoRepository {
  static async listarTodos(): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');
    if (error || !data) return [];
    // Mapear dados do banco incluindo quantidade
    return data.map((item: any) => ({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade || 0,
      criado_em: item.criado_em,
    })) as Produto[];
  }

  static async buscarPorId(id: string): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      nome: data.nome,
      preco: data.preco,
      quantidade: data.quantidade || 0,
      criado_em: data.criado_em,
    } as Produto;
  }

  static async criar(produto: Omit<Produto, 'id'>): Promise<Produto | null> {
    // Inserir produto com nome, preco e quantidade
    const { nome, preco, quantidade } = produto;
    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, preco, quantidade }])
      .select()
      .single();
    if (error) {
      console.error('Erro ao criar produto:', error);
    }
    if (error || !data) return null;
    // Mapear dados do banco incluindo quantidade
    return {
      id: data.id,
      nome: data.nome,
      preco: data.preco,
      quantidade: data.quantidade || 0,
      criado_em: data.criado_em,
    };
  }

  static async atualizar(id: string, produto: Partial<Omit<Produto, 'id'>>): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
    
    return {
      id: data.id,
      nome: data.nome,
      preco: data.preco,
      quantidade: data.quantidade || 0,
      criado_em: data.criado_em,
    };
  }

  static async deletar(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
    
    return true;
  }
}
