import { Request, Response } from 'express';
import { HistoricoEstoqueRepository } from '../repositories/HistoricoEstoqueRepository';

export class HistoricoEstoqueController {
  static async listarHistorico(req: Request, res: Response) {
    const historico = await HistoricoEstoqueRepository.listarHistorico();
    res.json(historico);
  }

  static async listarPorProduto(req: Request, res: Response) {
    const { produto_id } = req.params;
    const historico = await HistoricoEstoqueRepository.listarPorProduto(produto_id);
    res.json(historico);
  }
}
