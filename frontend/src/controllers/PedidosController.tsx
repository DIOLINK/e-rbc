import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePedidos } from '../hooks/usePedidos.ts';
import { PageHeader } from '../components/organisms/PageHeader.tsx';
import { OrderTable } from '../components/organisms/OrderTable.tsx';
import { Spinner } from '../components/atoms/Spinner.tsx';
import { Button } from '../components/atoms/Button.tsx';

export function PedidosController() {
  const navigate = useNavigate();
  const { pedidos, loading, fetchAll } = usePedidos();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleViewDetail = useCallback(
    (id: number) => {
      navigate(`/pedidos/${id}`);
    },
    [navigate]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos"
        description="Historial de todos los pedidos realizados"
        action={
          <Button onClick={() => navigate('/pedidos/nuevo')}>+ Nuevo Pedido</Button>
        }
      />

      {loading && pedidos.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <OrderTable pedidos={pedidos} onViewDetail={handleViewDetail} />
      )}
    </div>
  );
}
