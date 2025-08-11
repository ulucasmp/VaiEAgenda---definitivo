
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Logo from '../Logo';

interface DashboardHeaderProps {
  companyName: string;
}

const DashboardHeader = ({ companyName }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado com sucesso!",
    });
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <>
      {/* Header with Logo and User Actions */}
      <header className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo size="sm" variant="full" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{companyName}</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Olá, {companyName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Hoje</p>
            <p className="text-xl font-semibold text-gray-900 capitalize">
              {formatDate()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
