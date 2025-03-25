
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Download } from 'lucide-react';
import { fetchBookingAnalytics } from '@/lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#FF6B6B'];

const AnalyticsView = () => {
  const [timeframe, setTimeframe] = useState('year');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    serviceData: [],
    dentistData: [],
    monthsData: [],
  });
  
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      const data = await fetchBookingAnalytics(timeframe);
      setAnalyticsData(data);
      setLoading(false);
    };
    
    loadAnalytics();
  }, [timeframe]);
  
  // Calculate total numbers for the overview cards
  const totalAppointments = analyticsData.monthsData.reduce((sum, month: any) => sum + month.count, 0);
  const totalPatients = 632; // Mock total patients count
  const totalRevenue = 25000; // Mock total revenue
  const averageRating = 4.8; // Mock average rating
  
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Category,Count\n";
    
    // Data rows
    if (activeTab === 'overview') {
      analyticsData.monthsData.forEach((item: any) => {
        csvContent += `${item.name},${item.count}\n`;
      });
    } else if (activeTab === 'services') {
      analyticsData.serviceData.forEach((item: any) => {
        csvContent += `${item.name},${item.value}\n`;
      });
    } else if (activeTab === 'dentists') {
      analyticsData.dentistData.forEach((item: any) => {
        csvContent += `${item.name},${item.patients}\n`;
      });
    }
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${activeTab}_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
            {loading ? (
              <div className="flex justify-center items-center h-[350px]">
                <div className="animate-spin w-8 h-8 border-4 border-dental-blue border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
                <TabsContent value="overview" className="mt-0">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle>Appointments by Month</CardTitle>
                  </CardHeader>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.monthsData}>
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
                          data={analyticsData.serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.serviceData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} appointments`} />
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
                      <BarChart data={analyticsData.dentistData} layout="vertical">
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
                      <BarChart data={analyticsData.monthsData.map((month: any) => ({
                        name: month.name,
                        revenue: month.count * 150 // Simulated revenue calculation
                      }))}>
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
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AnalyticsView;
