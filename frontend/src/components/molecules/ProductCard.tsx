import { Badge } from '../atoms/Badge.tsx';
import { Button } from '../atoms/Button.tsx';
import type { Producto } from '../../types';
import { formatCurrency } from '../../utils/format.ts';

interface ProductCardProps {
  producto: Producto;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
}

export function ProductCard({ producto, onEdit, onDelete }: ProductCardProps) {
  const stockBajo = producto.cantidadEnStock <= 3;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
          <p className="text-sm text-gray-500">ID: {producto.id}</p>
        </div>
        <Badge tipo={producto.tipo} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Precio</span>
          <span className="font-medium text-gray-900">{formatCurrency(producto.precio)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Stock</span>
          <span
            className={`font-medium ${stockBajo ? 'text-red-600' : 'text-gray-900'}`}
          >
            {producto.cantidadEnStock} {stockBajo && '(Bajo)'}
          </span>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {onEdit && (
            <Button variant="secondary" size="sm" onClick={() => onEdit(producto)}>
              Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(producto.id)}>
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
