
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Send, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface MessagingTabProps {
  clientId: string;
  clientName: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_from_admin: boolean;
  is_read: boolean;
}

const MessagingTab: React.FC<MessagingTabProps> = ({ clientId, clientName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Fetch messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${clientId},receiver_id.eq.${clientId}`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages from admin as read
      const unreadMessages = data?.filter(msg => msg.is_from_admin && !msg.is_read).map(msg => msg.id) || [];
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessages);
      }
      
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load your messages. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to sample data
      setMessages([
        {
          id: '1',
          content: 'Hello! How can I help you with your dental care today?',
          sender_id: 'admin',
          receiver_id: clientId,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          is_from_admin: true,
          is_read: true
        },
        {
          id: '2',
          content: 'I have a question about my upcoming appointment.',
          sender_id: clientId,
          receiver_id: 'admin',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          is_from_admin: false,
          is_read: true
        },
        {
          id: '3',
          content: 'Of course! What would you like to know about your appointment?',
          sender_id: 'admin',
          receiver_id: clientId,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          is_from_admin: true,
          is_read: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=eq.${clientId}` 
        }, 
        payload => {
          console.log('Change received!', payload);
          // Refresh messages when there's a change
          fetchMessages();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setSending(true);
      
      // Send message to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: clientId,
          receiver_id: 'admin', // Admin receiver
          is_from_admin: false,
          is_read: false
        })
        .select();
        
      if (error) throw error;
      
      setNewMessage('');
      
      // Update messages list
      setMessages(prev => [...prev, data[0]]);
      
      // Send email notification to admin
      try {
        await supabase.functions.invoke("send-email", {
          body: {
            to: "admin@drsmile.com", // Admin email
            subject: `New message from patient: ${clientName}`,
            html: `
              <h2>New Patient Message</h2>
              <p><strong>From:</strong> ${clientName}</p>
              <p><strong>Message:</strong> ${newMessage.trim()}</p>
              <p>Please log in to the admin portal to respond.</p>
            `,
          },
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Continue even if email fails
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to our team. We'll respond as soon as possible.",
      });
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const formatMessageDate = (dateString: string) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return `Today at ${format(messageDate, 'h:mm a')}`;
    } else if (messageDate.getDate() === today.getDate() - 1) {
      return `Yesterday at ${format(messageDate, 'h:mm a')}`;
    } else {
      return format(messageDate, 'MMM d, yyyy h:mm a');
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-dental-blue">Messages</h2>
        <p className="text-gray-500">Communicate with our dental staff</p>
      </div>
      
      <Card className="flex-grow overflow-hidden flex flex-col">
        <div className="flex items-center justify-between bg-gray-50 border-b px-4 py-2">
          <div>
            <h3 className="font-medium">Dr. Smile Dental Staff</h3>
            <p className="text-xs text-gray-500">Messages are monitored during business hours</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMessages} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4 flex-grow overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Send className="w-12 h-12 text-gray-300 mb-2" />
              <h3 className="font-medium text-gray-500">No messages yet</h3>
              <p className="text-sm text-gray-400">Send a message to start a conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.is_from_admin ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      message.is_from_admin 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-dental-blue text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.is_from_admin ? 'text-gray-500' : 'text-white/70'}`}>
                      {formatMessageDate(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !newMessage.trim()}
              className="bg-dental-blue hover:bg-dental-blue/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send. Use Shift+Enter for a new line.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MessagingTab;
