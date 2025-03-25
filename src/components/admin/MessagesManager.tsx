
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Send, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fetchMessages, sendMessage, fetchClients } from '@/lib/api';

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_from_admin: boolean;
  is_read: boolean;
};

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  const [clients, setClients] = useState<Client[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [messagesData, clientsData] = await Promise.all([
        fetchMessages(),
        fetchClients()
      ]);
      
      // Process messages into conversations
      const clientMap = clientsData.reduce((acc: Record<string, Client>, client: Client) => {
        acc[client.id] = client;
        return acc;
      }, {});
      
      const conversationMap: Record<string, Conversation> = {};
      
      messagesData.forEach((message: Message) => {
        // Determine the client ID (non-admin party)
        const clientId = message.is_from_admin ? message.receiver_id : message.sender_id;
        
        if (!clientMap[clientId]) return; // Skip if client not found
        
        const clientName = `${clientMap[clientId].first_name} ${clientMap[clientId].last_name}`;
        
        if (!conversationMap[clientId]) {
          conversationMap[clientId] = {
            client_id: clientId,
            client_name: clientName,
            last_message: message.content,
            last_timestamp: message.created_at,
            messages: [message]
          };
        } else {
          conversationMap[clientId].messages.push(message);
          
          // Update last message if this one is newer
          const lastTimestamp = new Date(conversationMap[clientId].last_timestamp);
          const messageTimestamp = new Date(message.created_at);
          
          if (messageTimestamp > lastTimestamp) {
            conversationMap[clientId].last_message = message.content;
            conversationMap[clientId].last_timestamp = message.created_at;
          }
        }
      });
      
      // Sort conversations by last message timestamp (newest first)
      const sortedConversations = Object.values(conversationMap).sort((a, b) => {
        return new Date(b.last_timestamp).getTime() - new Date(a.last_timestamp).getTime();
      });
      
      // Sort messages within each conversation by timestamp
      sortedConversations.forEach(convo => {
        convo.messages.sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
      });
      
      setConversations(sortedConversations);
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    try {
      const newMessage = {
        sender_id: 'admin', // Using 'admin' as a placeholder - in a real app, use the admin's ID
        receiver_id: activeConversation,
        content: messageInput.trim(),
        is_from_admin: true,
        is_read: false
      };
      
      const result = await sendMessage(newMessage);
      
      if (result) {
        // Update conversations state
        setConversations(conversations.map(convo => {
          if (convo.client_id === activeConversation) {
            return {
              ...convo,
              last_message: messageInput.trim(),
              last_timestamp: new Date().toISOString(),
              messages: [...convo.messages, result]
            };
          }
          return convo;
        }));
        
        // Clear input
        setMessageInput('');
        
        toast({
          title: "Message Sent",
          description: `Your message has been sent to ${conversations.find(c => c.client_id === activeConversation)?.client_name}`,
        });
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
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
                      {format(new Date(message.created_at), 'MMM d, h:mm a')}
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
