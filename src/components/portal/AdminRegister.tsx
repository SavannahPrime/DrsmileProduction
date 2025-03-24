
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ShieldCheck, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 text-red-800 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Administrative Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-gray-700 mb-4">
            Admin registration is restricted to authorized personnel only. Admin accounts are created by the system administrator.
          </p>
          <p className="text-sm text-gray-700">
            If you need administrative access, please contact the system administrator with your credentials and access requirements.
          </p>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 rounded-b-lg">
          <Button 
            type="button" 
            className="w-full"
            variant="outline"
            onClick={() => navigate('/patient-portal')}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminRegister;
