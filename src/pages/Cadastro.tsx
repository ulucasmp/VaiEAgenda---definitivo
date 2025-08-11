
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    // Validações básicas
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simular criação de conta (aqui você integraria com sua API)
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar dados básicos no localStorage para demonstração
      localStorage.setItem('user', JSON.stringify({ name, email }));
      localStorage.setItem('isAuthenticated', 'true');

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a), ${name}!`,
      });

      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" variant="full" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta grátis
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              entre na sua conta existente
            </Link>
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1"
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar senha</Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                Concordo com os{' '}
                <Link to="/termos" className="text-blue-600 hover:text-blue-500">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacidade" className="text-blue-600 hover:text-blue-500">
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta grátis'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ✓ Sem cartão de crédito • ✓ 7 dias grátis • ✓ Cancele quando quiser
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
