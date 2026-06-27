import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos.ts';
import { usePedidos } from '../hooks/usePedidos.ts';
import { usePedidoForm } from '../hooks/usePedidoForm.ts';
import { PageHeader } from '../components/organisms/PageHeader.tsx';
import { OrderForm } from '../components/organisms/OrderForm.tsx';
import { Alert } from '../components/atoms/Alert.tsx';
import { Button } from '../components/atoms/Button.tsx';

export function NuevoPedidoController() {
  const navigate = useNavigate();
  const { productos, fetchAll: fetchProductos } = useProductos();
  const { crearPedido } = usePedidos();
  const pedidoForm = usePedidoForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (productos.length === 0) {
      fetchProductos();
    }
  }, [productos.length, fetchProductos]);

  const handleSubmit = useCallback(async () => {
    if (!pedidoForm.validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await crearPedido(pedidoForm.toRequest());
      setSuccess(true);
      pedidoForm.reset();
      setTimeout(() => {
        navigate('/pedidos');
      }, 1500);
    } catch (err) {
      setError((err as { message: string }).message || 'Error al crear el pedido');
    } finally {
      setIsSubmitting(false);
    }
  }, [pedidoForm, crearPedido, navigate]);

  const total = pedidoForm.calcularTotalConProductos(productos);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Nuevo Pedido"
        description="Selecciona productos y cantidades para crear un pedido"
      />

      <Button variant="ghost" onClick={() => navigate('/pedidos')}>
        ← Volver a Pedidos
      </Button>

      {error && <Alert variant="error" message={error} onClose={() => setError(null)} />}
      {success && (
        <Alert variant="success" message="Pedido creado exitosamente. Redirigiendo..." />
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <OrderForm
          productos={productos}
          lineas={pedidoForm.lineas}
          errors={pedidoForm.errors}
          totalEstimado={total}
          isSubmitting={isSubmitting}
          onAddLinea={pedidoForm.addLinea}
          onRemoveLinea={pedidoForm.removeLinea}
          onUpdateLinea={pedidoForm.updateLinea}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/pedidos')}
        />
      </div>
    </div>
  );
}
