import { RouterProvider } from 'react-router-dom';
import { ProductoProvider } from './contexts/ProductoContext.tsx';
import { PedidoProvider } from './contexts/PedidoContext.tsx';
import { router } from './routes/AppRouter.tsx';

export default function App() {
  return (
    <ProductoProvider>
      <PedidoProvider>
        <RouterProvider router={router} />
      </PedidoProvider>
    </ProductoProvider>
  );
}
