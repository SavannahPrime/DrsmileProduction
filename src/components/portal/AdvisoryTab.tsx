
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AdvisoryTabProps {
  clientId: string;
}

interface Advisory {
  id: string;
  created_at: string;
  title: string;
  content: string;
  dentist_name: string;
  appointment_id: string | null;
  priority: string;
  is_read: boolean;
  client_id: string; // Added this property to match database schema
}

const AdvisoryTab: React.FC<AdvisoryTabProps> = ({ clientId }) => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        // Get data from Supabase advisories table
        const { data, error } = await supabase
          .from('advisories')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAdvisories(data as Advisory[]);
        } else {
          // Use demo data if no advisories found
          const demoAdvisories: Advisory[] = [
            {
              id: '1',
              created_at: new Date().toISOString(),
              title: 'Post-Treatment Care Instructions',
              content: 'Remember to rinse with saltwater 3 times daily for the next week. Avoid hard foods and maintain regular brushing, but be gentle around the treated area.',
              dentist_name: 'Dr. Johnson',
              appointment_id: null,
              priority: 'high',
              is_read: false,
              client_id: clientId
            },
            {
              id: '2',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              title: 'Medication Reminder',
              content: 'Please complete your full course of antibiotics as prescribed. Take with food to minimize stomach upset.',
              dentist_name: 'Dr. Smith',
              appointment_id: null,
              priority: 'medium',
              is_read: true,
              client_id: clientId
            },
            {
              id: '3',
              created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              title: 'Dental Checkup Recommendation',
              content: 'Based on your last visit, we recommend scheduling a follow-up cleaning in 3 months to maintain optimal oral health.',
              dentist_name: 'Dr. Johnson',
              appointment_id: null,
              priority: 'low',
              is_read: true,
              client_id: clientId
            }
          ];
          
          setAdvisories(demoAdvisories);
        }
      } catch (error: any) {
        console.error('Error fetching advisories:', error);
        toast({
          title: "Error",
          description: "Failed to load your advisories. Please try again.",
          variant: "destructive",
        });
        
        // Fallback to sample data
        setAdvisories([
          {
            id: '1',
            created_at: new Date().toISOString(),
            title: 'Post-Treatment Care Instructions',
            content: 'Remember to rinse with saltwater 3 times daily for the next week. Avoid hard foods and maintain regular brushing, but be gentle around the treated area.',
            dentist_name: 'Dr. Johnson',
            appointment_id: null,
            priority: 'high',
            is_read: false,
            client_id: clientId
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Medication Reminder',
            content: 'Please complete your full course of antibiotics as prescribed. Take with food to minimize stomach upset.',
            dentist_name: 'Dr. Smith',
            appointment_id: null,
            priority: 'medium',
            is_read: true,
            client_id: clientId
          },
          {
            id: '3',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Dental Checkup Recommendation',
            content: 'Based on your last visit, we recommend scheduling a follow-up cleaning in 3 months to maintain optimal oral health.',
            dentist_name: 'Dr. Johnson',
            appointment_id: null,
            priority: 'low',
            is_read: true,
            client_id: clientId
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvisories();
  }, [clientId, toast]);
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advisories')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setAdvisories(prev => 
        prev.map(advisory => 
          advisory.id === id ? { ...advisory, is_read: true } : advisory
        )
      );
      
      toast({
        title: "Success",
        description: "Advisory marked as read",
      });
    } catch (error: any) {
      console.error('Error marking advisory as read:', error);
      toast({
        title: "Error",
        description: "Failed to update advisory status",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Important</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Attention</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">General</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
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
        <h2 className="text-2xl font-bold mb-4 text-dental-blue">Doctor's Advice & Instructions</h2>
        {advisories.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Advice Available</h3>
              <p className="text-gray-500">You don't have any advice or instructions from your dentist yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {advisories.map((advisory) => (
              <Card key={advisory.id} className={`overflow-hidden ${!advisory.is_read ? 'border-l-4 border-dental-blue' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {!advisory.is_read && <AlertCircle className="w-5 h-5 mr-2 text-dental-blue" />}
                        {advisory.title}
                      </CardTitle>
                      <CardDescription>
                        From: {advisory.dentist_name} • {formatDate(advisory.created_at)}
                      </CardDescription>
                    </div>
                    {getPriorityBadge(advisory.priority)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{advisory.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <div className="text-sm text-gray-500">
                    {advisory.is_read ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                        Read
                      </span>
                    ) : (
                      <button 
                        onClick={() => markAsRead(advisory.id)}
                        className="text-dental-blue hover:text-dental-blue-dark flex items-center"
                      >
                        <span>Mark as read</span>
                      </button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryTab;
