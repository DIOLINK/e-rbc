import { Select } from '../atoms/Select.tsx';
import { Input } from '../atoms/Input.tsx';
import { Button } from '../atoms/Button.tsx';
import type { Producto } from '../../types';

interface LineaPedidoInputProps {
  productos: Producto[];
  productoId: number;
  cantidad: number;
  onProductoChange: (value: number) => void;
  onCantidadChange: (value: number) => void;
  onRemove: () => void;
}

export function LineaPedidoInput({
  productos,
  productoId,
  cantidad,
  onProductoChange,
  onCantidadChange,
  onRemove,
}: LineaPedidoInputProps) {
  const productoOptions = [
    { value: '0', label: 'Seleccionar producto...' },
    ...productos.map((p) => ({
      value: String(p.id),
      label: `${p.nombre} ($${p.precio}) — Stock: ${p.cantidadEnStock}`,
    })),
  ];

  const selectedProducto = productos.find((p) => p.id === productoId);

  return (
    <div className="flex items-end gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <Select
          label="Producto"
          options={productoOptions}
          value={String(productoId)}
          onChange={(e) => onProductoChange(parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="w-28">
        <Input
          label="Cantidad"
          type="number"
          min={1}
          max={selectedProducto?.cantidadEnStock ?? 99}
          value={cantidad || ''}
          onChange={(e) => onCantidadChange(parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="pb-0.5">
        <Button variant="ghost" size="sm" onClick={onRemove} type="button">
          ✕
        </Button>
      </div>
    </div>
  );
}
