
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import AdminLogin from '@/components/portal/AdminLogin';
import AdminRegister from '@/components/portal/AdminRegister';

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<"patient" | "admin">("patient");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                {userType === "patient" ? "Patient Portal" : "Admin Portal"}
              </span>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                {userType === "patient" 
                  ? "Access your dental records, appointments, and more." 
                  : "Access admin dashboard, manage content and appointments."}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setUserType("patient")}
                  className={`px-4 py-1 rounded-l-md ${userType === "patient" 
                    ? "bg-dental-blue text-white" 
                    : "bg-gray-100 text-gray-600"}`}
                >
                  Patient
                </button>
                <button
                  onClick={() => setUserType("admin")}
                  className={`px-4 py-1 rounded-r-md ${userType === "admin" 
                    ? "bg-dental-blue text-white" 
                    : "bg-gray-100 text-gray-600"}`}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-xl shadow-lg animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {userType === "patient" ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 w-full">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <PatientLogin />
                  </TabsContent>
                  <TabsContent value="register">
                    <PatientRegister />
                  </TabsContent>
                </Tabs>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 w-full">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <AdminLogin />
                  </TabsContent>
                  <TabsContent value="register">
                    <AdminRegister />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientPortal;
