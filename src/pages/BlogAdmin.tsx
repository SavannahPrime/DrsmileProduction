
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { BlogPost } from '@/types/blog';

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  const form = useForm<BlogPost>({
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      category: '',
      author: 'Dr. Smile',
      image_url: '',
      is_published: true
    }
  });

  // Check if user is authenticated as an admin
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast.error("Please login to access this page");
        navigate("/patient-portal");
        return;
      }

      // Check if user is a blog author
      const { data: authorData, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('email', data.session.user.email);

      if (error || !authorData || authorData.length === 0) {
        toast.error("You don't have permission to access this page");
        navigate("/");
      }

      loadPosts();
    };

    checkAuth();
  }, [navigate]);

  // Load posts from database
  const loadPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      toast.error("Failed to load blog posts");
      console.error(error);
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  // Reset form with editing post data or clear it
  useEffect(() => {
    if (editingPost) {
      form.reset(editingPost);
    } else {
      form.reset({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: 'Dr. Smile',
        image_url: '',
        is_published: true
      });
    }
  }, [editingPost, form]);

  // Submit form handler
  const onSubmit = async (data: BlogPost) => {
    setIsSubmitting(true);
    let response;

    try {
      if (editingPost) {
        // Update existing post
        response = await supabase
          .from('blog_posts')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);
        
        if (response.error) throw response.error;
        toast.success("Blog post updated successfully");
      } else {
        // Create new post
        response = await supabase
          .from('blog_posts')
          .insert([{
            ...data,
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (response.error) throw response.error;
        toast.success("Blog post created successfully");
      }

      // Reset form and reload posts
      setEditingPost(null);
      form.reset({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        author: 'Dr. Smile',
        image_url: '',
        is_published: true
      });
      loadPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete post handler
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setIsLoading(true);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete post");
        console.error(error);
      } else {
        toast.success("Post deleted successfully");
        loadPosts();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Blog Management</h1>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="editor">Post Editor</TabsTrigger>
              <TabsTrigger value="posts">All Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Post title" 
                                {...field} 
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Oral Hygiene, Cosmetic Dentistry" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="author"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Author</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Author name" 
                                  {...field} 
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt (Brief Summary)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Brief summary of the post (shown in previews)" 
                                className="h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Full content of your blog post" 
                                className="h-48"
                                {...field} 
                                required
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="URL to the featured image" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="h-4 w-4"
                              />
                            </FormControl>
                            <FormLabel className="m-0">Publish immediately</FormLabel>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                        </Button>
                        {editingPost && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setEditingPost(null)}
                          >
                            Cancel Editing
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle>All Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-center py-4">Loading posts...</p>
                  ) : posts.length === 0 ? (
                    <p className="text-center py-4">No posts found. Create your first post!</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.category || '-'}</TableCell>
                            <TableCell>{post.author}</TableCell>
                            <TableCell>{new Date(post.published_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {post.is_published ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle2 className="h-4 w-4 mr-1" /> Published
                                </span>
                              ) : (
                                <span className="flex items-center text-amber-600">
                                  <AlertCircle className="h-4 w-4 mr-1" /> Draft
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setEditingPost(post)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogAdmin;
