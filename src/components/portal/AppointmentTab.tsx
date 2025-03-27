
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface AppointmentTabProps {
  clientId: string;
}

const AppointmentTab: React.FC<AppointmentTabProps> = ({ clientId }) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch upcoming appointments
        const { data: upcoming, error: upcomingError } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service (name, price, duration, description),
            dentists:dentist (name, specialization)
          `)
          .eq('client_id', clientId)
          .gte('date', today)
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        
        if (upcomingError) throw upcomingError;
        
        // Fetch past appointments
        const { data: past, error: pastError } = await supabase
          .from('bookings')
          .select(`
            *,
            services:service (name, price, duration, description),
            dentists:dentist (name, specialization)
          `)
          .eq('client_id', clientId)
          .lt('date', today)
          .order('date', { ascending: false })
          .order('time', { ascending: true })
          .limit(5);
        
        if (pastError) throw pastError;
        
        setUpcomingAppointments(upcoming || []);
        setPastAppointments(past || []);
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load your appointments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [clientId, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReschedule = (appointmentId: string) => {
    navigate('/booking', { state: { rescheduleId: appointmentId } });
  };

  const formatAppointmentDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dental-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-dental-blue">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-500 mb-4">You don't have any scheduled appointments yet.</p>
              <Button 
                onClick={() => navigate('/booking')} 
                className="bg-dental-blue hover:bg-dental-blue/90"
              >
                Book an Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="border-l-4 border-dental-blue">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{appointment.service}</CardTitle>
                        <CardDescription>
                          {appointment.services?.description || 'Dental appointment'}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-dental-blue" />
                        <span>{formatAppointmentDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-dental-blue" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-dental-blue" />
                        <span>Dr. {appointment.dentist}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReschedule(appointment.id)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-dental-blue">Appointment History</h2>
        {pastAppointments.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No past appointments found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden bg-gray-50">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-700">{appointment.service}</CardTitle>
                      <CardDescription>
                        {appointment.services?.description || 'Dental appointment'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-dental-blue" />
                      <span>{formatAppointmentDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-dental-blue" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-dental-blue" />
                      <span>Dr. {appointment.dentist}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTab;
