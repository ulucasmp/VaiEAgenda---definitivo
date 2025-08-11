
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useServicos } from '@/hooks/useServicos';
import { useEmpresa } from '@/hooks/useEmpresa';
import ServiceForm from './ServiceForm';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

interface ServicesTabProps {
  services?: Service[];
}

const ServicesTab = ({ services = [] }: ServicesTabProps) => {
  const { toast } = useToast();
  const { empresa } = useEmpresa();
  const { servicos, addServico, updateServico, deleteServico } = useServicos(empresa?.id);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(undefined);

  const handleAddService = () => {
    setEditingService(undefined);
    setShowForm(true);
  };

  const handleEditService = (servico: any) => {
    setEditingService({
      id: servico.id,
      name: servico.nome,
      price: servico.preco,
      duration: servico.duracao_em_minutos,
      active: servico.ativo
    });
    setShowForm(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    const { error } = await deleteServico(serviceId);
    
    if (error) {
      toast({
        title: "Erro ao excluir serviço",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Serviço excluído",
        description: "O serviço foi removido com sucesso.",
      });
    }
  };

  const handleSaveService = async (serviceData: any) => {
    if (!empresa?.id) return;

    const servicoData = {
      empresa_id: empresa.id,
      nome: serviceData.name,
      preco: serviceData.price,
      duracao_em_minutos: serviceData.duration,
      ativo: serviceData.active
    };

    if (serviceData.id) {
      // Editando serviço existente
      const { error } = await updateServico(serviceData.id, servicoData);
      
      if (error) {
        toast({
          title: "Erro ao atualizar serviço",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Serviço atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      }
    } else {
      // Adicionando novo serviço
      const { error } = await addServico(servicoData);
      
      if (error) {
        toast({
          title: "Erro ao adicionar serviço",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Serviço adicionado",
          description: "O novo serviço foi criado com sucesso.",
        });
      }
    }
    
    setShowForm(false);
    setEditingService(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingService(undefined);
  };

  return (
    <TabsContent value="services" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Serviços Oferecidos</h2>
        <Button 
          onClick={handleAddService}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicos.map((servico) => (
                <TableRow key={servico.id}>
                  <TableCell className="font-medium">{servico.nome}</TableCell>
                  <TableCell>R$ {Number(servico.preco).toFixed(2)}</TableCell>
                  <TableCell>{servico.duracao_em_minutos} min</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      servico.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleEditService(servico)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o serviço "{servico.nome}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteService(servico.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={handleCancelForm}
        />
      )}
    </TabsContent>
  );
};

export default ServicesTab;
