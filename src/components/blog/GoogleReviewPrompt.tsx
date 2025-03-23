
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';

const GoogleReviewPrompt = () => {
  // You can update this with the actual Google review URL for the dental practice
  const googleReviewUrl = "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review";

  return (
    <Card className="bg-dental-light-blue border-none">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 bg-white p-4 rounded-full">
            <ThumbsUp className="h-10 w-10 text-dental-blue" />
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
            <p className="mb-2">Your Google review helps others find quality dental care!</p>
            <div className="flex justify-center md:justify-start mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
          
          <Button 
            className="bg-dental-blue hover:bg-dental-blue/90"
            onClick={() => window.open(googleReviewUrl, '_blank')}
          >
            Leave a Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleReviewPrompt;
