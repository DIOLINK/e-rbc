import { ProductCard } from '../molecules/ProductCard.tsx';
import { SearchBar } from '../molecules/SearchBar.tsx';
import { EmptyState } from '../molecules/EmptyState.tsx';
import { Spinner } from '../atoms/Spinner.tsx';
import { Alert } from '../atoms/Alert.tsx';
import { Button } from '../atoms/Button.tsx';
import type { Producto, TipoProducto } from '../../types';

interface ProductListProps {
  productos: Producto[];
  filteredProductos: Producto[];
  loading: boolean;
  error: { message: string } | null;
  searchTerm: string;
  tipoFilter: TipoProducto | 'TODOS';
  onSearchChange: (value: string) => void;
  onTipoFilterChange: (value: TipoProducto | 'TODOS') => void;
  onNewProduct: () => void;
  onEditProduct: (producto: Producto) => void;
  onDeleteProduct: (id: number) => void;
  onDismissError: () => void;
}

export function ProductList({
  productos,
  filteredProductos,
  loading,
  error,
  searchTerm,
  tipoFilter,
  onSearchChange,
  onTipoFilterChange,
  onNewProduct,
  onEditProduct,
  onDeleteProduct,
  onDismissError,
}: ProductListProps) {
  if (loading && productos.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error" message={error.message} onClose={onDismissError} />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          tipoFilter={tipoFilter}
          onTipoFilterChange={onTipoFilterChange}
        />
        <Button onClick={onNewProduct} className="shrink-0">
          + Nuevo Producto
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}

      {filteredProductos.length === 0 && !loading ? (
        <EmptyState
          title="No se encontraron productos"
          description={
            productos.length === 0
              ? 'Aún no hay productos registrados. Crea el primero usando el botón superior.'
              : 'Ningún producto coincide con los filtros actuales. Prueba con otros términos.'
          }
          action={
            productos.length === 0 ? (
              <Button onClick={onNewProduct}>+ Nuevo Producto</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProductos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
