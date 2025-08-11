
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const RecuperarSenha = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    // Simular envio de email de recuperação
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para recuperar sua senha.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Logo size="lg" variant="full" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Email enviado!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.
            </p>
          </div>

          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-6">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => setEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Enviar novamente
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="lg" variant="full" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Recuperar senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite seu email para receber instruções de recuperação de senha.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecuperarSenha;
