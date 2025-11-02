import { Produto } from '../models/Produto';

export class ProdutoView {
  static exibir(produto: Produto) {
    return {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: produto.quantidade,
      criado_em: produto.criado_em
    };
  }

  static exibirLista(produtos: Produto[]) {
    return produtos.map(p => this.exibir(p));
  }
}
