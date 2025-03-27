
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the auth role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@drsmile.com';
    const adminPassword = 'DrSmile2023!';

    // Check if admin exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserByEmail(adminEmail);
    
    if (fetchError && fetchError.message !== 'User not found') {
      throw fetchError;
    }

    if (!existingUser) {
      // Create admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
      
      if (createError) throw createError;
      
      console.log("Created admin user:", newUser);
      
      // Add to blog_authors table
      const { error: authorError } = await supabaseAdmin
        .from('blog_authors')
        .insert({ email: adminEmail });
        
      if (authorError) throw authorError;
      
      return new Response(
        JSON.stringify({ success: true, message: "Admin user created successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Check if admin is in blog_authors table
      const { data: authorData, error: authorError } = await supabaseAdmin
        .from('blog_authors')
        .select('*')
        .eq('email', adminEmail)
        .single();
        
      if (authorError && authorError.message !== 'No rows found') {
        throw authorError;
      }
      
      // Add to blog_authors if not there
      if (!authorData) {
        const { error: insertError } = await supabaseAdmin
          .from('blog_authors')
          .insert({ email: adminEmail });
          
        if (insertError) throw insertError;
      }
      
      return new Response(
        JSON.stringify({ success: true, message: "Admin user already exists" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
