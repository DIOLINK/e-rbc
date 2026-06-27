import { Input } from '../atoms/Input.tsx';
import { Select } from '../atoms/Select.tsx';
import { Button } from '../atoms/Button.tsx';
import { useProductoForm } from '../../hooks/useProductoForm.ts';
import type { ProductoRequest, Producto } from '../../types';

interface ProductFormProps {
  initialValues?: Producto;
  onSubmit: (data: ProductoRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const tipoOptions = [
  { value: 'BEBIDA', label: 'Bebida' },
  { value: 'COMIDA', label: 'Comida' },
];

export function ProductForm({ initialValues, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const { form, errors, handleChange, validate } = useProductoForm(
    initialValues
      ? {
          nombre: initialValues.nombre,
          precio: initialValues.precio,
          cantidadEnStock: initialValues.cantidadEnStock,
          tipo: initialValues.tipo,
        }
      : undefined
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        type="text"
        placeholder="Ej: Coca-Cola"
        value={form.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
        error={errors.nombre}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio"
          type="number"
          placeholder="0"
          min={0}
          step={100}
          value={form.precio || ''}
          onChange={(e) => handleChange('precio', parseFloat(e.target.value) || 0)}
          error={errors.precio}
        />
        <Input
          label="Stock"
          type="number"
          placeholder="0"
          min={0}
          value={form.cantidadEnStock || ''}
          onChange={(e) => handleChange('cantidadEnStock', parseInt(e.target.value) || 0)}
          error={errors.cantidadEnStock}
        />
      </div>
      <Select
        label="Tipo"
        options={tipoOptions}
        value={form.tipo}
        onChange={(e) => handleChange('tipo', e.target.value)}
        error={errors.tipo}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : initialValues ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
