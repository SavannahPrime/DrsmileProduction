
import { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "Dr. Smile transformed my dental experience. After years of anxiety about visiting the dentist, their gentle approach and modern facilities made me feel completely at ease. My smile has never looked better!",
    author: "Sarah Johnson",
    role: "Marketing Executive",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5
  },
  {
    id: 2,
    content: "The entire team at Dr. Smile Dental Clinic is exceptional. From the moment you walk in, you're treated with care and respect. My children actually look forward to their dental check-ups now!",
    author: "Michael Rodriguez",
    role: "School Teacher",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 3,
    content: "I needed emergency dental work after an accident, and Dr. Smile accommodated me immediately. Their professionalism and expertise saved my tooth. I couldn't be more grateful for their care.",
    author: "Emma Thompson",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    rating: 5
  },
  {
    id: 4,
    content: "The cosmetic dentistry services at Dr. Smile are outstanding. My veneers look completely natural, and the team took time to understand exactly what I wanted. Worth every penny!",
    author: "David Chen",
    role: "Business Owner",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 5
  },
  {
    id: 5,
    content: "After moving to the area, I tried several dental clinics before finding Dr. Smile. The difference in care quality is remarkable. Their attention to detail and personalized approach sets them apart.",
    author: "Jessica Williams",
    role: "Nurse Practitioner",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-dental-light-blue/30 via-white to-dental-light-green/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Patients Say</h2>
          <p className="text-muted-foreground">
            Real stories from real patients about their experience at Dr. Smile Dental Clinic.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute -top-10 -left-10 text-dental-blue/10">
            <Quote size={100} />
          </div>
          
          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="min-w-full px-4"
                >
                  <div className="glass-card rounded-2xl p-8 md:p-10 shadow-lg animate-fade-up">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.author} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-dental-blue text-white p-1 rounded-full shadow-md">
                            <Quote size={16} />
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <div className="flex justify-center md:justify-start mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                            />
                          ))}
                        </div>
                        <p className="text-lg mb-4">"{testimonial.content}"</p>
                        <div>
                          <h4 className="font-medium">{testimonial.author}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-dental-light-blue transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="text-dental-blue" />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === index 
                      ? "bg-dental-blue w-5" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 hover:bg-dental-light-blue transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-dental-blue" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
