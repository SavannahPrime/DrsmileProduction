
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Send, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

type Message = {
  id: string;
  client_id: string;
  client_name: string;
  content: string;
  timestamp: string;
  is_from_admin: boolean;
};

type Conversation = {
  client_id: string;
  client_name: string;
  last_message: string;
  last_timestamp: string;
  messages: Message[];
};

const MessagesManager = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockConversations: Conversation[] = [
    {
      client_id: '1',
      client_name: 'John Doe',
      last_message: 'When is my next appointment?',
      last_timestamp: '2025-04-05T14:30:00Z',
      messages: [
        {
          id: '1-1',
          client_id: '1',
          client_name: 'John Doe',
          content: 'Hello, I would like to reschedule my appointment.',
          timestamp: '2025-04-04T13:20:00Z',
          is_from_admin: false
        },
        {
          id: '1-2',
          client_id: '1',
          client_name: 'John Doe',
          content: 'Sure, we can help you with that. When would you like to reschedule?',
          timestamp: '2025-04-04T14:15:00Z',
          is_from_admin: true
        },
        {
          id: '1-3',
          client_id: '1',
          client_name: 'John Doe',
          content: 'Next week would be better for me, if possible.',
          timestamp: '2025-04-04T16:45:00Z',
          is_from_admin: false
        },
        {
          id: '1-4',
          client_id: '1',
          client_name: 'John Doe',
          content: 'When is my next appointment?',
          timestamp: '2025-04-05T14:30:00Z',
          is_from_admin: false
        }
      ]
    },
    {
      client_id: '2',
      client_name: 'Jane Smith',
      last_message: 'Your appointment has been confirmed for this Friday at 2pm.',
      last_timestamp: '2025-04-03T10:15:00Z',
      messages: [
        {
          id: '2-1',
          client_id: '2',
          client_name: 'Jane Smith',
          content: 'I need to confirm my appointment for this week.',
          timestamp: '2025-04-03T09:20:00Z',
          is_from_admin: false
        },
        {
          id: '2-2',
          client_id: '2',
          client_name: 'Jane Smith',
          content: 'Your appointment has been confirmed for this Friday at 2pm.',
          timestamp: '2025-04-03T10:15:00Z',
          is_from_admin: true
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulating fetching conversations
    setLoading(true);
    setTimeout(() => {
      setConversations(mockConversations);
      setLoading(false);
    }, 500);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      client_id: activeConversation,
      client_name: conversations.find(c => c.client_id === activeConversation)?.client_name || 'Unknown',
      content: messageInput.trim(),
      timestamp: new Date().toISOString(),
      is_from_admin: true
    };
    
    // Update conversations with new message
    setConversations(conversations.map(convo => {
      if (convo.client_id === activeConversation) {
        return {
          ...convo,
          last_message: messageInput.trim(),
          last_timestamp: new Date().toISOString(),
          messages: [...convo.messages, newMessage]
        };
      }
      return convo;
    }));
    
    // Clear input
    setMessageInput('');
    
    // In a real application, you would also save the message to the database
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${conversations.find(c => c.client_id === activeConversation)?.client_name}`,
    });
  };

  const filteredConversations = conversations.filter(convo => 
    convo.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversationData = conversations.find(c => c.client_id === activeConversation);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-18rem)]">
      {/* Conversations List */}
      <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-4 text-center">Loading conversations...</div>
          ) : filteredConversations.length > 0 ? (
            <div className="divide-y">
              {filteredConversations.map((convo) => (
                <div 
                  key={convo.client_id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${activeConversation === convo.client_id ? 'bg-gray-100' : ''}`}
                  onClick={() => setActiveConversation(convo.client_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{convo.client_name}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(convo.last_timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 truncate mt-1">
                    {convo.last_message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
        {activeConversation && activeConversationData ? (
          <>
            <div className="p-4 border-b bg-gray-50 flex items-center">
              <div className="w-8 h-8 rounded-full bg-dental-light-blue flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-dental-blue" />
              </div>
              <div>
                <div className="font-medium">{activeConversationData.client_name}</div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {activeConversationData.messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.is_from_admin ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.is_from_admin 
                        ? 'bg-dental-blue text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${message.is_from_admin ? 'text-blue-100' : 'text-gray-500'}`}>
                      <Clock className="inline-block h-3 w-3 mr-1" />
                      {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Send className="h-6 w-6 text-gray-400" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
