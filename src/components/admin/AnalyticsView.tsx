
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

// Mock data for demonstration
const appointmentsByMonth = [
  { name: 'Jan', count: 45 },
  { name: 'Feb', count: 52 },
  { name: 'Mar', count: 48 },
  { name: 'Apr', count: 61 },
  { name: 'May', count: 58 },
  { name: 'Jun', count: 65 },
  { name: 'Jul', count: 70 },
  { name: 'Aug', count: 75 },
  { name: 'Sep', count: 68 },
  { name: 'Oct', count: 72 },
  { name: 'Nov', count: 78 },
  { name: 'Dec', count: 82 }
];

const serviceData = [
  { name: 'Teeth Cleaning', value: 35 },
  { name: 'Cavity Filling', value: 25 },
  { name: 'Root Canal', value: 15 },
  { name: 'Teeth Whitening', value: 10 },
  { name: 'Orthodontics', value: 8 },
  { name: 'Other', value: 7 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#FF6B6B'];

const dentistPerformance = [
  { name: 'Dr. Johnson', patients: 148, revenue: 22500 },
  { name: 'Dr. Smith', patients: 135, revenue: 20800 },
  { name: 'Dr. Williams', patients: 125, revenue: 19000 },
  { name: 'Dr. Brown', patients: 115, revenue: 17500 },
  { name: 'Dr. Davis', patients: 108, revenue: 16200 }
];

const revenueByMonth = [
  { name: 'Jan', revenue: 15000 },
  { name: 'Feb', revenue: 17500 },
  { name: 'Mar', revenue: 16800 },
  { name: 'Apr', revenue: 19200 },
  { name: 'May', revenue: 18500 },
  { name: 'Jun', revenue: 21000 },
  { name: 'Jul', revenue: 22800 },
  { name: 'Aug', revenue: 24500 },
  { name: 'Sep', revenue: 23000 },
  { name: 'Oct', revenue: 25200 },
  { name: 'Nov', revenue: 26800 },
  { name: 'Dec', revenue: 28500 }
];

const AnalyticsView = () => {
  const [timeframe, setTimeframe] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate total numbers for the overview cards
  const totalAppointments = appointmentsByMonth.reduce((sum, month) => sum + month.count, 0);
  const totalRevenue = revenueByMonth.reduce((sum, month) => sum + month.revenue, 0);
  const totalPatients = 632; // Mock total patients count
  const averageRating = 4.8; // Mock average rating
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Timeframe:</span>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{totalAppointments}</CardTitle>
            <p className="text-muted-foreground text-sm">Total Appointments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">{totalPatients}</CardTitle>
            <p className="text-muted-foreground text-sm">Total Patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">${(totalRevenue / 1000).toFixed(1)}k</CardTitle>
            <p className="text-muted-foreground text-sm">Total Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">{averageRating}</CardTitle>
            <p className="text-muted-foreground text-sm">Average Rating</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="dentists">Dentists</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="p-6">
            <TabsContent value="overview" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Appointments by Month</CardTitle>
              </CardHeader>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Services Distribution</CardTitle>
              </CardHeader>
              <div className="h-[350px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} patients`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="dentists" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Dentist Performance</CardTitle>
              </CardHeader>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dentistPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="patients" name="Patients Seen" fill="#2ecc71" />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#9b59b6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="mt-0">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Revenue by Month</CardTitle>
              </CardHeader>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#e74c3c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
