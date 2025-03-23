
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Maintaining Healthy Teeth Between Dental Visits",
    excerpt: "Learn the best practices for oral hygiene that will keep your smile bright and your teeth strong between your regular dental check-ups.",
    category: "Oral Hygiene",
    author: "Dr. Emily Johnson",
    date: "May 15, 2023",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Understanding Teeth Whitening: What You Need to Know",
    excerpt: "Explore the different methods of teeth whitening, from professional procedures to at-home kits, and discover which option is best for you.",
    category: "Cosmetic Dentistry",
    author: "Dr. Michael Rodriguez",
    date: "April 28, 2023",
    image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "How to Prepare Your Child for Their First Dental Visit",
    excerpt: "First dental visits can be intimidating for children. Learn how to make the experience positive and set the foundation for good oral health.",
    category: "Pediatric Dentistry",
    author: "Dr. Sarah Kim",
    date: "March 12, 2023",
    image: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "The Connection Between Oral Health and Overall Wellness",
    excerpt: "Discover how the health of your mouth, teeth, and gums can impact your general health and why maintaining good oral hygiene is essential.",
    category: "Health & Wellness",
    author: "Dr. James Wilson",
    date: "February 5, 2023",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Advancements in Dental Technology: What's New in 2023",
    excerpt: "Explore the cutting-edge technologies that are transforming modern dentistry and improving patient comfort and treatment outcomes.",
    category: "Dental Technology",
    author: "Dr. Emily Johnson",
    date: "January 20, 2023",
    image: "https://images.unsplash.com/photo-1462043216916-996a57ea20f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Managing Dental Anxiety: Tips for a Stress-Free Visit",
    excerpt: "Dental anxiety is common, but it shouldn't prevent you from receiving necessary care. Learn strategies to manage anxiety before and during your visit.",
    category: "Patient Care",
    author: "Dr. Michael Rodriguez",
    date: "December 8, 2022",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const categories = [
  "All Categories",
  "Oral Hygiene",
  "Cosmetic Dentistry",
  "Pediatric Dentistry",
  "Health & Wellness",
  "Dental Technology",
  "Patient Care"
];

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Our Blog
          </span>
          <h1 className="text-4xl font-bold mb-4">Dental Health Insights</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of articles on dental health, treatments, and tips for maintaining a beautiful smile.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-dental-blue hover:bg-dental-blue/90" : ""}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="glass-card rounded-xl overflow-hidden shadow-lg hover-lift animate-fade-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User size={14} className="mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Clock size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  
                  <Button asChild variant="link" className="p-0 mt-4 text-dental-blue">
                    <Link to={`/blog/${post.id}`} className="flex items-center">
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p>No articles found matching your search criteria.</p>
              <Button 
                variant="link" 
                className="text-dental-blue mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All Categories");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
