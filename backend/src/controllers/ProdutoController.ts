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
    const { nome, preco, quantidade } = req.body;
    
    if (!nome || preco == null || quantidade == null) {
      return res.status(400).json({ mensagem: 'Nome, preço e quantidade são obrigatórios.' });
    }
    
    const produto = await ProdutoRepository.criar({ 
      nome, 
      preco: Number(preco), 
      quantidade: Number(quantidade) 
    });
    
    if (produto) {
      res.status(201).json(produto);
    } else {
      res.status(500).json({ mensagem: 'Erro ao criar produto.' });
    }
  }

  static async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;
    
    const dadosAtualizacao: Partial<{ nome: string; preco: number; quantidade: number }> = {};
    if (nome !== undefined) dadosAtualizacao.nome = nome;
    if (preco !== undefined) dadosAtualizacao.preco = preco;
    if (quantidade !== undefined) dadosAtualizacao.quantidade = quantidade;
    
    if (Object.keys(dadosAtualizacao).length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum campo para atualizar.' });
    }
    
    const produto = await ProdutoRepository.atualizar(id, dadosAtualizacao);
    if (produto) {
      res.json(produto);
    } else {
      res.status(500).json({ mensagem: 'Erro ao atualizar produto.' });
    }
  }

  static async deletar(req: Request, res: Response) {
    const { id } = req.params;
    const sucesso = await ProdutoRepository.deletar(id);
    
    if (sucesso) {
      res.status(204).send();
    } else {
      res.status(500).json({ mensagem: 'Erro ao deletar produto.' });
    }
  }
}
