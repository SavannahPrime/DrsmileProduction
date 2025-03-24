
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const PatientRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      });
      
      if (error) throw error;
      
      // In a real application, you might also want to create a profile record
      // in your database with additional user information
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. You can now log in with your credentials.",
        variant: "default",
      });
      
      // Navigate to booking or login depending on whether email confirmation is required
      if (data.session) {
        navigate('/booking');
      } else {
        toast({
          title: "Email Verification Required",
          description: "Please check your email to verify your account before logging in.",
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <div className="flex mt-1.5">
            <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
              <User size={18} />
            </div>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
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
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="rounded-l-none"
              required
            />
          </div>
        </div>
      </div>
      
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
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
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
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0700 000 000"
            className="rounded-l-none"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="flex mt-1.5">
          <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
            <Lock size={18} />
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
            className="rounded-l-none"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="flex mt-1.5">
          <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
            <Lock size={18} />
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="******"
            className="rounded-l-none"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-dental-blue hover:bg-dental-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Creating Account..."
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
};

export default PatientRegister;
