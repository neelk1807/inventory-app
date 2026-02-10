import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Inventory</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/products">Products</Link>
        <Link to="/sales">Sales</Link>

        <button onClick={logout} className="text-red-400 mt-4">
          Logout
        </button>
      </nav>
    </div>
  );
}
