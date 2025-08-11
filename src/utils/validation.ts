
import { z } from 'zod';

// Phone number validation (Brazilian format) - now accepts numbers only
const phoneRegex = /^(\(\d{2}\)\s\d{4,5}-\d{4}|\d{10,11})$/;

// Name validation (letters, spaces, hyphens, apostrophes only)
const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

// Email validation schema
export const emailSchema = z.string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')
  .max(255, 'Email muito longo');

// Phone validation schema - now accepts both formats
export const phoneSchema = z.string()
  .min(1, 'Telefone é obrigatório')
  .regex(phoneRegex, 'Formato inválido. Use: (11) 99999-9999 ou 11999999999')
  .max(20, 'Telefone muito longo');

// Name validation schema
export const nameSchema = z.string()
  .min(1, 'Nome é obrigatório')
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome muito longo')
  .regex(nameRegex, 'Nome contém caracteres inválidos');

// Business name validation
export const businessNameSchema = z.string()
  .min(1, 'Nome do negócio é obrigatório')
  .min(3, 'Nome deve ter pelo menos 3 caracteres')
  .max(150, 'Nome muito longo')
  .regex(/^[a-zA-ZÀ-ÿ0-9\s&.-]+$/, 'Nome contém caracteres inválidos');

// Address validation
export const addressSchema = z.string()
  .min(1, 'Endereço é obrigatório')
  .min(5, 'Endereço deve ter pelo menos 5 caracteres')
  .max(255, 'Endereço muito longo')
  .regex(/^[a-zA-ZÀ-ÿ0-9\s,.-]*$/, 'Endereço contém caracteres inválidos');

// Booking validation schemas
export const bookingSchema = z.object({
  clientName: nameSchema,
  clientPhone: phoneSchema,
  clientEmail: emailSchema.optional().or(z.literal('')),
  selectedService: z.string().uuid('Serviço inválido'),
  selectedProfessional: z.string().uuid('Profissional inválido').nullable(),
  selectedDate: z.date(),
  selectedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido')
});

export const empresaSetupSchema = z.object({
  nome_negocio: businessNameSchema,
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  telefone: phoneSchema.optional().or(z.literal('')),
  endereco: addressSchema
});

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .slice(0, 500); // Limit length
};

export const sanitizeName = (name: string): string => {
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '') // Keep only letters, spaces, hyphens, apostrophes
    .slice(0, 100);
};

export const sanitizePhone = (phone: string): string => {
  return phone
    .replace(/[^\d()-\s]/g, '') // Keep only digits, parentheses, hyphens, spaces
    .slice(0, 20);
};

export const validateBusinessHours = (date: Date, time: string): boolean => {
  const hour = parseInt(time.split(':')[0]);
  const dayOfWeek = date.getDay();
  
  // Basic business hours validation (9 AM to 6 PM, Monday to Saturday)
  if (dayOfWeek === 0) return false; // Sunday
  if (hour < 9 || hour >= 18) return false; // Outside business hours
  
  return true;
};
