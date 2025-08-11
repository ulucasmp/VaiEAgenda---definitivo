
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Clock } from 'lucide-react';

interface WorkingHours {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  active: boolean;
  workingHours?: WorkingHours[];
}

interface ProfessionalFormProps {
  professional?: Professional;
  onSave: (professional: Omit<Professional, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const ProfessionalForm = ({ professional, onSave, onCancel }: ProfessionalFormProps) => {
  const defaultWorkingHours: WorkingHours[] = [
    { day: 'Segunda-feira', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Terça-feira', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Quarta-feira', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Quinta-feira', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Sexta-feira', enabled: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Sábado', enabled: true, startTime: '08:00', endTime: '16:00' },
    { day: 'Domingo', enabled: false, startTime: '08:00', endTime: '16:00' },
  ];

  const [formData, setFormData] = useState({
    name: professional?.name || '',
    specialty: professional?.specialty || '',
    phone: professional?.phone || '',
    email: professional?.email || '',
    active: professional?.active ?? true,
    workingHours: professional?.workingHours || defaultWorkingHours
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.specialty.trim() && formData.phone.trim() && formData.email.trim()) {
      onSave({
        ...formData,
        id: professional?.id
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: prev.workingHours.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {professional ? 'Editar Profissional' : 'Adicionar Profissional'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Ana Costa"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="specialty">Especialidade</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="Ex: Cabeleireira"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="active"
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="active">Profissional ativo</Label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <Label className="text-lg font-medium">Horários de Atendimento</Label>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700 mb-4">
                  Configure os dias e horários em que este profissional atende. 
                  Estes horários devem estar dentro do funcionamento geral da empresa.
                </p>
                
                <div className="space-y-3">
                  {formData.workingHours.map((workingDay, index) => (
                    <div key={workingDay.day} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2 min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={workingDay.enabled}
                          onChange={(e) => handleWorkingHoursChange(index, 'enabled', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label className="text-sm font-medium">{workingDay.day}</Label>
                      </div>
                      
                      {workingDay.enabled && (
                        <div className="flex items-center gap-2 flex-1">
                          <Label className="text-sm text-gray-600">Das</Label>
                          <Input
                            type="time"
                            value={workingDay.startTime}
                            onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                            className="w-24"
                          />
                          <Label className="text-sm text-gray-600">às</Label>
                          <Input
                            type="time"
                            value={workingDay.endTime}
                            onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                            className="w-24"
                          />
                        </div>
                      )}
                      
                      {!workingDay.enabled && (
                        <div className="flex-1">
                          <span className="text-sm text-gray-500">Não atende</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {professional ? 'Salvar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalForm;
