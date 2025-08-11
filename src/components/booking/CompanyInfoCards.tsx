
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone } from 'lucide-react';
import { CompanySettings } from '@/contexts/CompanyContext';

interface CompanyInfoCardsProps {
  companySettings: CompanySettings;
}

const CompanyInfoCards = ({ companySettings }: CompanyInfoCardsProps) => {
  return (
    <>
      {/* Foto do negócio */}
      {companySettings.businessPhoto && (
        <div className="mb-8">
          <img 
            src={companySettings.businessPhoto} 
            alt="Foto do negócio" 
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Informações da empresa - Centralizada */}
      <div className="mb-8">
        <Card className="border-blue-100 shadow-sm max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <MapPin className="w-5 h-5 text-blue-500" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {companySettings.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{companySettings.address}</span>
              </div>
            )}
            {companySettings.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{companySettings.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CompanyInfoCards;
