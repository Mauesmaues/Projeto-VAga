export interface Estorno {
  id: number;
  venda_id: string; // UUID
  usuario_id: number;
  motivo?: string;
  data_estorno: Date;
  valor_estornado: number;
}

export interface CriarEstornoDTO {
  venda_id: string | number; // UUID (string) ou number
  motivo?: string;
}
