export type TipoProducto = 'BEBIDA' | 'COMIDA';

export interface Producto {
  id: number;
  tipo: TipoProducto;
  nombre: string;
  precio: number;
  cantidadEnStock: number;
}

export interface ProductoRequest {
  nombre: string;
  precio: number;
  cantidadEnStock: number;
  tipo: TipoProducto;
}
