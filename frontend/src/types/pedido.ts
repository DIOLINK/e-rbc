export interface LineaPedidoRequest {
  productoId: number;
  cantidad: number;
}

export interface PedidoRequest {
  lineas: LineaPedidoRequest[];
}

export interface LineaPedido {
  id: number;
  productoId: number;
  productoNombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  lineas: LineaPedido[];
  total: number;
}
