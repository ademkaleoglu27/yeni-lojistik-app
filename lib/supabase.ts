import { createClient } from '@supabase/supabase-js';

// Supabase'den aldığın URL'yi tırnak içine yapıştır
const supabaseUrl = "https://txfivqetjfyxagxdcgmf.supabase.co";

// Supabase'den aldığın ANON KEY'i tırnak içine yapıştır
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Zml2cWV0amZ5eGFneGRjZ21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDA1NDcsImV4cCI6MjA4MDU3NjU0N30.-QaHioHgaz6MEmENO4fnT4_3mQr1Bw-yW5uwjUO3SXk";

export const supabase = createClient(supabaseUrl, supabaseKey);