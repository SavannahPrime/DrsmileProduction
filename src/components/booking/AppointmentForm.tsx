
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

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

  const sendConfirmationEmail = async (appointmentData: any) => {
    try {
      const { error } = await supabase.functions.invoke('send-appointment-email', {
        body: appointmentData,
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isStepTwoComplete) return;
    
    setIsSubmitting(true);
    
    // Prepare appointment data
    const appointmentData = {
      ...formData,
      date: date?.toISOString(),
      timeSlot,
      dentist,
      serviceType,
      status: "pending"
    };
    
    try {
      // Send confirmation email
      await sendConfirmationEmail(appointmentData);
      
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
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "There was a problem booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Steps */}
      <FormSteps step={step} />

      {/* Form Container */}
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
                    <Send size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AppointmentForm;
