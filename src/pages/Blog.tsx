
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogList from '@/components/blog/BlogList';
import CTASection from '@/components/home/CTASection';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <BlogList />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
