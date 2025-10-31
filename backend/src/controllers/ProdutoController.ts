import { Request, Response } from 'express';
import { ProdutoRepository } from '../repositories/ProdutoRepository';

export class ProdutoController {
  static async listar(req: Request, res: Response) {
    const produtos = await ProdutoRepository.listarTodos();
    res.json(produtos);
  }

  static async obterPorId(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await ProdutoRepository.buscarPorId(id);
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
  }

  static async criar(req: Request, res: Response) {
    const { nome, preco, descricao } = req.body;
    if (!nome || preco == null) {
      return res.status(400).json({ mensagem: 'Nome e preço são obrigatórios.' });
    }
    const produto = await ProdutoRepository.criar({ nome, preco, descricao });
    if (produto) {
      res.status(201).json(produto);
    } else {
      res.status(500).json({ mensagem: 'Erro ao criar produto.' });
    }
  }
}
