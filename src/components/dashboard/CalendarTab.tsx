import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MonthlyCalendar from './MonthlyCalendar';
import DaySchedule from './DaySchedule';
import { useEmpresa } from '@/hooks/useEmpresa';
import { useAppointments } from '@/hooks/useAppointments';

const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDaySchedule, setShowDaySchedule] = useState(false);
  const { empresa } = useEmpresa();
  const { appointments, getAppointmentsByDate, getAppointmentCountByDate } = useAppointments(empresa?.id);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowDaySchedule(true);
  };

  const handleCloseDaySchedule = () => {
    setShowDaySchedule(false);
  };

  return (
    <TabsContent value="calendar" className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlyCalendar 
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            getAppointmentCount={getAppointmentCountByDate}
          />
        </div>
        <div className="lg:col-span-1">
          {showDaySchedule ? (
            <DaySchedule 
              selectedDate={selectedDate}
              onClose={handleCloseDaySchedule}
              appointments={getAppointmentsByDate(selectedDate)}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              <p>Selecione uma data no calendário para ver os agendamentos do dia</p>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default CalendarTab;