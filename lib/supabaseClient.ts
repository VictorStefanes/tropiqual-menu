// Configuração do Supabase para uso no Next.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zonavlsetqzpttrwuoio.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbmF2bHNldHF6cHR0cnd1b2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjE4ODUsImV4cCI6MjA2MjczNzg4NX0.OJMdJUV2jXE2t4cRphf-W3lT0k87VOP2njswPe02EkM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
