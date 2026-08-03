import React, { useState } from "react";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Briefcase,
  Users,
  Clock,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Play
} from "lucide-react";
import { CrmDatabase, Task } from "../types";

// Safe Simple Markdown Renderer (Inline)
function renderSimpleMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  return (
    <div className="space-y-4 text-slate-800 text-sm leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        if (trimmed.startsWith("# ")) {
          return <h1 key={i} className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mt-4">{trimmed.substring(2)}</h1>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-bold text-slate-900 mt-4">{trimmed.substring(3)}</h2>;
        }
        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="text-base font-semibold text-slate-900 mt-3">{trimmed.substring(4)}</h3>;
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-4">
              <span className="text-indigo-500 font-bold">•</span>
              <div>{renderBoldPhrases(trimmed.substring(2))}</div>
            </div>
          );
        }
        if (trimmed === "") return <div key={i} className="h-1" />;
        return <p key={i}>{renderBoldPhrases(line)}</p>;
      })}
    </div>
  );
}

function renderBoldPhrases(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

interface CeoBriefingProps {
  database: CrmDatabase;
  onUpdateDatabase: (table: string, action: string, item: any) => Promise<void>;
  onTriggerAgent: (agentId: string, task: string) => void;
}

export default function CeoBriefing({ database, onUpdateDatabase, onTriggerAgent }: CeoBriefingProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [briefResult, setBriefResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Form state for Task Delegation
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [assignedAgent, setAssignedAgent] = useState<string>("KUBER");
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split("T")[0]);

  const handleGenerateBriefing = async () => {
    setIsRunning(true);
    setBriefResult("");
    setErrorMsg("");

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "CEO_ASSISTANT",
          task: "Synthesize the current live state of Navyug Jan Kalyan Foundation (including corporate funding sheets, registered student counts, volunteer applications, inbox emails, and legal risk logs) and generate the Daily Operational Briefing.",
          context: database,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBriefResult(data.text);
      } else {
        setErrorMsg(data.error || "Failed to generate briefing.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Error communicating with server API. Ensure Port 3000 is active.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await onUpdateDatabase("taskList", "add", {
      title: taskTitle,
      assignedTo: assignedAgent,
      dueDate,
      status: "Pending"
    });

    setTaskTitle("");
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const updatedStatus = task.status === "Pending" ? "Completed" : "Pending";
    await onUpdateDatabase("taskList", "edit", {
      ...task,
      status: updatedStatus
    });
  };

  const handleDeleteTask = async (id: string) => {
    await onUpdateDatabase("taskList", "delete", { id });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left Column: Daily Executive Briefing (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <TrendingUp className="text-indigo-600 h-5 w-5" />
                CEO Executive Briefing Generator
              </h2>
              <p className="text-xs text-slate-400">Audits Google Sheets CRM, Drive folder manifests, and email queues</p>
            </div>

            <button
              onClick={handleGenerateBriefing}
              disabled={isRunning}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-4 py-2.5 text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Generating Briefing...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Compile Daily Audit
                </>
              )}
            </button>
          </div>

          {/* Result Box */}
          {isRunning && (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="h-10 w-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin"></div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">CEO Assistant is compiling records...</p>
                <p className="text-xs text-slate-400 italic mt-1">"Reconciling ledger columns, scanning legal checklists, checking volunteer inbox..."</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 flex gap-3 text-sm text-rose-800">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold">Error compiling briefing</span>
                <p className="text-rose-700 text-xs leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {briefResult && !isRunning && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-h-[500px] overflow-y-auto font-sans shadow-inner">
              {renderSimpleMarkdown(briefResult)}
            </div>
          )}

          {!briefResult && !isRunning && (
            <div className="py-12 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Sparkles className="h-8 w-8 stroke-1 text-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-400">Generate an operational analysis of the foundation's CRM data</span>
            </div>
          )}

        </div>
      </div>

      {/* Right Column: Interactive To-Do List & AI Delegation (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Task List Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600 h-5 w-5" />
              AI Delegation Board
            </h2>
            <p className="text-xs text-slate-400">Assign task directives directly to your specialized AI workforce</p>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Directive Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Audit upcoming 80G tax benefit files..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assign Agent</label>
                <select
                  value={assignedAgent}
                  onChange={(e) => setAssignedAgent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-500 font-bold"
                >
                  <option value="KUBER">KUBER (CSR Discovery)</option>
                  <option value="SEVA">SEVA (Email Relations)</option>
                  <option value="VIDYA">VIDYA (Primary Support)</option>
                  <option value="LEKHA">LEKHA (Bookkeeping)</option>
                  <option value="GRANT">GRANT (Proposal Writer)</option>
                  <option value="MEDIA">MEDIA (Social Outreach)</option>
                  <option value="HR">HR (Volunteer Support)</option>
                  <option value="LEGAL">LEGAL (Compliance Audit)</option>
                  <option value="CHATBOT">CHATBOT (Site Queries)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-500 font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Delegate Directive
            </button>
          </form>

          {/* Task Render */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {(database.taskList ?? []).length > 0 ? (
              (database.taskList ?? []).map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    task.status === "Completed"
                      ? "bg-slate-50/50 border-slate-200 text-slate-400"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={() => handleToggleTaskStatus(task)}
                    className="h-4 w-4 rounded text-indigo-600 border-slate-300 mt-0.5 focus:ring-0"
                  />
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-xs font-bold leading-relaxed break-words ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5 items-center text-[10px]">
                      <span className="font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {task.assignedTo}
                      </span>
                      <span className="text-slate-400 font-mono font-bold">Due {task.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {task.status === "Pending" && (
                      <button
                        onClick={() => onTriggerAgent(task.assignedTo, task.title)}
                        className="p-1 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                        title={`Execute this task using ${task.assignedTo}`}
                      >
                        <Play className="h-3.5 w-3.5 fill-indigo-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:bg-rose-50 rounded-lg text-slate-300 hover:text-rose-600 transition"
                      title="Remove task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 block text-center py-6 italic border border-dashed border-slate-200 rounded-xl font-bold">
                No data available.
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}