
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

// Import the smaller components
import AppointmentDateSelection from './appointment/AppointmentDateSelection';
import ServiceTypeSelection from './appointment/ServiceTypeSelection';
import DentistSelection from './appointment/DentistSelection';
import PersonalInformation from './appointment/PersonalInformation';
import AppointmentSummary from './appointment/AppointmentSummary';
import FormSteps from './appointment/FormSteps';
import FormHeader from './appointment/FormHeader';

const AppointmentForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);
  const [dentist, setDentist] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isStepOneComplete = date && timeSlot && serviceType && dentist;
  const isStepTwoComplete = formData.firstName && formData.lastName && formData.email && formData.phone;

  const handleNext = () => {
    if (isStepOneComplete) {
      setStep(2);
      // Scroll to top when advancing to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(1);
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isStepTwoComplete) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment has been scheduled for ${date!.toLocaleDateString()} at ${timeSlot}. We'll send a confirmation to your email.`,
        variant: "default",
      });
      
      // Reset form
      setDate(undefined);
      setTimeSlot(undefined);
      setServiceType(undefined);
      setDentist(undefined);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
      });
      setStep(1);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <FormHeader />
        
        {/* Steps */}
        <FormSteps step={step} />

        {/* Form Container */}
        <div className="glass-card p-8 rounded-2xl animate-fade-up shadow-lg" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div>
                <h2 className="text-xl font-medium mb-6">Select Appointment Details</h2>
                
                {/* Date and Time Selection */}
                <AppointmentDateSelection 
                  date={date}
                  setDate={setDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                />
                
                {/* Service Type Selection */}
                <ServiceTypeSelection 
                  serviceType={serviceType}
                  setServiceType={setServiceType}
                />
                
                {/* Dentist Selection */}
                <DentistSelection 
                  dentist={dentist}
                  setDentist={setDentist}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    disabled={!isStepOneComplete}
                    className="bg-dental-blue hover:bg-dental-blue/90"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-medium mb-6">Personal Information</h2>
                
                {/* Personal Information Form */}
                <PersonalInformation 
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
                
                {/* Appointment Summary */}
                <AppointmentSummary 
                  date={date}
                  timeSlot={timeSlot}
                  dentist={dentist}
                  serviceType={serviceType}
                />
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!isStepTwoComplete || isSubmitting}
                    className="bg-dental-blue hover:bg-dental-blue/90"
                  >
                    {isSubmitting ? "Booking..." : (
                      <>
                        <span>Book Appointment</span>
                        <Send size={16} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
