// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uhlrswrmjalslhpatprv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobHJzd3JtamFsc2xocGF0cHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTcyMDUsImV4cCI6MjA1ODMzMzIwNX0.WlK4Cf8EDmvPwkItbYQpXyv_-NzHqrTwPs3S_FSF8Xc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);