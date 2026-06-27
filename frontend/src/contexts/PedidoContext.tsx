import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Pedido, ApiError } from '../types';
import { pedidoService } from '../services/modules/pedido.service.ts';

interface PedidoState {
  pedidos: Pedido[];
  loading: boolean;
  error: ApiError | null;
}

type PedidoAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Pedido[] }
  | { type: 'FETCH_ERROR'; payload: ApiError }
  | { type: 'CREATE_SUCCESS'; payload: Pedido };

const initialState: PedidoState = {
  pedidos: [],
  loading: false,
  error: null,
};

function pedidoReducer(state: PedidoState, action: PedidoAction): PedidoState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { pedidos: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, pedidos: [action.payload, ...state.pedidos] };
    default:
      return state;
  }
}

interface PedidoContextValue {
  state: PedidoState;
  dispatch: Dispatch<PedidoAction>;
  fetchAll: () => Promise<void>;
  getById: (id: number) => Promise<Pedido>;
  create: (data: Parameters<typeof pedidoService.create>[0]) => Promise<Pedido>;
}

const PedidoContext = createContext<PedidoContextValue | null>(null);

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pedidoReducer, initialState);

  const fetchAll = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const pedidos = await pedidoService.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: pedidos });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err as ApiError });
    }
  };

  const getById = async (id: number): Promise<Pedido> => {
    return pedidoService.getById(id);
  };

  const create = async (data: Parameters<typeof pedidoService.create>[0]): Promise<Pedido> => {
    const nuevo = await pedidoService.create(data);
    dispatch({ type: 'CREATE_SUCCESS', payload: nuevo });
    return nuevo;
  };

  return (
    <PedidoContext.Provider value={{ state, dispatch, fetchAll, getById, create }}>
      {children}
    </PedidoContext.Provider>
  );
}

export function usePedidoContext(): PedidoContextValue {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidoContext debe usarse dentro de un PedidoProvider');
  }
  return context;
}
