import { LineaPedidoInput } from '../molecules/LineaPedidoInput.tsx';
import { Button } from '../atoms/Button.tsx';
import { Alert } from '../atoms/Alert.tsx';
import type { Producto } from '../../types';

interface OrderFormProps {
  productos: Producto[];
  lineas: { key: string; productoId: number; cantidad: number }[];
  errors: { lineas?: string };
  totalEstimado: number;
  isSubmitting: boolean;
  onAddLinea: () => void;
  onRemoveLinea: (key: string) => void;
  onUpdateLinea: (key: string, field: 'productoId' | 'cantidad', value: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function OrderForm({
  productos,
  lineas,
  errors,
  totalEstimado,
  isSubmitting,
  onAddLinea,
  onRemoveLinea,
  onUpdateLinea,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  return (
    <div className="space-y-4">
      {errors.lineas && <Alert variant="error" message={errors.lineas} />}

      <div className="space-y-3">
        {lineas.map((linea) => (
          <LineaPedidoInput
            key={linea.key}
            productos={productos}
            productoId={linea.productoId}
            cantidad={linea.cantidad}
            onProductoChange={(v) => onUpdateLinea(linea.key, 'productoId', v)}
            onCantidadChange={(v) => onUpdateLinea(linea.key, 'cantidad', v)}
            onRemove={() => onRemoveLinea(linea.key)}
          />
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={onAddLinea} type="button">
        + Agregar línea
      </Button>

      {lineas.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">
            Total estimado: ${totalEstimado.toLocaleString('es-CL')}
          </span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting || lineas.length === 0} type="button">
          {isSubmitting ? 'Creando pedido...' : 'Crear Pedido'}
        </Button>
      </div>
    </div>
  );
}
