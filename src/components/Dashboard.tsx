import React from "react";
import {
  Sparkles,
  Users,
  GraduationCap,
  TrendingUp,
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowUpRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { CrmDatabase } from "../types";

interface DashboardProps {
  data: CrmDatabase;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ data, onNavigate }: DashboardProps) {
  // Dynamically calculate metrics
  const totalDonations = data.donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
  const enrolledStudents = data.students?.filter((s) => s.status === "Enrolled").length || 0;
  const activeVolunteers = data.volunteers?.filter((v) => v.status === "Active").length || 0;
  const pendingTasks = data.taskList?.filter((t) => t.status === "Pending").length || 0;
  const reviewCompliance = data.legalCompliance?.filter((c) => c.status === "Review Required").length || 0;

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Sub-program dynamic calculators based on campaigns
  const digitalLabSourced = data.donations
    ?.filter((d) => d.campaign?.toLowerCase().includes("digital") || d.campaign?.toLowerCase().includes("computer"))
    .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  const mealsSourced = data.donations
    ?.filter((d) => d.campaign?.toLowerCase().includes("meal") || d.campaign?.toLowerCase().includes("nutrition"))
    .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  const uniformsSourced = data.donations
    ?.filter((d) => d.campaign?.toLowerCase().includes("uniform") || d.campaign?.toLowerCase().includes("book"))
    .reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

  // Dynamic live activity tracker sourced from actual database tables
  const aiActivityLog: { agent: string; status: string; desc: string; time: string; color: string }[] = [];

  // Priority to activityLogs table if populated
  if (data.activityLogs && data.activityLogs.length > 0) {
    data.activityLogs.forEach((log) => {
      aiActivityLog.push({
        agent: log.agent || "AI",
        status: log.status || "Update",
        desc: log.desc || log.description || "",
        time: log.time || (log.created_at ? new Date(log.created_at).toLocaleTimeString() : "Recent"),
        color: log.color || "border-indigo-500 bg-indigo-50 text-indigo-700",
      });
    });
  } else {
    // Sourced dynamically from websiteQueries, emails, finances, driveFiles, taskList tables
    if (data.websiteQueries && data.websiteQueries.length > 0) {
      data.websiteQueries.slice(-2).forEach((q) => {
        aiActivityLog.push({
          agent: "CHATBOT",
          status: "WhatsApp",
          desc: `Addressed visitor inquiry regarding: "${q.message.slice(0, 60)}${q.message.length > 60 ? "..." : ""}"`,
          time: "Just now",
          color: "border-cyan-500 bg-cyan-50 text-cyan-700",
        });
      });
    }

    if (data.emails && data.emails.length > 0) {
      data.emails.slice(-2).forEach((e) => {
        aiActivityLog.push({
          agent: "SEVA",
          status: "Gmail",
          desc: `Analyzed email from '${e.from}' and updated context response draft.`,
          time: "15 mins ago",
          color: "border-blue-500 bg-blue-50 text-blue-700",
        });
      });
    }

    if (data.finances && data.finances.length > 0) {
      data.finances.slice(-2).forEach((f) => {
        aiActivityLog.push({
          agent: "LEKHA",
          status: "Tax Filing",
          desc: `Generated Draft Receipt for ${f.donorName} (₹${Number(f.amount).toLocaleString("en-IN")}) under Section 80G.`,
          time: "1 hour ago",
          color: "border-purple-500 bg-purple-50 text-purple-700",
        });
      });
    }

    if (data.driveFiles && (data.driveFiles ?? []).length > 0) {
      data.driveFiles.slice(-2).forEach((file) => {
        aiActivityLog.push({
          agent: file.createdBy.includes("GRANT") ? "GRANT" : file.createdBy.includes("MEDIA") ? "MEDIA" : "CEO_ASSISTANT",
          status: "Drive Upload",
          desc: `Uploaded document "${file.name}" to Google Drive folder "${file.folder}".`,
          time: "2 hours ago",
          color: "border-emerald-500 bg-emerald-50 text-emerald-700",
        });
      });
    }

    if (data.taskList && (data.taskList ?? []).length > 0) {
      data.taskList.slice(-2).forEach((t) => {
        aiActivityLog.push({
          agent: "HR",
          status: "Roster Task",
          desc: `Assigned roster task to ${t.assignedTo || "Volunteer Coordinator"}: "${t.title}".`,
          time: "Today",
          color: "border-teal-500 bg-teal-50 text-teal-700",
        });
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="absolute top-0 right-0 h-64 w-64 -translate-y-12 translate-x-12 rounded-full bg-indigo-500/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-12 -translate-x-12 rounded-full bg-emerald-500/5 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              Navyug 24x7 AI Office Active
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Navyug Jan Kalyan Foundation</h1>
            <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
              Empowering underprivileged children through free education, computers, and nutrition.
              Our specialized 10-Agent Gemini AI workforce manages 80-90% of routine operations around-the-clock.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("workspace")}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition flex items-center gap-2"
            >
              Open Workspace
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Total Funds</span>
            <div className="text-2xl font-bold text-slate-900">
              {totalDonations === 0 ? "₹0 Donations" : formatINR(totalDonations)}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 font-bold text-emerald-700">
                {data.donations?.length || 0} Transactions
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-amber-600">
            <Receipt className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Student Count</span>
            <div className="text-2xl font-bold text-slate-900">
              {(data.students ?? []).length === 0 || !data.students ? "0 Students" : `${(data.students ?? []).length} Students`}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 font-bold text-indigo-700">
                {enrolledStudents} Enrolled
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Volunteer Count</span>
            <div className="text-2xl font-bold text-slate-900">
              {(data.volunteers ?? []).length === 0 || !data.volunteers ? "0 Volunteers" : `${(data.volunteers ?? []).length} Volunteers`}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 font-bold text-blue-700">
                {activeVolunteers} Active Tutors
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Donor Count</span>
            <div className="text-2xl font-bold text-slate-900">
              {(data.donors ?? []).length === 0 || !data.donors ? "0 Donors" : `${(data.donors ?? []).length} Donors`}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <span className="rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 font-bold text-amber-700">
                Active Sponsors
              </span>
            </div>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-3 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Progress & AI Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: NGO Funding Progress & Program Capacity (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Donation Progress Progress Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">2026 Funding Goal Progress</h3>
                <p className="text-xs text-slate-400">Target to sustain operations, digital labs, and mid-day nutrition drives</p>
              </div>
              <span className="text-sm font-bold text-indigo-600">
                {totalDonations > 0 ? Math.round((totalDonations / 1000000) * 100) : 0}% Reached
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalDonations / 1000000) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>Raised: {formatINR(totalDonations)}</span>
                <span>Annual Goal: {formatINR(1000000)}</span>
              </div>
            </div>

            {/* Sub-Programs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Digital Computer Lab</span>
                <span className="text-sm font-bold text-slate-800">₹5,00,000 Budget</span>
                <span className="text-xs font-bold flex items-center gap-1 mt-1.5 text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${digitalLabSourced >= 500000 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                  {formatINR(digitalLabSourced)} Sourced
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Daily Nutritious Meals</span>
                <span className="text-sm font-bold text-slate-800">₹2,50,000 Goal</span>
                <span className="text-xs font-bold flex items-center gap-1 mt-1.5 text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${mealsSourced >= 250000 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                  {formatINR(mealsSourced)} Sourced
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Primary Uniforms & Books</span>
                <span className="text-sm font-bold text-slate-800">₹1,50,000 Goal</span>
                <span className="text-xs font-bold flex items-center gap-1 mt-1.5 text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${uniformsSourced >= 150000 ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                  {formatINR(uniformsSourced)} Sourced
                </span>
              </div>
            </div>
          </div>

          {/* AI Workforce Integration Map */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">AI-Powered Automation Flow</h3>
                <p className="text-xs text-slate-400">How our 10 Gemini AI agents process workflows autonomously</p>
              </div>
              <button
                onClick={() => onNavigate("workforce")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition"
              >
                Meet Workforce <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/25 p-4 space-y-2">
                <span className="font-bold text-sm text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Inbound Communications
                </span>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  Inquiries in **Gmail** or **WhatsApp** are analyzed by **SEVA** & **CHATBOT**. It classifies the visitor, drafts replies using high-context memory, and queues drafts for human approval.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/25 p-4 space-y-2">
                <span className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Sponsorship & Accounting
                </span>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  When a donation is received, **LEKHA** updates the Google Sheet CRM ledger, drafts a compliant Section 80G tax receipt, and uploads the final document to Google Drive.
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/25 p-4 space-y-2">
                <span className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Donor & Grant Acquisition
                </span>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  **KUBER** searches the web for corporate CSR targets. Once found, **GRANT** outlines tailored project proposals, budgeting timelines, and uploads drafts directly to the Drive storage.
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50/25 p-4 space-y-2">
                <span className="font-bold text-sm text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Daily Strategic Briefing
                </span>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Every morning, the **CEO Assistant** audits Sheet rows, compliance deadlines, and pending emails to prepare a complete actionable roadmap and schedule for the CEO.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Live Activity Ticker (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Live AI Activities</h3>
                  <p className="text-xs text-slate-400">Automated background events</p>
                </div>
                {aiActivityLog.length > 0 && (
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {aiActivityLog.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-bold text-xs italic">
                    No Recent Activity
                  </div>
                ) : (
                  aiActivityLog.map((log, index) => (
                    <div key={index} className="flex gap-3 items-start text-xs border-l-2 border-slate-200 pl-4 relative animate-fade-in">
                      <span className="absolute -left-1.5 top-0.5 h-2.5 w-2.5 rounded-full bg-slate-300 border-2 border-white"></span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{log.agent}</span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${log.color}`}>
                            {log.status}
                          </span>
                          <span className="text-slate-400 font-mono text-[9px] ml-auto">{log.time}</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed">{log.desc}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => onNavigate("ceo")}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-100 transition"
              >
                Access Daily CEO Briefing
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
