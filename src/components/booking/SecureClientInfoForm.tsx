
import { User, Phone, Mail } from 'lucide-react';
import { sanitizeName, sanitizePhone, sanitizeInput } from '@/utils/validation';

interface SecureClientInfoFormProps {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  errors?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

const SecureClientInfoForm = ({ 
  clientName, 
  clientPhone, 
  clientEmail,
  onNameChange, 
  onPhoneChange, 
  onEmailChange,
  errors = {}
}: SecureClientInfoFormProps) => {
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeName(e.target.value);
    onNameChange(sanitized);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhone(e.target.value);
    onPhoneChange(sanitized);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onEmailChange(sanitized);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Seu Nome *
        </label>
        <input
          type="text"
          className={`w-full p-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite seu nome completo"
          value={clientName}
          onChange={handleNameChange}
          maxLength={100}
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          Seu Telefone *
        </label>
        <input
          type="tel"
          className={`w-full p-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="(11) 99999-9999"
          value={clientPhone}
          onChange={handlePhoneChange}
          maxLength={20}
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          E-mail (opcional)
        </label>
        <input
          type="email"
          className={`w-full p-3 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="seu@email.com"
          value={clientEmail}
          onChange={handleEmailChange}
          maxLength={255}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
    </div>
  );
};

export default SecureClientInfoForm;
