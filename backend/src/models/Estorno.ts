export interface Estorno {
  id: number;
  venda_id: string;
  usuario_id: number;
  motivo?: string;
  data_estorno: Date;
  valor_estornado: number;
}

export interface CriarEstornoDTO {
  venda_id: string | number;
  motivo?: string;
}
