

import { createClient } from '@supabase/supabase-js';

// my project info:
const supabaseUrl = 'https://zhttihwlvahjmlbkocrm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpodHRpaHdsdmFoam1sYmtvY3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAzOTMsImV4cCI6MjA2NzU0NjM5M30.BlIonbI9Y9NmtjqFdrmHlVS5Ve-KlHn7peU8A8lUdCc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
