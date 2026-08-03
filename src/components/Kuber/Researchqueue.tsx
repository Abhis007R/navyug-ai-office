export default function ResearchQueue() {
  const queue = [
    {
      organization: "Tata Trusts",
      progress: "Researching",
    },
    {
      organization: "Infosys Foundation",
      progress: "Pending",
    },
    {
      organization: "Reliance Foundation",
      progress: "Completed",
    },
    {
      organization: "Azim Premji Foundation",
      progress: "Researching",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Research Queue
      </h2>

      <div className="space-y-4">
        {queue.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.organization}</p>
            </div>

            <span className="text-sm text-blue-600 font-semibold">
              {item.progress}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}