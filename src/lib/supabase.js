import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://cjklubeoqrpmcwjuekgp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa2x1YmVvcXJwbWN3anVla2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTcyMDIsImV4cCI6MjA5MzQ5MzIwMn0.j9-lCyzIfVtm5SvGn3KWaD1VQdKb3EMGkghwiiLHH3I',
)
