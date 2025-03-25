
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { fetchServices } from '@/lib/api';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  is_active: boolean;
};

type ServiceTypeSelectionProps = {
  serviceType?: string;
  setServiceType: (service: string) => void;
};

const ServiceTypeSelection = ({ serviceType, setServiceType }: ServiceTypeSelectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const servicesData = await fetchServices();
      setServices(servicesData.filter((service: Service) => service.is_active));
      setLoading(false);
    };
    
    loadServices();
  }, []);
  
  if (loading) {
    return <div className="text-center py-4">Loading services...</div>;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Service Type</h3>
      <RadioGroup value={serviceType} onValueChange={setServiceType}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.id} className={`border-2 cursor-pointer transition-all hover:border-dental-blue ${serviceType === service.name ? 'border-dental-blue bg-dental-light-blue/10' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <RadioGroupItem 
                  value={service.name}
                  id={`service-${service.id}`}
                  className="sr-only"
                />
                <Label 
                  htmlFor={`service-${service.id}`}
                  className="flex flex-col cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-dental-blue font-semibold">${service.price}</span>
                  </div>
                  <p className="text-sm text-gray-500">{service.description}</p>
                  <div className="text-xs text-gray-500 mt-2">Duration: ~{service.duration} minutes</div>
                </Label>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ServiceTypeSelection;
