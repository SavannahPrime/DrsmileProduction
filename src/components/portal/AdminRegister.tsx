
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ShieldCheck, UserPlus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const AdminRegister = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '' // For additional security
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
    
    // Simple admin code check - in a real app, use a more secure method
    if (formData.adminCode !== "DRSMILE2024") {
      toast({
        title: "Invalid Admin Code",
        description: "Please enter a valid admin registration code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register the user
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            is_admin: true
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Add to blog_authors table
      const { error: authorError } = await supabase
        .from('blog_authors')
        .insert({ email: formData.email });
      
      if (authorError) throw authorError;
      
      toast({
        title: "Registration Successful!",
        description: "Your admin account has been created. You can now log in.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-dental-light-blue p-3 rounded-full">
          <ShieldCheck className="h-8 w-8 text-dental-blue" />
        </div>
      </div>
      
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
        <Label htmlFor="email">Admin Email</Label>
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
            placeholder="admin@drsmile.com"
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
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="adminCode">Admin Registration Code</Label>
        <div className="flex mt-1.5">
          <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
            <ShieldCheck size={18} />
          </div>
          <Input
            id="adminCode"
            name="adminCode"
            type="password"
            value={formData.adminCode}
            onChange={handleChange}
            placeholder="Enter admin code"
            className="rounded-l-none"
            required
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-dental-blue hover:bg-dental-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Creating Admin Account..."
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Register as Admin
          </>
        )}
      </Button>
    </form>
  );
};

export default AdminRegister;
