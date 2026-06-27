import type { LineaPedido } from '../../types';
import { formatCurrency } from '../../utils/format.ts';

interface OrderLineItemProps {
  linea: LineaPedido;
}

export function OrderLineItem({ linea }: OrderLineItemProps) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4 text-sm text-gray-900">{linea.productoNombre}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(linea.precioUnitario)}</td>
      <td className="py-3 px-4 text-sm text-gray-600 text-center">{linea.cantidad}</td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
        {formatCurrency(linea.subtotal)}
      </td>
    </tr>
  );
}
