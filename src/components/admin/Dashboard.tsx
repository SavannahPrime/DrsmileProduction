
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  Users, 
  Calendar, 
  ChartBar, 
  MessageSquare, 
  FileText, 
  Settings, 
  Bell, 
  Mail, 
  Printer,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import BookingsManager from '@/components/admin/BookingsManager';
import ClientsManager from '@/components/admin/ClientsManager';
import StaffManager from '@/components/admin/StaffManager';
import AnalyticsView from '@/components/admin/AnalyticsView';
import BlogManager from '@/components/admin/BlogManager';
import MessagesManager from '@/components/admin/MessagesManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();
  
  const handleRefresh = () => {
    // This would typically trigger a data refresh
    console.log("Refreshing dashboard data");
  };
  
  const handleExport = () => {
    // This would typically trigger a data export
    console.log("Exporting dashboard data");
  };
  
  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-dental-blue">Admin Dashboard</h1>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="border-dental-blue/30 text-dental-blue"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          
          <Button 
            variant="outline"
            className="border-dental-blue/30 text-dental-blue"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          
          <Button 
            onClick={() => navigate('/blog-admin')} 
            className="bg-dental-blue hover:bg-dental-blue/90"
          >
            <Edit className="mr-2 h-4 w-4" />
            Advanced Blog Editor
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-dental-blue" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Appointments</p>
              <p className="text-2xl font-bold text-dental-blue">12</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-green-600">1,432</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Messages</p>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <ChartBar className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-amber-600">$24,500</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-8 mb-8">
          <TabsTrigger value="bookings" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <ChartBar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Blog</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="border-dental-light-blue/30">
          <CardContent className="p-6">
            <TabsContent value="bookings" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Appointments Manager</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Schedule
                  </Button>
                  <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                    <Calendar className="h-4 w-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
              </div>
              <BookingsManager />
            </TabsContent>
            
            <TabsContent value="clients" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Patient Records</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Patients
                  </Button>
                  <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                    <Users className="h-4 w-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              </div>
              <ClientsManager />
            </TabsContent>
            
            <TabsContent value="staff" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Staff Management</h2>
                <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Staff Member
                </Button>
              </div>
              <StaffManager />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Clinic Analytics</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
              <AnalyticsView />
            </TabsContent>
            
            <TabsContent value="blog" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Blog Content Management</h2>
                <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Post
                </Button>
              </div>
              <BlogManager />
            </TabsContent>
            
            <TabsContent value="messages" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Patient Messages</h2>
                <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </div>
              <MessagesManager />
            </TabsContent>
            
            <TabsContent value="email" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Email Campaigns</h2>
                <Button size="sm" className="bg-dental-blue hover:bg-dental-blue/90">
                  <Mail className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Email Campaign Management</h3>
                <p className="text-gray-500 mb-4">Create and manage email campaigns for appointment reminders, promotions, and patient education.</p>
                <Button className="bg-dental-blue hover:bg-dental-blue/90">Get Started</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">System Settings</h2>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Clinic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Clinic Name</label>
                        <input type="text" defaultValue="Dr. Smile Dental Clinic" className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input type="text" defaultValue="+1 (555) 123-4567" className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <textarea defaultValue="123 Dental Street, Suite 100, Medical City, MC 12345" className="w-full p-2 border rounded" rows={3}></textarea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-blue"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Reminders</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-blue"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Patient Portal Notifications</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dental-blue"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Dashboard;
