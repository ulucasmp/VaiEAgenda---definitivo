import React, { useState } from 'react';
import { Plus, User, Edit, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ProfessionalForm from './ProfessionalForm';
import ProfessionalSchedule from './ProfessionalSchedule';

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

interface ProfessionalsTabProps {
  professionals: Professional[];
}

const ProfessionalsTab = ({ professionals }: ProfessionalsTabProps) => {
  const { toast } = useToast();
  const [professionalsList, setProfessionalsList] = useState(professionals);
  const [showForm, setShowForm] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | undefined>();
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');

  const handleAddProfessional = () => {
    setEditingProfessional(undefined);
    setShowForm(true);
  };

  const handleViewSchedule = (professionalName: string) => {
    setSelectedProfessional(professionalName);
    setShowSchedule(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional);
    setShowForm(true);
  };

  const handleSaveProfessional = (professionalData: Omit<Professional, 'id'> & { id?: string }) => {
    if (professionalData.id) {
      // Editando profissional existente
      setProfessionalsList(prev => prev.map(professional => 
        professional.id === professionalData.id 
          ? { ...professionalData, id: professionalData.id }
          : professional
      ));
      toast({
        title: "Profissional atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Adicionando novo profissional
      const newProfessional = {
        ...professionalData,
        id: `prof_${Date.now()}`
      };
      setProfessionalsList(prev => [...prev, newProfessional]);
      toast({
        title: "Profissional adicionado",
        description: "O novo profissional foi cadastrado com sucesso.",
      });
    }
    setShowForm(false);
    setEditingProfessional(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProfessional(undefined);
  };

  const getWorkingDaysSummary = (workingHours?: WorkingHours[]) => {
    if (!workingHours) return 'Não configurado';
    
    const enabledDays = workingHours.filter(day => day.enabled);
    if (enabledDays.length === 0) return 'Nenhum dia configurado';
    
    const dayAbbreviations = {
      'Segunda-feira': 'Seg',
      'Terça-feira': 'Ter',
      'Quarta-feira': 'Qua',
      'Quinta-feira': 'Qui',
      'Sexta-feira': 'Sex',
      'Sábado': 'Sáb',
      'Domingo': 'Dom'
    };
    
    return enabledDays.map(workingDay => dayAbbreviations[workingDay.day as keyof typeof dayAbbreviations] || workingDay.day.substring(0, 3)).join(', ');
  };

  return (
    <TabsContent value="professionals" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipe de Profissionais</h2>
        <Button 
          onClick={handleAddProfessional}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Profissional
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {professionalsList.map((professional) => (
          <Card key={professional.id} className="border-blue-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{professional.name}</h3>
                  <p className="text-sm text-gray-600">{professional.specialty}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    professional.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {professional.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Telefone:</p>
                <p className="font-medium">{professional.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email:</p>
                <p className="font-medium">{professional.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Dias de trabalho:
                </p>
                <p className="font-medium text-sm">{getWorkingDaysSummary(professional.workingHours)}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleViewSchedule(professional.name)}
                >
                  Ver Agenda
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => handleEditProfessional(professional)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <ProfessionalForm
          professional={editingProfessional}
          onSave={handleSaveProfessional}
          onCancel={handleCancelForm}
        />
      )}

      {showSchedule && (
        <ProfessionalSchedule
          professionalName={selectedProfessional}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </TabsContent>
  );
};

export default ProfessionalsTab;
