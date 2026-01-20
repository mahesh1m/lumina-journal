
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugnoxnidupuewfxncvzo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnbm94bmlkdXB1ZXdmeG5jdnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDQ2NDIsImV4cCI6MjA4MzQyMDY0Mn0.ciDhxsCxYDdj3tZr84f30IZf8n50aht1wG70hvbkbDQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
