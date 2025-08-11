
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Caminho acessado: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
