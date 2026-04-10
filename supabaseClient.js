import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wbvcmioymoapubakteze.supabase.co',
  'sb_publishable_2eUno3hIHh-YcHuKLmeOJg_5HEsjDuj'
)

export default supabase