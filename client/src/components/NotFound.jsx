import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E6EAF3] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#1A6795]">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">Página no encontrada</p>
        <p className="text-gray-500 mt-2">La página que buscas no existe.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-6 py-2.5 bg-[#1A6795] text-white rounded-lg hover:bg-[#155a80] transition-colors"
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

export default NotFound;