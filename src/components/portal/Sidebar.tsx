
import React from 'react';
import { Calendar, MessageSquare, Stethoscope, User, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userFirstName?: string;
  userLastName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userFirstName, userLastName }) => {
  const { theme, toggleTheme } = useTheme();
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
    <div className="w-64 h-full bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-dental-blue dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-semibold text-dental-blue dark:text-blue-400">Dr. Smile Dental</h1>
            {userFirstName && userLastName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
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
                ? 'bg-dental-light-blue dark:bg-blue-900 text-dental-blue dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Calendar className="h-5 w-5 mr-3" />
            <span>Appointments</span>
          </button>
          
          <button
            onClick={() => onTabChange('advisory')}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeTab === 'advisory'
                ? 'bg-dental-light-blue dark:bg-blue-900 text-dental-blue dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Stethoscope className="h-5 w-5 mr-3" />
            <span>Doctor's Advice</span>
          </button>
          
          <button
            onClick={() => onTabChange('messaging')}
            className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
              activeTab === 'messaging'
                ? 'bg-dental-light-blue dark:bg-blue-900 text-dental-blue dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            <span>Messages</span>
          </button>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          {theme === 'light' ? <Moon className="h-5 w-5 mr-3" /> : <Sun className="h-5 w-5 mr-3" />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
