
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" variant="full" className="sm:hidden" />
            <Logo size="md" variant="full" className="hidden sm:block" />
          </Link>

          {/* Action Buttons - Only show login/signup for non-authenticated users */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {!user && (
              <>
                <Button 
                  variant="outline" 
                  className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2"
                  asChild
                >
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 border-0 transition-colors text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2 text-white"
                  asChild
                >
                  <Link to="/auth">Começar Grátis</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
