
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Calendar, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Smith",
      date: "2023-09-15",
      time: "10:00 AM",
      service: "Teeth Cleaning",
      dentist: "Dr. Johnson",
      status: "Confirmed"
    },
    {
      id: 2,
      patientName: "Emily Davis",
      date: "2023-09-16", 
      time: "2:30 PM",
      service: "Dental Checkup",
      dentist: "Dr. Wilson",
      status: "Pending"
    },
    {
      id: 3,
      patientName: "Robert Brown",
      date: "2023-09-17",
      time: "11:45 AM",
      service: "Root Canal",
      dentist: "Dr. Johnson",
      status: "Confirmed"
    }
  ]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Admin header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage appointments and blog content</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} disabled={loading}>
              <LogOut className="mr-2 h-4 w-4" />
              {loading ? "Signing out..." : "Sign out"}
            </Button>
          </div>
          
          {/* Dashboard tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full max-w-md">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="blog">
                <FileText className="mr-2 h-4 w-4" />
                Blog
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Appointment Schedule</h2>
                
                <Alert className="mb-6">
                  <AlertTitle>Notification System Active</AlertTitle>
                  <AlertDescription>
                    You will receive email notifications for all new bookings. Double bookings are prevented by the system.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableCaption>List of upcoming patient appointments</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Dentist</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patientName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>{appointment.dentist}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "Confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {appointment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="blog">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
                <p className="mb-6">Manage your blog content from the dedicated blog admin panel.</p>
                <Button onClick={() => navigate('/blog-admin')}>
                  Go to Blog Admin
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
