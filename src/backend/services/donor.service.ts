import { supabase } from "../lib/supabase";

export interface DonorLead {
  organization_name: string;
  website?: string;
  source_url?: string;
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  focus_area?: string;
  lead_score?: number;
  status?: string;
  verified_at?: string;
  notes?: string;
}

export async function getAllDonorLeads() {
  const { data, error } = await supabase
    .from("donor_leads")
    .select("*")
    .order("lead_score", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getDonorLeadById(id: string) {
  const { data, error } = await supabase
    .from("donor_leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createDonorLead(lead: DonorLead) {
  const { data, error } = await supabase
    .from("donor_leads")
    .insert([lead])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateDonorLead(
  id: string,
  updates: Partial<DonorLead>
) {
  const { data, error } = await supabase
    .from("donor_leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteDonorLead(id: string) {
  const { error } = await supabase
    .from("donor_leads")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return {
    success: true,
    message: "Donor lead deleted successfully",
  };
}