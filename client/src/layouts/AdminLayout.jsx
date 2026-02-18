import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import React from "react";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#E6EAF3]">
      <aside className="fixed top-0 left-0 h-screen w-54 bg-white">
        <Sidebar />
      </aside>

      <main className="ml-54 p-2 overflow-y-auto flex-1 bg-[#E6EAF3] w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;