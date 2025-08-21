
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { empresaSetupSchema } from '@/utils/validation';
import { sanitizeInput, sanitizeName } from '@/utils/validation';
import Logo from '@/components/Logo';

const EmpresaSetup = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmpresa, setHasEmpresa] = useState(false);
  const [checkingEmpresa, setCheckingEmpresa] = useState(true);
  const [errors, setErrors] = useState<{
    nome_negocio?: string;
    tipo?: string;
    telefone?: string;
    endereco?: string;
  }>({});

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user already has a company
  useEffect(() => {
    const checkExistingEmpresa = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setHasEmpresa(true);
      }
      setCheckingEmpresa(false);
    };

    checkExistingEmpresa();
  }, [user]);

  // Redirect to dashboard if already has company
  if (hasEmpresa && !checkingEmpresa) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (formData: FormData) => {
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string || '',
      address: formData.get('address') as string || ''
    };

    try {
      empresaSetupSchema.parse(data);
      setErrors({});
      return { isValid: true, data };
    } catch (error: any) {
      const newErrors: typeof errors = {};
      
      error.errors.forEach((err: any) => {
        const field = err.path[0];
        newErrors[field as keyof typeof errors] = err.message;
      });
      
      setErrors(newErrors);
      return { isValid: false, data };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Sanitize inputs
    const name = sanitizeName(formData.get('name') as string);
    const phone = sanitizeInput(formData.get('phone') as string);
    const address = sanitizeInput(formData.get('address') as string);

    // Create new FormData with sanitized values
    const sanitizedFormData = new FormData();
    sanitizedFormData.set('name', name);
    sanitizedFormData.set('phone', phone);
    sanitizedFormData.set('address', address);

    const validation = validateForm(sanitizedFormData);
    
    if (!validation.isValid) {
      setIsLoading(false);
      return;
    }

    const empresaData = {
      id: user.id,
      name: validation.data.name,
      phone: validation.data.phone || null,
      address: validation.data.address,
      // slug e link_agendamento serão gerados automaticamente pelos triggers do banco
    };

    console.log('Dados da empresa a serem inseridos:', empresaData);

    const { data, error } = await supabase
      .from('companies')
      .insert([empresaData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao cadastrar empresa:', error);
      toast({
        title: "Erro ao cadastrar empresa",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Empresa cadastrada com sucesso!",
        description: `Sua URL pública: /agendamento/${data.slug}`,
      });
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  if (loading || checkingEmpresa) {
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
            Cadastre sua empresa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados da sua empresa para começar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Estas informações aparecerão para seus clientes. O link público será gerado automaticamente baseado no nome da empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Negócio *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Ex: Salão Beleza Total"
                  disabled={isLoading}
                  maxLength={150}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Será usado para gerar sua URL pública automaticamente
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  disabled={isLoading}
                  maxLength={20}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Rua, número, bairro, cidade"
                  disabled={isLoading}
                  maxLength={255}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar Empresa'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaSetup;
