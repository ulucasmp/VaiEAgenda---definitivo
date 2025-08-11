
import { User, Phone } from 'lucide-react';

interface ClientInfoFormProps {
  clientName: string;
  clientPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
}

const ClientInfoForm = ({ clientName, clientPhone, onNameChange, onPhoneChange }: ClientInfoFormProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Seu Nome *
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Digite seu nome completo"
          value={clientName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          Seu Telefone *
        </label>
        <input
          type="tel"
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="(11) 99999-9999"
          value={clientPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientInfoForm;
