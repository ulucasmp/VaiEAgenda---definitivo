
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa } from '@/hooks/useEmpresa';
import Logo from '@/components/Logo';

const DashboardNew = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { empresa, profissionais, loading: empresaLoading, addProfissional, updateProfissional, deleteProfissional } = useEmpresa();
  const { toast } = useToast();
  const [isAddingProfissional, setIsAddingProfissional] = useState(false);
  const [editingProfissional, setEditingProfissional] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to setup if no company
  if (!empresa && !empresaLoading && !authLoading) {
    return <Navigate to="/empresa-setup" replace />;
  }

  const handleAddProfissional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!empresa) return;

    setIsAddingProfissional(true);

    const formData = new FormData(e.currentTarget);
    const profissionalData = {
      empresa_id: empresa.id,
      nome: formData.get('nome') as string,
      especialidade: formData.get('especialidade') as string,
      horarios_disponiveis: null,
      ativo: true,
    };

    const { error } = await addProfissional(profissionalData);

    if (error) {
      toast({
        title: "Erro ao adicionar profissional",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profissional adicionado com sucesso!",
      });
      setDialogOpen(false);
      (e.target as HTMLFormElement).reset();
    }

    setIsAddingProfissional(false);
  };

  const handleEditProfissional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProfissional) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      nome: formData.get('nome') as string,
      especialidade: formData.get('especialidade') as string,
    };

    const { error } = await updateProfissional(editingProfissional.id, updates);

    if (error) {
      toast({
        title: "Erro ao atualizar profissional",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profissional atualizado com sucesso!",
      });
      setEditingProfissional(null);
    }
  };

  const handleDeleteProfissional = async (id: string) => {
    const { error } = await deleteProfissional(id);

    if (error) {
      toast({
        title: "Erro ao remover profissional",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profissional removido com sucesso!",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Logout realizado com sucesso!",
    });
  };

  if (authLoading || empresaLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo size="sm" variant="full" />
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {empresa?.nome_negocio}
                </h1>
                <p className="text-sm text-gray-500">{empresa?.tipo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg">{empresa?.nome_negocio}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-lg">{empresa?.tipo}</p>
              </div>
              {empresa?.telefone && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p className="text-lg">{empresa.telefone}</p>
                </div>
              )}
              {empresa?.endereco && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p className="text-lg">{empresa.endereco}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Professionals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Profissionais</CardTitle>
                <CardDescription>
                  Gerencie os profissionais da sua empresa
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Profissional
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Profissional</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do novo profissional
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddProfissional} className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        name="nome"
                        required
                        placeholder="Nome do profissional"
                        disabled={isAddingProfissional}
                      />
                    </div>
                    <div>
                      <Label htmlFor="especialidade">Especialidade *</Label>
                      <Input
                        id="especialidade"
                        name="especialidade"
                        required
                        placeholder="Ex: Cabeleireiro, Barbeiro, Manicure"
                        disabled={isAddingProfissional}
                      />
                    </div>
                    <Button type="submit" disabled={isAddingProfissional}>
                      {isAddingProfissional ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {profissionais.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum profissional cadastrado ainda.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profissionais.map((profissional) => (
                  <Card key={profissional.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{profissional.nome}</h3>
                          <p className="text-sm text-gray-500">{profissional.especialidade}</p>
                        </div>
                        <Badge variant={profissional.ativo ? "default" : "secondary"}>
                          {profissional.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProfissional(profissional)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProfissional(profissional.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Professional Dialog */}
        {editingProfissional && (
          <Dialog open={!!editingProfissional} onOpenChange={() => setEditingProfissional(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Profissional</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditProfissional} className="space-y-4">
                <div>
                  <Label htmlFor="edit-nome">Nome *</Label>
                  <Input
                    id="edit-nome"
                    name="nome"
                    required
                    defaultValue={editingProfissional.nome}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-especialidade">Especialidade *</Label>
                  <Input
                    id="edit-especialidade"
                    name="especialidade"
                    required
                    defaultValue={editingProfissional.especialidade}
                  />
                </div>
                <Button type="submit">Atualizar</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

export default DashboardNew;
