import { supabase } from '../services/supabaseClient';
import { Produto } from '../models/Produto';

export class ProdutoRepository {
  static async listarTodos(): Promise<Produto[]> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*');
    if (error || !data) return [];
    return data as Produto[];
  }

  static async buscarPorId(id: string): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data as Produto;
  }

  static async criar(produto: Omit<Produto, 'id'>): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select()
      .single();
    if (error || !data) return null;
    return data as Produto;
  }
}
