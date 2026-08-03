import { DonorLead } from "./kuber.types";

export class KuberService {

  async research(query: string): Promise<DonorLead[]> {

    console.log("Research:", query);

    // Gemini API
    // Google Search
    // Supabase Save

    return [];

  }

}

export const kuberService = new KuberService();