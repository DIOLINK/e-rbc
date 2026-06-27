import { useEffect, useState, useCallback } from 'react';
import { useProductos } from '../hooks/useProductos.ts';
import { ProductList } from '../components/organisms/ProductList.tsx';
import { ProductForm } from '../components/molecules/ProductForm.tsx';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog.tsx';
import type { Producto, ProductoRequest } from '../types';

export function ProductosController() {
  const {
    productos,
    filteredProductos,
    loading,
    error,
    searchTerm,
    tipoFilter,
    setSearchTerm,
    setTipoFilter,
    fetchAll,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
  } = useProductos();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreate = useCallback(
    async (data: ProductoRequest) => {
      setIsSubmitting(true);
      try {
        await crearProducto(data);
        setShowCreateModal(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [crearProducto]
  );

  const handleUpdate = useCallback(
    async (data: ProductoRequest) => {
      if (!editingProducto) return;
      setIsSubmitting(true);
      try {
        await actualizarProducto(editingProducto.id, data);
        setEditingProducto(null);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingProducto, actualizarProducto]
  );

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    setIsSubmitting(true);
    try {
      await eliminarProducto(deletingId);
    } finally {
      setIsSubmitting(false);
      setDeletingId(null);
    }
  }, [deletingId, eliminarProducto]);

  return (
    <>
      <ProductList
        productos={productos}
        filteredProductos={filteredProductos}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        tipoFilter={tipoFilter}
        onSearchChange={setSearchTerm}
        onTipoFilterChange={setTipoFilter}
        onNewProduct={() => {
          setShowCreateModal(true);
        }}
        onEditProduct={(p) => {
          setEditingProducto(p);
        }}
        onDeleteProduct={(id) => setDeletingId(id)}
        onDismissError={() => {}}
      />

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nuevo Producto</h2>
            <ProductForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {editingProducto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setEditingProducto(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Editar Producto</h2>
            <ProductForm
              initialValues={editingProducto}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProducto(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deletingId !== null}
        title="Eliminar Producto"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
