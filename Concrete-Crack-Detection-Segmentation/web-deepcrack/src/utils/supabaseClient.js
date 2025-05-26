// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabaseConfig';

const supabase = createClient(supabaseConfig.url, supabaseConfig.key);

export default supabase;