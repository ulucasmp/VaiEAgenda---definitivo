import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useBloqueios } from '@/hooks/useBloqueios';
import { useAppointments } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';

interface BloqueioModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresaId: string;
  selectedDate?: Date;
  bloqueio?: {
    id: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    descricao?: string;
  };
}

const BloqueioModal = ({ isOpen, onClose, empresaId, selectedDate, bloqueio }: BloqueioModalProps) => {
  const [date, setDate] = useState<Date>(
    bloqueio ? new Date(bloqueio.data) : selectedDate || new Date()
  );
  const [horaInicio, setHoraInicio] = useState(bloqueio?.hora_inicio || '09:00');
  const [horaFim, setHoraFim] = useState(bloqueio?.hora_fim || '10:00');
  const [descricao, setDescricao] = useState(bloqueio?.descricao || '');
  const [loading, setLoading] = useState(false);

  const { createBloqueio, updateBloqueio } = useBloqueios(empresaId);
  const { isTimeBooked } = useAppointments(empresaId);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validações
    if (horaInicio >= horaFim) {
      toast({
        title: "Erro",
        description: "A hora de início deve ser anterior à hora de término.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Verificar se há agendamentos no período
    if (isTimeBooked(date, horaInicio)) {
      toast({
        title: "Erro",
        description: "Já existe um agendamento confirmado neste horário.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const bloqueioData = {
      empresa_id: empresaId,
      data: format(date, 'yyyy-MM-dd'),
      hora_inicio: horaInicio + ':00',
      hora_fim: horaFim + ':00',
      descricao: descricao || null,
    };

    let result;
    if (bloqueio) {
      result = await updateBloqueio(bloqueio.id, bloqueioData);
    } else {
      result = await createBloqueio(bloqueioData);
    }

    if (result.success) {
      toast({
        title: "Sucesso",
        description: bloqueio ? "Bloqueio atualizado com sucesso!" : "Horário bloqueado com sucesso!",
      });
      onClose();
    } else {
      toast({
        title: "Erro",
        description: "Erro ao salvar o bloqueio. Tente novamente.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const resetForm = () => {
    setDate(selectedDate || new Date());
    setHoraInicio('09:00');
    setHoraFim('10:00');
    setDescricao('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {bloqueio ? 'Editar Bloqueio' : 'Bloquear Horário'}
          </DialogTitle>
          <DialogDescription>
            {bloqueio 
              ? 'Edite as informações do bloqueio de horário.'
              : 'Bloqueie um horário para que não possa ser agendado por clientes.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora-inicio">Hora de Início</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hora-inicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora-fim">Hora de Término</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hora-fim"
                  type="time"
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Motivo do bloqueio..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (bloqueio ? 'Atualizar' : 'Bloquear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BloqueioModal;