import type { TipoProducto } from '../../types';

interface BadgeProps {
  tipo: TipoProducto;
}

const tipoColors: Record<TipoProducto, string> = {
  BEBIDA: 'bg-blue-100 text-blue-800',
  COMIDA: 'bg-orange-100 text-orange-800',
};

export function Badge({ tipo }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tipoColors[tipo]}`}
    >
      {tipo}
    </span>
  );
}
