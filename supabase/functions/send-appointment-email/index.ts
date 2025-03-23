
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
  
  // For demonstration, we'll just return success
  return { success: true };
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
    
    // Send email to patient
    const emailResult = await sendEmail(appointmentData);
    
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
