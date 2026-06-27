import { useCallback } from 'react';
import { usePedidoContext } from '../contexts/PedidoContext.tsx';
import type { PedidoRequest } from '../types';

export function usePedidos() {
  const { state, fetchAll, getById, create } = usePedidoContext();

  const crearPedido = useCallback(
    async (data: PedidoRequest): Promise<void> => {
      await create(data);
    },
    [create]
  );

  const obtenerPedido = useCallback(
    async (id: number) => {
      return getById(id);
    },
    [getById]
  );

  return {
    pedidos: state.pedidos,
    loading: state.loading,
    error: state.error,
    fetchAll,
    crearPedido,
    obtenerPedido,
  };
}
