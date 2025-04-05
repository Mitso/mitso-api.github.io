const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.ENDPOINT, process.env.PUBLIC);
module.exports = supabase