
import { User, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface PersonalInformationProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInformation = ({ formData, handleInputChange }: PersonalInformationProps) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInformation;
