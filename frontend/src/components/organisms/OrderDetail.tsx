import { OrderLineItem } from '../molecules/OrderLineItem.tsx';
import { Spinner } from '../atoms/Spinner.tsx';
import type { Pedido } from '../../types';
import { formatCurrency } from '../../utils/format.ts';

interface OrderDetailProps {
  pedido: Pedido | null;
  loading: boolean;
}

export function OrderDetail({ pedido, loading }: OrderDetailProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="text-center py-10 text-gray-500">
        Pedido no encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-900">Pedido #{pedido.id}</span>
        <span className="text-lg font-bold text-gray-900">
          Total: {formatCurrency(pedido.total)}
        </span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
              Producto
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
              Precio Unit.
            </th>
            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase">
              Cant.
            </th>
            <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {pedido.lineas.map((linea) => (
            <OrderLineItem key={linea.id} linea={linea} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
