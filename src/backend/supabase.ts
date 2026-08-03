import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,https://zygzwcxkopwdlahzszht.supabase.co
  process.env.SUPABASE_ANON_KEY!sb_publishable_0HtI9wKNXrlMcpiEdEjhVA_WiD1_rOb
);
