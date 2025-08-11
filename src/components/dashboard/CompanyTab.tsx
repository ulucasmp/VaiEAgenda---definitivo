
import React, { useState, useEffect } from 'react';
import { ExternalLink, Upload, X, Image, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useEmpresa } from '@/hooks/useEmpresa';
import { supabase } from '@/integrations/supabase/client';

const CompanyTab = () => {
  const { toast } = useToast();
  const { empresa } = useEmpresa();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessPhotoPreview, setBusinessPhotoPreview] = useState<string | null>(null);
  const [workingHours, setWorkingHours] = useState({
    segunda: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    terca: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    quarta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    quinta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    sexta: { active: true, shifts: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }] },
    sabado: { active: false, shifts: [] },
    domingo: { active: false, shifts: [] }
  });

  // Função para migrar formato antigo para novo formato
  const migrateOldFormat = (oldHours: any) => {
    const newFormat: any = {};
    
    Object.keys(oldHours).forEach(day => {
      const dayData = oldHours[day];
      
      // Se já está no novo formato, manter
      if (dayData.shifts) {
        newFormat[day] = dayData;
      } else {
        // Migrar do formato antigo para novo
        if (dayData.active && dayData.start && dayData.end) {
          // Dividir em dois turnos padrão: manhã e tarde
          const startTime = dayData.start;
          const endTime = dayData.end;
          
          // Se o horário é contínuo (mais de 6 horas), dividir em dois turnos
          const [startHour] = startTime.split(':').map(Number);
          const [endHour] = endTime.split(':').map(Number);
          const totalHours = endHour - startHour;
          
          if (totalHours > 6) {
            newFormat[day] = {
              active: true,
              shifts: [
                { start: '08:00', end: '12:00' },
                { start: '14:00', end: '18:00' }
              ]
            };
          } else {
            // Manter como um turno só
            newFormat[day] = {
              active: true,
              shifts: [{ start: startTime, end: endTime }]
            };
          }
        } else {
          // Dia inativo
          newFormat[day] = {
            active: false,
            shifts: []
          };
        }
      }
    });
    
    return newFormat;
  };

  // Carrega os dados da empresa quando o componente monta ou empresa muda
  useEffect(() => {
    if (empresa) {
      setFormData({
        name: empresa.nome_negocio || '',
        address: empresa.endereco || '',
        phone: empresa.telefone || '',
      });
      
      // Carregar horários de funcionamento salvos ou usar padrão
      if (empresa.horarios_funcionamento) {
        const migratedHours = migrateOldFormat(empresa.horarios_funcionamento);
        setWorkingHours(migratedHours);
      }
    }
  }, [empresa]);

  // Use o link_agendamento salvo no banco, com fallback para o slug
  const generateBookingLink = (): string => {
    if (empresa?.link_agendamento) return empresa.link_agendamento;
    if (!empresa?.slug) return '';
    const currentDomain = window.location.origin;
    return `${currentDomain}/agendamento/${empresa.slug}`;
  };

  const bookingLink = generateBookingLink();

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'photo') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') {
          setLogoPreview(result);
        } else {
          setBusinessPhotoPreview(result);
        }
      };
      reader.readAsDataURL(file);

      toast({
        title: "Imagem carregada",
        description: `${type === 'logo' ? 'Logo' : 'Foto do negócio'} carregada com sucesso!`
      });
    }
  };

  const removeImage = (type: 'logo' | 'photo') => {
    if (type === 'logo') {
      setLogoPreview(null);
    } else {
      setBusinessPhotoPreview(null);
    }
    toast({
      title: "Imagem removida",
      description: `${type === 'logo' ? 'Logo' : 'Foto do negócio'} removida com sucesso!`
    });
  };

  const handleWorkingHourChange = (day: string, field: 'active', value: boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleShiftChange = (day: string, shiftIndex: number, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => {
      const dayData = prev[day as keyof typeof prev];
      const newShifts = [...dayData.shifts];
      newShifts[shiftIndex] = { ...newShifts[shiftIndex], [field]: value };
      
      return {
        ...prev,
        [day]: {
          ...dayData,
          shifts: newShifts
        }
      };
    });
  };

  const addShift = (day: string) => {
    setWorkingHours(prev => {
      const dayData = prev[day as keyof typeof prev];
      return {
        ...prev,
        [day]: {
          ...dayData,
          shifts: [...dayData.shifts, { start: '09:00', end: '17:00' }]
        }
      };
    });
  };

  const removeShift = (day: string, shiftIndex: number) => {
    setWorkingHours(prev => {
      const dayData = prev[day as keyof typeof prev];
      const newShifts = dayData.shifts.filter((_, index) => index !== shiftIndex);
      
      return {
        ...prev,
        [day]: {
          ...dayData,
          shifts: newShifts
        }
      };
    });
  };

  const handleSaveChanges = async () => {
    if (!empresa) return;

    try {
      // IMPORTANTE: Não atualizar o slug - ele permanece fixo após a criação
      const { error } = await supabase
        .from('empresas')
        .update({
          nome_negocio: formData.name,
          endereco: formData.address,
          telefone: formData.phone,
          horarios_funcionamento: workingHours,
          // slug NÃO é atualizado - permanece fixo para sempre
        })
        .eq('id', empresa.id);

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Alterações salvas",
        description: "As informações da empresa foram salvas com sucesso! O link de agendamento permanece o mesmo."
      });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = async () => {
    if (!bookingLink) {
      toast({
        title: "Link não disponível",
        description: "O slug da empresa não foi encontrado.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(bookingLink);
      toast({
        title: "Link copiado",
        description: "Link de agendamento copiado para a área de transferência!"
      });
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleViewBookingPage = () => {
    if (!bookingLink) {
      toast({
        title: "Link não disponível",
        description: "O slug da empresa não foi encontrado.",
        variant: "destructive",
      });
      return;
    }
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
  };

  if (!empresa) {
    return (
      <TabsContent value="company" className="space-y-6">
        <div className="text-center py-8">
          <p>Carregando dados da empresa...</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="company" className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo da Empresa */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo da Empresa</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-blue-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-blue-300" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {logoPreview ? 'Alterar Logo' : 'Carregar Logo'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Alterar o nome não afetará o link de agendamento, que permanece fixo.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            {/* Horário de Funcionamento */}
            <div>
              <label className="block text-sm font-medium mb-3">Horário de Funcionamento</label>
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={workingHours[key as keyof typeof workingHours].active}
                          onCheckedChange={(checked) => 
                            handleWorkingHourChange(key, 'active', checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={key} 
                          className="text-sm font-medium min-w-[100px]"
                        >
                          {label}
                        </label>
                      </div>
                      
                      {workingHours[key as keyof typeof workingHours].active && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addShift(key)}
                          className="h-6 px-2 text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Turno
                        </Button>
                      )}
                    </div>
                    
                    {workingHours[key as keyof typeof workingHours].active && (
                      <div className="space-y-2 ml-6">
                        {workingHours[key as keyof typeof workingHours].shifts.map((shift, shiftIndex) => (
                          <div key={shiftIndex} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={shift.start}
                              onChange={(e) => handleShiftChange(key, shiftIndex, 'start', e.target.value)}
                              className="px-2 py-1 border border-blue-200 rounded text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                            />
                            <span className="text-sm text-gray-500">às</span>
                            <input
                              type="time"
                              value={shift.end}
                              onChange={(e) => handleShiftChange(key, shiftIndex, 'end', e.target.value)}
                              className="px-2 py-1 border border-blue-200 rounded text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                            />
                            {workingHours[key as keyof typeof workingHours].shifts.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeShift(key, shiftIndex)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!workingHours[key as keyof typeof workingHours].active && (
                      <div className="ml-6">
                        <span className="text-sm text-gray-500">Fechado</span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-xs text-gray-600">
                    💡 <strong>Dica:</strong> Os intervalos entre turnos (ex: 12:00-14:00) não estarão disponíveis para agendamento no link público.
                  </p>
                </div>
              </div>
            </div>

            {/* Foto do Negócio */}
            <div>
              <label className="block text-sm font-medium mb-2">Foto do Negócio (Opcional)</label>
              <div className="space-y-3">
                {businessPhotoPreview && (
                  <div className="relative">
                    <img 
                      src={businessPhotoPreview} 
                      alt="Foto do negócio" 
                      className="w-full h-32 object-cover rounded-lg border border-blue-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => removeImage('photo')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="business-photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                  />
                  <label
                    htmlFor="business-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {businessPhotoPreview ? 'Alterar Foto' : 'Carregar Foto do Negócio'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB - Esta foto será exibida na sua página de agendamento</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              onClick={handleSaveChanges}
            >
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Link de Agendamento */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Link de Agendamento
              <ExternalLink className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingLink ? (
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-2">Seu link personalizado fixo:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white p-2 rounded border text-sm text-blue-600 break-all">
                      {bookingLink}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={handleCopyLink}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Compartilhe este link com seus clientes para que eles possam agendar diretamente. 
                  <strong> Este link é fixo e não muda mesmo que você altere o nome da empresa.</strong>
                </p>
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={handleViewBookingPage}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visualizar Página de Agendamento
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Slug da empresa não encontrado.</p>
                <p className="text-sm text-gray-500 mt-2">Entre em contato com o suporte.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default CompanyTab;
