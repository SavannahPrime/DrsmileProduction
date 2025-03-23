
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Check, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

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
        description: `Your appointment has been scheduled for ${format(date!, 'PPP')} at ${timeSlot}. We'll send a confirmation to your email.`,
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
        <div className="text-center mb-12 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Book an Appointment
          </span>
          <h1 className="text-4xl font-bold mb-4">Schedule Your Visit</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schedule your appointment online with our convenient booking system. We'll get back to you promptly to confirm your visit.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-10 flex justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-dental-blue text-white' : 'bg-dental-light-blue text-dental-blue'}`}>
              1
            </div>
            <div className="w-16 h-1 bg-dental-light-blue"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-dental-blue text-white' : 'bg-dental-light-blue text-dental-blue'}`}>
              2
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 rounded-2xl animate-fade-up shadow-lg" style={{ animationDelay: '0.3s' }}>
          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div>
                <h2 className="text-xl font-medium mb-6">Select Appointment Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date Picker */}
                  <div>
                    <Label className="mb-2 block">Preferred Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => 
                            date < new Date() || 
                            date.getDay() === 0 || // Sunday
                            date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Time Slots */}
                  <div>
                    <Label className="mb-2 block">Preferred Time</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto p-1">
                      {timeSlots.map((time) => (
                        <div 
                          key={time}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm cursor-pointer border text-center transition-colors",
                            timeSlot === time 
                              ? "bg-dental-blue text-white border-dental-blue" 
                              : "bg-white hover:bg-dental-light-blue/50 border-gray-200"
                          )}
                          onClick={() => setTimeSlot(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Service Type */}
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
                
                {/* Dentist Selection */}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="flex mt-1.5">
                      <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                        <User size={18} />
                      </div>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="flex mt-1.5">
                      <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                        <User size={18} />
                      </div>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex mt-1.5">
                      <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                        <Mail size={18} />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex mt-1.5">
                      <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                        <Phone size={18} />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <Label htmlFor="message">Additional Information (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please let us know if you have any specific concerns or requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="h-32 mt-1.5"
                  />
                </div>
                
                {/* Appointment Summary */}
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
                    {isSubmitting ? "Booking..." : "Book Appointment"}
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
