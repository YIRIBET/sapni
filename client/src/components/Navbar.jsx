import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Navbar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userName = localStorage.getItem("userName") || "Usuario";
  const userRole = localStorage.getItem("userRole") || "Usuario";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-6">
          <img
            src="/src/assets/logoIncognita.png"
            alt="Incognita Logo"
            className="w-28 object-contain"
          />
        </div>
        <div className="relative">

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >

            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700 leading-none">
                {userName}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {userRole}
              </p>
            </div>

            <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {initials}
            </div>

          </div>
          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-lg">

              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">
                  {userRole}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Navbar;