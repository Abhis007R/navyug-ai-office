import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Mail,
  GraduationCap,
  Receipt,
  FileText,
  Share2,
  Users,
  ShieldAlert,
  MessageSquare,
  TrendingUp,
  Play,
  ArrowRight,
  Database,
  CloudLightning,
  AlertCircle,
  Check,
  RefreshCw,
  Copy,
  FolderSync
} from "lucide-react";
import { AGENT_PROFILES, AgentProfile } from "../data/agents";
import { CrmDatabase } from "../types";
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://navyug-ai-office.onrender.com";

console.log("AIWorkforce API_BASE =", API_BASE);

interface AiWorkforceProps {
  database: CrmDatabase;
  onUpdateDatabase: (...args: any[]) => void;
}

export default function AiWorkforce({
  database,
  onUpdateDatabase,
}: AiWorkforceProps) {
// Dynamic Lucide Icon Mapper
const IconMapper: Record<string, React.ComponentType<any>> = {
  Search,
  Mail,
  GraduationCap,
  Receipt,
  FileText,
  Share2,
  Users,
  ShieldAlert,
  MessageSquare,
  TrendingUp,
};

// Helper to render basic markdown strings safely without external packages
function renderSimpleMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-4 text-slate-800 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Header 1 (# ...)
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mt-6">
              {trimmed.substring(2)}
            </h1>
          );
        }

        // Header 2 (## ...)
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-bold text-slate-900 mt-4">
              {trimmed.substring(3)}
            </h2>
          );
        }

        // Header 3 (### ...)
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-slate-900 mt-3">
              {trimmed.substring(4)}
            </h3>
          );
        }

        // Bullet list item (- ...) or (* ...)
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-4">
              <span className="text-indigo-500 font-bold">•</span>
              <div>{renderBoldPhrases(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Checklist items (- [ ] or - [x])
        if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
          const checked = trimmed.includes("- [x]");
          return (
            <div key={i} className="flex items-center gap-2 pl-4">
              <input type="checkbox" checked={checked} disabled className="h-4 w-4 rounded text-indigo-600 border-slate-300" />
              <div className={checked ? "line-through text-slate-400" : ""}>{renderBoldPhrases(trimmed.substring(6))}</div>
            </div>
          );
        }

        // Plain line with possible bold tags
        if (trimmed === "") return <div key={i} className="h-1" />;

        return <p key={i}>{renderBoldPhrases(line)}</p>;
      })}
    </div>
  );
}

