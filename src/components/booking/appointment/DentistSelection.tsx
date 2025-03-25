
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetchDentists } from '@/lib/api';

type Dentist = {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  is_active: boolean;
};

type DentistSelectionProps = {
  dentist?: string;
  setDentist: (dentist: string) => void;
};

const DentistSelection = ({ dentist, setDentist }: DentistSelectionProps) => {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDentists = async () => {
      setLoading(true);
      const dentistsData = await fetchDentists();
      setDentists(dentistsData.filter((dentist: Dentist) => dentist.is_active));
      setLoading(false);
    };
    
    loadDentists();
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Loading dentists...</div>;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Select Dentist</h3>
      <RadioGroup value={dentist} onValueChange={setDentist}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dentists.map((dentistItem) => (
            <Card key={dentistItem.id} className={`border-2 cursor-pointer transition-all hover:border-dental-blue ${dentist === dentistItem.name ? 'border-dental-blue bg-dental-light-blue/10' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <RadioGroupItem 
                  value={dentistItem.name}
                  id={`dentist-${dentistItem.id}`}
                  className="sr-only"
                />
                <Label 
                  htmlFor={`dentist-${dentistItem.id}`}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium">{dentistItem.name}</span>
                  <span className="text-sm text-dental-blue">{dentistItem.specialization}</span>
                  <p className="text-sm text-gray-500 mt-1">{dentistItem.bio}</p>
                </Label>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default DentistSelection;
