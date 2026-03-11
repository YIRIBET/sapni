import React, { useEffect, useState } from "react";
import { fetchCampaings, deleteCampaing } from "../../services/campaignService";
import CampaignModal from "../../components/modals/campaignsModal";
import Swal from "sweetalert2";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Campaings() {
  const [campaings, setCampaings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("Todos");

  useEffect(() => {
    loadCampaings();
  }, []);

  const loadCampaings = async () => {
    try {
      const data = await fetchCampaings();
      setCampaings(Array.isArray(data) ? data : data.data);
    } catch (error) {
      console.error("Error fetching campaings:", error);
    }
  };

  const openCreateModal = () => { setSelectedCampaign(null); setIsModalOpen(true); };
  const openModal = (campaign) => { setSelectedCampaign(campaign); setIsModalOpen(true); };
  const closeModal = () => { setSelectedCampaign(null); setIsModalOpen(false); };

  const handleDelete = async (campaignId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCampaing(campaignId);
      await Swal.fire({ title: "Eliminada", text: "La campaña fue eliminada correctamente", icon: "success" });
      loadCampaings();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      Swal.fire({ title: "Error", text: "No se pudo eliminar la campaña", icon: "error" });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
    return date.toLocaleDateString("es-MX");
  };

  const estatusDisponibles = ["Todos", "Activa", "Inactiva"];

  const filteredCampaings = campaings.filter((c) => {
    const matchSearch = `${c.campaign_name || ""} ${c.company_name || ""}`
      .toLowerCase().includes(search.toLowerCase());
    const matchEstatus =
      filtroEstatus === "Todos" ||
      (filtroEstatus === "Activa" && c.is_active) ||
      (filtroEstatus === "Inactiva" && !c.is_active);
    return matchSearch && matchEstatus;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Campañas</h1>

      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Campañas"
          filename="campanas.pdf"
          columns={[
            { label: "Campaña",       key: "campaign_name" },
            { label: "Cliente",       key: "company_name" },
            { label: "Inicio",        key: "_start_date" },
            { label: "Fin",           key: "_end_date" },
            { label: "Estatus",       key: "_estatus" },
          ]}
          rows={filteredCampaings.map((c) => ({
            ...c,
            _start_date: formatDate(c.start_date),
            _end_date:   formatDate(c.end_date),
            _estatus:    c.is_active ? "Activa" : "Inactiva",
          }))}
          filters={{ Estatus: filtroEstatus, Búsqueda: search }}
        />
        <button
          className="bg-[#1A6795] text-white px-4 py-2 rounded-md ml-2"
          onClick={openCreateModal}
        >
          Agregar
        </button>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 sm:gap-6 mb-4 justify-between items-center">
          <div className="relative w-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              type="text"
              placeholder="Buscar campañas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <FilterDropdown
            label="Estatus"
            options={estatusDisponibles}
            value={filtroEstatus}
            onChange={setFiltroEstatus}
          />
        </div>

        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre de la campaña</th>
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Fecha de inicio</th>
              <th className="py-2 px-4">Fecha de fin</th>
              <th className="py-2 px-4">Estatus</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaings.map((campaing) => (
              <tr key={campaing.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{campaing.campaign_name}</td>
                <td className="py-2 px-4">{campaing.company_name}</td>
                <td className="py-2 px-4">{formatDate(campaing.start_date)}</td>
                <td className="py-2 px-4">{formatDate(campaing.end_date)}</td>
                <td className="py-2 px-4">
                  {campaing.is_active ? (
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">Activa</span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">Inactiva</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <button className="hover:text-blue-700 mr-2" onClick={() => openModal(campaing)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(campaing.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 11v6" /><path d="M14 11v6" />
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

        {isModalOpen && (
          <CampaignModal campaign={selectedCampaign} onClose={closeModal} onSuccess={loadCampaings} />
        )}
      </div>
    </div>
  );
}

export default Campaings;