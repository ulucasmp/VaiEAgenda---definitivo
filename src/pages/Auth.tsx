
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { emailSchema } from '@/utils/validation';
import { sanitizeInput } from '@/utils/validation';
import Logo from '@/components/Logo';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = crypto.randomUUID();
    setCsrfToken(token);
  }, []);

  // Redirect if already authenticated
  if (user && !loading) {
    return <Navigate to="/empresa-setup" replace />;
  }

  const validateEmail = (email: string): string | null => {
    try {
      emailSchema.parse(email);
      return null;
    } catch (error: any) {
      return error.errors[0]?.message || 'Email inválido';
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (password.length > 128) {
      return 'A senha deve ter no máximo 128 caracteres';
    }
    return null;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = sanitizeInput(formData.get('email') as string);
    const password = formData.get('password') as string;
    const submittedCsrfToken = formData.get('csrfToken') as string;

    // CSRF validation
    if (submittedCsrfToken !== csrfToken) {
      toast({
        title: "Erro de segurança",
        description: "Token de segurança inválido. Recarregue a página.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate inputs
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrors({ password: 'Senha é obrigatória' });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      // Generic error message to prevent user enumeration
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Verifique seu email e senha.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = sanitizeInput(formData.get('email') as string);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const submittedCsrfToken = formData.get('csrfToken') as string;

    // CSRF validation
    if (submittedCsrfToken !== csrfToken) {
      toast({
        title: "Erro de segurança",
        description: "Token de segurança inválido. Recarregue a página.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate inputs
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);

      return;
    }

    const { error } = await signUp(email, password);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: "Conta já existe",
          description: "Este email já está cadastrado. Tente fazer login.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="lg" variant="full" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Gerencie seus agendamentos
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema completo para salões de beleza e barbearias
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acesse sua conta</CardTitle>
            <CardDescription>
              Entre ou crie uma conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      disabled={isLoading}
                      maxLength={255}
                      autoComplete="email"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      disabled={isLoading}
                      maxLength={128}
                      autoComplete="current-password"
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      disabled={isLoading}
                      maxLength={255}
                      autoComplete="email"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      disabled={isLoading}
                      maxLength={128}
                      autoComplete="new-password"
                      className={errors.password ? 'border-red-500' : ''}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 6 caracteres
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      disabled={isLoading}
                      maxLength={128}
                      autoComplete="new-password"
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
