
import { MapPin } from 'lucide-react';

const Map = () => {
  return (
    <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="glass-card p-8 rounded-xl shadow-lg h-full">
        <h2 className="text-2xl font-bold mb-6">Our Location</h2>
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-6">
          <iframe
            className="absolute top-0 left-0 w-full h-full border-0"
            title="Dr. Smile Dental Clinic Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8114530940403!2d36.8478!3d-1.2727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTYnMjEuNyJTIDM2wrA1MCc1Mi4xIkU!5e0!3m2!1sen!2sus!4v1616597848024!5m2!1sen!2sus"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="bg-dental-light-blue/30 p-4 rounded-lg flex items-start gap-3">
          <MapPin className="text-dental-blue mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium mb-1">Dr. Smile Dental Clinic</h3>
            <p className="text-muted-foreground text-sm">Eastleigh 1st Avenue, next to Marie Stopes Maternity Hospital, Nairobi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
