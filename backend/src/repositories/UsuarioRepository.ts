import { supabase } from '../services/supabaseClient';
import { Usuario, TipoUsuario } from '../models/User';

export class UsuarioRepository {

  static async buscarPorNome(nome: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nome', nome)
      .single();
    if (error || !data) return null;
    return data as Usuario;
  }

  static async buscarPorEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    if (error || !data) return null;
    return data as Usuario;
  }

  static async listarTodos(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as Usuario[];
  }

  static async criar(usuario: Omit<Usuario, 'id'>): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select()
      .single();
    if (error) {
      console.error('Erro ao criar usuário no Supabase:', error.message, error.details, error.hint);
    }
    if (error || !data) return null;
    return data as Usuario;
  }

  static async atualizar(id: string, dados: Partial<Omit<Usuario, 'id'>>): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Erro ao atualizar usuário no Supabase:', error.message, error.details, error.hint);
    }
    if (error || !data) return null;
    return data as Usuario;
  }

  static async deletar(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erro ao deletar usuário no Supabase:', error.message, error.details, error.hint);
      return false;
    }
    return true;
  }

  static async buscarPorId(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data as Usuario;
  }
}
