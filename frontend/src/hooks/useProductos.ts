import { useCallback, useMemo, useState } from 'react';
import { useProductoContext } from '../contexts/ProductoContext.tsx';
import type { ProductoRequest, TipoProducto } from '../types';

export function useProductos() {
  const { state, fetchAll, create, update, remove } = useProductoContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<TipoProducto | 'TODOS'>('TODOS');

  const filteredProductos = useMemo(() => {
    return state.productos.filter((p) => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = tipoFilter === 'TODOS' || p.tipo === tipoFilter;
      return matchesSearch && matchesTipo;
    });
  }, [state.productos, searchTerm, tipoFilter]);

  const crearProducto = useCallback(
    async (data: ProductoRequest): Promise<void> => {
      await create(data);
    },
    [create]
  );

  const actualizarProducto = useCallback(
    async (id: number, data: ProductoRequest): Promise<void> => {
      await update(id, data);
    },
    [update]
  );

  const eliminarProducto = useCallback(
    async (id: number): Promise<void> => {
      await remove(id);
    },
    [remove]
  );

  return {
    productos: state.productos,
    filteredProductos,
    loading: state.loading,
    error: state.error,
    searchTerm,
    tipoFilter,
    setSearchTerm,
    setTipoFilter,
    fetchAll,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
  };
}
