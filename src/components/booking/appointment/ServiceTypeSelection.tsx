
import { Check, User, Clock, MessageSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const serviceTypes = [
  {
    id: "general-checkup",
    name: "General Check-up & Cleaning",
    duration: "1 hour",
    icon: <Check className="w-4 h-4" />
  },
  {
    id: "cosmetic",
    name: "Cosmetic Consultation",
    duration: "45 min",
    icon: <User className="w-4 h-4" />
  },
  {
    id: "emergency",
    name: "Emergency Care",
    duration: "30 min",
    icon: <Clock className="w-4 h-4" />
  },
  {
    id: "orthodontic",
    name: "Orthodontic Consultation",
    duration: "1 hour",
    icon: <MessageSquare className="w-4 h-4" />
  }
];

interface ServiceTypeSelectionProps {
  serviceType: string | undefined;
  setServiceType: (serviceType: string | undefined) => void;
}

const ServiceTypeSelection = ({ serviceType, setServiceType }: ServiceTypeSelectionProps) => {
  return (
    <div className="mb-6">
      <Label className="mb-2 block">Service Type</Label>
      <RadioGroup 
        value={serviceType} 
        onValueChange={setServiceType}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {serviceTypes.map((service) => (
          <Label
            key={service.id}
            htmlFor={service.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg cursor-pointer border transition-colors",
              serviceType === service.id 
                ? "border-dental-blue bg-dental-light-blue/50" 
                : "border-gray-200 hover:bg-dental-light-blue/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                serviceType === service.id ? "bg-dental-blue text-white" : "bg-dental-light-blue text-dental-blue"
              )}>
                {service.icon}
              </div>
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-xs text-muted-foreground">{service.duration}</div>
              </div>
            </div>
            <RadioGroupItem 
              value={service.id} 
              id={service.id} 
              className="sr-only"
            />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};

export { serviceTypes };
export default ServiceTypeSelection;
