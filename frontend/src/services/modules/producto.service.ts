import { ApiClient } from '../config/api-client.ts';
import type { Producto, ProductoRequest } from '../../types';

class ProductoService extends ApiClient {
  constructor() {
    super();
  }

  async getAll(): Promise<Producto[]> {
    return this.get<Producto[]>('/productos');
  }

  async getById(id: number): Promise<Producto> {
    return this.get<Producto>(`/productos/${id}`);
  }

  async create(data: ProductoRequest): Promise<Producto> {
    return this.post<Producto>('/productos', data);
  }

  async update(id: number, data: ProductoRequest): Promise<Producto> {
    return this.put<Producto>(`/productos/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return this.httpDelete(`/productos/${id}`);
  }
}

export const productoService = new ProductoService();
