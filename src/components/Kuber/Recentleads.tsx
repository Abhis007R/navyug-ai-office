export default function RecentLeads() {
  const leads = [
    {
      name: "ABC Foundation",
      location: "New Delhi",
      status: "Ready to Call",
    },
    {
      name: "XYZ Trust",
      location: "Mumbai",
      status: "Researching",
    },
    {
      name: "Sunrise Education Foundation",
      location: "Bengaluru",
      status: "High Priority",
    },
    {
      name: "Helping Hands NGO",
      location: "Kolkata",
      status: "Follow-up",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        Recent Leads
      </h2>

      <div className="space-y-4">
        {leads.map((lead, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <h3 className="font-semibold">
                {lead.name}
              </h3>

              <p className="text-sm text-gray-500">
                {lead.location}
              </p>
            </div>

            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}