
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const dentists = [
  {
    id: "dr-johnson",
    name: "Dr. Emily Johnson",
    specialty: "General Dentistry"
  },
  {
    id: "dr-rodriguez",
    name: "Dr. Michael Rodriguez",
    specialty: "Orthodontist"
  },
  {
    id: "dr-kim",
    name: "Dr. Sarah Kim",
    specialty: "Pediatric Dentistry"
  },
  {
    id: "dr-wilson",
    name: "Dr. James Wilson",
    specialty: "Oral Surgeon"
  }
];

interface DentistSelectionProps {
  dentist: string | undefined;
  setDentist: (dentist: string | undefined) => void;
}

const DentistSelection = ({ dentist, setDentist }: DentistSelectionProps) => {
  return (
    <div className="mb-8">
      <Label className="mb-2 block">Preferred Dentist</Label>
      <RadioGroup 
        value={dentist} 
        onValueChange={setDentist}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {dentists.map((doc) => (
          <Label
            key={doc.id}
            htmlFor={doc.id}
            className={cn(
              "flex items-center space-x-3 p-4 rounded-lg cursor-pointer border transition-colors",
              dentist === doc.id 
                ? "border-dental-blue bg-dental-light-blue/50" 
                : "border-gray-200 hover:bg-dental-light-blue/20"
            )}
          >
            <div>
              <div className="font-medium">{doc.name}</div>
              <div className="text-xs text-muted-foreground">{doc.specialty}</div>
            </div>
            <RadioGroupItem 
              value={doc.id} 
              id={doc.id} 
              className="sr-only"
            />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export { dentists };
export default DentistSelection;
