
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, UserPlus, Edit, Search, Mail, Phone, Briefcase, Award, Trash2 } from 'lucide-react';

type StaffMember = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  specialty: string;
  hired_date: string;
  status: 'active' | 'inactive';
};

const roles = ['Dentist', 'Hygienist', 'Receptionist', 'Assistant', 'Manager'];
const specialties = ['General', 'Orthodontics', 'Pediatric', 'Periodontics', 'Prosthodontics', 'Endodontics', 'N/A'];

const StaffManager = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStaff, setNewStaff] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    specialty: '',
  });
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      // This is a mock API call - in a real app, you would fetch from your Supabase database
      // const { data, error } = await supabase.from('staff').select('*');
      
      // Mock data for demonstration
      const mockData = [
        {
          id: '1',
          first_name: 'Dr. Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@drsmile.com',
          phone: '123-456-7890',
          role: 'Dentist',
          specialty: 'General',
          hired_date: '2020-01-15',
          status: 'active' as const
        },
        {
          id: '2',
          first_name: 'Dr. Michael',
          last_name: 'Williams',
          email: 'michael.williams@drsmile.com',
          phone: '123-456-7891',
          role: 'Dentist',
          specialty: 'Orthodontics',
          hired_date: '2019-05-10',
          status: 'active' as const
        },
        {
          id: '3',
          first_name: 'Emily',
          last_name: 'Taylor',
          email: 'emily.taylor@drsmile.com',
          phone: '123-456-7892',
          role: 'Hygienist',
          specialty: 'General',
          hired_date: '2021-03-22',
          status: 'active' as const
        }
      ];
      
      setStaff(mockData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    try {
      // Validate input
      if (!newStaff.first_name || !newStaff.last_name || !newStaff.email || !newStaff.role) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }
      
      // In a real app, you would insert into the database
      /* 
      const { data, error } = await supabase.from('staff').insert({
        ...newStaff,
        hired_date: new Date().toISOString(),
        status: 'active'
      });
      */
      
      // Mock new staff with generated ID
      const newStaffWithId = {
        ...newStaff,
        id: Math.random().toString(36).substring(2, 9),
        hired_date: new Date().toISOString().split('T')[0],
        status: 'active' as const
      };
      
      setStaff([...staff, newStaffWithId]);
      
      // Reset form
      setNewStaff({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: '',
        specialty: '',
      });
      
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;
    
    try {
      // In a real app, you would update the database
      // await supabase.from('staff').update(editingStaff).eq('id', editingStaff.id);
      
      // Update local state
      setStaff(staff.map(s => 
        s.id === editingStaff.id ? editingStaff : s
      ));
      
      setEditingStaff(null);
      
      toast({
        title: "Success",
        description: "Staff information updated successfully",
      });
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        title: "Error",
        description: "Failed to update staff information",
        variant: "destructive",
      });
    }
  };

  const handleChangeStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} this staff member?`)) return;
    
    try {
      // In a real app, you would update the database
      // await supabase.from('staff').update({ status: newStatus }).eq('id', id);
      
      // Update local state
      setStaff(staff.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      
      toast({
        title: "Success",
        description: `Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error(`Error ${action}ing staff:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} staff member`,
        variant: "destructive",
      });
    }
  };

  const filteredStaff = staff.filter(s => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || 
           s.email.toLowerCase().includes(query) || 
           s.role.toLowerCase().includes(query) ||
           s.specialty.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Staff</h2>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 min-w-[250px]"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={newStaff.first_name}
                      onChange={(e) => setNewStaff({...newStaff, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={newStaff.last_name}
                      onChange={(e) => setNewStaff({...newStaff, last_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newStaff.role} 
                    onValueChange={(value) => setNewStaff({...newStaff, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select 
                    value={newStaff.specialty} 
                    onValueChange={(value) => setNewStaff({...newStaff, specialty: value})}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddStaff}>
                  Add Staff
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        <div className="space-y-4">
          {filteredStaff.map((staffMember) => (
            <Card key={staffMember.id} className={`border-l-4 ${staffMember.status === 'active' ? 'border-l-green-500' : 'border-l-gray-400'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="bg-dental-light-blue rounded-full p-3">
                      <User className="h-6 w-6 text-dental-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {staffMember.first_name} {staffMember.last_name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Briefcase className="h-4 w-4 mr-1 text-dental-blue" />
                        <span className="font-medium text-sm text-dental-blue">{staffMember.role}</span>
                        {staffMember.specialty && staffMember.specialty !== 'N/A' && (
                          <>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-sm text-gray-600">{staffMember.specialty}</span>
                          </>
                        )}
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {staffMember.email}
                        </div>
                        {staffMember.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {staffMember.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          Member since {staffMember.hired_date}
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
                          onClick={() => setEditingStaff(staffMember)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      {editingStaff && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Staff Member</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit_first_name">First Name</Label>
                                <Input
                                  id="edit_first_name"
                                  value={editingStaff.first_name}
                                  onChange={(e) => setEditingStaff({...editingStaff, first_name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_last_name">Last Name</Label>
                                <Input
                                  id="edit_last_name"
                                  value={editingStaff.last_name}
                                  onChange={(e) => setEditingStaff({...editingStaff, last_name: e.target.value})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="edit_email">Email</Label>
                              <Input
                                id="edit_email"
                                type="email"
                                value={editingStaff.email}
                                onChange={(e) => setEditingStaff({...editingStaff, email: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_phone">Phone Number</Label>
                              <Input
                                id="edit_phone"
                                value={editingStaff.phone}
                                onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_role">Role</Label>
                              <Select 
                                value={editingStaff.role} 
                                onValueChange={(value) => setEditingStaff({...editingStaff, role: value})}
                              >
                                <SelectTrigger id="edit_role">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit_specialty">Specialty</Label>
                              <Select 
                                value={editingStaff.specialty} 
                                onValueChange={(value) => setEditingStaff({...editingStaff, specialty: value})}
                              >
                                <SelectTrigger id="edit_specialty">
                                  <SelectValue placeholder="Select specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {specialties.map(specialty => (
                                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingStaff(null)}>
                              Cancel
                            </Button>
                            <Button type="submit" onClick={handleUpdateStaff}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                    
                    <Button 
                      variant={staffMember.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleChangeStatus(staffMember.id, staffMember.status)}
                    >
                      {staffMember.status === 'active' ? (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredStaff.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No staff members found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffManager;
