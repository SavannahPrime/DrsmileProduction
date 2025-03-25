
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Edit2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchBookings, updateBooking, deleteBooking, fetchClients, fetchServices, fetchDentists } from '@/lib/api';

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type Booking = {
  id: string;
  client_id: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
  status: string;
  clients: Client;
};

const BookingsManager = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Booking | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [dentist, setDentist] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [dentists, setDentists] = useState<any[]>([]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, clientsData, servicesData, dentistsData] = await Promise.all([
        fetchBookings(),
        fetchClients(),
        fetchServices(),
        fetchDentists()
      ]);
      
      setAppointments(bookingsData);
      setClients(clientsData);
      setServices(servicesData);
      setDentists(dentistsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditAppointment = (appointment: Booking) => {
    setEditingAppointment(appointment);
    setDate(appointment.date ? new Date(appointment.date) : undefined);
    setTime(appointment.time);
    setDentist(appointment.dentist);
    setStatus(appointment.status);
    setService(appointment.service);
  };

  const handleSaveChanges = async () => {
    if (!editingAppointment || !date) return;
    
    try {
      const updatedAppointment = {
        client_id: editingAppointment.client_id,
        date: format(date, 'yyyy-MM-dd'),
        time,
        dentist,
        service,
        status
      };
      
      const result = await updateBooking(editingAppointment.id, updatedAppointment);
      
      if (result) {
        // Update local state
        setAppointments(appointments.map(app => 
          app.id === editingAppointment.id ? { ...app, ...updatedAppointment } : app
        ));
        
        setEditingAppointment(null);
        
        toast({
          title: "Success",
          description: "Appointment updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (id: string, clientId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const success = await deleteBooking(id, clientId);
      
      if (success) {
        // Update local state
        setAppointments(appointments.filter(app => app.id !== id));
        
        toast({
          title: "Success",
          description: "Appointment cancelled successfully",
        });
      }
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Appointments</h2>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="border-l-4 relative overflow-hidden transition-all hover:shadow-md" 
              style={{ borderLeftColor: appointment.status === 'confirmed' ? '#10b981' : appointment.status === 'pending' ? '#f59e0b' : appointment.status === 'completed' ? '#3b82f6' : '#ef4444' }}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-dental-blue mr-2" />
                      <h3 className="font-semibold">{appointment.clients.first_name} {appointment.clients.last_name}</h3>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{appointment.clients.email}</div>
                    <div className="text-sm text-gray-500">{appointment.clients.phone}</div>
                    <div className="mt-2 text-sm font-medium">{appointment.service}</div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-dental-blue mr-2" />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-dental-blue mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium">{appointment.dentist}</div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-dental-blue border-dental-blue/30 hover:bg-dental-light-blue/20"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Reschedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reschedule Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left"
                                >
                                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Time</label>
                            <Input 
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              placeholder="e.g. 10:00 AM"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Service</label>
                            <Select value={service} onValueChange={setService}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map(service => (
                                  <SelectItem key={service.id} value={service.name}>
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Dentist</label>
                            <Select value={dentist} onValueChange={setDentist}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a dentist" />
                              </SelectTrigger>
                              <SelectContent>
                                {dentists.map(dentist => (
                                  <SelectItem key={dentist.id} value={dentist.name}>
                                    {dentist.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveChanges}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id, appointment.client_id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
