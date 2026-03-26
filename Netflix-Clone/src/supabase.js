import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ylkxpstrqgsrxggnlcbs.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_8R2tJTpWc4OpFB9kjYF6Og_2c6WBk2t'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
