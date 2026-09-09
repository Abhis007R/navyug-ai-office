import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
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

/* =========================================================
   OPENROUTER CONFIGURATION
   ========================================================= */

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "openrouter/free";

function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please add it to your .env file."
    );
  }

  return apiKey.trim();
}

/* =========================================================
   SUPABASE HELPERS
   ========================================================= */

// Map client table names to Supabase table names
function getSupabaseTableName(
  clientTable: string
): { main: string; alt?: string } {
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

// Safe select query with optional fallback
async function safeSelect(
  tableName: string,
  alternateName?: string
) {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*");

    if (error) {
      if (alternateName) {
        const altResult = await supabase
          .from(alternateName)
          .select("*");

        if (!altResult.error) {
          return altResult.data || [];
        }
      }

      console.warn(
        `Error querying Supabase table ${tableName}:`,
        error.message
      );

      return [];
    }

    return data || [];
  } catch (e: any) {
    if (
      e?.message !==
      "Supabase environment variables are missing."
    ) {
      console.warn(
        `Failed to query table ${tableName}:`,
        e?.message || e
      );
    }

    return [];
  }
}

/* =========================================================
   SERVER-SIDE REPOSITORIES
   ========================================================= */

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

/* =========================================================
   FETCH CRM DATABASE
   ========================================================= */

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

/* =========================================================
   SAFE INSERT
   ========================================================= */

async function safeInsert(
  clientTable: string,
  item: any
) {
  if (!supabase) return item;

  const { main, alt } =
    getSupabaseTableName(clientTable);

  try {
    const { data, error } = await supabase
      .from(main)
      .insert(item)
      .select();

    if (error && alt) {
      const altRes = await supabase
        .from(alt)
        .insert(item)
        .select();

      return altRes.data?.[0] || item;
    }

    return data?.[0] || item;
  } catch (e: any) {
    if (
      e?.message !==
      "Supabase environment variables are missing."
    ) {
      console.error(
        `Insert failed on ${clientTable}:`,
        e
      );
    }

    return item;
  }
}

/* =========================================================
   SAFE UPDATE
   ========================================================= */

async function safeUpdate(
  clientTable: string,
  item: any
) {
  if (!supabase) return item;

  const { main, alt } =
    getSupabaseTableName(clientTable);

  try {
    const { data, error } = await supabase
      .from(main)
      .update(item)
      .eq("id", item.id)
      .select();

    if (error && alt) {
      const altRes = await supabase
        .from(alt)
        .update(item)
        .eq("id", item.id)
        .select();

      return altRes.data?.[0] || item;
    }

    return data?.[0] || item;
  } catch (e: any) {
    if (
      e?.message !==
      "Supabase environment variables are missing."
    ) {
      console.error(
        `Update failed on ${clientTable}:`,
        e
      );
    }

    return item;
  }
}

/* =========================================================
   SAFE DELETE
   ========================================================= */

async function safeDelete(
  clientTable: string,
  id: any
) {
  if (!supabase) return;

  const { main, alt } =
    getSupabaseTableName(clientTable);

  try {
    const { error } = await supabase
      .from(main)
      .delete()
      .eq("id", id);

    if (error && alt) {
      await supabase
        .from(alt)
        .delete()
        .eq("id", id);
    }
  } catch (e: any) {
    if (
      e?.message !==
      "Supabase environment variables are missing."
    ) {
      console.error(
        `Delete failed on ${clientTable}:`,
        e
      );
    }
  }
}

/* =========================================================
   REST API
   ========================================================= */

app.get("/api/crm", async (_req, res) => {
  const db = await fetchCrmDatabase();

  res.json(db);
});

app.post("/api/crm/update", async (req, res) => {
  const { table, action, item } = req.body;

  if (action === "add") {
    const newItem = {
      id: `${table.substring(0, 3)}-${Date.now()}`,
      ...item,
    };

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

    return res.json({
      success: true,
      item: newItem,
      database: updatedDb,
    });
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

    return res.json({
      success: true,
      item,
      database: updatedDb,
    });
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

    return res.json({
      success: true,
      database: updatedDb,
    });
  }

  return res.status(400).json({
    error: "Invalid action.",
  });
});

