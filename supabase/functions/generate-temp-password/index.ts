
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Function to create demo accounts if they don't exist
async function ensureDemoAccountsExist(supabase: any) {
  try {
    // Demo accounts credentials
    const demoAccounts = [
      { email: 'patient@drsmile.com', password: 'password123', isAdmin: false },
      { email: 'admin@drsmile.com', password: 'password123', isAdmin: true }
    ];
    
    for (const account of demoAccounts) {
      // Check if account already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers({
        filters: {
          email: account.email,
        },
      });
      
      if (!existingUser.users || existingUser.users.length === 0) {
        // Create the user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
        });
        
        if (authError) {
          console.error(`Error creating demo account ${account.email}:`, authError);
          continue;
        }
        
        console.log(`Demo account created: ${account.email}`);
        
        // If admin, add to blog_authors table
        if (account.isAdmin) {
          const { error: authorError } = await supabase
            .from('blog_authors')
            .insert([{ email: account.email }]);
          
          if (authorError) {
            console.error(`Error adding demo admin to blog_authors:`, authorError);
          }
        } else {
          // Add to clients table
          const { error: clientError } = await supabase
            .from('clients')
            .insert([{
              auth_id: authData.user.id,
              first_name: 'Demo',
              last_name: 'Patient',
              email: account.email,
              phone: '0700000000',
              status: 'active'
            }]);
          
          if (clientError) {
            console.error(`Error adding demo patient to clients:`, clientError);
          }
        }
      } else {
        console.log(`Demo account already exists: ${account.email}`);
      }
    }
  } catch (error) {
    console.error("Error ensuring demo accounts exist:", error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Ensure demo accounts exist
    await ensureDemoAccountsExist(supabase);
    
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    
    if (authError) {
      console.error("Error creating user:", authError);
      throw authError;
    }
    
    console.log("User created successfully with temporary password");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: authData.user.id, 
        tempPassword 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in generate-temp-password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
