
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
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
  Search,
  BarChart3,
  PieChart,
  UserCog
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
import { BlogPost } from '@/types/blog';
import { PieChart as RechartsBarChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { dentists } from '@/components/booking/appointment/DentistSelection';
import { serviceTypes } from '@/components/booking/appointment/ServiceTypeSelection';

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

interface StaffMember {
  id: number;
  name: string;
  role: "Dentist" | "Hygienist" | "Receptionist" | "Assistant";
  email: string;
  phone: string;
  specialization?: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
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

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Dr. Emily Johnson",
      role: "Dentist",
      email: "emily.johnson@drsmile.com",
      phone: "(555) 123-4567",
      specialization: "General Dentistry",
      joinDate: "2020-03-15",
      status: "Active"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      role: "Dentist",
      email: "michael.rodriguez@drsmile.com",
      phone: "(555) 234-5678",
      specialization: "Orthodontist",
      joinDate: "2019-06-10",
      status: "Active"
    },
    {
      id: 3,
      name: "Dr. Sarah Kim",
      role: "Dentist",
      email: "sarah.kim@drsmile.com",
      phone: "(555) 345-6789",
      specialization: "Pediatric Dentistry",
      joinDate: "2021-01-05",
      status: "Active"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "Dentist",
      email: "james.wilson@drsmile.com",
      phone: "(555) 456-7890",
      specialization: "Oral Surgeon",
      joinDate: "2018-09-20",
      status: "Active"
    }
  ]);

  // Form for blog post
  const form = useForm<BlogPost>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      author: 'Dr. Smile',
      image_url: '',
      is_published: true
    }
  });

  // Chart data
  const appointmentsByDentist = [
    { name: 'Dr. Johnson', value: 28 },
    { name: 'Dr. Wilson', value: 22 },
    { name: 'Dr. Kim', value: 18 },
    { name: 'Dr. Rodriguez', value: 25 }
  ];

  const appointmentsByService = [
    { name: 'Cleaning', count: 35 },
    { name: 'Checkup', count: 42 },
    { name: 'Root Canal', count: 12 },
    { name: 'Cosmetic', count: 18 },
    { name: 'Emergency', count: 8 }
  ];

  const patientsByMonth = [
    { month: 'Jan', patients: 25 },
    { month: 'Feb', patients: 30 },
    { month: 'Mar', patients: 28 },
    { month: 'Apr', patients: 35 },
    { month: 'May', patients: 42 },
    { month: 'Jun', patients: 48 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      loadPosts();
    };
    
    checkAdminStatus();
  }, [navigate, toast]);

  // Load posts from database
  const loadPosts = async () => {
    setIsPostsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      toast({
        title: "Failed to load blog posts",
        description: error.message,
        variant: "destructive"
      });
      console.error(error);
    } else {
      setPosts(data || []);
    }
    setIsPostsLoading(false);
  };

  // Reset form with editing post data or clear it
  useEffect(() => {
    if (editingPost) {
      form.reset(editingPost);
    } else {
      form.reset({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: 'Dr. Smile',
        image_url: '',
        is_published: true
      });
    }
  }, [editingPost, form]);

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

  // Filter staff based on search query
  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blog posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Functions to handle staff actions
  const handleUpdateStaffStatus = (id: number, status: StaffMember['status']) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, status } : member
    ));
    
    toast({
      title: "Staff status updated",
      description: `Staff member status changed to ${status.toLowerCase()}`
    });
  };

  const addNewStaffMember = (newMember: Omit<StaffMember, 'id' | 'joinDate' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    const member: StaffMember = {
      id: staff.length + 1,
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      phone: newMember.phone,
      specialization: newMember.specialization,
      joinDate: today,
      status: "Active"
    };
    
    setStaff([...staff, member]);
    
    toast({
      title: "Staff member added",
      description: `${newMember.name} has been added to the staff`
    });
  };

  // Submit form handler for blog posts
  const onSubmit = async (data: BlogPost) => {
    setIsSubmitting(true);
    let response;

    try {
      if (editingPost) {
        // Update existing post
        response = await supabase
          .from('blog_posts')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);
        
        if (response.error) throw response.error;
        toast({
          title: "Blog post updated successfully"
        });
      } else {
        // Create new post
        response = await supabase
          .from('blog_posts')
          .insert([{
            ...data,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (response.error) throw response.error;
        toast({
          title: "Blog post created successfully"
        });
      }

      // Reset form and reload posts
      setEditingPost(null);
      form.reset({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: 'Dr. Smile',
        image_url: '',
        is_published: true
      });
      loadPosts();
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        title: "Failed to save blog post",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete post handler
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setIsPostsLoading(true);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Failed to delete post",
          description: error.message,
          variant: "destructive"
        });
        console.error(error);
      } else {
        toast({
          title: "Post deleted successfully"
        });
        loadPosts();
      }
    }
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
              <p className="text-muted-foreground">Manage appointments, clients, staff, and blog content</p>
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
            <TabsList className="grid grid-cols-5 mb-6 w-full max-w-4xl">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="clients">
                <Users className="mr-2 h-4 w-4" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="staff">
                <UserCog className="mr-2 h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
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

            {/* Staff Tab */}
            <TabsContent value="staff">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Staff Management</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New Staff Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>
                          Add a new team member to the dental practice.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="staffName">Full Name</Label>
                          <Input id="staffName" placeholder="Dr. John Smith" />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label>Role</Label>
                          <RadioGroup defaultValue="Dentist">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Dentist" id="role-dentist" />
                                <Label htmlFor="role-dentist">Dentist</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Hygienist" id="role-hygienist" />
                                <Label htmlFor="role-hygienist">Hygienist</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Assistant" id="role-assistant" />
                                <Label htmlFor="role-assistant">Assistant</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="staffEmail">Email</Label>
                          <Input id="staffEmail" type="email" placeholder="john.smith@drsmile.com" />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="staffPhone">Phone Number</Label>
                          <Input id="staffPhone" placeholder="(555) 123-4567" />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input id="specialization" placeholder="e.g., Orthodontics, Pediatric Dentistry" />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => addNewStaffMember({
                          name: "Dr. New Staff", 
                          role: "Dentist", 
                          email: "newstaff@drsmile.com", 
                          phone: "(555) 000-0000",
                          specialization: "General Dentistry"
                        })}>
                          Add Staff Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Table>
                  <TableCaption>Complete list of dental practice staff</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.specialization || "-"}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : member.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {member.status}
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
                                  <DialogTitle>Edit Staff Member</DialogTitle>
                                  <DialogDescription>
                                    Update staff member details.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`name-${member.id}`}>Full Name</Label>
                                    <Input id={`name-${member.id}`} defaultValue={member.name} />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`email-${member.id}`}>Email</Label>
                                    <Input id={`email-${member.id}`} defaultValue={member.email} />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`phone-${member.id}`}>Phone Number</Label>
                                    <Input id={`phone-${member.id}`} defaultValue={member.phone} />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`specialization-${member.id}`}>Specialization</Label>
                                    <Input id={`specialization-${member.id}`} defaultValue={member.specialization} />
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
                                <Button variant="outline" size="sm">
                                  <Clock className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Staff Status</DialogTitle>
                                  <DialogDescription>
                                    Change the status of this staff member.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 py-4">
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateStaffStatus(member.id, "Active")}
                                  >
                                    <Check className="mr-2 h-4 w-4 text-green-500" />
                                    Active
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateStaffStatus(member.id, "On Leave")}
                                  >
                                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                    On Leave
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => handleUpdateStaffStatus(member.id, "Inactive")}
                                  >
                                    <X className="mr-2 h-4 w-4 text-red-500" />
                                    Inactive
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
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Clinic Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">126</div>
                      <p className="text-sm text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">285</div>
                      <p className="text-sm text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">4.8/5</div>
                      <p className="text-sm text-muted-foreground">Based on 78 reviews</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointments by Dentist</CardTitle>
                      <CardDescription>Distribution of appointments among practitioners</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={appointmentsByDentist}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {appointmentsByDentist.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointments by Service</CardTitle>
                      <CardDescription>Most requested dental services</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={appointmentsByService}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0088FE" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>New Patients Over Time</CardTitle>
                    <CardDescription>Monthly registration of new patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={patientsByMonth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="patients" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Blog Tab */}
            <TabsContent value="blog">
              <div className="glass-card p-6 rounded-xl shadow-lg">
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="editor">Post Editor</TabsTrigger>
                    <TabsTrigger value="posts">All Posts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {editingPost ? 'Edit Post' : 'Create New Post'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Post title" 
                                      {...field} 
                                      required
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="e.g., Oral Hygiene, Cosmetic Dentistry" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Author name" 
                                        {...field} 
                                        required
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="excerpt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Excerpt (Brief Summary)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Brief summary of the post (shown in previews)" 
                                      className="h-24"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="content"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Content</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Full content of your blog post" 
                                      className="h-48"
                                      {...field} 
                                      required
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="image_url"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image URL</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="URL to the featured image" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="is_published"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={(e) => field.onChange(e.target.checked)}
                                      className="h-4 w-4"
                                    />
                                  </FormControl>
                                  <FormLabel className="m-0">Publish immediately</FormLabel>
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-4">
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                              </Button>
                              {editingPost && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setEditingPost(null)}
                                >
                                  Cancel Editing
                                </Button>
                              )}
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="posts">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Blog Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isPostsLoading ? (
                          <p className="text-center py-4">Loading posts...</p>
                        ) : posts.length === 0 ? (
                          <p className="text-center py-4">No posts found. Create your first post!</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredPosts.map((post) => (
                                <TableRow key={post.id}>
                                  <TableCell className="font-medium">{post.title}</TableCell>
                                  <TableCell>{post.category || '-'}</TableCell>
                                  <TableCell>{post.author}</TableCell>
                                  <TableCell>{new Date(post.published_at).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {post.is_published ? (
                                      <span className="flex items-center text-green-600">
                                        <Check className="h-4 w-4 mr-1" /> Published
                                      </span>
                                    ) : (
                                      <span className="flex items-center text-amber-600">
                                        <X className="h-4 w-4 mr-1" /> Draft
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => setEditingPost(post)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleDelete(post.id)}
                                      >
                                        <X className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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

