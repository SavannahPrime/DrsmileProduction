
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  dentist: string;
  serviceType: string;
  message?: string;
}

const sendEmail = async (data: AppointmentData) => {
  // In a production environment, you would use a proper email service
  // like SendGrid, Mailgun, or AWS SES
  console.log("Sending email to patient:", data.email);
  console.log("Appointment details:", data);
  
  // Format the message for better readability
  const emailContent = `
    Dear ${data.firstName} ${data.lastName},

    Thank you for booking an appointment with Dr. Smile Dental Clinic.

    Your appointment details:
    - Date: ${new Date(data.date).toLocaleDateString()}
    - Time: ${data.timeSlot}
    - Dentist: ${data.dentist}
    - Service: ${data.serviceType}

    Please arrive 15 minutes before your appointment. If you need to reschedule or have any questions, please call us at (123) 456-7890.

    We look forward to seeing you!

    Best regards,
    Dr. Smile Dental Clinic
  `;
  
  // Also send notification to admin
  const adminNotification = `
    New Appointment Booked:
    
    Patient: ${data.firstName} ${data.lastName}
    Contact: ${data.email} / ${data.phone}
    Date: ${new Date(data.date).toLocaleDateString()}
    Time: ${data.timeSlot}
    Dentist: ${data.dentist}
    Service: ${data.serviceType}
    Additional Notes: ${data.message || "None"}
  `;
  
  console.log("Admin notification:", adminNotification);
  
  // For demonstration, we'll just return success
  // In production, you would send actual emails here
  return { success: true, emailContent, adminNotification };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appointmentData: AppointmentData = await req.json();
    
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "date", "timeSlot", "dentist", "serviceType"];
    for (const field of requiredFields) {
      if (!appointmentData[field as keyof AppointmentData]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Check if the slot is already booked (in a real app, you'd check against a database)
    // This will be handled by the appointments table we'll create
    
    // Send email to patient
    const emailResult = await sendEmail(appointmentData);
    
    // In a production app, here we would save the appointment to the database
    
    return new Response(JSON.stringify(emailResult), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
