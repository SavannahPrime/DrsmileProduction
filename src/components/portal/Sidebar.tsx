
import React from 'react';
import { Calendar, MessageSquare, Stethoscope, User, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userFirstName?: string;
  userLastName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userFirstName, userLastName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/patient-portal');
  };

  return (
    <div className="w-64 h-full bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-dental-blue" />
          <div>
            <h1 className="text-xl font-semibold text-dental-blue">Dr. Smile Dental</h1>
            {userFirstName && userLastName && (
              <p className="text-sm text-gray-500">
                Welcome, {userFirstName} {userLastName}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4">
        <nav className="space-y-2">
          <button
            onClick={() => onTabChange('appointments')}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeTab === 'appointments'
                ? 'bg-dental-light-blue text-dental-blue'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            <span>Appointments</span>
          </button>
          
          <button
            onClick={() => onTabChange('advisory')}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeTab === 'advisory'
                ? 'bg-dental-light-blue text-dental-blue'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Stethoscope className="h-5 w-5 mr-3" />
            <span>Doctor's Advice</span>
          </button>
          
          <button
            onClick={() => onTabChange('messaging')}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeTab === 'messaging'
                ? 'bg-dental-light-blue text-dental-blue'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            <span>Messages</span>
          </button>
          
          <Button
            variant="outline"
            className="w-full mt-4 border-dental-blue/30 text-dental-blue"
            onClick={() => navigate('/')}
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Main Website</span>
          </Button>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
