
import { CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelector = ({ services, selectedService, onServiceSelect }: ServiceSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Escolha o Serviço *
      </label>
      <div className="grid md:grid-cols-2 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedService === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onServiceSelect(service.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">{service.name}</h3>
              {selectedService === service.id && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              R$ {service.price} • {service.duration} min
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
