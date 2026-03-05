// layouts/AuditorLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function AuditorLayout() {
  return (
    <div className="min-h-screen bg-[#E6EAF3] flex flex-col">
      {/* Navbar Superior */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <Navbar />
      </header>

      {/* Contenedor del contenido */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default AuditorLayout;