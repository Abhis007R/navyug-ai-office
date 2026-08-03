import SearchBar from "../../components/Kuber/SearchBar";
import StatsCards from "../../components/Kuber/StatsCards";
import RecentLeads from "../../components/Kuber/Recentleads";
import ResearchQueue from "../../components/Kuber/Researchqueue";
import LeadTable from "../../components/Kuber/Leadtable";

export default function KuberDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-blue-700">
            💰 KUBER Workspace
          </h1>

          <p className="text-gray-500 mt-1">
            Gemini Live • AI Donor Researcher
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">

        {/* Search */}
        <SearchBar />

        {/* Statistics */}
        <div className="mt-6">
          <StatsCards />
        </div>

        {/* Recent Leads + Research Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentLeads />
          <ResearchQueue />
        </div>

        {/* Donor Table */}
        <div className="mt-6">
          <LeadTable />
        </div>

      </div>
    </div>
  );
}