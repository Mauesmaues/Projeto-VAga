import { Request, Response } from 'express';
import { EstornoRepository } from '../repositories/EstornoRepository';

export class EstornoController {
  private estornoRepository = new EstornoRepository();

  criarEstorno = async (req: Request, res: Response) => {
    try {
      const { venda_id, motivo } = req.body;
      const usuarioId = (req as any).user.id;

      console.log('Dados recebidos para estorno:', { 
        body: req.body, 
        venda_id, 
        tipo_venda_id: typeof venda_id,
        motivo,
        usuarioId 
      });

      if (!venda_id) {
        return res.status(400).json({ erro: 'venda_id é obrigatório' });
      }

      const estorno = await this.estornoRepository.criarEstorno(
        { venda_id, motivo },
        usuarioId
      );

      return res.status(201).json(estorno);
    } catch (error: any) {
      console.error('Erro ao criar estorno:', error);
      return res.status(500).json({ erro: error.message || 'Erro ao criar estorno' });
    }
  };

  buscarPorVenda = async (req: Request, res: Response) => {
    try {
      const vendaId = req.params.vendaId;

      if (!vendaId) {
        return res.status(400).json({ erro: 'ID da venda é obrigatório' });
      }

      const estorno = await this.estornoRepository.buscarPorVendaId(vendaId);
      
      if (!estorno) {
        return res.status(404).json({ erro: 'Estorno não encontrado' });
      }

      return res.json(estorno);
    } catch (error: any) {
      console.error('Erro ao buscar estorno:', error);
      return res.status(500).json({ erro: error.message || 'Erro ao buscar estorno' });
    }
  };

  verificarEstorno = async (req: Request, res: Response) => {
    try {
      const vendaId = req.params.vendaId;

      if (!vendaId) {
        return res.status(400).json({ erro: 'ID da venda é obrigatório' });
      }

      const estornada = await this.estornoRepository.vendaFoiEstornada(vendaId);
      
      return res.json({ estornada });
    } catch (error: any) {
      console.error('Erro ao verificar estorno:', error);
      return res.status(500).json({ erro: error.message || 'Erro ao verificar estorno' });
    }
  };

  listarEstornos = async (req: Request, res: Response) => {
    try {
      const estornos = await this.estornoRepository.listarTodos();
      return res.json(estornos);
    } catch (error: any) {
      console.error('Erro ao listar estornos:', error);
      return res.status(500).json({ erro: error.message || 'Erro ao listar estornos' });
    }
  };
}
