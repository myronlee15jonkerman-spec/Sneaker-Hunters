import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stabutfvkrxbglgjkelk.supabase.co";
const supabaseKey = "sb_publishable_fmy2lW7gYHIFPC1sNzhdzw_ZFUX-xZt";

export const supabase = createClient(supabaseUrl, supabaseKey);