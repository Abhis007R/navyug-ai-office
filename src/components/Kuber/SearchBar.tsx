import { Search, RefreshCw, Plus } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="flex flex-col lg:flex-row gap-4">

        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3.5 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search donors, foundations, organizations..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start Research */}
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          <Plus size={18} />
          Start Research
        </button>

        {/* Refresh */}
        <button
          className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 px-5 py-3 rounded-lg"
        >
          <RefreshCw size={18} />
          Refresh
        </button>

      </div>

    </div>
  );
}