
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
      console.log(`Checking demo account: ${account.email}`);
      
      // Check if account already exists in auth.users
      const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers({
        filters: {
          email: account.email,
        },
      });
      
      if (userError) {
        console.error(`Error checking if user exists: ${userError.message}`);
      }
      
      const userExists = existingUser?.users && existingUser.users.length > 0;
      let userId = userExists ? existingUser.users[0].id : null;
      
      console.log(`User exists: ${userExists}, User ID: ${userId}`);
      
      if (!userExists) {
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
        
        userId = authData.user.id;
        console.log(`Demo account created: ${account.email}, user ID: ${userId}`);
      }
      
      // Always ensure correct roles are set
      if (account.isAdmin) {
        // Check if admin already exists in blog_authors table
        const { data: authorData, error: authorCheckError } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('email', account.email);
        
        if (authorCheckError) {
          console.error(`Error checking if admin exists in blog_authors: ${authorCheckError.message}`);
        }
        
        if (!authorData || authorData.length === 0) {
          // Add to blog_authors table
          const { error: authorError } = await supabase
            .from('blog_authors')
            .insert([{ email: account.email }]);
          
          if (authorError) {
            console.error(`Error adding admin to blog_authors: ${authorError.message}`);
          } else {
            console.log(`Added admin to blog_authors: ${account.email}`);
          }
        } else {
          console.log(`Admin already exists in blog_authors: ${account.email}`);
        }
      } else if (userId) {
        // For patient account, ensure it exists in clients table
        const { data: clientData, error: clientCheckError } = await supabase
          .from('clients')
          .select('*')
          .eq('auth_id', userId);
        
        if (clientCheckError) {
          console.error(`Error checking if client exists: ${clientCheckError.message}`);
        }
        
        if (!clientData || clientData.length === 0) {
          // Add to clients table
          const { error: clientError } = await supabase
            .from('clients')
            .insert([{
              auth_id: userId,
              first_name: 'Demo',
              last_name: 'Patient',
              email: account.email,
              phone: '0700000000',
              status: 'active'
            }]);
          
          if (clientError) {
            console.error(`Error adding patient to clients: ${clientError.message}`);
          } else {
            console.log(`Added patient to clients table: ${account.email}`);
          }
        } else {
          console.log(`Patient already exists in clients table: ${account.email}`);
        }
      }
    }
    
    return { success: true, message: "Demo accounts verified and created if needed" };
  } catch (error) {
    console.error("Error ensuring demo accounts exist:", error);
    return { success: false, error: error.message };
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
    
    const requestData = await req.json();
    
    // Check if this is a request to ensure demo accounts exist
    if (requestData.createDemoAccounts) {
      const result = await ensureDemoAccountsExist(supabase);
      return new Response(
        JSON.stringify(result),
        {
          status: result.success ? 200 : 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Always ensure demo accounts exist
    await ensureDemoAccountsExist(supabase);
    
    const { email } = requestData;
    
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
