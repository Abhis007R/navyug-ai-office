export interface DonorLead {
  id?: string;
  organization: string;
  contactPerson?: string;
  email?: string;
  website?: string;
  phone?: string;

  category:
    | "CSR"
    | "Foundation"
    | "Government"
    | "Individual";

  focusAreas: string[];

  state?: string;
  city?: string;

  score?: number;

  status:
    | "new"
    | "researching"
    | "proposal_pending"
    | "emailed"
    | "responded"
    | "closed";
}