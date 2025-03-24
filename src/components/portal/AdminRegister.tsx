
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ShieldCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // This component now only shows a message that admin registration is restricted
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-dental-light-blue p-3 rounded-full">
          <ShieldCheck className="h-8 w-8 text-dental-blue" />
        </div>
      </div>
      
      <Alert variant="destructive">
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          Admin registration is restricted. Admin accounts are created by the system administrator.
          If you need access, please contact the system administrator.
        </AlertDescription>
      </Alert>
      
      <Button 
        type="button" 
        className="w-full"
        variant="outline"
        onClick={() => navigate('/patient-portal')}
      >
        Back to Login
      </Button>
    </div>
  );
};

export default AdminRegister;
