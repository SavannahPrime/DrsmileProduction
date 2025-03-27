
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Edit, Users, Calendar, ChartBar, MessageSquare, FileText } from 'lucide-react';
import BookingsManager from '@/components/admin/BookingsManager';
import ClientsManager from '@/components/admin/ClientsManager';
import StaffManager from '@/components/admin/StaffManager';
import AnalyticsView from '@/components/admin/AnalyticsView';
import BlogManager from '@/components/admin/BlogManager';
import MessagesManager from '@/components/admin/MessagesManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();
  
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dental-blue dark:text-blue-400">Admin Dashboard</h1>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/blog-admin')} 
            className="bg-dental-blue hover:bg-dental-blue/90 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Advanced Blog Editor
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <ChartBar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="border-dental-light-blue/30 dark:border-blue-800/30">
          <CardContent className="p-6">
            <TabsContent value="bookings" className="mt-0">
              <BookingsManager />
            </TabsContent>
            
            <TabsContent value="clients" className="mt-0">
              <ClientsManager />
            </TabsContent>
            
            <TabsContent value="staff" className="mt-0">
              <StaffManager />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsView />
            </TabsContent>
            
            <TabsContent value="blog" className="mt-0">
              <BlogManager />
            </TabsContent>
            
            <TabsContent value="messages" className="mt-0">
              <MessagesManager />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Dashboard;