/* =========================================================
   OPENROUTER AI HELPER
   ========================================================= */

async function runOpenRouter(
  systemInstruction: string,
  prompt: string
): Promise<string> {
  const apiKey = getOpenRouterApiKey();

  const response = await fetch(
    OPENROUTER_URL,
    {
      method: "POST",

      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",

        // Optional OpenRouter metadata
        "HTTP-Referer":
          "http://localhost:4000",
        "X-Title":
          "Navyug AI Office",
      },

      body: JSON.stringify({
        model: OPENROUTER_MODEL,

        messages: [
          {
            role: "system",
            content: systemInstruction,
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,

        max_tokens: 4000,
      }),
    }
  );

  const rawText = await response.text();

  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `OpenRouter returned invalid JSON: ${rawText}`
    );
  }

  if (!response.ok) {
    const providerMessage =
      data?.error?.message ||
      rawText ||
      "Unknown OpenRouter error";

    throw new Error(
      `OpenRouter API error ${response.status}: ${providerMessage}`
    );
  }

  const text =
    data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error(
      "OpenRouter returned an empty response."
    );
  }

  return text;
}

/* =========================================================
   AI EMPLOYEE AGENT
   ========================================================= */

app.post("/api/agent/run", async (req, res) => {
  const {
    agentId,
    task,
    context,
  } = req.body;

  // Use provided context or query Supabase
  const activeCtx =
    context || (await fetchCrmDatabase());

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

  try {
    console.log(
      `Running OpenRouter agent: ${agentId}`
    );

    console.log(
      `CRM records available: ${totalRecordsCount}`
    );

    let systemInstruction = "";
    let prompt = "";

    switch (agentId.toUpperCase()) {

      /* =====================================================
         KUBER
         ===================================================== */

      case "KUBER":
        systemInstruction =
          "You are KUBER, the AI Donor Researcher & CSR Opportunity Discoverer for Navyug Jan Kalyan Foundation. You specialize in identifying corporate social responsibility (CSR) programs, philanthropic grants, and potential individual donors in India. Use professional Indian NGO terminology. Focus heavily on CSR Form CSR-1, Companies Act Section 135 compliance, and thematic alignment (education, remedial teaching, digital literacy). Generate structured, professional, markdown-formatted donor research reports with concrete action items and funding fits.";

        prompt = `Analyze the following task: "${task}".

Use the provided NGO CRM data if helpful:

${JSON.stringify(context || {}, null, 2)}

Deliver a highly structured, realistic, and actionable donor/CSR research report in markdown.

Include:
- Corporate names
- Eligibility
- Thematic alignment
- Estimated grant sizes
- Funding fit
- Step-by-step next actions`;

        break;

      /* =====================================================
         SEVA
         ===================================================== */

      case "SEVA":
        systemInstruction =
          "You are SEVA, the AI Gmail Manager & Communications Officer for Navyug Jan Kalyan Foundation. You draft clean, humble, warm, and highly professional emails to donors, corporate officers, volunteers, parents, and community members. Your tone is respectful, deeply grateful, and community-centric. Always draft a complete, polished email with subject line, greeting, cohesive explanation of the NGO's educational work, call-to-action, and standard signature.";

        prompt = `Draft an email response based on this request or inbound message:

"${task}"

Here is the current CRM context:

${JSON.stringify(context || {}, null, 2)}

Please write a beautiful, polite, ready-to-send draft in markdown with:
- Subject
- Greeting
- Body
- Clear call-to-action
- Professional signature

Highlight our mission of providing free digital literacy, meals, and academic tuition to underprivileged kids.`;

        break;

      /* =====================================================
         VIDYA
         ===================================================== */

      case "VIDYA":
        systemInstruction =
          "You are VIDYA, the AI Student Admissions & Support Coordinator for Navyug Jan Kalyan Foundation. You handle student intakes, draft communications to underprivileged families, manage attendance reports, and compile welfare support summaries. You write in a warm, compassionate, supportive, and clear style, translating complex processes into simple, easy-to-understand guidance suitable for parents who may be semi-literate.";

        prompt = `Process the following admission/attendance or parent query:

"${task}"

Using this student context:

${JSON.stringify(context || {}, null, 2)}

Draft a warm, structured, and easy-to-understand response, parent letter, or admission guide in markdown.

Clearly outline:
- Next steps
- Daily school timings
- Required documentation
- Aadhaar card
- Income certificate
- Reassurance that the program is 100% free`;

        break;

      /* =====================================================
         LEKHA
         ===================================================== */

      case "LEKHA":
        systemInstruction =
          "You are LEKHA, the AI Financial Officer & Accountant for Navyug Jan Kalyan Foundation. You specialize in drafting donation receipts, generating simple accounting ledgers, audit reports, and managing budget trackings under Indian NGO taxation frameworks (Section 12A, Section 80G tax write-offs, CSR funding audits). Be highly precise, formal, and organized. Always format reports cleanly with Markdown tables.";

        prompt = `Perform the following accounting task:

"${task}"

Review this financial record/context:

${JSON.stringify(context || {}, null, 2)}

Produce a professional financial report, donation receipt template, or ledger audit in markdown.

Where appropriate, address:
- Section 80G
- Donation deduction benefits
- Unique Registration Number
- Validity periods
- Compliance clauses`;

        break;

      /* =====================================================
         GRANT
         ===================================================== */

      case "GRANT":
        systemInstruction =
          "You are GRANT, the AI Grant Proposal Writer for Navyug Jan Kalyan Foundation. You draft comprehensive, compelling, and persuasive project proposals for corporate CSR boards, foreign philanthropies, and government grants. Your proposals contain clear sections: Executive Summary, Statement of Need, Project Goals & Objectives, Implementation Methodology, Monitoring & Evaluation, Budget Estimates, and Expected Outcomes.";

        prompt = `Draft a comprehensive grant proposal for this specific project or request:

"${task}"

Use the current foundation context:

${JSON.stringify(context || {}, null, 2)}

Write a high-quality, professional and detailed grant proposal in markdown.

Use persuasive language and realistic metrics.

Include:
1. Executive Summary
2. Statement of Need
3. Project Goals & Objectives
4. Implementation Methodology
5. Monitoring & Evaluation
6. Budget Estimates
7. Expected Outcomes`;

        break;

      /* =====================================================
         MEDIA
         ===================================================== */

      case "MEDIA":
        systemInstruction =
          "You are MEDIA, the AI Social Media Manager & Outreach Officer for Navyug Jan Kalyan Foundation. You draft engaging social media posts for LinkedIn, Instagram, and Facebook, newsletter snippets, and flyer descriptions to attract donors and volunteers. Your content is inspirational, high-energy, and impactful. Always include layout suggestions, visual prompt ideas for graphic design, and strategic hashtags.";

        prompt = `Create social media copy or a newsletter section for:

"${task}"

Using the NGO context:

${JSON.stringify(context || {}, null, 2)}

Write 3 options:

1. Professional & CSR-oriented for LinkedIn
2. Emotive & visually rich for Instagram
3. Brief monthly newsletter snippet

Suggest specific visual concepts or design prompts for each.`;

        break;

      /* =====================================================
         HR
         ===================================================== */

      case "HR":
        systemInstruction =
          "You are HR, the AI Volunteer & Staff Coordinator for Navyug Jan Kalyan Foundation. You manage volunteer onboarding, coordinate teaching schedules, draft volunteer guidelines, write appreciations/certificates, and address staff queries. Your tone is supportive, motivating, welcoming, and organized.";

        prompt = `Onboard, appreciate, or coordinate based on this task:

"${task}"

Here is the volunteer and staff CRM registry:

${JSON.stringify(context || {}, null, 2)}

Write a highly professional onboarding letter, volunteer charter, or teaching roster in markdown.

Emphasize:
- Service
- Child safety
- Professional tutoring
- Clear responsibilities`;

        break;

      /* =====================================================
         LEGAL
         ===================================================== */

      case "LEGAL":
        systemInstruction =
          "You are LEGAL, the AI NGO Compliance Officer for Navyug Jan Kalyan Foundation. You track and advise on Indian non-profit laws and regulations: Income Tax Section 12A exemption, Section 80G tax-deductibility, Ministry of Corporate Affairs Form CSR-1, and Ministry of Home Affairs FCRA regulations. You provide clear, exact legal checklists, audit readiness reports, and strict filing schedules.";

        prompt = `Analyze the following legal compliance concern:

"${task}"

Review the current compliance registry:

${JSON.stringify(context || {}, null, 2)}

Provide a rigorous compliance report, renewal checklist, or audit-readiness guide in markdown.

Highlight:
- Relevant forms
- Deadlines
- Risks
- Compliance actions
- Risk mitigations

Do not invent legal facts when the provided information is insufficient.`;

        break;

      /* =====================================================
         CHATBOT
         ===================================================== */

      case "CHATBOT":
        systemInstruction =
          "You are Navyug Jan Kalyan Foundation's 24/7 Web & WhatsApp Chatbot. You assist website visitors, potential donors, parents, and volunteers. Keep your answers brief, friendly, highly informative, and polite. Always guide users to relevant registration forms, explain our free school and meal programs, highlight donor tax benefits only when accurate, and offer to register their details.";

        prompt = `Inbound query from user:

"${task}"

Generate a helpful, conversational, and direct chatbot response in markdown.

Keep it relatively concise but comprehensive.

Use friendly bullets where useful.`;

        break;

      /* =====================================================
         CEO ASSISTANT
         ===================================================== */

      case "CEO_ASSISTANT":

      default:
        systemInstruction =
          "You are the AI Executive Assistant to the CEO of Navyug Jan Kalyan Foundation. Your job is to analyze the complete state of the NGO including emails, donations, students, volunteers, compliance, and active projects and compile a daily briefing for the CEO. Your briefing includes: (1) A concise Operations Dashboard summary, (2) Critical urgent action items, (3) Key donor or volunteer approvals needed, (4) Strategic recommendations for organizational growth and compliance safeguarding.";

        prompt = `Generate the daily executive briefing based on the current NGO database state:

${JSON.stringify(context || {}, null, 2)}

Include any current custom query:

"${task}"

Format this as a highly polished, executive-level, clear markdown briefing.

Include:
1. Operations Dashboard
2. Critical urgent action items
3. Donor approvals needed
4. Volunteer approvals needed
5. Strategic recommendations
6. Compliance safeguards`;

        break;
    }

    /* =====================================================
       CALL OPENROUTER
       ===================================================== */

    const responseText = await runOpenRouter(
      systemInstruction,
      prompt
    );

    /* =====================================================
       SUCCESS RESPONSE
       ===================================================== */

    return res.json({
      success: true,
      text: responseText,
      agentId,
      model: OPENROUTER_MODEL,
    });

  } catch (error: any) {

    console.error(
      "========================================"
    );

    console.error("AI AGENT ERROR");

    console.error(
      "Provider: OpenRouter"
    );

    console.error(
      "Agent:",
      agentId
    );

    console.error(
      "Error name:",
      error?.name
    );

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Full error:",
      error
    );

    console.error(
      "========================================"
    );

    const message =
      error?.message ||
      "An error occurred while running the OpenRouter agent.";

    const isRateLimitError =
      message.includes("429") ||
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("quota");

    return res.status(
      isRateLimitError ? 429 : 500
    ).json({
      success: false,
      error: message,
      agentId,
    });
  }
});

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "Navyug AI Office",
    aiProvider: "OpenRouter",
    model: OPENROUTER_MODEL,
  });
});

/* =========================================================
   START SERVER
   ========================================================= */

async function bootstrap() {

  console.log("STEP 1");

  if (process.env.NODE_ENV !== "production") {

    console.log("STEP PROD");

    try {

      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },

        appType: "spa",
      });

      app.use(vite.middlewares);

    } catch (error) {

      console.error(
        "Vite setup failed:",
        error
      );
    }

  } else {

    console.log("STEP PROD");

    const distPath = path.resolve(
      process.cwd(),
      "dist"
    );

    app.use(
      express.static(distPath)
    );

    app.get("*", (_req, res) => {
      res.sendFile(
        path.join(
          distPath,
          "index.html"
        )
      );
    });
  }

  console.log("STEP 4");

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `Navyug AI Office Server running on port ${PORT}`
      );
    }
  );

  console.log("STEP 5");
}

bootstrap();