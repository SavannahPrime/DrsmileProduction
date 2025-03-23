
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AppointmentForm from '@/components/booking/AppointmentForm';

const Booking = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AppointmentForm />
      </main>
      <Footer />
    </div>
  );
};

export default Booking;
