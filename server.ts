import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./src/backend/supabase";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;

// Lazy initialization of Gemini API Client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your Gemini API key in the 'Settings > Secrets' panel of the AI Studio UI to enable live AI reasoning."
    );
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Map client table names to Supabase table names
function getSupabaseTableName(clientTable: string): { main: string; alt?: string } {
  switch (clientTable) {
    case "websiteQueries":
      return { main: "website_queries", alt: "websiteQueries" };
    case "legalCompliance":
      return { main: "legal_compliance", alt: "legalCompliance" };
    case "driveFiles":
      return { main: "drive_files", alt: "driveFiles" };
    case "taskList":
      return { main: "task_list", alt: "taskList" };
    case "activityLogs":
      return { main: "activity_logs", alt: "activityLogs" };
    default:
      return { main: clientTable };
  }
}

// Safe select query with optional fallback to camelCase table name
async function safeSelect(tableName: string, alternateName?: string) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) {
      if (alternateName) {
        const altResult = await supabase.from(alternateName).select("*");
        if (!altResult.error) {
          return altResult.data || [];
        }
      }
      console.warn(`Error querying Supabase table ${tableName}:`, error.message);
      return [];
    }
    return data || [];
  } catch (e: any) {
    if (e?.message !== "Supabase environment variables are missing.") {
      console.warn(`Failed to query table ${tableName}:`, e?.message || e);
    }
    return [];
  }
}

// Server-side repositories representing tables
export class DonorRepository {
  static async getAll() {
    return safeSelect("donors");
  }
  static async insert(item: any) {
    return safeInsert("donors", item);
  }
  static async update(item: any) {
    return safeUpdate("donors", item);
  }
  static async delete(id: any) {
    return safeDelete("donors", id);
  }
}

export class StudentRepository {
  static async getAll() {
    return safeSelect("students");
  }
  static async insert(item: any) {
    return safeInsert("students", item);
  }
  static async update(item: any) {
    return safeUpdate("students", item);
  }
  static async delete(id: any) {
    return safeDelete("students", id);
  }
}

export class VolunteerRepository {
  static async getAll() {
    return safeSelect("volunteers");
  }
  static async insert(item: any) {
    return safeInsert("volunteers", item);
  }
  static async update(item: any) {
    return safeUpdate("volunteers", item);
  }
  static async delete(id: any) {
    return safeDelete("volunteers", id);
  }
}

// Fetch all database records from Supabase
async function fetchCrmDatabase() {
  const [
    activityLogs,
    bankAccounts,
    communications,
    complianceStatus,
    donorLeads,
    donors,
    employees,
    fundingStrategies,
    grantProposals,
    notifications,
    organizationDocuments,
    organizationProfile,
    students,
    tasks,
    userProfiles,
    volunteers,
  ] = await Promise.all([
    safeSelect("activitylogs"),
    safeSelect("bank_accounts"),
    safeSelect("communications"),
    safeSelect("compliance_status"),
    safeSelect("donor_leads"),
    safeSelect("donors"),
    safeSelect("employees"),
    safeSelect("funding_strategies"),
    safeSelect("grant_proposals"),
    safeSelect("notifications"),
    safeSelect("organization_documents"),
    safeSelect("organization_profile"),
    safeSelect("students"),
    safeSelect("tasks"),
    safeSelect("user_profiles"),
    safeSelect("volunteers"),
  ]);

  return {
    // Original fields
    activityLogs,
    bankAccounts,
    communications,
    complianceStatus,
    donorLeads,
    donors,
    employees,
    fundingStrategies,
    grantProposals,
    notifications,
    organizationDocuments,
    organizationProfile,
    students,
    tasks,
    userProfiles,
    volunteers,

    // Frontend compatibility fields
    emails: communications,
    donations: donorLeads,
    finances: bankAccounts,
    taskList: tasks,
    legalCompliance: complianceStatus,
    driveFiles: organizationDocuments,
    websiteQueries: notifications,
  };
}

