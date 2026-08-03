import { AIEmployee } from "../types/employee";
import { AI_MODELS } from "../config/ai.config";

export const employees: AIEmployee[] = [
  {
    id: "ceo",
    name: "CEO Assistant",
    title: "AI Executive Assistant",
    model: AI_MODELS.ADVANCED,
    status: "active",
    capabilities: [
      "executive_briefing",
      "decision_support",
      "task_delegation",
      "workflow_approval"
    ],
    permissions: ["*"]
  },

  {
    id: "kuber",
    name: "KUBER",
    title: "AI Donor & CSR Researcher",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "donor_research",
      "csr_search",
      "grant_discovery"
    ],
    permissions: [
      "read:donors",
      "write:donors"
    ]
  },

  {
    id: "grant",
    name: "GRANT",
    title: "AI Grant Proposal Writer",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "proposal_writing",
      "budget_generation"
    ],
    permissions: [
      "read:donors",
      "write:proposals"
    ]
  },

  {
    id: "seva",
    name: "SEVA",
    title: "AI Gmail & Communications Officer",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "email_drafting",
      "gmail_management"
    ],
    permissions: [
      "read:communications",
      "write:communications"
    ]
  },

  {
    id: "lekha",
    name: "LEKHA",
    title: "AI Accountant & Financial Officer",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "accounting",
      "receipt_generation"
    ],
    permissions: [
      "read:finance",
      "write:finance"
    ]
  },

  {
    id: "vidya",
    name: "VIDYA",
    title: "AI Student Intake & Support Coordinator",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "student_management",
      "admission_support"
    ],
    permissions: [
      "read:students",
      "write:students"
    ]
  },

  {
    id: "media",
    name: "MEDIA",
    title: "AI Social Media & Outreach Officer",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "content_creation",
      "social_media"
    ],
    permissions: [
      "read:media",
      "write:media"
    ]
  },

  {
    id: "hr",
    name: "HR",
    title: "AI Volunteer & Staff Coordinator",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "recruitment",
      "volunteer_management"
    ],
    permissions: [
      "read:hr",
      "write:hr"
    ]
  },

  {
    id: "legal",
    name: "LEGAL",
    title: "AI NGO Compliance Specialist",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "legal_compliance",
      "ngo_regulations"
    ],
    permissions: [
      "read:legal",
      "write:legal"
    ]
  },

  {
    id: "chatbot",
    name: "CHATBOT",
    title: "AI Website & WhatsApp Representative",
    model: AI_MODELS.DEFAULT,
    status: "active",
    capabilities: [
      "website_chat",
      "whatsapp_support"
    ],
    permissions: [
      "read:chat",
      "write:chat"
    ]
  }
];