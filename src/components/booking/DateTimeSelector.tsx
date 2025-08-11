
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  availableTimes: string[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
}

const DateTimeSelector = ({ 
  selectedDate, 
  selectedTime, 
  availableTimes, 
  onDateSelect, 
  onTimeSelect 
}: DateTimeSelectorProps) => {
  return (
    <>
      {/* Seleção de data */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Escolha a Data *
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Seleção de horário */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Clock className="w-4 h-4 inline mr-1" />
          Escolha o Horário *
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => (
              <button
                key={time}
                className={`p-3 text-sm border rounded-lg transition-all ${
                  selectedTime === time
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onTimeSelect(time)}
              >
                {time}
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">
              <p>Nenhum horário disponível para esta data.</p>
              <p className="text-sm">Escolha outra data ou entre em contato.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DateTimeSelector;
