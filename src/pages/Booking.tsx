
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AppointmentForm from '@/components/booking/AppointmentForm';
import { Card, CardContent } from '@/components/ui/card';

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 pt-20 pb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
              Professional Care
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Schedule Your Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Our team of experienced dental professionals is ready to provide you with the highest quality care.
              Schedule your appointment today.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto shadow-lg border-none overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="bg-dental-blue text-white p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Dr. Smile Dental Clinic</h2>
                    <p className="mb-6 opacity-90">
                      Experience the highest standard of dental care in a comfortable environment.
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 opacity-75">📍</div>
                        <p>123 Dental Street, New York, NY 10001</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 opacity-75">📞</div>
                        <p>(123) 456-7890</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 opacity-75">📧</div>
                        <p>info@drsmile.com</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 flex-shrink-0 opacity-75">🕒</div>
                        <p>Mon-Fri: 9am-5pm<br />Sat: 10am-2pm</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-sm opacity-75">
                      Our commitment is to provide the best dental care possible in a comfortable and relaxing environment.
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <AppointmentForm />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
