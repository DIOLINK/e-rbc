import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/templates/MainLayout.tsx';
import { ProductosPage } from '../pages/ProductosPage.tsx';
import { ProductoDetallePage } from '../pages/ProductoDetallePage.tsx';
import { PedidosPage } from '../pages/PedidosPage.tsx';
import { PedidoDetallePage } from '../pages/PedidoDetallePage.tsx';
import { NuevoPedidoPage } from '../pages/NuevoPedidoPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/productos" replace />,
      },
      {
        path: 'productos',
        element: <ProductosPage />,
      },
      {
        path: 'productos/:id',
        element: <ProductoDetallePage />,
      },
      {
        path: 'pedidos',
        element: <PedidosPage />,
      },
      {
        path: 'pedidos/nuevo',
        element: <NuevoPedidoPage />,
      },
      {
        path: 'pedidos/:id',
        element: <PedidoDetallePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
