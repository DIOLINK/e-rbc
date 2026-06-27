import { useState, useCallback } from 'react';
import type { ProductoRequest, TipoProducto } from '../types';

interface FormErrors {
  nombre?: string;
  precio?: string;
  cantidadEnStock?: string;
  tipo?: string;
}

const initialForm: ProductoRequest = {
  nombre: '',
  precio: 0,
  cantidadEnStock: 0,
  tipo: 'BEBIDA',
};

export function useProductoForm(initial?: Partial<ProductoRequest>) {
  const [form, setForm] = useState<ProductoRequest>({ ...initialForm, ...initial });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback(
    (field: keyof ProductoRequest, value: string | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (form.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    if (form.cantidadEnStock < 0) {
      newErrors.cantidadEnStock = 'El stock no puede ser negativo';
    }
    if (!form.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const reset = useCallback((newInitial?: Partial<ProductoRequest>) => {
    setForm({ ...initialForm, ...newInitial });
    setErrors({});
  }, []);

  const setValues = useCallback((values: Partial<ProductoRequest>) => {
    setForm((prev) => ({ ...prev, ...values }));
  }, []);

  return { form, errors, handleChange, validate, reset, setValues };
}

export type { FormErrors, ProductoRequest, TipoProducto };
