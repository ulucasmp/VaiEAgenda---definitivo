
import { CompanySettings } from '@/contexts/CompanyContext';

interface BookingHeaderProps {
  companySettings: CompanySettings;
}

const BookingHeader = ({ companySettings }: BookingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      {companySettings.logo && (
        <img 
          src={companySettings.logo} 
          alt="Logo da empresa" 
          className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg"
        />
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{companySettings.name}</h1>
      <p className="text-lg text-gray-600">Agende seu horário online</p>
    </div>
  );
};

export default BookingHeader;
