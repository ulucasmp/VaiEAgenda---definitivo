import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { usePlan } from '../hooks/usePlan';
import type { PlanUsage } from '../types/plans';

interface PlanContextType extends PlanUsage {
  hasFeature: (feature: string) => boolean;
  isOverLimit: (type: 'profissionais' | 'agendamentos') => boolean;
  canAddProfessional: () => boolean;
  canAddAppointment: () => boolean;
}

const PlanContext = createContext<PlanContextType | null>(null);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const { user } = useAuth();
  const companyId = user?.company_id;
  const planData = usePlan(companyId);

  const hasFeature = (feature: string): boolean => {
    if (!planData.plan?.features) return false;
    return planData.plan.features[feature] === true;
  };

  const isOverLimit = (type: 'profissionais' | 'agendamentos'): boolean => {
    if (!planData.plan) return false;
    
    if (type === 'profissionais') {
      return planData.totalProfissionais > planData.plan.max_profissionais;
    }
    
    if (type === 'agendamentos') {
      return planData.totalAgendamentosMes > planData.plan.max_agendamentos_mes;
    }
    
    return false;
  };

  const canAddProfessional = (): boolean => {
    if (!planData.plan) return false;
    return planData.totalProfissionais < planData.plan.max_profissionais;
  };

  const canAddAppointment = (): boolean => {
    if (!planData.plan) return false;
    return planData.totalAgendamentosMes < planData.plan.max_agendamentos_mes;
  };

  const contextValue: PlanContextType = {
    ...planData,
    hasFeature,
    isOverLimit,
    canAddProfessional,
    canAddAppointment
  };

  return (
    <PlanContext.Provider value={contextValue}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlanContext deve ser usado dentro de um PlanProvider');
  }
  return context;
};
