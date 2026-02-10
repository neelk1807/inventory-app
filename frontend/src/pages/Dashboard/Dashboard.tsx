import { useEffect, useState } from "react";
import { getStats } from "../../api/stats";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getStats();
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold">{stats.total_products}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Categories</p>
          <h2 className="text-3xl font-bold">{stats.total_categories}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Low Stock Items</p>
          <h2 className="text-3xl font-bold text-red-600">
            {stats.low_stock_items}
          </h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Stock Value</p>
          <h2 className="text-3xl font-bold">
            ${stats.total_value}
          </h2>
        </div>
      </div>
    </div>
  );
}
