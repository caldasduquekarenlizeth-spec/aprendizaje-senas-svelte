import { createClient } from "@supabase/supabase-js";


export const PUBLIC_SUPABASE_URL = 'https://pltiqbvsraxprjkfbelv.supabase.co';
export const PUBLIC_SUPABASE_ANON_KEY = 'sb_publishable_lFz5wqUciFAiqPSXjxkIWQ_3DtPFczm';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);