export function validateRequired(value: string, fieldName: string): string | null {
  return value.trim() ? null : `${fieldName} es requerido`;
}

export function validateMin(value: number, min: number, fieldName: string): string | null {
  return value >= min ? null : `${fieldName} debe ser al menos ${min}`;
}

export function validatePositive(value: number, fieldName: string): string | null {
  return value > 0 ? null : `${fieldName} debe ser mayor a 0`;
}
