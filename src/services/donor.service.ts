import { supabase } from "../lib/supabase";

export interface DonorLead {
  id?: string;
  organization_name: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  focus_area?: string;
  lead_score?: number;
  status?: string;
  notes?: string;
}

export async function getDonorLeads() {
  const { data, error } = await supabase
    .from("donor_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createDonorLead(lead: DonorLead) {
  const { data, error } = await supabase
    .from("donor_leads")
    .insert([lead])
    .select();

  if (error) throw error;

  return data;
}