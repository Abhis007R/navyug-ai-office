import React, { useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  Handshake,
  IndianRupee,
  Mail,
  FolderOpen,
  ShieldCheck,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Download,
} from "lucide-react";

import type {
  CrmDatabase,
  Donor,
  Student,
  Volunteer,
  Finance,
  Email,
  DriveFile,
  LegalCompliance,
} from "../types";

interface WorkspaceHubProps {
  database: CrmDatabase;
  onUpdateDatabase: (
    table: string,
    action: "add" | "update" | "delete",
    payload: any
  ) => Promise<void>;

  onTriggerAgent: (agent: string, task: string) => void;
}

type WorkspaceTab =
  | "sheets"
  | "gmail"
  | "drive"
  | "compliance";

type SheetTab =
  | "donors"
  | "students"
  | "volunteers"
  | "finances";

export default function WorkspaceHub({
  database,
  onUpdateDatabase,
  onTriggerAgent,
}: WorkspaceHubProps) {

  const [workspace, setWorkspace] =
    useState<WorkspaceTab>("sheets");

  const [sheetTab, setSheetTab] =
    useState<SheetTab>("donors");

  const [search, setSearch] = useState("");

  const [selectedEmail, setSelectedEmail] =
    useState<Email | null>(
      database.emails?.[0] ?? null
    );

  const [selectedFile, setSelectedFile] =
    useState<DriveFile | null>(null);

  const [viewDonor, setViewDonor] =
    useState<Donor | null>(null);

  const [editDonor, setEditDonor] =
    useState<Donor | null>(null);

  const [showAddDonor, setShowAddDonor] =
    useState(false);

  const [showAddStudent, setShowAddStudent] =
    useState(false);

  const [showAddVolunteer, setShowAddVolunteer] =
    useState(false);

  const donors = database.donors ?? [];
  const students = database.students ?? [];
  const volunteers = database.volunteers ?? [];
  const finances = database.finances ?? [];
  const emails = database.emails ?? [];
  const driveFiles = database.driveFiles ?? [];
  const compliance = database.legalCompliance ?? [];
  const taskList = database.taskList ?? [];

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const filteredDonors = useMemo(() => {

    if (!search.trim()) return donors;

    const q = search.toLowerCase();

    return donors.filter((d) => {

      return (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        (d.organization ?? "")
          .toLowerCase()
          .includes(q)
      );

    });

  }, [search, donors]);

  return (

<div className="flex flex-col gap-6">

{/* Header */}

<div className="bg-white rounded-xl border p-5 flex items-center justify-between">

<div>

<h1 className="text-2xl font-bold">
Workspace Hub
</h1>

<p className="text-slate-500 text-sm">
Manage CRM, Gmail, Google Drive and Compliance
from one place.
</p>

</div>

<div className="flex gap-3">

<button
className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold"
onClick={() =>
onTriggerAgent(
"workspace",
"Synchronize all workspaces"
)
}
>
Sync Workspace
</button>

</div>

</div>

{/* Workspace Tabs */}

<div className="flex gap-3 flex-wrap">

<button
onClick={() => setWorkspace("sheets")}
className={`px-4 py-2 rounded-lg border ${
workspace === "sheets"
? "bg-indigo-600 text-white"
: "bg-white"
}`}
>
<FileText className="w-4 h-4 inline mr-2" />
Google Sheets
</button>

<button
onClick={() => setWorkspace("gmail")}
className={`px-4 py-2 rounded-lg border ${
workspace === "gmail"
? "bg-indigo-600 text-white"
: "bg-white"
}`}
>
<Mail className="w-4 h-4 inline mr-2" />
Gmail
</button>

<button
onClick={() => setWorkspace("drive")}
className={`px-4 py-2 rounded-lg border ${
workspace === "drive"
? "bg-indigo-600 text-white"
: "bg-white"
}`}
>
<FolderOpen className="w-4 h-4 inline mr-2" />
Google Drive
</button>

<button
onClick={() => setWorkspace("compliance")}
className={`px-4 py-2 rounded-lg border ${
workspace === "compliance"
? "bg-indigo-600 text-white"
: "bg-white"
}`}
>
<ShieldCheck className="w-4 h-4 inline mr-2" />
Compliance
</button>

</div>
{/* ================= GOOGLE SHEETS ================= */}

{workspace === "sheets" && (
  <div className="space-y-6">

    {/* Sheet Tabs */}

    <div className="flex flex-wrap gap-3">

      <button
        onClick={() => setSheetTab("donors")}
        className={`px-4 py-2 rounded-lg border ${
          sheetTab === "donors"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <Handshake className="w-4 h-4 inline mr-2" />
        Donors
      </button>

      <button
        onClick={() => setSheetTab("students")}
        className={`px-4 py-2 rounded-lg border ${
          sheetTab === "students"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <GraduationCap className="w-4 h-4 inline mr-2" />
        Students
      </button>

      <button
        onClick={() => setSheetTab("volunteers")}
        className={`px-4 py-2 rounded-lg border ${
          sheetTab === "volunteers"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <Users className="w-4 h-4 inline mr-2" />
        Volunteers
      </button>

      <button
        onClick={() => setSheetTab("finances")}
        className={`px-4 py-2 rounded-lg border ${
          sheetTab === "finances"
            ? "bg-indigo-600 text-white"
            : "bg-white"
        }`}
      >
        <IndianRupee className="w-4 h-4 inline mr-2" />
        Finance
      </button>

    </div>

    {/* DONORS */}

    {sheetTab === "donors" && (

      <div className="bg-white rounded-xl border shadow-sm">

        <div className="flex justify-between items-center p-5 border-b">

          <div className="relative w-96">

            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor..."
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />

          </div>

          <button
            onClick={() => setShowAddDonor(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Donor
          </button>

        </div>

        <div className="overflow-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr className="text-left">

                <th className="p-3">Name</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Email</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredDonors.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center p-8 text-slate-500"
                  >
                    No Donors Found
                  </td>

                </tr>

              ) : (

                filteredDonors.map((d) => (

                  <tr
                    key={d.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-3 font-semibold">
                      {d.name}
                    </td>

                    <td className="p-3">
                      {d.organization || "-"}
                    </td>

                    <td className="p-3">
                      {d.email}
                    </td>

                    <td className="p-3">
                      {formatINR(d.amount)}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          d.status === "Received"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.status}
                      </span>

                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() => setViewDonor(d)}
                          className="p-2 rounded hover:bg-slate-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditDonor(d)}
                          className="p-2 rounded hover:bg-slate-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            onUpdateDatabase(
                              "donors",
                              "delete",
                              d
                            )
                          }
                          className="p-2 rounded hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    )}

  </div>
)}
{/* ================= STUDENTS ================= */}

{sheetTab === "students" && (
  <div className="bg-white rounded-xl border shadow-sm">

    <div className="flex justify-between items-center p-5 border-b">

      <h2 className="text-lg font-bold">
        Students
      </h2>

      <button
        onClick={() => setShowAddStudent(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Student
      </button>

    </div>

    <div className="overflow-auto">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Class</th>
            <th className="p-3 text-left">Parent</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Status</th>

          </tr>

        </thead>

        <tbody>

          {(students ?? []).length === 0 ? (

            <tr>

              <td
                colSpan={5}
                className="text-center p-8 text-slate-500"
              >
                No Students Available
              </td>

            </tr>

          ) : (

            (students ?? []).map((s) => (

              <tr
                key={s.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-3">{s.name}</td>

                <td className="p-3">{s.classLevel}</td>

                <td className="p-3">{s.parentName}</td>

                <td className="p-3">{s.phone}</td>

                <td className="p-3">

                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">

                    {s.status}

                  </span>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>
)}

{/* ================= VOLUNTEERS ================= */}

{sheetTab === "volunteers" && (

<div className="bg-white rounded-xl border shadow-sm">

<div className="flex justify-between items-center p-5 border-b">

<h2 className="text-lg font-bold">
Volunteers
</h2>

<button
onClick={() => setShowAddVolunteer(true)}
className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
>

<Plus className="w-4 h-4"/>

Add Volunteer

</button>

</div>

<div className="overflow-auto">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-3 text-left">Name</th>
<th className="p-3 text-left">Role</th>
<th className="p-3 text-left">Skill</th>
<th className="p-3 text-left">Email</th>
<th className="p-3 text-left">Status</th>

</tr>

</thead>

<tbody>

{(volunteers ?? []).length===0 ? (

<tr>

<td
colSpan={5}
className="text-center p-8 text-slate-500"
>

No Volunteers

</td>

</tr>

) : (

(volunteers ?? []).map(v=>(

<tr
key={v.id}
className="border-t hover:bg-slate-50"
>

<td className="p-3">{v.name}</td>

<td className="p-3">{v.role}</td>

<td className="p-3">{v.skill}</td>

<td className="p-3">{v.email}</td>

<td className="p-3">

<span className={`px-2 py-1 rounded text-xs ${
v.status==="Active"
?"bg-green-100 text-green-700"
:"bg-yellow-100 text-yellow-700"
}`}>

{v.status}

</span>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

)}

{/* ================= FINANCE ================= */}

{sheetTab==="finances" && (

<div className="bg-white rounded-xl border shadow-sm">

<div className="p-5 border-b">

<h2 className="text-lg font-bold">
Finance Register
</h2>

</div>

<div className="overflow-auto">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-3 text-left">
Receipt
</th>

<th className="p-3 text-left">
Donor
</th>

<th className="p-3 text-left">
Amount
</th>

<th className="p-3 text-left">
Date
</th>

<th className="p-3 text-left">
Status
</th>

</tr>

</thead>

<tbody>

{(finances ?? []).length===0 ? (

<tr>

<td
colSpan={5}
className="text-center p-8 text-slate-500"
>

No Finance Records

</td>

</tr>

) : (

(finances ?? []).map(f=>(

<tr
key={f.id}
className="border-t hover:bg-slate-50"
>

<td className="p-3">
{f.receiptNo}
</td>

<td className="p-3">
{f.donorName}
</td>

<td className="p-3">
{formatINR(f.amount)}
</td>

<td className="p-3">
{f.date}
</td>

<td className="p-3">

<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">

{f.status}

</span>

</td>

</tr>

))

)}

</tbody>

</table>

</div>

</div>

)}
{/* ====================== GMAIL ====================== */}

{workspace === "gmail" && (

<div className="grid lg:grid-cols-12 gap-6">

  {/* Inbox */}

  <div className="lg:col-span-4 bg-white rounded-xl border overflow-hidden">

    <div className="flex items-center justify-between p-4 border-b">

      <h2 className="font-bold flex items-center gap-2">

        <Mail className="w-5 h-5 text-blue-600"/>

        Gmail Inbox

      </h2>

      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">

        {(emails ?? []).length}

      </span>

    </div>

    {(emails ?? []).length === 0 ? (

      <div className="p-10 text-center text-slate-500">

        No Emails Available

      </div>

    ) : (

      <div className="divide-y max-h-[700px] overflow-y-auto">

        {(emails ?? []).map((mail) => (

          <button

            key={mail.id}

            onClick={() => setSelectedEmail(mail)}

            className={`

            w-full

            text-left

            p-4

            hover:bg-slate-50

            transition

            ${selectedEmail?.id===mail.id

              ? "bg-blue-50 border-r-4 border-blue-600"

              : ""

            }

            `}

          >

            <div className="flex justify-between">

              <strong className="truncate">

                {mail.from}

              </strong>

              <span className="text-xs text-slate-400">

                {mail.date}

              </span>

            </div>

            <div className="font-semibold mt-1 truncate">

              {mail.subject}

            </div>

            <div className="text-xs text-slate-500 line-clamp-2">

              {mail.content}

            </div>

            <div className="mt-2">

              <span

                className={`

                px-2

                py-1

                rounded

                text-[10px]

                font-semibold

                ${

                  mail.status==="Approved & Sent"

                  ? "bg-green-100 text-green-700"

                  : mail.status==="Drafted"

                  ? "bg-purple-100 text-purple-700"

                  : "bg-yellow-100 text-yellow-700"

                }

                `}

              >

                {mail.status}

              </span>

            </div>

          </button>

        ))}

      </div>

    )}

  </div>

  {/* Email Viewer */}

  <div className="lg:col-span-8">

    <div className="bg-white rounded-xl border h-full">

      {selectedEmail ? (

        <>

          <div className="border-b p-5">

            <h2 className="text-xl font-bold">

              {selectedEmail.subject}

            </h2>

            <div className="text-sm text-slate-500 mt-2">

              From:

              <strong>

                {" "}

                {selectedEmail.from}

              </strong>

            </div>

            <div className="text-xs text-slate-400">

              {selectedEmail.date}

            </div>

          </div>

          <div className="p-6 whitespace-pre-wrap leading-7">

            {selectedEmail.content}

          </div>

          <div className="border-t p-5 flex gap-3 flex-wrap">

            <button

              className="bg-indigo-600 text-white px-4 py-2 rounded"

              onClick={()=>

                onTriggerAgent(

                  "seva",

                  `Draft reply for email ${selectedEmail.subject}`

                )

              }

            >

              AI Draft Reply

            </button>

            <button

              className="bg-green-600 text-white px-4 py-2 rounded"

            >

              Approve & Send

            </button>

            <button

              className="border px-4 py-2 rounded"

            >

              Archive

            </button>

          </div>

        </>

      ) : (

        <div className="flex items-center justify-center h-[500px] text-slate-400">

          Select an Email

        </div>

      )}

    </div>

  </div>

</div>

)}
{/* ====================== GOOGLE DRIVE ====================== */}

{workspace === "drive" && (

<div className="grid lg:grid-cols-12 gap-6">

{/* Left Sidebar */}

<div className="lg:col-span-4">

<div className="bg-white rounded-xl border">

<div className="p-4 border-b">

<h2 className="font-bold flex items-center gap-2">

<FolderOpen className="w-5 h-5 text-amber-600"/>

Google Drive

</h2>

</div>

{[
"Grant Proposals",
"Donation Receipts",
"Newsletters",
"CEO Reports"
].map(folder=>{

const files=(driveFiles??[]).filter(
f=>f.folder===folder
);

return(

<div
key={folder}
className="border-b last:border-b-0"
>

<div className="flex items-center justify-between px-4 py-3 bg-slate-50">

<span className="font-semibold">

{folder}

</span>

<span className="text-xs bg-indigo-100 text-indigo-700 rounded px-2 py-1">

{files.length}

</span>

</div>

<div>

{files.length===0? (

<div className="px-4 py-3 text-xs text-slate-400">

No Files

</div>

):(files.map(file=>(

<button

key={file.id}

onClick={()=>setSelectedFile(file)}

className={`

w-full

text-left

px-4

py-3

hover:bg-slate-50

transition

${selectedFile?.id===file.id

?"bg-blue-50 border-r-4 border-blue-600"

:""

}

`}

>

<div className="font-medium truncate">

{file.name}

</div>

<div className="text-xs text-slate-500">

{file.createdBy}

</div>

</button>

)))}

</div>

</div>

);

})}

</div>

</div>

{/* Right Viewer */}

<div className="lg:col-span-8">

<div className="bg-white rounded-xl border h-full">

{selectedFile?(

<>

<div className="border-b p-5">

<h2 className="text-xl font-bold">

{selectedFile.name}

</h2>

<div className="text-sm text-slate-500 mt-2">

Folder :

<strong>

{" "}

{selectedFile.folder}

</strong>

</div>

<div className="text-xs text-slate-400">

Created By :

{selectedFile.createdBy}

</div>

<div className="text-xs text-slate-400">

Date :

{selectedFile.date}

</div>

</div>

<div className="p-6 whitespace-pre-wrap leading-7 min-h-[350px]">

{selectedFile.content}

</div>

<div className="border-t p-5 flex gap-3 flex-wrap">

<button

className="bg-indigo-600 text-white px-4 py-2 rounded-lg"

onClick={()=>onTriggerAgent(

"drive",

`Summarize ${selectedFile.name}`

)}

>

AI Summary

</button>

<button

className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

>

<Download className="w-4 h-4"/>

Download

</button>

<button

className="border px-4 py-2 rounded-lg"

>

Open in Drive

</button>

</div>

</>

):(

<div className="flex flex-col items-center justify-center h-[600px] text-slate-400">

<FolderOpen className="w-20 h-20 mb-5"/>

<p>

Select any file from Drive

</p>

</div>

)}

</div>

</div>

</div>

)}
{/* ================= COMPLIANCE ================= */}

{workspace === "compliance" && (

<div className="space-y-6">

<div className="flex justify-between items-center">

<div>

<h2 className="text-2xl font-bold">

Legal Compliance

</h2>

<p className="text-slate-500">

NGO statutory compliance dashboard

</p>

</div>

<button
className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
onClick={() =>
onTriggerAgent(
"legal",
"Run complete compliance audit"
)
}
>

Run AI Audit

</button>

</div>

<div className="grid lg:grid-cols-2 gap-5">

{(compliance ?? []).length===0 ? (

<div className="col-span-2 bg-white rounded-xl border p-12 text-center text-slate-500">

No Compliance Records Available

</div>

) : (

(compliance ?? []).map(item=>(

<div
key={item.id}
className="bg-white rounded-xl border p-5 shadow-sm"
>

<div className="flex justify-between items-start">

<div>

<h3 className="font-bold text-lg">

{item.name}

</h3>

<p className="text-sm text-slate-500">

{item.law}

</p>

</div>

<span
className={`px-3 py-1 rounded-full text-xs font-bold ${
item.status==="Compliant"
?"bg-green-100 text-green-700"
:item.status==="Renewal Pending"
?"bg-yellow-100 text-yellow-700"
:"bg-red-100 text-red-700"
}`}
>

{item.status}

</span>

</div>

<div className="mt-4 space-y-2">

<div>

<span className="font-semibold">

Due :

</span>

{" "}

{item.dueBy}

</div>

<div className="text-slate-600 text-sm">

{item.notes}

</div>

</div>

<div className="mt-5 flex gap-3">

<button
className="bg-indigo-600 text-white px-3 py-2 rounded-lg"
onClick={() =>
onTriggerAgent(
"legal",
`Review ${item.law}`
)
}
>

AI Review

</button>

<button
className="border px-3 py-2 rounded-lg"
>

Open Record

</button>

</div>

</div>

))

)}

</div>

{/* ================= QUICK STATS ================= */}

<div className="grid md:grid-cols-4 gap-4">

<div className="bg-white border rounded-xl p-5">

<div className="text-sm text-slate-500">

Total Records

</div>

<div className="text-3xl font-bold mt-2">

{(compliance ?? []).length}

</div>

</div>

<div className="bg-white border rounded-xl p-5">

<div className="text-sm text-slate-500">

Compliant

</div>

<div className="text-3xl font-bold text-green-600 mt-2">

{
(compliance ?? []).filter(
c=>c.status==="Compliant"
).length
}

</div>

</div>

<div className="bg-white border rounded-xl p-5">

<div className="text-sm text-slate-500">

Renewal Pending

</div>

<div className="text-3xl font-bold text-yellow-600 mt-2">

{
(compliance ?? []).filter(
c=>c.status==="Renewal Pending"
).length
}

</div>

</div>

<div className="bg-white border rounded-xl p-5">

<div className="text-sm text-slate-500">

Review Required

</div>

<div className="text-3xl font-bold text-red-600 mt-2">

{
(compliance ?? []).filter(
c=>c.status==="Review Required"
).length
}

</div>

</div>

</div>

</div>

)}
{/* ================= ADD DONOR MODAL ================= */}

{showAddDonor && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

    {/* Header */}

    <div className="flex items-center justify-between border-b p-5">

      <h2 className="text-xl font-bold">
        Add New Donor
      </h2>

      <button
        onClick={() => setShowAddDonor(false)}
        className="text-slate-500 hover:text-red-600 text-xl"
      >
        ✕
      </button>

    </div>

    {/* Form */}

    <form
      onSubmit={handleAddDonor}
      className="p-6 space-y-5"
    >

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <label className="text-sm font-semibold">
            Donor Name
          </label>

          <input
            required
            value={newDonor.name ?? ""}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                name:e.target.value
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          />

        </div>

        <div>

          <label className="text-sm font-semibold">
            Organization
          </label>

          <input
            value={newDonor.organization ?? ""}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                organization:e.target.value
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          />

        </div>

        <div>

          <label className="text-sm font-semibold">
            Email
          </label>

          <input
            type="email"
            value={newDonor.email ?? ""}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                email:e.target.value
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          />

        </div>

        <div>

          <label className="text-sm font-semibold">
            Phone
          </label>

          <input
            value={newDonor.phone ?? ""}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                phone:e.target.value
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          />

        </div>

        <div>

          <label className="text-sm font-semibold">
            Donation Amount
          </label>

          <input
            type="number"
            value={newDonor.amount ?? 0}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                amount:Number(e.target.value)
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          />

        </div>

        <div>

          <label className="text-sm font-semibold">
            Type
          </label>

          <select
            value={newDonor.type ?? "Individual"}
            onChange={(e)=>
              setNewDonor({
                ...newDonor,
                type:e.target.value
              })
            }
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option>Individual</option>
            <option>Corporate</option>
          </select>

        </div>

      </div>

      <div>

        <label className="text-sm font-semibold">
          Campaign
        </label>

        <input
          value={newDonor.campaign ?? ""}
          onChange={(e)=>
            setNewDonor({
              ...newDonor,
              campaign:e.target.value
            })
          }
          className="w-full border rounded-lg p-2 mt-1"
        />

      </div>

      <div>

        <label className="text-sm font-semibold">
          Notes
        </label>

        <textarea
          rows={4}
          value={newDonor.notes ?? ""}
          onChange={(e)=>
            setNewDonor({
              ...newDonor,
              notes:e.target.value
            })
          }
          className="w-full border rounded-lg p-2 mt-1"
        />

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 pt-3 border-t">

        <button
          type="button"
          onClick={() => setShowAddDonor(false)}
          className="border px-5 py-2 rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Save Donor
        </button>

      </div>

    </form>

  </div>

</div>

)}
{/* ================= ADD STUDENT MODAL ================= */}

{showAddStudent && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

  <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

    {/* Header */}

    <div className="flex items-center justify-between border-b p-5">

      <h2 className="text-xl font-bold">
        Add Student
      </h2>

      <button
        onClick={() => setShowAddStudent(false)}
        className="text-2xl text-slate-500 hover:text-red-600"
      >
        ×
      </button>

    </div>

    {/* Form */}

    <form
      onSubmit={handleAddStudent}
      className="p-6 space-y-5"
    >

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <label className="block text-sm font-semibold mb-1">
            Student Name
          </label>

          <input
            required
            value={newStudent.name ?? ""}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                name:e.target.value
              })
            }
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-1">
            Age
          </label>

          <input
            type="number"
            value={newStudent.age ?? 10}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                age:Number(e.target.value)
              })
            }
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-1">
            Class
          </label>

          <input
            value={newStudent.classLevel ?? ""}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                classLevel:e.target.value
              })
            }
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-1">
            Parent Name
          </label>

          <input
            value={newStudent.parentName ?? ""}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                parentName:e.target.value
              })
            }
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-1">
            Phone
          </label>

          <input
            value={newStudent.phone ?? ""}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                phone:e.target.value
              })
            }
            className="w-full border rounded-lg p-2"
          />

        </div>

        <div>

          <label className="block text-sm font-semibold mb-1">
            Status
          </label>

          <select
            value={newStudent.status ?? "Enrolled"}
            onChange={(e)=>
              setNewStudent({
                ...newStudent,
                status:e.target.value
              })
            }
            className="w-full border rounded-lg p-2"
          >
            <option value="Enrolled">Enrolled</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

      </div>

      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={() => setShowAddStudent(false)}
          className="px-5 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Save Student
        </button>

      </div>

    </form>

  </div>

</div>

)}
{/* ================= ADD VOLUNTEER MODAL ================= */}

{showAddVolunteer && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

  <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

    {/* Header */}

    <div className="flex items-center justify-between border-b p-5">

      <h2 className="text-xl font-bold">

        Add Volunteer

      </h2>

      <button
        onClick={() => setShowAddVolunteer(false)}
        className="text-2xl text-slate-500 hover:text-red-600"
      >
        ×
      </button>

    </div>

    {/* Form */}

    <form
      onSubmit={handleAddVolunteer}
      className="space-y-5 p-6"
    >

      <div className="grid gap-4 md:grid-cols-2">

        <div>

          <label className="mb-1 block text-sm font-semibold">

            Volunteer Name

          </label>

          <input
            required
            value={newVolunteer.name ?? ""}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

        <div>

          <label className="mb-1 block text-sm font-semibold">

            Role

          </label>

          <input
            value={newVolunteer.role ?? ""}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                role: e.target.value,
              })
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

        <div>

          <label className="mb-1 block text-sm font-semibold">

            Email

          </label>

          <input
            type="email"
            value={newVolunteer.email ?? ""}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                email: e.target.value,
              })
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

        <div>

          <label className="mb-1 block text-sm font-semibold">

            Skill

          </label>

          <input
            value={newVolunteer.skill ?? ""}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                skill: e.target.value,
              })
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

        <div>

          <label className="mb-1 block text-sm font-semibold">

            Status

          </label>

          <select
            value={newVolunteer.status ?? "Active"}
            onChange={(e) =>
              setNewVolunteer({
                ...newVolunteer,
                status: e.target.value,
              })
            }
            className="w-full rounded-lg border p-2"
          >
            <option value="Active">
              Active
            </option>

            <option value="Pending Approval">
              Pending Approval
            </option>

          </select>

        </div>

      </div>

      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={() => setShowAddVolunteer(false)}
          className="rounded-lg border px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white"
        >
          Save Volunteer
        </button>

      </div>

    </form>

  </div>

</div>

)}
{/* ================= VIEW DONOR ================= */}

{viewDonor && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-xl shadow-xl w-full max-w-xl">

<div className="flex justify-between items-center border-b p-5">

<h2 className="text-xl font-bold">
Donor Details
</h2>

<button
onClick={()=>setViewDonor(null)}
className="text-2xl"
>
×
</button>

</div>

<div className="p-6 space-y-3">

<p><strong>Name :</strong> {viewDonor.name}</p>

<p><strong>Organization :</strong> {viewDonor.organization}</p>

<p><strong>Email :</strong> {viewDonor.email}</p>

<p><strong>Phone :</strong> {viewDonor.phone}</p>

<p><strong>Campaign :</strong> {viewDonor.campaign}</p>

<p><strong>Amount :</strong> {formatINR(viewDonor.amount)}</p>

<p><strong>Status :</strong> {viewDonor.status}</p>

<p><strong>Notes :</strong></p>

<div className="border rounded-lg p-3 bg-slate-50">

{viewDonor.notes}

</div>

</div>

<div className="border-t p-5 flex justify-end">

<button

onClick={()=>setViewDonor(null)}

className="px-5 py-2 border rounded-lg"

>

Close

</button>

</div>

</div>

</div>
)}

{/* ================= EDIT DONOR ================= */}

{editDonor && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

<div className="flex justify-between items-center border-b p-5">

<h2 className="text-xl font-bold">

Edit Donor

</h2>

<button

onClick={()=>setEditDonor(null)}

className="text-2xl"

>

×

</button>

</div>

<form

className="p-6 space-y-4"

onSubmit={async(e)=>{

e.preventDefault();

await onUpdateDatabase(

"donors",

"update",

editDonor

);

setEditDonor(null);

}}

>

<input

className="w-full border rounded-lg p-2"

value={editDonor.name}

onChange={(e)=>

setEditDonor({

...editDonor,

name:e.target.value

})

}

/>

<input

className="w-full border rounded-lg p-2"

value={editDonor.email}

onChange={(e)=>

setEditDonor({

...editDonor,

email:e.target.value

})

}

/>

<input

className="w-full border rounded-lg p-2"

value={editDonor.phone}

onChange={(e)=>

setEditDonor({

...editDonor,

phone:e.target.value

})

}

/>

<input

type="number"

className="w-full border rounded-lg p-2"

value={editDonor.amount}

onChange={(e)=>

setEditDonor({

...editDonor,

amount:Number(e.target.value)

})

}

/>

<textarea

rows={5}

className="w-full border rounded-lg p-2"

value={editDonor.notes}

onChange={(e)=>

setEditDonor({

...editDonor,

notes:e.target.value

})

}

/>

<div className="flex justify-end gap-3">

<button

type="button"

onClick={()=>setEditDonor(null)}

className="border rounded-lg px-5 py-2"

>

Cancel

</button>

<button

type="submit"

className="bg-indigo-600 text-white rounded-lg px-5 py-2"

>

Save Changes

</button>

</div>

</form>

</div>

</div>

)}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() => setEditDonor(null)}
            className="border rounded-lg px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-lg px-5 py-2"
          >
            Save Changes
          </button>

        </div>
)
</div>
  );
}
