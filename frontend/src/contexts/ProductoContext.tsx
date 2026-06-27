import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Producto, ApiError } from '../types';
import { productoService } from '../services/modules/producto.service.ts';

interface ProductoState {
  productos: Producto[];
  loading: boolean;
  error: ApiError | null;
}

type ProductoAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Producto[] }
  | { type: 'FETCH_ERROR'; payload: ApiError }
  | { type: 'CREATE_SUCCESS'; payload: Producto }
  | { type: 'UPDATE_SUCCESS'; payload: Producto }
  | { type: 'DELETE_SUCCESS'; payload: number };

const initialState: ProductoState = {
  productos: [],
  loading: false,
  error: null,
};

function productoReducer(state: ProductoState, action: ProductoAction): ProductoState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { productos: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return { ...state, productos: [...state.productos, action.payload] };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        productos: state.productos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        productos: state.productos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

interface ProductoContextValue {
  state: ProductoState;
  dispatch: Dispatch<ProductoAction>;
  fetchAll: () => Promise<void>;
  create: (data: Omit<Producto, 'id'>) => Promise<Producto>;
  update: (id: number, data: Omit<Producto, 'id'>) => Promise<Producto>;
  remove: (id: number) => Promise<void>;
}

const ProductoContext = createContext<ProductoContextValue | null>(null);

export function ProductoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productoReducer, initialState);

  const fetchAll = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const productos = await productoService.getAll();
      dispatch({ type: 'FETCH_SUCCESS', payload: productos });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err as ApiError });
    }
  };

  const create = async (data: Omit<Producto, 'id'>): Promise<Producto> => {
    const nuevo = await productoService.create(data as Parameters<typeof productoService.create>[0]);
    dispatch({ type: 'CREATE_SUCCESS', payload: nuevo });
    return nuevo;
  };

  const update = async (id: number, data: Omit<Producto, 'id'>): Promise<Producto> => {
    const actualizado = await productoService.update(id, data as Parameters<typeof productoService.update>[1]);
    dispatch({ type: 'UPDATE_SUCCESS', payload: actualizado });
    return actualizado;
  };

  const remove = async (id: number) => {
    await productoService.delete(id);
    dispatch({ type: 'DELETE_SUCCESS', payload: id });
  };

  return (
    <ProductoContext.Provider value={{ state, dispatch, fetchAll, create, update, remove }}>
      {children}
    </ProductoContext.Provider>
  );
}

export function useProductoContext(): ProductoContextValue {
  const context = useContext(ProductoContext);
  if (!context) {
    throw new Error('useProductoContext debe usarse dentro de un ProductoProvider');
  }
  return context;
}
