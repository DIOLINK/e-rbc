import { OrderLineItem } from '../molecules/OrderLineItem.tsx';
import { EmptyState } from '../molecules/EmptyState.tsx';
import type { Pedido } from '../../types';
import { formatCurrency } from '../../utils/format.ts';

interface OrderTableProps {
  pedidos: Pedido[];
  onViewDetail?: (id: number) => void;
}

export function OrderTable({ pedidos, onViewDetail }: OrderTableProps) {
  if (pedidos.length === 0) {
    return (
      <EmptyState
        title="No hay pedidos registrados"
        description="Crea tu primer pedido para verlo aquí."
      />
    );
  }

  return (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-700">Pedido #{pedido.id}</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-900">
                Total: {formatCurrency(pedido.total)}
              </span>
              {onViewDetail && (
                <button
                  onClick={() => onViewDetail(pedido.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver detalle
                </button>
              )}
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Producto
                </th>
                <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Unit.
                </th>
                <th className="py-2 px-4 text-center text-xs font-medium text-gray-500 uppercase">
                  Cant.
                </th>
                <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase">
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
      ))}
    </div>
  );
}
