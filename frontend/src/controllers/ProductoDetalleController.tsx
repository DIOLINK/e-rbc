import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/molecules/ProductForm.tsx';
import { ProductCard } from '../components/molecules/ProductCard.tsx';
import { Spinner } from '../components/atoms/Spinner.tsx';
import { Alert } from '../components/atoms/Alert.tsx';
import { Button } from '../components/atoms/Button.tsx';
import { useProductos } from '../hooks/useProductos.ts';
import type { ProductoRequest } from '../types';

export function ProductoDetalleController() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productos, loading, fetchAll, actualizarProducto } = useProductos();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productoId = Number(id);
  const producto = productos.find((p) => p.id === productoId);

  useEffect(() => {
    if (productos.length === 0) {
      fetchAll();
    }
  }, [productos.length, fetchAll]);

  const handleUpdate = async (data: ProductoRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await actualizarProducto(productoId, data);
      setIsEditing(false);
    } catch (err) {
      setError((err as { message: string }).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !producto) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!producto && !loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
        <p className="text-gray-500 mb-4">El producto con ID {id} no existe.</p>
        <Button onClick={() => navigate('/productos')}>Volver a Productos</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/productos')}>
        ← Volver a Productos
      </Button>

      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}

      {producto && !isEditing && (
        <ProductCard
          producto={producto}
          onEdit={() => setIsEditing(true)}
          onDelete={undefined}
        />
      )}

      {producto && isEditing && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Editar Producto</h2>
          <ProductForm
            initialValues={producto}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
