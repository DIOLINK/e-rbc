import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePedidos } from '../hooks/usePedidos.ts';
import { OrderDetail } from '../components/organisms/OrderDetail.tsx';
import { Button } from '../components/atoms/Button.tsx';
import type { Pedido } from '../types';

export function PedidoDetalleController() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtenerPedido } = usePedidos();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedido = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await obtenerPedido(Number(id));
        setPedido(data);
      } catch {
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id, obtenerPedido]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/pedidos')}>
        ← Volver a Pedidos
      </Button>
      <OrderDetail pedido={pedido} loading={loading} />
    </div>
  );
}
