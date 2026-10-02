export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  responsibility: string;
  iconName: string;
  colorClass: string;
  systemPrompt: string;
  exampleTasks: string[];
}

export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: "KUBER",
    name: "KUBER",
    role: "AI Individual Donor Researcher",
    responsibility:
      "Identifies individual philanthropists, education donors, entrepreneurs, business owners, charitable families, and other potential personal donors in India.",
    iconName: "Search",
    colorClass: "bg-amber-500 text-amber-950 border-amber-200",
    systemPrompt:
      "Individual donor research, philanthropist discovery, education donor discovery, and donor prospect identification",

    exampleTasks: [
      "Find individual donors in Bihar and Jharkhand who support education and underprivileged children.",
      "Research philanthropists and business owners who have publicly supported education or child welfare.",
      "Find potential individual donors for sponsoring school infrastructure and digital classrooms.",
      "Research charitable individuals and families in India who support scholarships and rural education."
    ]
  },

  {
    id: "SEVA",
    name: "SEVA",
    role: "AI Gmail & Communications Officer",
    responsibility: "Manages email correspondence, drafts polite follow-ups, and crafts donor relations messages.",
    iconName: "Mail",
    colorClass: "bg-blue-500 text-blue-950 border-blue-200",
    systemPrompt: "Gmail management, email drafting, follow-ups",
    exampleTasks: [
      "Draft a reply to Suresh Prasad from Tata Trusts regarding our 12A/80G status and classroom capacity.",
      "Draft a heartfelt donation thank-you email to Aarav Sharma for his ₹25,000 sponsorship.",
      "Draft a warm volunteer invite follow-up for weekend tutoring applicants."
    ]
  },
  {
    id: "VIDYA",
    name: "VIDYA",
    role: "AI Student Intake & Support Coordinator",
    responsibility: "Coordinates student admissions, parent support materials, and translates school updates.",
    iconName: "GraduationCap",
    colorClass: "bg-emerald-500 text-emerald-950 border-emerald-200",
    systemPrompt: "Student admissions, attendance, parent support",
    exampleTasks: [
      "Draft a friendly parent handbook explaining class hours, uniform expectations, and free lunch details.",
      "Prepare a bilingual (English-Hindi) admission guidelines announcement for our free computer courses.",
      "Draft a supportive outreach note for parents whose children are frequently absent from tutoring."
    ]
  },
  {
    id: "LEKHA",
    name: "LEKHA",
    role: "AI Accountant & Financial Officer",
    responsibility: "Generates donation receipts, tracks balance ledgers, and tags financial Section 80G benefits.",
    iconName: "Receipt",
    colorClass: "bg-purple-500 text-purple-950 border-purple-200",
    systemPrompt: "Donation receipts, accounting, financial reports",
    exampleTasks: [
      "Create a professional Section 80G donation receipt draft for Aarav Sharma (₹25,000, 80G benefit eligible).",
      "Draft a simple Q2 NGO income and expense statement audit outline.",
      "Generate a checklist of financial receipts required for our yearly Section 10BD filing."
    ]
  },
  {
    id: "GRANT",
    name: "GRANT",
    role: "AI Grant Proposal Writer",
    responsibility: "Drafts formal corporate CSR project briefs, foundation grant applications, and target budgets.",
    iconName: "FileText",
    colorClass: "bg-indigo-500 text-indigo-950 border-indigo-200",
    systemPrompt: "Grant proposal writing",
    exampleTasks: [
      "Draft a comprehensive grant proposal for 'Navyug Digital Education Hub' seeking ₹5,00,000 from corporate CSR.",
      "Draft a project brief for a 'Daily Healthy Nutrition Program' sponsoring morning milk and fruits for 100 kids.",
      "Write a project proposal to recruit 10 remedial math tutors to counter post-covid school dropouts."
    ]
  },
  {
    id: "MEDIA",
    name: "MEDIA",
    role: "AI Social Media & Outreach Officer",
    responsibility: "Crafts engaging LinkedIn updates, newsletters, and inspirational flyers for community drives.",
    iconName: "Share2",
    colorClass: "bg-rose-500 text-rose-950 border-rose-200",
    systemPrompt: "Social media posts, newsletters, posters",
    exampleTasks: [
      "Write a LinkedIn post celebrating HDFC Bank's CSR grant and explaining the impact on underprivileged children.",
      "Draft an emotional Instagram caption spotlighting a student's success (e.g. Anjali Kumari learning code).",
      "Compose a quarterly email newsletter header inviting volunteers and donors to our upcoming anniversary."
    ]
  },
  {
    id: "HR",
    name: "HR",
    role: "AI Volunteer & Staff Coordinator",
    responsibility: "Manages tutor onboardings, writes volunteer guides, and coordinates appreciation letters.",
    iconName: "Users",
    colorClass: "bg-teal-500 text-teal-950 border-teal-200",
    systemPrompt: "Volunteer and staff management",
    exampleTasks: [
      "Draft a welcome guidelines letter for newly registered volunteer Manisha Patel explaining teaching standards.",
      "Create a monthly weekend roster schedule and coordinator responsibilities charter.",
      "Write a glowing appreciation and certificate draft for a tutor completing 6 months of service."
    ]
  },
  {
    id: "LEGAL",
    name: "LEGAL",
    role: "AI NGO Compliance Specialist",
    responsibility: "Monitors Indian compliance targets including Section 12A, 80G, MCA CSR-1, and MHA FCRA rules.",
    iconName: "ShieldAlert",
    colorClass: "bg-slate-500 text-slate-950 border-slate-200",
    systemPrompt: "Track 12A, 80G, CSR, FCRA compliance",
    exampleTasks: [
      "Analyze the due dates and required filings for our upcoming FCRA registration renewal.",
      "Provide an audit checklist for Section 12A and 80G continuing compliance requirements.",
      "Draft a corporate compliance brief for our board on MCA CSR-1 certification rules."
    ]
  },
  {
    id: "CHATBOT",
    name: "CHATBOT",
    role: "AI Website & WhatsApp Rep",
    responsibility: "Addresses public FAQs, provides instant answers on 80G eligibility, and processes visitor intakes.",
    iconName: "MessageSquare",
    colorClass: "bg-cyan-50 text-cyan-950 border-cyan-200",
    systemPrompt: "Answer website and WhatsApp queries 24x7",
    exampleTasks: [
      "How do I claim a Section 80G tax benefit receipt for my donation?",
      "Can I enroll my child in your digital classes? What are the charges?",
      "How can I register as a volunteer for teaching mathematics on weekends?"
    ]
  },
  {
    id: "CEO_ASSISTANT",
    name: "CEO Assistant",
    role: "AI Executive Assistant",
    responsibility: "Synthesizes system state (finances, tasks, emails) and compiles daily actionable CEO briefs.",
    iconName: "TrendingUp",
    colorClass: "bg-violet-500 text-violet-950 border-violet-200",
    systemPrompt: "Daily summary and task planning",
    exampleTasks: [
      "Synthesize our database state and generate the daily operational briefing for the CEO.",
      "Generate an action agenda focusing on urgent donor enquiries and critical compliance risks.",
      "Recommend a growth strategy for scaling our student intake by 30% next quarter."
    ]
  }
];
