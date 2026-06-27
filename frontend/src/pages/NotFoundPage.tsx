import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button.tsx';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-7xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-6">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/productos">
        <Button>Ir a Productos</Button>
      </Link>
    </div>
  );
}
