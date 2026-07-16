export interface Donor {
  id: string;
  name: string;
  type: string; // Corporate | Individual
  amount: number;
  date: string;
  status: string;
  email: string;
  phone: string;
  campaign: string;
  notes: string;
  organization?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  classLevel: string;
  parentName: string;
  status: string;
  phone: string;
  admissionDate: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  status: string; // Active | Pending Approval
  email: string;
  skill: string;
  joinedDate: string;
}

export interface Finance {
  id: string;
  receiptNo: string;
  donorName: string;
  amount: number;
  date: string;
  type: string;
  status: string;
  complianceTag: string;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  status: string; // Inbox | Drafted | Approved & Sent
  content: string;
  draftContent?: string;
}

export interface WebsiteQuery {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  chatbotResponse?: string;
}

export interface LegalCompliance {
  id: string;
  name: string;
  law: string;
  status: string; // Compliant | Renewal Pending | Review Required
  dueBy: string;
  notes: string;
}

export interface DriveFile {
  id: string;
  name: string;
  folder: string; // Grant Proposals | Donation Receipts | Newsletters | CEO Reports
  createdBy: string;
  date: string;
  content: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: string; // Pending | Completed
}

export interface Donation {
  id: string;
  amount: number;
  donorName?: string;
  donor_name?: string;
  date?: string;
  campaign?: string;
}

export interface ActivityLog {
  id: string;
  agent?: string;
  status?: string;
  desc?: string;
  description?: string;
  time?: string;
  created_at?: string;
  color?: string;
}

export interface CrmDatabase {
  donors: Donor[];
  students: Student[];
  volunteers: Volunteer[];
  finances: Finance[];
  emails: Email[];
  websiteQueries: WebsiteQuery[];
  legalCompliance: LegalCompliance[];
  driveFiles: DriveFile[];
  taskList: Task[];
  donations?: Donation[];
  activityLogs?: ActivityLog[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  responsibility: string;
  iconName: string;
  systemPrompt: string;
}
