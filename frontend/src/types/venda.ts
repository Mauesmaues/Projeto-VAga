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
  estornada?: boolean;
}

export interface VendaInput {
  valor_total: number;
  forma_pagamento: 'dinheiro' | 'cartao' | 'pix';
  itens: ItemVenda[];
}

export interface Estorno {
  id: number;
  venda_id: string;
  usuario_id: number;
  motivo?: string;
  data_estorno: string;
  valor_estornado: number;
}

export interface CriarEstornoDTO {
  venda_id: string | number;
  motivo?: string;
}
