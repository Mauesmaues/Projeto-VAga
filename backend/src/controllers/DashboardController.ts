import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

export class DashboardController {
  static async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      // Buscar total de produtos cadastrados
      const { count: totalProdutos } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true });

      // Buscar soma de quantidade em estoque
      const { data: produtosEstoque } = await supabase
        .from('produtos')
        .select('quantidade');
      
      const totalEstoque = produtosEstoque?.reduce((sum, p) => sum + (p.quantidade || 0), 0) || 0;

      // Buscar vendas do dia atual
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const { data: vendasHoje, count: totalVendasHoje } = await supabase
        .from('vendas')
        .select('valor_total', { count: 'exact' })
        .gte('data_venda', hoje.toISOString());

      // Calcular receita do dia
      const receitaDiaria = vendasHoje?.reduce((sum, v) => sum + (v.valor_total || 0), 0) || 0;

      res.json({
        totalProdutos: totalProdutos || 0,
        totalEstoque,
        vendasDoDia: totalVendasHoje || 0,
        receitaDiaria
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
  }
}
