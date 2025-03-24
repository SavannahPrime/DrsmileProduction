
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, Plus, Trash2, Calendar, User, Tag, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  published_at: string;
  is_published: boolean;
  image_url?: string;
};

const BlogManager = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    is_published: false,
    image_url: ''
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    try {
      // Validate input
      if (!newPost.title || !newPost.content || !newPost.author || !newPost.category) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...newPost,
          published_at: new Date().toISOString(),
        })
        .select();
      
      if (error) throw error;
      
      setPosts([...(data || []), ...posts]);
      
      // Reset form
      setNewPost({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        is_published: false,
        image_url: ''
      });
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    } catch (error) {
      console.error('Error adding blog post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: editingPost.title,
          excerpt: editingPost.excerpt,
          content: editingPost.content,
          author: editingPost.author,
          category: editingPost.category,
          is_published: editingPost.is_published,
          image_url: editingPost.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingPost.id);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === editingPost.id ? editingPost : post
      ));
      
      setEditingPost(null);
      
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.filter(post => post.id !== id));
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === id ? { ...post, is_published: !currentStatus } : post
      ));
      
      toast({
        title: "Success",
        description: `Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update publish status",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query) || 
           post.content.toLowerCase().includes(query) || 
           post.author.toLowerCase().includes(query) ||
           post.category.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Blog</h2>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 min-w-[250px]"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                  <Textarea
                    id="excerpt"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={8}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newPost.author}
                      onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={newPost.image_url}
                    onChange={(e) => setNewPost({...newPost, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={newPost.is_published}
                    onCheckedChange={(checked) => setNewPost({...newPost, is_published: checked})}
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddPost}>
                  Create Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p>Loading blog posts...</p>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={`border-l-4 ${post.is_published ? 'border-l-green-500' : 'border-l-yellow-400'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Not published yet'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-3.5 w-3.5 mr-1.5" />
                          {post.author}
                        </div>
                        {post.category && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            {post.category}
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          {post.is_published ? (
                            <span className="flex items-center text-green-600">
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600">
                              <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.excerpt || post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
                <Button 
                  variant={post.is_published ? "destructive" : "default"}
                  size="sm"
                  onClick={() => togglePublishStatus(post.id, post.is_published)}
                >
                  {post.is_published ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingPost(post)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    {editingPost && (
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Edit Blog Post</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <Label htmlFor="edit_title">Title</Label>
                            <Input
                              id="edit_title"
                              value={editingPost.title}
                              onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit_excerpt">Excerpt (Short Summary)</Label>
                            <Textarea
                              id="edit_excerpt"
                              value={editingPost.excerpt || ''}
                              onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit_content">Content</Label>
                            <Textarea
                              id="edit_content"
                              value={editingPost.content}
                              onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                              rows={8}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit_author">Author</Label>
                              <Input
                                id="edit_author"
                                value={editingPost.author}
                                onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit_category">Category</Label>
                              <Input
                                id="edit_category"
                                value={editingPost.category || ''}
                                onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit_image_url">Image URL</Label>
                            <Input
                              id="edit_image_url"
                              value={editingPost.image_url || ''}
                              onChange={(e) => setEditingPost({...editingPost, image_url: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="edit_is_published"
                              checked={editingPost.is_published}
                              onCheckedChange={(checked) => setEditingPost({...editingPost, is_published: checked})}
                            />
                            <Label htmlFor="edit_is_published">Published</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingPost(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" onClick={handleUpdatePost}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
