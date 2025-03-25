
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PersonalInformationProps = {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isDisabled?: boolean;
};

const PersonalInformation = ({ formData, handleInputChange, isDisabled = false }: PersonalInformationProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className="mt-1"
            required
            disabled={isDisabled}
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            className="mt-1"
            required
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-gray-700">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john.doe@example.com"
            className="mt-1"
            required
            disabled={isDisabled}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            className="mt-1"
            required
            disabled={isDisabled}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-gray-700">Additional Information (Optional)</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Any special requests or information the dentist should know..."
          className="mt-1"
          rows={4}
        />
      </div>
      
      {isDisabled && (
        <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
          Your personal information is being used from your account. If you need to update it, please go to your profile settings.
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
