export default function LeadTable() {
  const leads = [
    {
      name: "ABC Foundation",
      city: "New Delhi",
      email: "contact@abcfoundation.org",
      phone: "+91 9876543210",
      score: 95,
      status: "Ready to Call",
    },
    {
      name: "Helping Hands Trust",
      city: "Mumbai",
      email: "info@helpinghands.org",
      phone: "+91 9988776655",
      score: 89,
      status: "Researching",
    },
    {
      name: "Future Education Foundation",
      city: "Bengaluru",
      email: "hello@futureedu.org",
      phone: "+91 9123456789",
      score: 92,
      status: "Follow-up",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Donor Leads</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3">Organization</th>
              <th>City</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 font-medium">{lead.name}</td>
                <td>{lead.city}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {lead.score}
                  </span>
                </td>
                <td>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}