async function safeInsert(clientTable: string, item: any) {
  if (!supabase) return item;
  const { main, alt } = getSupabaseTableName(clientTable);
  try {
    const { data, error } = await supabase.from(main).insert(item).select();
    if (error && alt) {
      const altRes = await supabase.from(alt).insert(item).select();
      return altRes.data?.[0] || item;
    }
    return data?.[0] || item;
  } catch (e: any) {
    if (e?.message !== "Supabase environment variables are missing.") {
      console.error(`Insert failed on ${clientTable}:`, e);
    }
    return item;
  }
}

async function safeUpdate(clientTable: string, item: any) {
  if (!supabase) return item;
  const { main, alt } = getSupabaseTableName(clientTable);
  try {
    const { data, error } = await supabase.from(main).update(item).eq("id", item.id).select();
    if (error && alt) {
      const altRes = await supabase.from(alt).update(item).eq("id", item.id).select();
      return altRes.data?.[0] || item;
    }
    return data?.[0] || item;
  } catch (e: any) {
    if (e?.message !== "Supabase environment variables are missing.") {
      console.error(`Update failed on ${clientTable}:`, e);
    }
    return item;
  }
}

async function safeDelete(clientTable: string, id: any) {
  if (!supabase) return;
  const { main, alt } = getSupabaseTableName(clientTable);
  try {
    const { error } = await supabase.from(main).delete().eq("id", id);
    if (error && alt) {
      await supabase.from(alt).delete().eq("id", id);
    }
  } catch (e: any) {
    if (e?.message !== "Supabase environment variables are missing.") {
      console.error(`Delete failed on ${clientTable}:`, e);
    }
  }
}

// REST API endpoints
app.get("/api/crm", async (req, res) => {
  const db = await fetchCrmDatabase();
  res.json(db);
});

app.post("/api/crm/update", async (req, res) => {
  const { table, action, item } = req.body;

  if (action === "add") {
    const newItem = { id: `${table.substring(0, 3)}-${Date.now()}`, ...item };
    if (table === "donors") {
      await DonorRepository.insert(newItem);
    } else if (table === "students") {
      await StudentRepository.insert(newItem);
    } else if (table === "volunteers") {
      await VolunteerRepository.insert(newItem);
    } else {
      await safeInsert(table, newItem);
    }
    const updatedDb = await fetchCrmDatabase();
    return res.json({ success: true, item: newItem, database: updatedDb });
  }

  if (action === "edit") {
    if (table === "donors") {
      await DonorRepository.update(item);
    } else if (table === "students") {
      await StudentRepository.update(item);
    } else if (table === "volunteers") {
      await VolunteerRepository.update(item);
    } else {
      await safeUpdate(table, item);
    }
    const updatedDb = await fetchCrmDatabase();
    return res.json({ success: true, item, database: updatedDb });
  }

  if (action === "delete") {
    if (table === "donors") {
      await DonorRepository.delete(item.id);
    } else if (table === "students") {
      await StudentRepository.delete(item.id);
    } else if (table === "volunteers") {
      await VolunteerRepository.delete(item.id);
    } else {
      await safeDelete(table, item.id);
    }
    const updatedDb = await fetchCrmDatabase();
    return res.json({ success: true, database: updatedDb });
  }

  res.status(400).json({ error: "Invalid action." });
});

