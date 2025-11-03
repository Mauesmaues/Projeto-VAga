import { Request, Response } from 'express';
import { VendaRepository } from '../repositories/VendaRepository';
import { VendaInput } from '../models/Venda';
import { AuthRequest } from '../types/api';

export class VendaController {
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const vendas = await VendaRepository.listarTodas();
      res.json(vendas);
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      res.status(500).json({ message: 'Erro ao listar vendas' });
    }
  }

  static async criar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vendaInput: VendaInput = req.body;

      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      vendaInput.usuario_id = req.user.id;
      
      const novaVenda = await VendaRepository.criar(vendaInput);
      
      if (!novaVenda) {
        res.status(500).json({ message: 'Erro ao criar venda' });
        return;
      }
      
      res.status(201).json(novaVenda);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      res.status(500).json({ message: 'Erro ao criar venda' });
    }
  }

  static async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const venda = await VendaRepository.buscarPorId(id);
      
      if (!venda) {
        res.status(404).json({ message: 'Venda não encontrada' });
        return;
      }
      
      res.json(venda);
    } catch (error) {
      console.error('Erro ao buscar venda:', error);
      res.status(500).json({ message: 'Erro ao buscar venda' });
    }
  }
}
