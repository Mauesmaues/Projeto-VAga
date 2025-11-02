export interface Produto {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  criado_em?: string;
}

export interface ProdutoInput {
  nome: string;
  preco: number;
  quantidade: number;
}
