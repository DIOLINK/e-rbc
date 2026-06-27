import { ApiClient } from '../config/api-client.ts';
import type { Pedido, PedidoRequest } from '../../types';

class PedidoService extends ApiClient {
  constructor() {
    super();
  }

  async getAll(): Promise<Pedido[]> {
    return this.get<Pedido[]>('/pedidos');
  }

  async getById(id: number): Promise<Pedido> {
    return this.get<Pedido>(`/pedidos/${id}`);
  }

  async create(data: PedidoRequest): Promise<Pedido> {
    return this.post<Pedido>('/pedidos', data);
  }
}

export const pedidoService = new PedidoService();
