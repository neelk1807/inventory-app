import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }: any) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
