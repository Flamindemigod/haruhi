import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
export const supabaseServer = () =>
  createClient(supabaseUrl, supabaseServiceKey);

export const verifySession = async (id: number, sessionId: string) => {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("users").select().eq("id", id);
  console.log(error);
  if (data![0].sessionId === sessionId) {
    return true;
  }
  return false;
};
