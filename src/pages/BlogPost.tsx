
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import CTASection from '@/components/home/CTASection';
import GoogleReviewPrompt from '@/components/blog/GoogleReviewPrompt';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      if (!id) {
        setError("Blog post not found");
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();
      
      if (error) {
        console.error("Error fetching blog post:", error);
        setError("Blog post not found");
        setLoading(false);
        return;
      }
      
      setPost(data as BlogPost);
      setLoading(false);
    };
    
    fetchPost();
  }, [id]);

  // Function to format the content with proper paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground">Loading blog post...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Blog Post Header */}
        <div className="w-full bg-dental-light-blue py-14">
          <div className="container mx-auto px-4">
            <Link to="/blog" className="inline-flex items-center text-dental-blue mb-6 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center text-muted-foreground gap-4 mb-4">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(post.published_at || "").toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {post.category && (
                <span className="inline-block px-3 py-1 text-xs font-medium bg-white text-dental-blue rounded-full">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Blog Post Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-auto rounded-lg mb-8 shadow-lg"
              />
            )}
            
            <div className="prose prose-lg max-w-none">
              {formatContent(post.content)}
            </div>

            {/* Google Review Prompt */}
            <div className="mt-16 mb-8">
              <GoogleReviewPrompt />
            </div>
          </div>
        </div>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
