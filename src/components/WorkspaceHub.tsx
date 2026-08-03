import React, { useState } from "react";
import {
  FileSpreadsheet,
  Mail,
  HardDrive,
  PlusCircle,
  Trash2,
  Check,
  Send,
  Eye,
  Download,
  Folder,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Plus,
  ArrowRight,
  Database,
  Users,
  Briefcase,
  Search,
  Edit,
  Calendar
} from "lucide-react";
import { CrmDatabase, Donor, Student, Volunteer, Finance, Email, DriveFile } from "../types";

interface WorkspaceHubProps {
  database: CrmDatabase;
  onUpdateDatabase: (table: string, action: string, item: any) => Promise<void>;
  onTriggerAgent: (agentId: string, task: string) => void;
}

export default function WorkspaceHub({ database, onUpdateDatabase, onTriggerAgent }: WorkspaceHubProps) {
  const [activeWorkspace, setActiveWorkspace] = useState<"sheets" | "gmail" | "drive" | "compliance">("sheets");
  
  // Sheet-specific subtabs
  const [activeSheet, setActiveSheet] = useState<"donors" | "students" | "volunteers" | "finances">("donors");
  
  // Modal for Viewing Drive File
  const [viewingFile, setViewingFile] = useState<DriveFile | null>(null);

  // Forms states for manual adding
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newDonor, setNewDonor] = useState<Partial<Donor>>({ name: "", type: "Corporate", amount: 10000, campaign: "Digital Lab Sponsor", email: "", phone: "", notes: "", organization: "" });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({ name: "", age: 10, classLevel: "Class 5", parentName: "", status: "Enrolled", phone: "" });
  const [newVolunteer, setNewVolunteer] = useState<Partial<Volunteer>>({ name: "", role: "Computer Tutor", email: "", skill: "", status: "Active" });

  const [donorSearch, setDonorSearch] = useState<string>("");
  const [viewingDonor, setViewingDonor] = useState<Donor | null>(null);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  // Selected Email in Gmail Inbox
  const [selectedEmail, setSelectedEmail] =useState(database.emails?.[0] ?? null);

  // Format currency
  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handlers for additions
  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonor.name) return;
    await onUpdateDatabase("donors", "add", {
      ...newDonor,
      date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      status: "Received"
    });
    // Also log finance receipt automatically (simulating autonomous bookkeeping!)
    const randReceipt = `R-2026-00${database.finances.length + 1}`;
    await onUpdateDatabase("finances", "add", {
      receiptNo: randReceipt,
      donorName: newDonor.name,
      amount: Number(newDonor.amount || 10000),
      date: new Date().toISOString().split("T")[0],
      type: newDonor.type === "Corporate" ? "CSR Funding" : "80G Tax Exemption",
      status: "Reconciled",
      complianceTag: "Pending Filing Verification"
    });
    setNewDonor({ name: "", type: "Corporate", amount: 10000, campaign: "Digital Lab Sponsor", email: "", phone: "", notes: "", organization: "" });
    setShowAddForm(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name) return;
    await onUpdateDatabase("students", "add", {
      ...newStudent,
      admissionDate: new Date().toISOString().split("T")[0],
      status: "Enrolled"
    });
    setNewStudent({ name: "", age: 10, classLevel: "Class 5", parentName: "", status: "Enrolled", phone: "" });
    setShowAddForm(false);
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVolunteer.name) return;
    await onUpdateDatabase("volunteers", "add", {
      ...newVolunteer,
      joinedDate: new Date().toISOString().split("T")[0]
    });
    setNewVolunteer({ name: "", role: "Computer Tutor", email: "", skill: "", status: "Active" });
    setShowAddForm(false);
  };

  const handleDeleteItem = async (table: string, id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await onUpdateDatabase(table, "delete", { id });
    }
  };

  // Gmail workflow
  const handleSendDraft = async (email: Email) => {
    if (!email.draftContent) return;
    // Update email status to 'Approved & Sent'
    await onUpdateDatabase("emails", "edit", {
      ...email,
      status: "Approved & Sent"
    });
    
    // Auto-create a task completion notification
    const correspondingTask = database.taskList.find(t => t.assignedTo === "SEVA" && t.status === "Pending");
    if (correspondingTask) {
      await onUpdateDatabase("taskList", "edit", {
        ...correspondingTask,
        status: "Completed"
      });
    }

    // Update selected email visual
    setSelectedEmail({
      ...email,
      status: "Approved & Sent"
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Menu Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveWorkspace("sheets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition ${
            activeWorkspace === "sheets"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          Google Sheets CRM
        </button>

        <button
          onClick={() => setActiveWorkspace("gmail")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition ${
            activeWorkspace === "gmail"
              ? "bg-blue-50 text-blue-800 border-blue-200 shadow-sm"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <Mail className="h-4 w-4 text-blue-600" />
          Gmail Inbox & drafts
          {database.emails.filter((e) => e.status !== "Approved & Sent").length > 0 && (
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveWorkspace("drive")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition ${
            activeWorkspace === "drive"
              ? "bg-indigo-50 text-indigo-800 border-indigo-200 shadow-sm"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <HardDrive className="h-4 w-4 text-indigo-600" />
          Google Drive Storage
        </button>

        <button
          onClick={() => setActiveWorkspace("compliance")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition ${
            activeWorkspace === "compliance"
              ? "bg-slate-100 text-slate-900 border-slate-300 shadow-sm"
              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-slate-700" />
          Legal Compliance Board
        </button>
      </div>

      {/* WORKSPACE 1: GOOGLE SHEETS WORKSPACE */}
      {activeWorkspace === "sheets" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-600 h-5 w-5" />
                Navyug Google Sheets CRM
              </h2>
              <p className="text-xs text-slate-400">Continuous Supabase database synchronization, updated automatically by AI Employees</p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" />
              Add Row Manually
            </button>
          </div>

          {/* Sheet Table Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveSheet("donors"); setShowAddForm(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeSheet === "donors" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Donors Sheet
              </button>
              <button
                onClick={() => { setActiveSheet("students"); setShowAddForm(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeSheet === "students" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Students Sheet
              </button>
              <button
                onClick={() => { setActiveSheet("volunteers"); setShowAddForm(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeSheet === "volunteers" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Volunteers Sheet
              </button>
              <button
                onClick={() => { setActiveSheet("finances"); setShowAddForm(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeSheet === "finances" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Finances Ledger
              </button>
            </div>

            {activeSheet === "donors" && (
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, organization, phone..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-emerald-500 bg-slate-50/50"
                />
              </div>
            )}
          </div>

          {/* Manual Entry Form */}
          {showAddForm && (
            <div className="p-5 border border-emerald-100 bg-emerald-50/25 rounded-xl animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                Insert New Row into {activeSheet.charAt(0).toUpperCase() + activeSheet.slice(1)} Sheet
              </h3>
              
              {activeSheet === "donors" && (
                <form onSubmit={handleAddDonor} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Donor Name"
                    value={newDonor.name}
                    onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Organization / Institution"
                    value={newDonor.organization || ""}
                    onChange={(e) => setNewDonor({ ...newDonor, organization: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <select
                    value={newDonor.type}
                    onChange={(e) => setNewDonor({ ...newDonor, type: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  >
                    <option value="Corporate">Corporate CSR</option>
                    <option value="Individual">Individual Donor</option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Amount (INR)"
                    value={newDonor.amount}
                    onChange={(e) => setNewDonor({ ...newDonor, amount: Number(e.target.value) })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Campaign Theme"
                    value={newDonor.campaign}
                    onChange={(e) => setNewDonor({ ...newDonor, campaign: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Contact Email"
                    value={newDonor.email}
                    onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Contact Phone"
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Internal Notes"
                    value={newDonor.notes}
                    onChange={(e) => setNewDonor({ ...newDonor, notes: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white sm:col-span-2 focus:outline-emerald-500"
                  />
                  <button type="submit" className="sm:col-span-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 text-xs font-semibold shadow-xs transition">
                    Insert Row & Sync Ledger
                  </button>
                </form>
              )}

              {activeSheet === "students" && (
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Student Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Age"
                    value={newStudent.age}
                    onChange={(e) => setNewStudent({ ...newStudent, age: Number(e.target.value) })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Class Level (e.g., Class 6)"
                    value={newStudent.classLevel}
                    onChange={(e) => setNewStudent({ ...newStudent, classLevel: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Parent/Guardian Name & Occupation"
                    value={newStudent.parentName}
                    onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Parent Mobile"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white sm:col-span-2 focus:outline-emerald-500"
                  />
                  <button type="submit" className="sm:col-span-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 text-xs font-semibold shadow-xs">
                    Insert Student Record
                  </button>
                </form>
              )}

              {activeSheet === "volunteers" && (
                <form onSubmit={handleAddVolunteer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Volunteer Name"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Assigned Tutoring Role"
                    value={newVolunteer.role}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, role: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Skills (e.g. Science, Python)"
                    value={newVolunteer.skill}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, skill: e.target.value })}
                    className="p-2 border border-slate-200 rounded-lg text-xs bg-white sm:col-span-2 focus:outline-emerald-500"
                  />
                  <button type="submit" className="sm:col-span-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 text-xs font-semibold shadow-xs">
                    Insert Volunteer Record
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Sheets Grids */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            {activeSheet === "donors" && (() => {
              const filteredDonors = database.donors.filter((d) => {
                if (!donorSearch) return true;
                const query = donorSearch.toLowerCase();
                return (
                  d.name?.toLowerCase().includes(query) ||
                  d.organization?.toLowerCase().includes(query) ||
                  d.email?.toLowerCase().includes(query) ||
                  d.phone?.toLowerCase().includes(query) ||
                  d.notes?.toLowerCase().includes(query)
                );
              });

              return filteredDonors.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-slate-50/50 text-xs">
                  {donorSearch ? "No donors found matching your search." : "No data available."}
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Organization</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Notes</th>
                      <th className="p-4 font-mono">Created At</th>
                      <th className="p-4">Sponsorship Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredDonors.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 animate-fade-in">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{d.name}</div>
                          <div className="mt-0.5 text-[10px] text-slate-400 font-mono">ID: {d.id?.slice(0, 8)}...</div>
                        </td>
                        <td className="p-4 font-semibold text-slate-600">{d.organization || "—"}</td>
                        <td className="p-4 space-y-0.5">
                          <div className="font-bold text-slate-600">{d.email}</div>
                          <div className="text-slate-400 font-bold">{d.phone}</div>
                        </td>
                        <td className="p-4 max-w-[200px] truncate text-slate-500 italic font-medium" title={d.notes}>
                          {d.notes || "—"}
                        </td>
                        <td className="p-4 font-mono text-slate-500">
                          {d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }) : d.date || "—"}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                              <Check className="h-3 w-3" /> Received
                            </span>
                            <div className="text-[10px] font-mono font-bold text-slate-500">{formatINR(d.amount || 10000)}</div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setViewingDonor(d)}
                              className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="View Donor Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingDonor(d)}
                              className="text-slate-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                              title="Edit Donor Record"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem("donors", d.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}

            {activeSheet === "students" && (
              (database.students ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-slate-50/50 text-xs">No data available.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Age / Class</th>
                      <th className="p-4">Parent Details</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Admission Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {database.students.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{s.name}</td>
                        <td className="p-4 space-y-0.5">
                          <div className="font-bold">{s.classLevel}</div>
                          <div className="text-slate-400 font-mono font-bold">Age: {s.age} yrs</div>
                        </td>
                        <td className="p-4 text-slate-600 italic font-bold">{s.parentName}</td>
                        <td className="p-4 font-mono font-bold text-slate-500">{s.phone || "N/A"}</td>
                        <td className="p-4 font-mono">{s.admissionDate}</td>
                        <td className="p-4">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                            {s.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteItem("students", s.id)} className="text-slate-300 hover:text-rose-600 p-1 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {activeSheet === "volunteers" && (
              (database.volunteers ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-slate-50/50 text-xs">No data available.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Volunteer Name</th>
                      <th className="p-4">Teaching Role</th>
                      <th className="p-4">Skills / Expertise</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Registration Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {database.volunteers.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-900">{v.name}</td>
                        <td className="p-4 font-bold text-slate-800">{v.role}</td>
                        <td className="p-4 text-slate-500 italic font-bold">{v.skill || "Primary Academics"}</td>
                        <td className="p-4 font-mono font-bold text-slate-600">{v.email}</td>
                        <td className="p-4 font-mono">{v.joinedDate}</td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            v.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteItem("volunteers", v.id)} className="text-slate-300 hover:text-rose-600 p-1 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {activeSheet === "finances" && (
              (database.finances ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-slate-50/50 text-xs">No data available.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Receipt No</th>
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Accounting Tag</th>
                      <th className="p-4">Audited Compliance</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {database.finances.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-55/30">
                        <td className="p-4 font-mono font-bold text-indigo-600">{f.receiptNo}</td>
                        <td className="p-4 font-bold text-slate-900">{f.donorName}</td>
                        <td className="p-4 font-mono font-bold text-slate-900">{formatINR(f.amount)}</td>
                        <td className="p-4 font-mono">{f.date}</td>
                        <td className="p-4 font-bold text-slate-600">{f.type}</td>
                        <td className="p-4 italic text-slate-500 font-bold">{f.complianceTag}</td>
                        <td className="p-4">
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            {f.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteItem("finances", f.id)} className="text-slate-300 hover:text-rose-600 p-1 rounded-lg transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      )}

      {/* WORKSPACE 2: GMAIL EMAIL INBOX & DRAFTS */}
      {activeWorkspace === "gmail" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <Mail className="text-blue-600 h-5 w-5" />
              Navyug NGO Email Inbox
            </h2>
            <p className="text-xs text-slate-400">Incoming donor enquiries handled autonomously by SEVA (AI Employee)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            {/* Email List Left Panel (4 cols) */}
            <div className="lg:col-span-4 border border-slate-200 rounded-xl overflow-y-auto divide-y divide-slate-200 bg-slate-50/10">
              {(database.emails ?? []).length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold text-xs">No data available.</div>
              ) : (
                database.emails.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEmail(e)}
                    className={`w-full text-left p-4 transition ${
                      selectedEmail?.id === e.id ? "bg-blue-50/50 border-r-4 border-blue-500" : "hover:bg-slate-50/50 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate max-w-[150px]">{e.from}</span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(e.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1 mb-1">{e.subject}</h4>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{e.content}</p>
                    
                    {/* Status Indicator badge */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        e.status === "Approved & Sent"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : e.status === "Drafted"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {e.status}
                      </span>
                      {e.status === "Inbox" && (
                        <span className="text-[9px] text-blue-600 font-bold animate-pulse">SEVA can Draft</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Email Reader Right Panel (8 cols) */}
            <div className="lg:col-span-8 border border-slate-200 rounded-xl p-5 flex flex-col justify-between overflow-y-auto bg-white">
              {selectedEmail ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Subject & Metadata */}
                  <div className="border-b border-slate-200 pb-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-base text-slate-900">{selectedEmail.subject}</h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(selectedEmail.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400">From: </span>
                      <span className="font-semibold text-slate-800">{selectedEmail.from}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed flex-1 py-4 font-medium">
                    {selectedEmail.content}
                  </div>

                  {/* AI SEVA Draft Overlay Section */}
                  {selectedEmail.status === "Inbox" && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                          No response drafted yet
                        </span>
                        <button
                          onClick={() => onTriggerAgent("SEVA", `Draft full email response to: ${selectedEmail.content}`)}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-xs transition flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" /> Execute SEVA Drafting
                        </button>
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                        Authorize **SEVA** to read this message and draft an empathetic, compliance-aware response using Section 12A/80G validation.
                      </p>
                    </div>
                  )}

                  {selectedEmail.status === "Drafted" && selectedEmail.draftContent && (
                    <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-5 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                        <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-purple-600" />
                          SEVA drafted response (Pending Board approval)
                        </span>
                        <button
                          onClick={() => handleSendDraft(selectedEmail)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" /> Approve & Send Email
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-[180px] overflow-y-auto font-sans font-medium">
                        {selectedEmail.draftContent}
                      </div>
                    </div>
                  )}

                  {selectedEmail.status === "Approved & Sent" && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-xs text-emerald-800 font-bold">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>
                        Email successfully approved and dispatched under standard Apps Script triggering rules. Logs synchronized with CRM history.
                      </span>
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Mail className="h-8 w-8 stroke-1" />
                  <span className="text-xs font-bold">No email selected. Select from the Inbox.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WORKSPACE 3: GOOGLE DRIVE STORAGE */}
      {activeWorkspace === "drive" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <HardDrive className="text-indigo-600 h-5 w-5" />
              Navyug Google Drive Storage
            </h2>
            <p className="text-xs text-slate-400">Secure cloud storage for corporate proposals, donation receipts, and legal documents</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Grant Proposals", "Donation Receipts", "Newsletters", "CEO Reports"].map((folderName) => {
              const folderFiles = database.driveFiles.filter(f => f.folder === folderName);

              return (
                <div key={folderName} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                    <Folder className="h-4 w-4 text-indigo-500 fill-indigo-200" />
                    <span>{folderName}</span>
                    <span className="ml-auto font-mono text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full font-bold">
                      {folderFiles.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {folderFiles.length > 0 ? (
                      folderFiles.map(file => (
                        <button
                          key={file.id}
                          onClick={() => setViewingFile(file)}
                          className="w-full text-left p-2 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition flex items-center justify-between text-[11px]"
                        >
                          <span className="truncate max-w-[130px] font-semibold text-slate-700">{file.name}</span>
                          <Eye className="h-3.5 w-3.5 text-slate-400 hover:text-indigo-600" />
                        </button>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 block italic py-2 font-bold">Folder empty. Use GRANT/LEKHA to write files.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inline Document Viewer (Google Docs Workspace Modal) */}
          {viewingFile && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{viewingFile.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">
                      Author: {viewingFile.createdBy} • Generated {viewingFile.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([viewingFile.content], { type: "text/plain" });
                      element.href = URL.createObjectURL(file);
                      element.download = viewingFile.name;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="p-1 px-2.5 rounded-lg border border-indigo-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-indigo-700 flex items-center gap-1 transition shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <button onClick={() => setViewingFile(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                    Close Viewer
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto shadow-inner">
                {viewingFile.content}
              </div>
            </div>
          )}

        </div>
      )}

      {/* WORKSPACE 4: LEGAL COMPLIANCE HUB */}
      {activeWorkspace === "compliance" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="text-slate-900 h-5 w-5" />
              Navyug Legal Compliance Audit Board
            </h2>
            <p className="text-xs text-slate-400">Track and safeguard Section 12A, 80G tax deductions, MCA CSR-1, and FCRA filings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(database.legalCompliance ?? []).length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-500 font-bold bg-slate-50 border border-slate-200 rounded-xl text-xs">
                No data available.
              </div>
            ) : (
              database.legalCompliance.map((comp) => (
                <div key={comp.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between shadow-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-xs text-slate-900">{comp.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        comp.status === "Compliant"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">Act: {comp.law}</div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{comp.notes}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400 font-bold">Due Renewal: {comp.dueBy}</span>
                    <button
                      onClick={() => onTriggerAgent("LEGAL", `Audit upcoming requirements and renewal protocols for ${comp.name}.`)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                    >
                      Run Legal Audit <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW DONOR PROFILE MODAL */}
      {viewingDonor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="bg-indigo-950 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-sm tracking-wide">Donor Registration Profile</span>
              </div>
              <button onClick={() => setViewingDonor(null)} className="text-white/80 hover:text-white font-bold text-xs">
                ✕ Close
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Donor / Sponsor Name</span>
                <h4 className="text-xl font-bold text-slate-900">{viewingDonor.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Organization</span>
                  <p className="text-xs font-semibold text-slate-700">{viewingDonor.organization || "—"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donor Type</span>
                  <p className="text-xs font-semibold text-slate-700">{viewingDonor.type || "Corporate"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
                  <p className="text-xs font-semibold text-slate-700 font-mono">{viewingDonor.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</span>
                  <p className="text-xs font-semibold text-slate-700 font-mono">{viewingDonor.phone || "—"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount Sponsoring</span>
                  <p className="text-xs font-bold text-emerald-700 font-mono">{formatINR(viewingDonor.amount || 10000)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date Registered</span>
                  <p className="text-xs font-semibold text-slate-700 font-mono">
                    {viewingDonor.created_at ? new Date(viewingDonor.created_at).toLocaleString("en-IN") : viewingDonor.date || "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Association</span>
                <p className="text-xs font-semibold text-slate-700 italic">{viewingDonor.campaign || "General Contribution"}</p>
              </div>

              <div className="space-y-1 border-t border-slate-100 pt-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Internal Notes</span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium whitespace-pre-line leading-relaxed max-h-[120px] overflow-y-auto">
                  {viewingDonor.notes || "No extra internal briefing notes are stored for this sponsor."}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setEditingDonor(viewingDonor);
                  setViewingDonor(null);
                }}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition"
              >
                Edit Record
              </button>
              <button
                onClick={() => setViewingDonor(null)}
                className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 px-4 py-2 text-xs font-bold transition"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DONOR PROFILE MODAL */}
      {editingDonor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="bg-indigo-950 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-emerald-400" />
                <span className="font-bold text-sm tracking-wide">Edit Donor Registration</span>
              </div>
              <button onClick={() => setEditingDonor(null)} className="text-white/80 hover:text-white font-bold text-xs">
                ✕ Cancel
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingDonor.name) return;
                await onUpdateDatabase("donors", "edit", editingDonor);
                setEditingDonor(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donor / Sponsor Name</label>
                  <input
                    type="text"
                    required
                    value={editingDonor.name}
                    onChange={(e) => setEditingDonor({ ...editingDonor, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Organization / Company</label>
                  <input
                    type="text"
                    value={editingDonor.organization || ""}
                    onChange={(e) => setEditingDonor({ ...editingDonor, organization: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donor Type</label>
                  <select
                    value={editingDonor.type || "Corporate"}
                    onChange={(e) => setEditingDonor({ ...editingDonor, type: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-semibold"
                  >
                    <option value="Corporate">Corporate CSR</option>
                    <option value="Individual">Individual Donor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={editingDonor.amount || 10000}
                    onChange={(e) => setEditingDonor({ ...editingDonor, amount: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Theme</label>
                  <input
                    type="text"
                    value={editingDonor.campaign || ""}
                    onChange={(e) => setEditingDonor({ ...editingDonor, campaign: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={editingDonor.email || ""}
                    onChange={(e) => setEditingDonor({ ...editingDonor, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-semibold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editingDonor.phone || ""}
                    onChange={(e) => setEditingDonor({ ...editingDonor, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-semibold font-mono"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Internal Notes</label>
                  <textarea
                    value={editingDonor.notes || ""}
                    onChange={(e) => setEditingDonor({ ...editingDonor, notes: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-emerald-500 font-medium h-24 resize-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 px-4 py-2.5 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-colors"
                >
                  Save & Sync Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}