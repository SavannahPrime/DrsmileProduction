
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, Edit2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Appointment = {
  id: string;
  patient_name: string;
  email: string;
  phone: string;
  service: string;
  dentist: string;
  date: string;
  time: string;
  status: string;
};

const BookingsManager = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [dentist, setDentist] = useState("");
  const [status, setStatus] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // This is a mock API call - in a real app, you would fetch from your Supabase database
      // const { data, error } = await supabase.from('appointments').select('*');
      
      // Mock data for demonstration
      const mockData = [
        {
          id: '1',
          patient_name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          service: 'Teeth Cleaning',
          dentist: 'Dr. Smith',
          date: '2025-04-10',
          time: '10:00 AM',
          status: 'confirmed'
        },
        {
          id: '2',
          patient_name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '123-456-7891',
          service: 'Root Canal',
          dentist: 'Dr. Johnson',
          date: '2025-04-11',
          time: '2:00 PM',
          status: 'pending'
        }
      ];
      
      setAppointments(mockData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setDate(appointment.date ? new Date(appointment.date) : undefined);
    setTime(appointment.time);
    setDentist(appointment.dentist);
    setStatus(appointment.status);
  };

  const handleSaveChanges = async () => {
    if (!editingAppointment || !date) return;
    
    try {
      const updatedAppointment = {
        ...editingAppointment,
        date: format(date, 'yyyy-MM-dd'),
        time,
        dentist,
        status
      };
      
      // In a real app, you would update the database
      // await supabase.from('appointments').update(updatedAppointment).eq('id', editingAppointment.id);
      
      // Update local state
      setAppointments(appointments.map(app => 
        app.id === editingAppointment.id ? updatedAppointment : app
      ));
      
      setEditingAppointment(null);
      
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      // In a real app, you would update the database
      // await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
      
      // Update local state
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: 'cancelled' } : app
      ));
      
      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
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
              style={{ borderLeftColor: appointment.status === 'confirmed' ? '#10b981' : appointment.status === 'pending' ? '#f59e0b' : '#ef4444' }}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-dental-blue mr-2" />
                      <h3 className="font-semibold">{appointment.patient_name}</h3>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{appointment.email}</div>
                    <div className="text-sm text-gray-500">{appointment.phone}</div>
                    <div className="mt-2 text-sm font-medium">{appointment.service}</div>
                  </div>

                  <div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-dental-blue mr-2" />
                      <span>{appointment.date}</span>
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
                            <label className="block text-sm font-medium mb-1">Dentist</label>
                            <Select value={dentist} onValueChange={setDentist}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a dentist" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                                <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                                <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
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
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveChanges}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
