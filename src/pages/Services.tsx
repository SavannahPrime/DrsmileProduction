
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceList from '@/components/services/ServiceList';
import CTASection from '@/components/home/CTASection';

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ServiceList />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
