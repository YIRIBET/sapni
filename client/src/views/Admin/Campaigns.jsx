import React from "react";
import { useEffect, useState } from "react";
import { fetchCampaings } from "../../services/campaignService";

function Campaings() {
  const [campaings, setCampaings] = useState([]);

  useEffect(() => {
    const loadCampaings = async () => {
      try {
        const data = await fetchCampaings();
        setCampaings(data.data);
      } catch (error) {
        console.error("Error fetching campaings:", error);
      }
    };

    loadCampaings();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campañas</h1>
      <div className="flex justify-end items-center mb-4 mr-4">
        <button className="bg-[#1A6795] text-white px-4 py-2 rounded-md ml-2">
          Agregar
        </button>
      </div>
      <div className="mb-8">
        <div className="flex gap-4 sm:gap-6 mb-4 justify-between items-center">
          <div className="relative w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              type="text"
              placeholder="Buscar campañas..."
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre de la campaña</th>
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Fecha de inicio</th>
              <th className="py-2 px-4">Fecha de fin</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campaings.map((campaing) => (
              <tr key={campaing.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{campaing.campaign_name}</td>
                <td className="py-2 px-4">{campaing.company_name}</td>
                <td className="py-2 px-4">
                  {new Date(campaing.start_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(campaing.end_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <button className=" hover:text-blue-700 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-pencil-icon lucide-pencil"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-trash2-icon lucide-trash-2"
                    >
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Campaings;
