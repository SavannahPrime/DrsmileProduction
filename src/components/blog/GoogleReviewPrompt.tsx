
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const GoogleReviewPrompt = () => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewData, setReviewData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // You can update this with the actual Google review URL for the dental practice
  const googleReviewUrl = "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleDirectReview = () => {
    window.open(googleReviewUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real application, you would send this data to your backend
    // and potentially use an API or email to encourage the user to post
    // the same review on Google
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Thank you for your feedback!",
        description: "Your review has been submitted. We'd also appreciate if you could share it on Google!",
        variant: "default",
      });
      setReviewData({ name: '', email: '', review: '' });
      setExpanded(false);
    }, 1000);
  };

  return (
    <Card className="bg-dental-light-blue border-none">
      <CardContent className="p-6 md:p-8">
        {!expanded ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-white p-4 rounded-full">
              <ThumbsUp className="h-10 w-10 text-dental-blue" />
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
              <p className="mb-2">Your review helps others find quality dental care!</p>
              <div className="flex justify-center md:justify-start mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="bg-white hover:bg-gray-50"
                onClick={() => setExpanded(true)}
              >
                Write a Review
              </Button>
              
              <Button 
                className="bg-dental-blue hover:bg-dental-blue/90"
                onClick={handleDirectReview}
              >
                Review on Google
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-fade-up">
            <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
            
            <div className="mb-4">
              <Label htmlFor="rating" className="mb-2 block">Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-7 w-7 ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name" className="mb-2 block">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={reviewData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="mb-2 block">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={reviewData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="review" className="mb-2 block">Your Review</Label>
              <Textarea
                id="review"
                name="review"
                value={reviewData.review}
                onChange={handleInputChange}
                placeholder="Tell us about your experience..."
                className="h-24"
                required
              />
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setExpanded(false)}
              >
                Cancel
              </Button>
              
              <div className="space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                  onClick={handleDirectReview}
                >
                  Go to Google
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-dental-blue hover:bg-dental-blue/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleReviewPrompt;
