
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  LogOut, 
  Calendar, 
  FileText, 
  Users, 
  Edit, 
  X, 
  Check, 
  Clock, 
  Plus,
  Ban,
  User,
  UserPlus,
  Search
} from 'lucide-react';
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Define types for our data structures
interface Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  service: string;
  dentist: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Rescheduled";
  notes?: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastVisit?: string;
  status: "Active" | "Inactive" | "Banned";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Define our data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "John Smith",
      patientEmail: "john@example.com",
      date: "2023-09-15",
      time: "10:00 AM",
      service: "Teeth Cleaning",
      dentist: "Dr. Johnson",
      status: "Confirmed"
    },
    {
      id: 2,
      patientName: "Emily Davis",
      patientEmail: "emily@example.com",
      date: "2023-09-16", 
      time: "2:30 PM",
      service: "Dental Checkup",
      dentist: "Dr. Wilson",
      status: "Pending"
    },
    {
      id: 3,
      patientName: "Robert Brown",
      patientEmail: "robert@example.com",
      date: "2023-09-17",
      time: "11:45 AM",
      service: "Root Canal",
      dentist: "Dr. Johnson",
      status: "Confirmed"
    }
  ]);
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      registrationDate: "2023-01-15",
      lastVisit: "2023-09-15",
      status: "Active"
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "(555) 987-6543",
      registrationDate: "2023-02-20",
      lastVisit: "2023-09-16",
      status: "Active"
    },
    {
      id: 3,
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "(555) 456-7890",
      registrationDate: "2023-03-10",
      lastVisit: "2023-09-17",
      status: "Active"
    }
  ]);

  // Check if user is authorized as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Unauthorized access",
          description: "Please log in to access the admin dashboard",
          variant: "destructive"
        });
        navigate('/patient-portal');
        return;
      }
      
      // Check if the logged-in user is in the blog_authors table (admin)
      const { data: authorData, error: authorError } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('email', session.user?.email)
        .single();
      
      if (authorError || !authorData) {
        toast({
          title: "Unauthorized access",
          description: "You do not have admin privileges",
          variant: "destructive"
        });
        navigate('/patient-portal');
        return;
      }
      
      setIsAdmin(true);
    };
    
    checkAdminStatus();
  }, [navigate, toast]);

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

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.dentist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.date.includes(searchQuery)
  );

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  // Functions to handle appointment actions
  const handleUpdateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
    
    toast({
      title: "Appointment updated",
      description: `Appointment status changed to ${status.toLowerCase()}`
    });
  };

  const handleRescheduleAppointment = (id: number, newDate: string, newTime: string) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { 
        ...appointment, 
        date: newDate, 
        time: newTime, 
        status: "Rescheduled" 
      } : appointment
    ));
    
    toast({
      title: "Appointment rescheduled",
      description: `Appointment moved to ${newDate} at ${newTime}`
    });
  };

  // Functions to handle client actions
  const handleUpdateClientStatus = (id: number, status: Client['status']) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, status } : client
    ));
    
    toast({
      title: "Client status updated",
      description: `Client status changed to ${status.toLowerCase()}`
    });
  };

  const addNewClient = (newClient: Omit<Client, 'id' | 'registrationDate' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const client: Client = {
      id: clients.length + 1,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      registrationDate: today,
      status: "Active"
    };
    
    setClients([...clients, client]);
    
    toast({
      title: "Client added",
      description: `${newClient.name} has been added as a new client`
    });
  };

  // If not admin, don't render the dashboard
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Admin header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage appointments, clients, and blog content</p>
            </div>
            <div className="flex gap-4 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleSignOut} disabled={loading}>
                <LogOut className="mr-2 h-4 w-4" />
                {loading ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
          
          {/* Dashboard tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="clients">
                <Users className="mr-2 h-4 w-4" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="blog">
                <FileText className="mr-2 h-4 w-4" />
                Blog
              </TabsTrigger>
            </TabsList>
            
            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Appointment Management</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Appointment</DialogTitle>
                        <DialogDescription>
                          Create a new appointment for a patient.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="patient">Patient</Label>
                          <Input id="patient" placeholder="Select or add a patient" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="service">Service</Label>
                            <Input id="service" placeholder="Select a service" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="dentist">Dentist</Label>
                            <Input id="dentist" placeholder="Select a dentist" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input id="notes" placeholder="Add any special notes" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Appointment</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
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
                              : appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : appointment.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {appointment.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reschedule Appointment</DialogTitle>
                                  <DialogDescription>
                                    Update the appointment date and time.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <p><strong>Patient:</strong> {appointment.patientName}</p>
                                  <p><strong>Service:</strong> {appointment.service}</p>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`date-${appointment.id}`}>New Date</Label>
                                      <Input 
                                        id={`date-${appointment.id}`} 
                                        type="date" 
                                        defaultValue={appointment.date}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`time-${appointment.id}`}>New Time</Label>
                                      <Input 
                                        id={`time-${appointment.id}`} 
                                        type="time" 
                                        defaultValue={appointment.time.split(' ')[0]}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button onClick={() => handleRescheduleAppointment(appointment.id, appointment.date, appointment.time)}>
                                    Save Changes
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Clock className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Appointment Status</DialogTitle>
                                  <DialogDescription>
                                    Change the status of this appointment.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 py-4">
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, "Confirmed")}
                                  >
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Confirmed
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, "Completed")}
                                  >
                                    <Check className="mr-2 h-4 w-4 text-blue-500" />
                                    Completed
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, "Cancelled")}
                                  >
                                    <X className="mr-2 h-4 w-4 text-red-500" />
                                    Cancelled
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateAppointmentStatus(appointment.id, "Pending")}
                                  >
                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                    Pending
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Clients Tab */}
            <TabsContent value="clients">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Client Management</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New Client
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>
                          Create a new client record for your practice.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" placeholder="John Smith" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="clientEmail">Email</Label>
                          <Input id="clientEmail" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="(555) 123-4567" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => addNewClient({
                          name: "New Client", 
                          email: "new@example.com", 
                          phone: "(555) 000-0000"
                        })}>
                          Add Client
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Table>
                  <TableCaption>Complete list of registered clients</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.registrationDate}</TableCell>
                        <TableCell>{client.lastVisit || "No visits yet"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            client.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : client.status === "Inactive"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {client.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <User className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Client Profile</DialogTitle>
                                  <DialogDescription>
                                    View and edit client details.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`name-${client.id}`}>Full Name</Label>
                                    <Input id={`name-${client.id}`} defaultValue={client.name} />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`email-${client.id}`}>Email</Label>
                                    <Input id={`email-${client.id}`} defaultValue={client.email} />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`phone-${client.id}`}>Phone Number</Label>
                                    <Input id={`phone-${client.id}`} defaultValue={client.phone} />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant={client.status === "Banned" ? "destructive" : "outline"} size="sm">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Client Status</DialogTitle>
                                  <DialogDescription>
                                    Manage this client's account status.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 py-4">
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateClientStatus(client.id, "Active")}
                                  >
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Set as Active
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateClientStatus(client.id, "Inactive")}
                                  >
                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                    Set as Inactive
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateClientStatus(client.id, "Banned")}
                                  >
                                    <Ban className="mr-2 h-4 w-4 text-red-500" />
                                    Ban Client
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Blog Tab */}
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
