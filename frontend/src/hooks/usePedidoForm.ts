import { useState, useCallback, useMemo } from 'react';
import type { LineaPedidoRequest, Producto } from '../types';

interface LineaFormState extends LineaPedidoRequest {
  key: string;
}

interface FormErrors {
  lineas?: string;
}

export function usePedidoForm() {
  const [lineas, setLineas] = useState<LineaFormState[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const addLinea = useCallback(() => {
    const nueva: LineaFormState = {
      key: crypto.randomUUID(),
      productoId: 0,
      cantidad: 1,
    };
    setLineas((prev) => [...prev, nueva]);
    setErrors({});
  }, []);

  const removeLinea = useCallback((key: string) => {
    setLineas((prev) => prev.filter((l) => l.key !== key));
    setErrors({});
  }, []);

  const updateLinea = useCallback(
    (key: string, field: keyof LineaPedidoRequest, value: number) => {
      setLineas((prev) =>
        prev.map((l) => (l.key === key ? { ...l, [field]: value } : l))
      );
      setErrors({});
    },
    []
  );

  const totalEstimado = useMemo(() => {
    return 0;
  }, []);

  const calcularTotalConProductos = useCallback((productos: Producto[]) => {
    return lineas.reduce((total, linea) => {
      const producto = productos.find((p) => p.id === linea.productoId);
      if (!producto) return total;
      return total + producto.precio * linea.cantidad;
    }, 0);
  }, [lineas]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (lineas.length === 0) {
      newErrors.lineas = 'Debe agregar al menos una línea al pedido';
    } else {
      const invalidLinea = lineas.find((l) => !l.productoId || l.cantidad < 1);
      if (invalidLinea) {
        newErrors.lineas = 'Todas las líneas deben tener producto y cantidad válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [lineas]);

  const reset = useCallback(() => {
    setLineas([]);
    setErrors({});
  }, []);

  const toRequest = useCallback((): { lineas: LineaPedidoRequest[] } => {
    return {
      lineas: lineas.map(({ productoId, cantidad }) => ({ productoId, cantidad })),
    };
  }, [lineas]);

  return {
    lineas,
    errors,
    totalEstimado,
    addLinea,
    removeLinea,
    updateLinea,
    calcularTotalConProductos,
    validate,
    reset,
    toRequest,
  };
}

export type { LineaFormState };
