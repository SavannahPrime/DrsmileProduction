
import { CalendarIcon, Clock, User, Check } from 'lucide-react';
import { format } from 'date-fns';
import { dentists } from './DentistSelection';
import { serviceTypes } from './ServiceTypeSelection';

interface AppointmentSummaryProps {
  date: Date | undefined;
  timeSlot: string | undefined;
  dentist: string | undefined;
  serviceType: string | undefined;
}

const AppointmentSummary = ({ date, timeSlot, dentist, serviceType }: AppointmentSummaryProps) => {
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
            <span className="font-medium">Dentist:</span> {dentists.find(d => d.id === dentist)?.name}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-dental-blue mt-0.5" />
          <div>
            <span className="font-medium">Service:</span> {serviceTypes.find(s => s.id === serviceType)?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummary;
