
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

interface ProfessionalSelectorProps {
  professionals: Professional[];
  selectedProfessional: string;
  onProfessionalSelect: (professionalId: string) => void;
}

const ProfessionalSelector = ({ professionals, selectedProfessional, onProfessionalSelect }: ProfessionalSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Escolha o Profissional *
      </label>
      <Select onValueChange={onProfessionalSelect} value={selectedProfessional}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um profissional" />
        </SelectTrigger>
        <SelectContent>
          {professionals.map((professional) => (
            <SelectItem key={professional.id} value={professional.id}>
              <div className="flex flex-col">
                <span className="font-medium">{professional.name}</span>
                <span className="text-sm text-gray-500">{professional.specialty}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfessionalSelector;
