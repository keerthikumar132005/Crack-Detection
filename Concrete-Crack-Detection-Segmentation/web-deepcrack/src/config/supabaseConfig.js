import { createClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: process.env.REACT_APP_SUPABASE_URL || 'https://wqimmbwmpebuvmhhrctl.supabase.co/',
  key: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaW1tYndtcGVidXZtaGhyY3RsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODI1NjUzNiwiZXhwIjoyMDYzODMyNTM2fQ.uT2xITnVFPQ1_dDowSEK3DFNcZoOLNscrNS0nkR4JMY',
  bucketName: 'imaged', // Your bucket name
  tableName: 'image_details' // Your table name
};

export const createSupabaseClient = () => {
  const { url, key } = supabaseConfig;
  return createClient(url, key);
};