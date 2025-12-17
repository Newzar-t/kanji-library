import './style.css'
import { createClient } from '@supabase/supabase-js'

class Home {
  constructor(){
     this.initSupabase()
  }

initSupabase(){
  this.supabase = createClient('https://flwtxxzmabehcaktnkme.supabase.co',process.env.SUPABASE_KEY);
}
}
