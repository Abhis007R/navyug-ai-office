export default function StatsCards() {
  const stats = [
    {
      title: "Total Leads",
      value: "1,245",
      color: "bg-blue-500",
    },
    {
      title: "New Today",
      value: "38",
      color: "bg-green-500",
    },
    {
      title: "Ready To Call",
      value: "112",
      color: "bg-orange-500",
    },
    {
      title: "High Score",
      value: "67",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div
            className={`w-12 h-12 rounded-lg ${item.color} mb-4`}
          />

          <h3 className="text-gray-500 text-sm">
            {item.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}