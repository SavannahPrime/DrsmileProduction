
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, UserPlus, UserX, Edit, Search, Mail, Phone, Calendar } from 'lucide-react';
import { fetchClients, addClient, updateClient, deleteClient } from '@/lib/api';

type ClientStatus = 'active' | 'inactive' | 'banned';

type Client = {
  id: string;
  auth_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  created_at: string;
  status: ClientStatus;
};

// Type for the data coming from the database
type ClientFromDB = Omit<Client, 'status'> & {
  status: string;
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

  const loadClients = async () => {
    setLoading(true);
    const data = await fetchClients();
    // Cast the data to ensure status is one of the allowed values
    const typedData: Client[] = data.map((client: ClientFromDB) => ({
      ...client,
      status: client.status as ClientStatus,
    }));
    setClients(typedData);
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
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
      
      const result = await addClient(newClient);
      
      if (result) {
        // Ensure the result has the correct type
        const typedResult: Client = {
          ...result,
          status: (result.status || 'active') as ClientStatus,
        };
        
        setClients([...clients, typedResult]);
        
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
          description: "Client added successfully. Login credentials have been emailed to the client.",
        });
      }
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    
    try {
      const result = await updateClient(editingClient.id, {
        first_name: editingClient.first_name,
        last_name: editingClient.last_name,
        email: editingClient.email,
        phone: editingClient.phone,
        date_of_birth: editingClient.date_of_birth,
        status: editingClient.status
      });
      
      if (result) {
        // Ensure the result has the correct type
        const typedResult: Client = {
          ...result,
          status: result.status as ClientStatus,
        };
        
        // Update local state
        setClients(clients.map(client => 
          client.id === editingClient.id ? typedResult : client
        ));
        
        setEditingClient(null);
        
        toast({
          title: "Success",
          description: "Client information updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update client information",
        variant: "destructive",
      });
    }
  };

  const handleBanClient = async (id: string, authId: string, currentStatus: ClientStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const action = newStatus === 'banned' ? 'ban' : 'unban';
    
    if (!confirm(`Are you sure you want to ${action} this client?`)) return;
    
    try {
      const result = await updateClient(id, { status: newStatus });
      
      if (result) {
        // Update local state with type safety
        setClients(clients.map(client => 
          client.id === id ? { ...client, status: newStatus as ClientStatus } : client
        ));
        
        toast({
          title: "Success",
          description: `Client ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`,
        });
      }
    } catch (error: any) {
      console.error(`Error ${action}ning client:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} client`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (id: string, authId: string) => {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) return;
    
    try {
      const success = await deleteClient(id, authId);
      
      if (success) {
        // Update local state
        setClients(clients.filter(client => client.id !== id));
        
        toast({
          title: "Success",
          description: "Client deleted successfully",
        });
      }
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete client",
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
                          Registered: {new Date(client.created_at).toLocaleDateString()}
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
                      onClick={() => handleBanClient(client.id, client.auth_id, client.status)}
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
                    
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id, client.auth_id)}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Delete
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
