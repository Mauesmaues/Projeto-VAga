export interface ItemVenda {
  produto_id: string;
  produto_nome?: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  usuario_id: string;
  usuario_nome?: string;
  data_venda?: string;
  valor_total: number;
  forma_pagamento: 'dinheiro' | 'cartao' | 'pix';
  itens?: ItemVenda[];
}

export interface VendaInput {
  usuario_id: string;
  valor_total: number;
  forma_pagamento: 'dinheiro' | 'cartao' | 'pix';
  itens: ItemVenda[];
}
