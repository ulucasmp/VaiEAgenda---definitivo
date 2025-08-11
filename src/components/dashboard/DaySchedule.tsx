import { format } from 'date-fns';
import { X, Clock, User, Phone, Mail, Lock, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useBloqueios } from '@/hooks/useBloqueios';
import { useEmpresa } from '@/hooks/useEmpresa';
import BloqueioModal from './BloqueioModal';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email: string | null;
  data_agendamento: string;
  horario: string;
  status: string;
  servico: {
    nome: string;
    preco: number;
  } | null;
  profissional: {
    nome: string;
  } | null;
}

interface DayScheduleProps {
  selectedDate: Date;
  onClose: () => void;
  appointments: Appointment[];
}

const DaySchedule = ({ selectedDate, onClose, appointments }: DayScheduleProps) => {
  const [showBloqueioModal, setShowBloqueioModal] = useState(false);
  const [editingBloqueio, setEditingBloqueio] = useState<any>(null);
  
  const { empresa } = useEmpresa();
  const { getBloqueiosByDate, deleteBloqueio } = useBloqueios(empresa?.id);
  const { toast } = useToast();
  
  const bloqueios = getBloqueiosByDate(selectedDate);
  
  const statusColors = {
    'agendado - pendente de confirmação': 'bg-yellow-100 text-yellow-800',
    'confirmado': 'bg-green-100 text-green-800',
    'cancelado': 'bg-red-100 text-red-800',
    'concluído': 'bg-blue-100 text-blue-800',
  };

  const handleDeleteBloqueio = async (id: string) => {
    const result = await deleteBloqueio(id);
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Bloqueio removido com sucesso!",
      });
    } else {
      toast({
        title: "Erro", 
        description: "Erro ao remover o bloqueio. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditBloqueio = (bloqueio: any) => {
    setEditingBloqueio(bloqueio);
    setShowBloqueioModal(true);
  };

  const handleCloseBloqueioModal = () => {
    setShowBloqueioModal(false);
    setEditingBloqueio(null);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Agenda - {format(selectedDate, 'dd/MM/yyyy')}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBloqueioModal(true)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Bloquear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seção de Bloqueios */}
        {bloqueios.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Lock className="h-4 w-4" />
              Horários Bloqueados
            </h3>
            {bloqueios.map((bloqueio) => (
              <div
                key={bloqueio.id}
                className="p-3 border rounded-lg bg-gray-50 border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700">
                      {bloqueio.hora_inicio.slice(0, 5)} - {bloqueio.hora_fim.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBloqueio(bloqueio)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBloqueio(bloqueio.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {bloqueio.descricao && (
                  <p className="text-sm text-gray-600 ml-6">{bloqueio.descricao}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Seção de Agendamentos */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Agendamentos
          </h3>
          {appointments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{appointment.horario.slice(0, 5)}</span>
                  </div>
                  <Badge 
                    className={`${statusColors[appointment.status as keyof typeof statusColors]} text-xs`}
                  >
                    {appointment.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{appointment.cliente_nome}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{appointment.cliente_telefone}</span>
                  </div>
                  
                  {appointment.cliente_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{appointment.cliente_email}</span>
                    </div>
                  )}
                  
                  {appointment.servico && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="font-medium">{appointment.servico.nome}</p>
                      <p className="text-gray-600">R$ {appointment.servico.preco}</p>
                    </div>
                  )}
                  
                  {appointment.profissional && (
                    <div className="text-gray-600">
                      Profissional: {appointment.profissional.nome}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {/* Modal de Bloqueio */}
      {empresa && (
        <BloqueioModal
          isOpen={showBloqueioModal}
          onClose={handleCloseBloqueioModal}
          empresaId={empresa.id}
          selectedDate={selectedDate}
          bloqueio={editingBloqueio}
        />
      )}
    </Card>
  );
};

export default DaySchedule;