
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-gradient-to-br from-white via-dental-light-blue/30 to-dental-light-green/30 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Get in Touch
          </span>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to answer any questions you may have about our dental services. Reach out to us and we'll respond as soon as we can.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <MapPin className="h-6 w-6" />,
              title: "Our Location",
              content: "Eastleigh 1st Avenue, next to Marie Stopes Maternity Hospital",
              color: "text-dental-blue",
              bgColor: "bg-dental-light-blue"
            },
            {
              icon: <Phone className="h-6 w-6" />,
              title: "Phone Number",
              content: "0798 997 093",
              color: "text-green-500",
              bgColor: "bg-dental-light-green"
            },
            {
              icon: <Mail className="h-6 w-6" />,
              title: "Email Address",
              content: "info@drsmile.com",
              color: "text-dental-blue",
              bgColor: "bg-dental-light-blue"
            },
            {
              icon: <Clock className="h-6 w-6" />,
              title: "Working Hours",
              content: "Mon-Fri: 8am-6pm, Sat: 9am-2pm",
              color: "text-green-500",
              bgColor: "bg-dental-light-green"
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="glass-card p-6 rounded-xl text-center animate-fade-up hover-lift"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`${item.bgColor} ${item.color} p-3 rounded-full inline-flex justify-center items-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
