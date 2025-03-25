
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { date, time, dentist, bookingId = null, duration = 60 } = await req.json();
    
    if (!date || !time || !dentist) {
      return new Response(
        JSON.stringify({ error: "Date, time and dentist are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Convert time string (e.g. "10:00 AM") to minutes from midnight
    const parseTimeToMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return hours * 60 + minutes;
    };
    
    const requestedStartMinutes = parseTimeToMinutes(time);
    const requestedEndMinutes = requestedStartMinutes + duration;
    
    // Query for existing bookings on the same date with the same dentist
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('date', date)
      .eq('dentist', dentist);
      
    // Exclude current booking if we're checking for an update
    if (bookingId) {
      query = query.neq('id', bookingId);
    }
    
    const { data: existingBookings, error } = await query;
    
    if (error) {
      console.error("Error fetching existing bookings:", error);
      throw error;
    }
    
    // Check for overlaps
    const conflicts = existingBookings.filter(booking => {
      const bookingStartMinutes = parseTimeToMinutes(booking.time);
      const bookingEndMinutes = bookingStartMinutes + (booking.duration || 60);
      
      // Check if there's an overlap
      return (
        (requestedStartMinutes < bookingEndMinutes && requestedEndMinutes > bookingStartMinutes) ||
        (bookingStartMinutes < requestedEndMinutes && bookingEndMinutes > requestedStartMinutes)
      );
    });
    
    return new Response(
      JSON.stringify({ 
        hasConflict: conflicts.length > 0,
        conflicts
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in booking-conflict-check function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
