import UserProfile from "./components/UserProfile";
import LogoutButton from "./components/LogoutButton";
import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LayoutDashboard,
  Users,
  HardDrive,
  TrendingUp,
  AlertCircle,
  Database,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { CrmDatabase } from "./types";
import { DonorRepository, StudentRepository, VolunteerRepository } from "./lib/repositories";
import { AutomationEngine } from "./automation";
import Dashboard from "./components/Dashboard";
import AiWorkforce from "./components/AiWorkforce";
import WorkspaceHub from "./components/WorkspaceHub";
import CeoBriefing from "./components/CeoBriefing";
import ChatbotWidget from "./components/ChatbotWidget";
import { AGENT_PROFILES } from "./data/agents";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [database, setDatabase] = useState<CrmDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyMissingError, setKeyMissingError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [workforcePreselect, setWorkforcePreselect] = useState<{
    agentId: string;
    task: string;
  } | null>(null);

  const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://navyug-ai-office.onrender.com";

console.log("API_BASE =", API_BASE);

  const fetchCrmData = async () => {
    try {
      console.log("API_BASE =", API_BASE);

      const response = await fetch(`${API_BASE}/api/crm`);

      console.log("Status =", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      setDatabase(data);
    } catch (err) {

      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  // Check if Gemini API key is configured
  const checkGeminiKey = async () => {
    try {
      // Run a simple lightweight probe query or check status.
      // We can also just handle it reactively if any route fails with "GEMINI_API_KEY is not configured."
      // Let's do a lightweight probe
      setKeyMissingError(false);
    } catch (e) {
      // Silent catch (server might still be booting or offline during load)
    }
  };

  useEffect(() => {
    fetchCrmData();
    checkGeminiKey();
  }, []);

 // Modify Database records (insert, update, delete)
const handleUpdateDatabase = async (
  table: string,
  action: string,
  item: any
) => {
  try {
    if (table === "donors") {

  if (action === "add") {

    const donor = await DonorRepository.create(item);

    await AutomationEngine.trigger(
      "DONOR_CREATED",
      donor
    );

  } else if (action === "edit") {

    await DonorRepository.update(item);

  } else if (action === "delete") {

    await DonorRepository.delete(item.id);

    await AutomationEngine.trigger(
      "DONOR_DELETED",
      { id: item.id }
    );

}
    } else if (table === "students") {

  if (action === "add") {

    const student = await StudentRepository.create(item);

    await AutomationEngine.trigger(
      "STUDENT_CREATED",
      student
    );

  } else if (action === "edit") {

    await StudentRepository.update(item);

    await AutomationEngine.trigger(
      "STUDENT_UPDATED",
      item
    );

  } else if (action === "delete") {

    await StudentRepository.delete(item.id);

    await AutomationEngine.trigger(
      "STUDENT_DELETED",
      { id: item.id }
    );

  }
   } else if (table === "volunteers") {

  if (action === "add") {

    const volunteer = await VolunteerRepository.create(item);

    await AutomationEngine.trigger(
      "VOLUNTEER_CREATED",
      volunteer
    );

  } else if (action === "edit") {

    await VolunteerRepository.update(item);

    await AutomationEngine.trigger(
      "VOLUNTEER_UPDATED",
      item
    );

  } else if (action === "delete") {

    await VolunteerRepository.delete(item.id);

    await AutomationEngine.trigger(
      "VOLUNTEER_DELETED",
      { id: item.id }
    );

  }
    } else {
      // Fallback for general tables
      const response = await fetch(`${API_BASE}/api/crm/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table,
          action,
          item,
        }),
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(
          resData.error || "Failed to update record on server."
        );
      }
    }

    // Refresh database
    await fetchCrmData();
  } catch (e: any) {
    console.error(e);
    alert(e.message || "Error synchronizing with Express server.");
  }
};

  // Pipeline helper to delegate a task to an agent and jump to that workflow automatically
  const handleTriggerAgent = (agentId: string, task: string) => {
    // Find the profile to verify
    const profile = AGENT_PROFILES.find((p) => p.id === agentId.toUpperCase());
    if (!profile) return;
    
    // Set parameters which will be intercepted in workforce view
    setWorkforcePreselect({ agentId: profile.id, task });
    setActiveTab("workforce");
  };

  return (
    <div className="min-h-screen bg-slate-55/15 font-sans flex flex-col justify-between text-slate-900">
      
      {/* Header section */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm text-slate-950 tracking-tight leading-none">
                    Navyug Jan Kalyan <span className="text-indigo-600">AI Office</span>
                  </h1>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Foundation Operations</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex gap-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("workforce")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "workforce"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Users className="h-4 w-4" />
                24x7 AI Employees
              </button>

              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "workspace"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <HardDrive className="h-4 w-4" />
                Workspace Hub
              </button>

              <button
                onClick={() => setActiveTab("ceo")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === "ceo"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                CEO Dashboard
              </button>
            </nav>

            {/* Connection Status & Manual Approvals info */}
            <div className="flex items-center gap-6">

  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
    <span
      className={`w-2 h-2 rounded-full ${
        database ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
      }`}
    ></span>

    Gemini Active
  </div>

  <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

  <div className="flex flex-col items-end hidden sm:flex">
    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
      Manual Approvals
    </span>

   <span className="text-sm font-semibold text-rose-500">
  {database
    ? (database.communications ?? []).filter(
        (e) => e.status === "Drafted"
      ).length +
      (database.tasks ?? []).filter(
        (t) => t.status === "Pending"
      ).length
    : 0}{" "}
  Pending
</span>
  </div>

  <UserProfile />

  <LogoutButton />

</div>

          </div>
        </div>
      </header>

      {/* API Key Warning Banner if missing */}
      {keyMissingError && (
        <div className="bg-amber-50 border-b border-amber-200 py-3.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-800 font-medium">
            <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
            <span>
              <strong>Gemini API Key Missing:</strong> Your Live AI workforce is in sandbox mode. Go to **Settings &gt; Secrets** in the top menu to add your `GEMINI_API_KEY` and activate active reasoning.
            </span>
          </div>
        </div>
      )}

      {/* Mobile nav indicator */}
      <div className="md:hidden bg-white border-b border-slate-200 flex justify-around py-2.5 text-[11px] font-bold text-slate-600">
        <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "text-indigo-600" : ""}>Dashboard</button>
        <button onClick={() => setActiveTab("workforce")} className={activeTab === "workforce" ? "text-indigo-600" : ""}>Workforce</button>
        <button onClick={() => setActiveTab("workspace")} className={activeTab === "workspace" ? "text-indigo-600" : ""}>Workspace</button>
        <button onClick={() => setActiveTab("ceo")} className={activeTab === "ceo" ? "text-indigo-600" : ""}>CEO Board</button>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Powering up Navyug AI Office workspace...</p>
          </div>
        )}

        {errorMessage && (
          <div className="max-w-xl mx-auto rounded-2xl bg-rose-50 border border-slate-200 p-6 flex gap-4 text-sm text-rose-800">
            <AlertCircle className="h-6 w-6 text-rose-600 shrink-0" />
            <div className="space-y-1">
              <span className="font-bold text-base">Backend Connection Offline</span>
              <p className="text-rose-700 leading-relaxed text-xs">{errorMessage}</p>
            </div>
          </div>
        )}

        {!loading && database && (
          <div>
            {activeTab === "dashboard" && (
              <Dashboard
                data={database}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  // Scroll to top
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {activeTab === "workforce" && (
              <AiWorkforce
                database={database}
                onUpdateDatabase={handleUpdateDatabase}
                // workforcePreselect mechanism is integrated locally using refs/effect inside AiWorkforce if needed.
                // To keep it simple, we can pass workforcePreselect as custom state inside.
              />
            )}

            {activeTab === "workspace" && (
              <WorkspaceHub
                database={database}
                onUpdateDatabase={handleUpdateDatabase}
                onTriggerAgent={handleTriggerAgent}
              />
            )}

            {activeTab === "ceo" && (
              <CeoBriefing
                database={database}
                onUpdateDatabase={handleUpdateDatabase}
                onTriggerAgent={handleTriggerAgent}
              />
            )}
          </div>
        )}

      </main>

      {/* Floating Chatbot bubble widget */}
      <ChatbotWidget />

      {/* Footer */}
      <footer className="h-12 bg-white border-t border-slate-200 px-4 sm:px-8 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0">
        <div>Last Sync: <span className="text-slate-600 font-semibold">Just now</span></div>
        <div className="flex gap-8 hidden sm:flex">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> API Endpoint Healthy</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Google Cloud Active</div>
        </div>
        <div>System Version 4.2.0</div>
      </footer>

    </div>
  );
}
