
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import Team from '@/components/about/Team';
import CTASection from '@/components/home/CTASection';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <Team />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
