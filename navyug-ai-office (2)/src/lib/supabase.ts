import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
const supabaseKey = (process.env.SUPABASE_KEY || "").trim();

let internalClient: any = null;

const getClient = () => {
  const isInvalid = !supabaseUrl || 
                    !supabaseKey || 
                    supabaseUrl === "YOUR_SUPABASE_URL" || 
                    supabaseKey === "YOUR_SUPABASE_KEY" || 
                    !/^https?:\/\//i.test(supabaseUrl);

  if (isInvalid) {
    throw new Error("Supabase environment variables are missing.");
  }
  if (!internalClient) {
    internalClient = createClient(supabaseUrl, supabaseKey);
  }
  return internalClient;
};

export const supabase = new Proxy({} as any, {
  get(target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const client = getClient();
    return Reflect.set(client, prop, value, receiver);
  },
  has(target, prop) {
    const client = getClient();
    return Reflect.has(client, prop);
  }
});

