
import { useEffect, useState } from 'react';
import { CalendarIcon, Clock, User, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fetchDentists, fetchServices } from '@/lib/api';

interface AppointmentSummaryProps {
  date: Date | undefined;
  timeSlot: string | undefined;
  dentist: string | undefined;
  serviceType: string | undefined;
}

type Dentist = {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  is_active: boolean;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  is_active: boolean;
};

const AppointmentSummary = ({ date, timeSlot, dentist, serviceType }: AppointmentSummaryProps) => {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dentistsData, servicesData] = await Promise.all([
          fetchDentists(),
          fetchServices()
        ]);
        
        setDentists(dentistsData.filter((d: Dentist) => d.is_active));
        setServices(servicesData.filter((s: Service) => s.is_active));
      } catch (error) {
        console.error('Error loading appointment summary data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-dental-light-blue/30 p-5 rounded-lg mb-8">
        <h3 className="font-medium mb-3">Appointment Summary</h3>
        <div className="text-sm text-gray-500">Loading appointment details...</div>
      </div>
    );
  }

  const selectedDentist = dentists.find(d => d.name === dentist);
  const selectedService = services.find(s => s.name === serviceType);

  return (
    <div className="bg-dental-light-blue/30 p-5 rounded-lg mb-8">
      <h3 className="font-medium mb-3">Appointment Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-2">
          <CalendarIcon className="w-4 h-4 text-dental-blue mt-0.5" />
          <div>
            <span className="font-medium">Date:</span> {date && format(date, "PPP")}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-dental-blue mt-0.5" />
          <div>
            <span className="font-medium">Time:</span> {timeSlot}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-dental-blue mt-0.5" />
          <div>
            <span className="font-medium">Dentist:</span> {selectedDentist?.name}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-dental-blue mt-0.5" />
          <div>
            <span className="font-medium">Service:</span> {selectedService?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;
