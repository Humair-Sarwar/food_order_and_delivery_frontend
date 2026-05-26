import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import { useState } from "react";
import Header from "../components/admin/Header";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans antialiased selection:bg-orange-100 selection:text-orange-600">

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}/>

      {/* Main Content */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-66'
      }`}>

        {/* Header */}
        <Header isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}/>

        {/* Page Content */}
        <main className="flex-1 p-6">

          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminLayout;