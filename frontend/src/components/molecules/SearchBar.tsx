import { Input } from '../atoms/Input.tsx';
import { Select } from '../atoms/Select.tsx';
import type { TipoProducto } from '../../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFilter: TipoProducto | 'TODOS';
  onTipoFilterChange: (value: TipoProducto | 'TODOS') => void;
}

const tipoOptions = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'BEBIDA', label: 'Bebidas' },
  { value: 'COMIDA', label: 'Comidas' },
];

export function SearchBar({
  searchTerm,
  onSearchChange,
  tipoFilter,
  onTipoFilterChange,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <Input
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          options={tipoOptions}
          value={tipoFilter}
          onChange={(e) => onTipoFilterChange(e.target.value as TipoProducto | 'TODOS')}
        />
      </div>
    </div>
  );
}