// Run AI Employee Agent using Gemini API
app.post("/api/agent/run", async (req, res) => {
  const { agentId, task, context } = req.body;

  // Use the context provided, or fall back to querying the database from Supabase
  const activeCtx = context || (await fetchCrmDatabase());
  const totalRecordsCount = 
    (activeCtx.donors?.length || 0) +
    (activeCtx.students?.length || 0) +
    (activeCtx.volunteers?.length || 0) +
    (activeCtx.finances?.length || 0) +
    (activeCtx.emails?.length || 0) +
    (activeCtx.websiteQueries?.length || 0) +
    (activeCtx.legalCompliance?.length || 0) +
    (activeCtx.driveFiles?.length || 0) +
    (activeCtx.taskList?.length || 0);

  if (totalRecordsCount === 0) {
    return res.json({
      success: true,
      text: "No data available.",
      agentId,
    });
  }

  try {
    const ai = getGeminiClient();

    let systemInstruction = "";
    let prompt = "";

    switch (agentId.toUpperCase()) {
      case "KUBER":
        systemInstruction =
          "You are KUBER, the AI Donor Researcher & CSR Opportunity Discoverer for Navyug Jan Kalyan Foundation. You specialize in identifying corporate social responsibility (CSR) programs, philanthropic grants, and potential individual donors in India. Use professional Indian NGO terminology. Focus heavily on CSR Form CSR-1, Companies Act Section 135 compliance, and thematic alignment (education, remedial teaching, digital literacy). Generate structured, professional, markdown-formatted donor research reports with concrete action items and funding fits.";
        prompt = `Analyze the following task: "${task}". Use the provided NGO CRM data if helpful: ${JSON.stringify(
          context || {}
        )}. Deliver a highly structured, realistic, and actionable donor/CSR research report in markdown. Include corporate names (e.g., tech giants, Indian conglomerates, public sector undertakings), eligibility, thematic alignment, estimated grant sizes, and a list of step-by-step next actions.`;
        break;

      case "SEVA":
        systemInstruction =
          "You are SEVA, the AI Gmail Manager & Communications Officer for Navyug Jan Kalyan Foundation. You draft clean, humble, warm, and highly professional emails to donors, corporate officers, volunteers, parents, and community members. Your tone is respectful, deeply grateful, and community-centric. Always draft a complete, polished email with subject line, greeting, cohesive explanation of the NGO's educational work, call-to-action, and standard signature.";
        prompt = `Draft an email response based on this request or inbound message: "${task}". Here is the current CRM context: ${JSON.stringify(
          context || {}
        )}. Please write a beautiful, polite, ready-to-send draft in markdown with a distinct Subject and Body. Highlight our mission of providing free digital literacy, meals, and academic tuition to underprivileged kids.`;
        break;

      case "VIDYA":
        systemInstruction =
          "You are VIDYA, the AI Student Admissions & Support Coordinator for Navyug Jan Kalyan Foundation. You handle student intakes, draft communications to underprivileged families, manage attendance reports, and compile welfare support summaries. You write in a warm, compassionate, supportive, and clear style, translating complex processes into simple, easy-to-understand guidance (suitable for parents who may be semi-literate).";
        prompt = `Process the following admission/attendance or parent query: "${task}". Using this student context: ${JSON.stringify(
          context || {}
        )}, draft a warm, structured, and easy-to-understand response, parent letter, or admission guide in markdown. Clearly outline next steps, daily school timings, required documentation (Aadhaar card, income certificate), and reassurance that the program is 100% free.`;
        break;

      case "LEKHA":
        systemInstruction =
          "You are LEKHA, the AI Financial Officer & Accountant for Navyug Jan Kalyan Foundation. You specialize in drafting donation receipts, generating simple accounting ledgers, audit reports, and managing budget trackings under Indian NGO taxation frameworks (Section 12A, Section 80G tax write-offs, CSR funding audits). Be highly precise, formal, and organized. Always format reports cleanly with Markdown tables.";
        prompt = `Perform the following accounting task: "${task}". Review this financial record/context: ${JSON.stringify(
          context || {}
        )}. Produce a professional financial report, donation receipt template, or ledger audit in markdown. Ensure Section 80G deduction benefits (50% tax exemption) are explicitly stated for individual donors, and include standard clauses (e.g. Unique Registration Number, validity periods) to verify compliance.`;
        break;

      case "GRANT":
        systemInstruction =
          "You are GRANT, the AI Grant Proposal Writer for Navyug Jan Kalyan Foundation. You draft comprehensive, compelling, and persuasive project proposals for corporate CSR boards, foreign philanthropies, and government grants. Your proposals contain clear sections: Executive Summary, Statement of Need, Project Goals & Objectives, Implementation Methodology, Monitoring & Evaluation, Budget Estimates, and Expected Outcomes.";
        prompt = `Draft a comprehensive grant proposal for this specific project or request: "${task}". Use the current foundation context: ${JSON.stringify(
          context || {}
        )}. Write a high-quality, professional, and detailed grant proposal in markdown. Use persuasive language, realistic metrics (e.g., training 120 kids, ₹5,00,000 budget), and structure it as a complete, formal document.`;
        break;

      case "MEDIA":
        systemInstruction =
          "You are MEDIA, the AI Social Media Manager & Outreach Officer for Navyug Jan Kalyan Foundation. You draft engaging social media posts (for LinkedIn, Instagram, Facebook), newsletter snippets, and flyer descriptions to attract donors and volunteers. Your content is inspirational, high-energy, and impactful. Always include layout suggestions, visual prompt ideas for graphic design, and a collection of strategic hashtags.";
        prompt = `Create social media copy or a newsletter section for: "${task}". Using the NGO context: ${JSON.stringify(
          context || {}
        )}, write a series of 3 options: (1) Professional & CSR-oriented for LinkedIn, (2) Emotive & visually rich for Instagram, and (3) A brief monthly newsletter snippet. Suggest specific visual concepts or design prompts (e.g. 'A close-up photo of a student smiling while looking at a laptop screen') for each.`;
        break;

      case "HR":
        systemInstruction =
          "You are HR, the AI Volunteer & Staff Coordinator for Navyug Jan Kalyan Foundation. You manage volunteer onboarding, coordinate teaching schedules, draft volunteer guidelines, write appreciations/certificates, and address staff queries. Your tone is supportive, motivating, welcoming, and organized.";
        prompt = `Onboard, appreciate, or coordinate based on this task: "${task}". Here is the volunteer and staff CRM registry: ${JSON.stringify(
          context || {}
        )}. Write a highly professional onboarding letter, volunteer charter, or teaching roster in markdown. Emphasize Navyug's core values of service, child safety, and professional tutoring.`;
        break;

      case "LEGAL":
        systemInstruction =
          "You are LEGAL, the AI NGO Compliance Officer for Navyug Jan Kalyan Foundation. You track and advise on Indian non-profit laws and regulations: Income Tax Section 12A exemption, Section 80G tax-deductibility, Ministry of Corporate Affairs Form CSR-1, and Ministry of Home Affairs FCRA regulations. You provide clear, exact legal checklists, audit readiness reports, and strict filing schedules.";
        prompt = `Analyze the following legal compliance concern: "${task}". Review the current compliance registry: ${JSON.stringify(
          context || {}
        )}. Provide a rigorous compliance report, renewal checklist, or audit-readiness guide in markdown. Highlight specific penalties, exact deadlines, regulatory forms, and risk mitigations (such as handling foreign contributions under strict FCRA guidelines).`;
        break;

      case "CHATBOT":
        systemInstruction =
          "You are Navyug Jan Kalyan Foundation's 24/7 Web & WhatsApp Chatbot. You assist website visitors, potential donors, parents, and volunteers. Keep your answers brief, friendly, highly informative, and polite. Always guide users to the relevant registration forms, explain our 100% free school/meal programs, highlight 80G tax savings for donors, and offer to register their details.";
        prompt = `Inbound query from user: "${task}". Generate a helpful, conversational, and direct chatbot response in markdown (with conversational spacing and friendly bullets). Keep it relatively concise but comprehensive.`;
        break;

      case "CEO_ASSISTANT":
      default:
        systemInstruction =
          "You are the AI Executive Assistant to the CEO of Navyug Jan Kalyan Foundation. Your job is to analyze the complete state of the NGO (emails, donations, students, volunteers, compliance, active projects) and compile a daily briefing for the CEO. Your briefing includes: (1) A concise Operations Dashboard summary, (2) Critical urgent action items, (3) Key donor or volunteer approvals needed, (4) Strategic recommendations for organizational growth and compliance safeguarding.";
        prompt = `Generate the daily executive briefing based on the current NGO database state: ${JSON.stringify(
          context || {}
        )}. Include any current custom queries: "${task}". Format this as a highly polished, executive-level, clear markdown briefing.`;
        break;
    }

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text,
      agentId,
    });
  } catch (error: any) {
    console.error("Gemini API Client Error:", error.message || error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while running the Gemini agent."
    });
  }
});

// Serve frontend assets and start server

async function bootstrap() {
  console.log("STEP 1");

  if (process.env.NODE_ENV !== "production") {
    console.log("STEP 2");

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    console.log("STEP 3");

    app.use(vite.middlewares);
  } else {
    console.log("STEP PROD");

    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  console.log("STEP 4");

  app.listen(PORT, "0.0.0.0", () => {
  console.log(`Navyug AI Office Server running on port ${PORT}`);
});

  console.log("STEP 5");
}

bootstrap();
