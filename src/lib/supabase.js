import { createClient } from '@supabase/supabase-js';

// Hardcode your Supabase URL and key here
const supabaseUrl = 'https://efsmzslkgxrdwcjnkjbu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmc216c2xrZ3hyZHdjam5ramJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMTY3NTMsImV4cCI6MjA1NDc5Mjc1M30.X0NaUv_-s6Gx35f7LA3ZFKwr7AcVHKS9t_xqCSo1kbM'; 

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);