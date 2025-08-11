import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CreditCard, TrendingUp } from 'lucide-react';
import { usePlanContext } from '@/context/PlanContext';

export function ExcedenteModal() {
  const { 
    plan, 
    totalProfissionais, 
    totalAgendamentosMes,
    isOverLimit,
    excedentes 
  } = usePlanContext();
  
  const [open, setOpen] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  useEffect(() => {
    if (!plan || hasShownThisSession) return;
    
    const hasExcedente = isOverLimit('agendamentos') || isOverLimit('profissionais');
    
    if (hasExcedente) {
      setOpen(true);
      setHasShownThisSession(true);
    }
  }, [plan, isOverLimit, hasShownThisSession]);

  if (!plan) return null;

  const excedenteAgendamentos = Math.max(0, totalAgendamentosMes - plan.max_agendamentos_mes);
  const excedenteProfissionais = Math.max(0, totalProfissionais - plan.max_profissionais);
  const valorExtraAgendamentos = excedenteAgendamentos * plan.excedente_valor;
  const valorExtraProfissionais = excedenteProfissionais * plan.excedente_valor;
  const valorTotalExtra = valorExtraAgendamentos + valorExtraProfissionais;

  const handleUpgrade = () => {
    setOpen(false);
    // Aqui será integrada a funcionalidade de upgrade futura
    alert('Funcionalidade de upgrade em desenvolvimento! Em breve você poderá alterar seu plano diretamente.');
  };

  const handleDismiss = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Limite do plano ultrapassado
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Você ultrapassou os limites do seu plano <strong>{plan.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detalhamento dos excedentes */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-3">Excedentes detectados:</h4>
            
            {excedenteAgendamentos > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-700">
                  📅 {excedenteAgendamentos} agendamento(s) extra
                </span>
                <Badge variant="secondary">
                  R$ {valorExtraAgendamentos.toFixed(2)}
                </Badge>
              </div>
            )}
            
            {excedenteProfissionais > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-orange-700">
                  👥 {excedenteProfissionais} profissional(is) extra
                </span>
                <Badge variant="secondary">
                  R$ {valorExtraProfissionais.toFixed(2)}
                </Badge>
              </div>
            )}

            <div className="pt-2 mt-3 border-t border-orange-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-orange-800">Total adicional:</span>
                <Badge className="bg-orange-600 hover:bg-orange-700">
                  R$ {valorTotalExtra.toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Explicação da cobrança */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Como funciona a cobrança:</p>
                <ul className="space-y-1 text-xs">
                  <li>• O valor extra será cobrado na sua próxima fatura</li>
                  <li>• A cobrança é válida apenas para este ciclo atual</li>
                  <li>• No próximo mês, os contadores serão zerados</li>
                  <li>• Você pode fazer upgrade para evitar cobranças extras</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Fazer Upgrade
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="flex-1"
            >
              Entendi
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            💡 Dica: Planos superiores têm limites maiores e valores de excedente menores
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
