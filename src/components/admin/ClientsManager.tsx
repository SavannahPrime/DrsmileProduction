
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, UserPlus, UserX, Edit, Search, Mail, Phone, Calendar } from 'lucide-react';

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  registered_date: string;
  status: 'active' | 'banned';
};

const ClientsManager = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // This is a mock API call - in a real app, you would fetch from your Supabase database
      // const { data, error } = await supabase.from('clients').select('*');
      
      // Mock data for demonstration
      const mockData = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          date_of_birth: '1985-06-15',
          registered_date: '2024-01-10',
          status: 'active' as const
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '123-456-7891',
          date_of_birth: '1990-03-25',
          registered_date: '2024-02-15',
          status: 'active' as const
        }
      ];
      
      setClients(mockData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async () => {
    try {
      // Validate input
      if (!newClient.first_name || !newClient.last_name || !newClient.email || !newClient.phone) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, you would insert into the database and generate credentials
      /* 
      const { data, error } = await supabase.from('clients').insert({
        ...newClient,
        registered_date: new Date().toISOString(),
        status: 'active'
      });
      */
      
      // Mock new client with generated ID
      const newClientWithId = {
        ...newClient,
        id: Math.random().toString(36).substring(2, 9),
        registered_date: new Date().toISOString().split('T')[0],
        status: 'active' as const
      };
      
      setClients([...clients, newClientWithId]);
      
      // Reset form
      setNewClient({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
      });
      
      toast({
        title: "Success",
        description: "Client added successfully and login credentials have been generated.",
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    
    try {
      // In a real app, you would update the database
      // await supabase.from('clients').update(editingClient).eq('id', editingClient.id);
      
      // Update local state
      setClients(clients.map(client => 
        client.id === editingClient.id ? editingClient : client
      ));
      
      setEditingClient(null);
      
      toast({
        title: "Success",
        description: "Client information updated successfully",
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: "Failed to update client information",
        variant: "destructive",
      });
    }
  };

  const handleBanClient = async (id: string, currentStatus: 'active' | 'banned') => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const action = newStatus === 'banned' ? 'ban' : 'unban';
    
    if (!confirm(`Are you sure you want to ${action} this client?`)) return;
    
    try {
      // In a real app, you would update the database
      // await supabase.from('clients').update({ status: newStatus }).eq('id', id);
      
      // Update local state
      setClients(clients.map(client => 
        client.id === id ? { ...client, status: newStatus } : client
      ));
      
      toast({
        title: "Success",
        description: `Client ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ning client:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} client`,
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || client.email.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Clients</h2>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 min-w-[250px]"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
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
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={newClient.first_name}
                      onChange={(e) => setNewClient({...newClient, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newClient.last_name}
                      onChange={(e) => setNewClient({...newClient, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newClient.date_of_birth}
                    onChange={(e) => setNewClient({...newClient, date_of_birth: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddClient}>
                  Add Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className={`border-l-4 ${client.status === 'active' ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-dental-light-blue rounded-full p-3">
                      <User className="h-6 w-6 text-dental-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {client.first_name} {client.last_name}
                      </h3>
                      <div className="space-y-1 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                        {client.date_of_birth && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Born: {client.date_of_birth}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Registered: {client.registered_date}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingClient(client)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      {editingClient && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Client</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit_first_name">First Name</Label>
                                <Input
                                  id="edit_first_name"
                                  value={editingClient.first_name}
                                  onChange={(e) => setEditingClient({...editingClient, first_name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_last_name">Last Name</Label>
                                <Input
                                  id="edit_last_name"
                                  value={editingClient.last_name}
                                  onChange={(e) => setEditingClient({...editingClient, last_name: e.target.value})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit_email">Email</Label>
                              <Input
                                id="edit_email"
                                type="email"
                                value={editingClient.email}
                                onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_phone">Phone Number</Label>
                              <Input
                                id="edit_phone"
                                value={editingClient.phone}
                                onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_dob">Date of Birth</Label>
                              <Input
                                id="edit_dob"
                                type="date"
                                value={editingClient.date_of_birth || ''}
                                onChange={(e) => setEditingClient({...editingClient, date_of_birth: e.target.value})}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingClient(null)}>
                              Cancel
                            </Button>
                            <Button type="submit" onClick={handleUpdateClient}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    
                    <Button 
                      variant={client.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleBanClient(client.id, client.status)}
                    >
                      {client.status === 'active' ? (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Ban
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          Unban
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredClients.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No clients found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsManager;