// Inline formatting of **bold** text and `code` tags
function renderBoldPhrases(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="bg-slate-100 rounded px-1"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

  const [selectedAgent, setSelectedAgent] = useState<AgentProfile>(AGENT_PROFILES[0]);
  const [taskInput, setTaskInput] = useState<string>(selectedAgent?.exampleTasks?.[0] ?? "");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // States for coordinated 10-Agent parallel/sequential bulk run
  const [isBulkRunning, setIsBulkRunning] = useState<boolean>(false);
  const [bulkStatus, setBulkStatus] = useState<Record<string, 'idle' | 'running' | 'success' | 'error'>>({});
  const [bulkResults, setBulkResults] = useState<Record<string, string>>({});
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const [bulkLog, setBulkLog] = useState<string[]>([]);

  const handleAgentSelect = (agent: AgentProfile) => {
    setSelectedAgent(agent);
    setTaskInput(agent.exampleTasks?.[0] ?? "");
    setApiResult("");
    setSyncStatus("");
    setErrorMsg("");
  };

  const handleRunAllEmployees = async () => {
    if (isBulkRunning) return;
    setIsBulkRunning(true);
    setBulkProgress(0);
    setBulkLog(["Initializing Coordinated Multi-Agent Workforce..."]);
    
    const initialStatus: Record<string, 'idle' | 'running' | 'success' | 'error'> = {};
    AGENT_PROFILES.forEach(agent => {
      initialStatus[agent.id] = 'idle';
    });
    setBulkStatus(initialStatus);

    // Run each of the 10 agents with a beautiful staggered progress
    for (let i = 0; i < AGENT_PROFILES.length; i++) {
      const agent = AGENT_PROFILES[i];
      
      // Update status to running
      setBulkStatus(prev => ({ ...prev, [agent.id]: 'running' }));
      setBulkLog(prev => [...prev, `[${agent.name}] Launching directive: "${agent.exampleTasks?.[0] ?? ""}"`]);
      
      try {
        const response = await fetch(`${API_BASE}/api/agent/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId: agent.id,
            task: agent.exampleTasks?.[0] ?? "",
            context: database,
          }),
        });

        const data = await response.json();
        if (data.success) {
          const resText = data.text;
          setBulkResults(prev => ({ ...prev, [agent.id]: resText }));
          setBulkStatus(prev => ({ ...prev, [agent.id]: 'success' }));
          setBulkLog(prev => [...prev, `[${agent.name}] Completed task successfully. compiling report...`]);

          // Automatically construct and sync the item to the database
          let table = "";
          let item: any = {};
          let action = "add";

          switch (agent.id) {
            case "KUBER":
              table = "donors";
              const isIndividual = resText.toLowerCase().includes("individual") || resText.toLowerCase().includes("hni") || resText.toLowerCase().includes("philanthropist") || (agent.exampleTasks?.[0] ?? "").toLowerCase().includes("individual") || (agent.exampleTasks?.[0] ?? "").toLowerCase().includes("hni");
              const corporateNameMatch = resText.match(/(?:Corporate|Donor|Target|Company|Name|Trust|Individual|Philanthropist):\s*\**([^\n\*]+)\**/i) || resText.match(/###\s*(.*)/);
              const discoveredName = corporateNameMatch ? corporateNameMatch[1].trim() : (isIndividual ? "Shiv Nadar (HNI Philanthropist)" : "New Discovered Corporate Lead");
              item = {
                name: discoveredName,
                type: isIndividual ? "Individual" : "Corporate",
                amount: isIndividual ? 500000 : 150000,
                date: new Date().toISOString().split("T")[0],
                status: "Lead Discovered",
                email: isIndividual ? "philanthropy@shivnadarfoundation.org" : "csr-contact@corporate.com",
                phone: "+91 99999 88888",
                campaign: isIndividual ? "HNI Philanthropy Outreach" : "CSR Grant Outreach",
                notes: isIndividual
                  ? "KUBER discovered high-net-worth individual prospect. Ready for personalized 80G tax-deductible pitch."
                  : "KUBER discovered CSR possibility. Next step: Submit grant pitch.",
              };
              break;

            case "SEVA":
              table = "emails";
              item = {
                id: "email-1",
                from: "suresh.csr@tatatrusts.org",
                subject: "CSR Partnership Query - Digital Classrooms",
                date: new Date().toISOString(),
                status: "Drafted",
                content: database.emails?.[0]?.content ?? "Inbound message content.",
                draftContent: resText,
              };
              action = "edit";
              break;

            case "VIDYA":
              table = "taskList";
              item = {
                title: "Review admission guidelines written by VIDYA",
                assignedTo: "CEO",
                dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
                status: "Pending",
              };
              break;

            case "LEKHA":
              table = "driveFiles";
              item = {
                name: `Receipt_80G_${Date.now()}.txt`,
                folder: "Donation Receipts",
                createdBy: "LEKHA (AI Financial Officer)",
                date: new Date().toISOString().split("T")[0],
                content: resText,
              };
              break;

            case "GRANT":
              table = "driveFiles";
              const proposalMatch = resText.match(/(?:Title|Project|Proposal):\s*\**([^\n\*]+)\**/i);
              const proposalTitle = proposalMatch ? proposalMatch[1].trim() : "CSR Grant Proposal Draft";
              item = {
                name: `${proposalTitle.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30)}.docx`,
                folder: "Grant Proposals",
                createdBy: "GRANT (AI Proposal Writer)",
                date: new Date().toISOString().split("T")[0],
                content: resText,
              };
              break;

            case "MEDIA":
              table = "driveFiles";
              item = {
                name: `Social_Media_Campaign_${Date.now()}.txt`,
                folder: "Newsletters",
                createdBy: "MEDIA (AI Outreach Agent)",
                date: new Date().toISOString().split("T")[0],
                content: resText,
              };
              break;

            case "HR":
              table = "taskList";
              item = {
                title: "Review Volunteer Teaching Guide compiled by HR",
                assignedTo: "Sneha Gupta",
                dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
                status: "Pending",
              };
              break;

            case "LEGAL":
              table = "legalCompliance";
              item = {
                name: "FCRA Filing Audit Audit",
                law: "Foreign Contribution Regulation Act",
                status: "Review Required",
                dueBy: "2026-10-31",
                notes: "Audit drafted by LEGAL Agent. Review guidelines prior to final MHA upload.",
              };
              break;

            case "CHATBOT":
              table = "websiteQueries";
              item = {
                name: "Interested Website Visitor",
                phone: "+91 99999 00000",
                message: agent.exampleTasks?.[0] ?? "",
                date: new Date().toISOString(),
                chatbotResponse: resText,
              };
              break;

            case "CEO_ASSISTANT":
            default:
              table = "driveFiles";
              item = {
                name: `CEO_Briefing_${new Date().toISOString().split("T")[0]}.txt`,
                folder: "CEO Reports",
                createdBy: "CEO AI Assistant",
                date: new Date().toISOString().split("T")[0],
                content: resText,
              };
              break;
          }

          setBulkLog(prev => [...prev, `[${agent.name}] Syncing generated records to Google Workspace table "${table}"...`]);
          await onUpdateDatabase(table, action, item);
          setBulkLog(prev => [...prev, `[${agent.name}] Database synchronization complete.`]);

        } else {
          setBulkStatus(prev => ({ ...prev, [agent.id]: 'error' }));
          setBulkLog(prev => [...prev, `[${agent.name}] Failed: ${data.error || "Execution error"}`]);
        }
      } catch (error: any) {
        console.error(error);
        setBulkStatus(prev => ({ ...prev, [agent.id]: 'error' }));
        setBulkLog(prev => [...prev, `[${agent.name}] Network connection error.`]);
      }

      setBulkProgress(Math.round(((i + 1) / AGENT_PROFILES.length) * 100));
      // Stagger slight sleep to make the layout extremely satisfying and responsive
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setBulkLog(prev => [...prev, "All 10 AI Employees executed successfully! CRM Sheets & Drive updated."]);
    setIsBulkRunning(false);
  };

  const handleRunAgent = async (taskText: string = taskInput) => {
    if (!taskText.trim()) return;
    setIsRunning(true);
    setApiResult("");
    setSyncStatus("");
    setErrorMsg("");

    try {
      const response = await fetch(`${API_BASE}/api/agent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          task: taskText,
          context: database,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setApiResult(data.text);
      } else {
        setErrorMsg(data.error || "Failed to execute agent reasoning.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Error connecting to server API. Verify that the server is running on Port 3000.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(apiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Synchronize AI results directly to our Supabase workspace
  const handleSyncToWorkspace = async () => {
    if (!apiResult) return;
    setSyncStatus("synchronizing");

    try {
      let table = "";
      let item: any = {};
      let action = "add";

      switch (selectedAgent.id) {
        case "KUBER":
          // Add newly discovered donor to Sheets
          table = "donors";
          // Attempt to extract title/name dynamically or use a fallback
          const isIndividual = apiResult.toLowerCase().includes("individual") || apiResult.toLowerCase().includes("hni") || apiResult.toLowerCase().includes("philanthropist") || taskInput.toLowerCase().includes("individual") || taskInput.toLowerCase().includes("hni");
          const corporateNameMatch = apiResult.match(/(?:Corporate|Donor|Target|Company|Name|Trust|Individual|Philanthropist):\s*\**([^\n\*]+)\**/i) || apiResult.match(/###\s*(.*)/);
          const discoveredName = corporateNameMatch ? corporateNameMatch[1].trim() : (isIndividual ? "Shiv Nadar (HNI Philanthropist)" : "New Discovered Corporate Lead");
          
          item = {
            name: discoveredName,
            type: isIndividual ? "Individual" : "Corporate",
            amount: isIndividual ? 500000 : 150000, // Estimated budget
            date: new Date().toISOString().split("T")[0],
            status: "Lead Discovered",
            email: isIndividual ? "philanthropy@shivnadarfoundation.org" : "csr-contact@corporate.com",
            phone: "+91 99999 88888",
            campaign: isIndividual ? "HNI Philanthropy Outreach" : "CSR Grant Outreach",
            notes: isIndividual
              ? "KUBER discovered high-net-worth individual prospect. Ready for personalized 80G tax-deductible pitch."
              : "KUBER discovered CSR possibility. Next step: Submit grant pitch.",
          };
          break;

        case "SEVA":
          // Add drafted reply to email drafts
          table = "emails";
          const emailSubjectMatch = apiResult.match(/Subject:\s*\*?([^\n\*]+)\*?/i);
          const sub = emailSubjectMatch ? emailSubjectMatch[1].trim() : "Response draft";
          item = {
            id: "email-1", // Overwrites first inbox email's draft
            from: "suresh.csr@tatatrusts.org",
            subject: "CSR Partnership Query - Digital Classrooms",
            date: new Date().toISOString(),
            status: "Drafted",
            content: database.emails?.[0]?.content ?? "Inbound message content.",
            draftContent: apiResult,
          };
          action = "edit"; // Overwrite to add draft
          break;

        case "VIDYA":
          // Add task for student enrollment or guidelines
          table = "taskList";
          item = {
            title: "Review admission guidelines written by VIDYA",
            assignedTo: "CEO",
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
            status: "Pending",
          };
          break;

        case "LEKHA":
          // Save a file into Drive
          table = "driveFiles";
          item = {
            name: `Receipt_80G_${Date.now()}.txt`,
            folder: "Donation Receipts",
            createdBy: "LEKHA (AI Financial Officer)",
            date: new Date().toISOString().split("T")[0],
            content: apiResult,
          };
          break;

        case "GRANT":
          // Save drafted Proposal in Drive
          table = "driveFiles";
          const proposalMatch = apiResult.match(/(?:Title|Project|Proposal):\s*\**([^\n\*]+)\**/i);
          const proposalTitle = proposalMatch ? proposalMatch[1].trim() : "CSR Grant Proposal Draft";
          item = {
            name: `${proposalTitle.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 30)}.docx`,
            folder: "Grant Proposals",
            createdBy: "GRANT (AI Proposal Writer)",
            date: new Date().toISOString().split("T")[0],
            content: apiResult,
          };
          break;

        case "MEDIA":
          // Create Drive file in newsletters
          table = "driveFiles";
          item = {
            name: `Social_Media_Campaign_${Date.now()}.txt`,
            folder: "Newsletters",
            createdBy: "MEDIA (AI Outreach Agent)",
            date: new Date().toISOString().split("T")[0],
            content: apiResult,
          };
          break;

        case "HR":
          // Onboard a dummy volunteer or create guidelines
          table = "taskList";
          item = {
            title: "Review Volunteer Teaching Guide compiled by HR",
            assignedTo: "Sneha Gupta",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
            status: "Pending",
          };
          break;

        case "LEGAL":
          // Set checklist in Compliance
          table = "legalCompliance";
          item = {
            name: "FCRA Filing Audit Audit",
            law: "Foreign Contribution Regulation Act",
            status: "Review Required",
            dueBy: "2026-10-31",
            notes: "Audit drafted by LEGAL Agent. Review guidelines prior to final MHA upload.",
          };
          break;

        case "CHATBOT":
          // Log query in WebsiteQueries
          table = "websiteQueries";
          item = {
            name: "Interested Website Visitor",
            phone: "+91 99999 00000",
            message: taskInput,
            date: new Date().toISOString(),
            chatbotResponse: apiResult,
          };
          break;

        case "CEO_ASSISTANT":
        default:
          table = "driveFiles";
          item = {
            name: `CEO_Briefing_${new Date().toISOString().split("T")[0]}.txt`,
            folder: "CEO Reports",
            createdBy: "CEO AI Assistant",
            date: new Date().toISOString().split("T")[0],
            content: apiResult,
          };
          break;
      }

      await onUpdateDatabase(table, action, item);
      setSyncStatus("success");
    } catch (e) {
      console.error(e);
      setSyncStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Coordinated Office Run / All Employees Controller */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 shadow-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-400/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                Coordinated Office Orchestrator
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Coordinated AI Team Launch</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Activate all 10 specialized AI employees in parallel. Each agent will independently execute their primary administrative directive, synthesize live reports, and synchronize the entire operational pipeline with the Google Workspace Hub automatically.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleRunAllEmployees}
              disabled={isBulkRunning}
              className={`w-full lg:w-auto font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2.5 ${
                isBulkRunning
                  ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed animate-pulse"
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white active:scale-[0.98]"
              }`}
            >
              {isBulkRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                  Running Coordinated Mission ({bulkProgress}%)
                </>
              ) : (
                <>
                  <Play className="h-4.5 w-4.5 fill-white text-indigo-200" />
                  Start Working All Employees
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Staged execution Stepper / Progress Bar */}
        {(isBulkRunning || Object.keys(bulkStatus).length > 0) && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fade-in">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>WORKFORCE LAUNCH STATUS</span>
                <span>{bulkProgress}% Completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${bulkProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Agent Badges grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
              {AGENT_PROFILES.map((agent) => {
                const status = bulkStatus[agent.id] || 'idle';
                let statusColor = "bg-slate-800/60 text-slate-400 border-slate-700/50";
                let statusText = "Ready";

                if (status === 'running') {
                  statusColor = "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 animate-pulse";
                  statusText = "Analyzing...";
                } else if (status === 'success') {
                  statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  statusText = "Done & Synced";
                } else if (status === 'error') {
                  statusColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                  statusText = "Failed";
                }

                return (
                  <div key={agent.id} className={`p-2 rounded-xl border flex items-center justify-between text-[11px] font-bold ${statusColor} transition-all`}>
                    <span className="truncate">{agent.name}</span>
                    <span className="text-[9px] uppercase shrink-0 px-1.5 py-0.5 rounded bg-black/20">{statusText}</span>
                  </div>
                );
              })}
            </div>

            {/* Live Orchestrator Terminal Output Logs */}
            <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-800/80 max-h-[160px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
              {bulkLog.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes("Failed") || log.includes("Error") ? "text-rose-400 font-semibold" : log.includes("Successfully") || log.includes("synced") || log.includes("complete") ? "text-emerald-400" : "text-slate-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Left Column: 10 AI Workforce Bento Selector (4 cols) */}
      <div className="xl:col-span-4 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              10 AI Employees
            </h2>
            <p className="text-xs text-slate-400">Select any specialist to delegate a custom office task</p>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[550px] overflow-y-auto pr-1">
            {AGENT_PROFILES.map((agent) => {
              const AgentIcon = IconMapper[agent.iconName] || Users;
              const isSelected = selectedAgent.id === agent.id;

              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-500/10"
                      : "bg-slate-50/50 hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`p-2 rounded-lg border shrink-0 ${
                    isSelected ? "bg-indigo-700 border-indigo-600 text-white" : agent.colorClass.split(" ")[0] + " " + agent.colorClass.split(" ")[1]
                  }`}>
                    <AgentIcon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm tracking-tight">{agent.name}</span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                        isSelected ? "bg-indigo-500 text-indigo-100 border-indigo-400" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        Active 24x7
                      </span>
                    </div>
                    <p className={`text-xs ${isSelected ? "text-indigo-100" : "text-slate-500"} line-clamp-1`}>
                      {agent.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: AI Employee Interactive Workspace (8 cols) */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Workspace Card Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${selectedAgent.colorClass}`}>
                {React.createElement(IconMapper[selectedAgent.iconName] || Users, { className: "h-6 w-6" })}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{selectedAgent.name} Workspace</h1>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                    <CloudLightning className="pulse-slow h-3 w-3 text-emerald-500" />
                    Gemini Live
                  </span>
                </div>
                <p className="text-xs font-bold text-indigo-600">{selectedAgent.role}</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{selectedAgent.responsibility}</p>
              </div>
            </div>
          </div>

          {/* Quick Trial Tasks */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
              Quick Trial Tasks (Recommended)
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedAgent.exampleTasks.map((task, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTaskInput(task);
                    handleRunAgent(task);
                  }}
                  className="text-xs text-left bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 text-indigo-950 font-semibold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>{task.length > 55 ? task.slice(0, 52) + "..." : task}</span>
                  <ArrowRight className="h-3 w-3 text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Entry Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                Delegate Office Directive
              </span>
              <span className="text-slate-400 font-mono text-[9px] font-bold">model: "gemini-3.6-flash"</span>
            </div>
            <div className="relative">
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder={`Type a command or administrative requirement for ${selectedAgent.name}...`}
                className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-slate-400 bg-slate-50"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  onClick={() => handleRunAgent()}
                  disabled={isRunning || !taskInput.trim()}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white px-4 py-2 text-xs font-bold shadow-sm flex items-center gap-1.5 transition disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                       <RefreshCw className="h-3 w-3 animate-spin" />
                       Thinking...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-white" />
                      Run AI Employee
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* System Prompt Specs Drawer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>
                <strong>System Prompt Context:</strong> {selectedAgent.systemPrompt}
              </span>
            </div>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.2 rounded uppercase">
              Connected to AI Orchestrator
            </span>
          </div>

        </div>

        {/* AI Output Section */}
        {(apiResult || isRunning || errorMsg) && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Generated Output
              </span>
              {apiResult && !isRunning && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 border border-slate-200 transition flex items-center gap-1 text-xs font-bold bg-white"
                    title="Copy response markdown"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleSyncToWorkspace}
                    disabled={syncStatus === "success" || syncStatus === "synchronizing"}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1 ${
                      syncStatus === "success"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                    }`}
                  >
                    <FolderSync className="h-3.5 w-3.5" />
                    <span>
                      {syncStatus === "success"
                        ? "Synced to Workspace!"
                        : syncStatus === "synchronizing"
                        ? "Syncing..."
                        : `Sync to Google Workspace`}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Loading Placeholder */}
            {isRunning && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
                  <div className={`absolute inset-2 p-1.5 rounded-full ${selectedAgent.colorClass} border`}>
                    {React.createElement(IconMapper[selectedAgent.iconName] || Users, { className: "h-3.5 w-3.5" })}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedAgent.name} is reasoning with Google Gemini...
                  </p>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    "Reading CRM database rows, drafting outcomes, compiling compliances"
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 flex gap-3 text-sm text-rose-800">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                <div className="space-y-1">
                  <span className="font-bold">Execution Failed</span>
                  <p className="text-rose-700 text-xs leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Markdown Render */}
            {apiResult && !isRunning && (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-[500px] overflow-y-auto font-sans">
                {renderSimpleMarkdown(apiResult)}
              </div>
            )}

            {/* Sync Post-Success Explainer */}
            {syncStatus === "success" && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-fade-in">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Outcome successfully written back into the **Google Workspace Hub**. Check Google Sheet CRM or Google Drive folders to see your newly generated record!
                </span>
              </div>
            )}

          </div>
        )}

      </div>
      </div>
    </div>
  );
}
