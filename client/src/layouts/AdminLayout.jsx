import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import React from "react";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#E6EAF3]">
      {/* Sidebar: fixed en ambas resoluciones, oculto via transform en móvil */}
      <Sidebar />

      {/* Main: sin margen en móvil, con margen de 256px (w-64) en desktop */}
      <main className="flex-1 lg:ml-64 ml-0 pt-14 lg:pt-0 p-2 overflow-y-auto bg-[#E6EAF3] min-h-screen w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;