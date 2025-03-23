
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  author: string;
  published_at?: string;
  updated_at?: string;
  image_url?: string;
  is_published: boolean;
}
