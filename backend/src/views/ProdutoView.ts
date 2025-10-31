import { Produto } from '../models/Produto';

export class ProdutoView {
  static exibir(produto: Produto) {
    return {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao
    };
  }

  static exibirLista(produtos: Produto[]) {
    return produtos.map(p => this.exibir(p));
  }
}
