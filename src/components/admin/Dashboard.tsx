
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import BookingsManager from '@/components/admin/BookingsManager';
import ClientsManager from '@/components/admin/ClientsManager';
import StaffManager from '@/components/admin/StaffManager';
import AnalyticsView from '@/components/admin/AnalyticsView';
import BlogManager from '@/components/admin/BlogManager';
import MessagesManager from '@/components/admin/MessagesManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-dental-blue">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <Card className="border-dental-light-blue/30">
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
