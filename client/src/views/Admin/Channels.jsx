import { useEffect, useState } from "react";
import React from "react";
import { fetchChannels, deleteChannel } from "../../services/channelsService";
import ChannelModal from "../../components/modals/channelModal";
import ChannelDetailModal from "../../components/modals/channelDetailsModal";
import Swal from "sweetalert2";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Channels() {
  const [channels, setChannels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [detailChannel, setDetailChannel] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  useEffect(() => {
    loadChannels();
  }, []);

  const loadChannels = async () => {
    try {
      const data = await fetchChannels();
      setChannels(Array.isArray(data) ? data : data.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedChannel(null);
    setIsModalOpen(true);
  };
  const openModal = (channel) => {
    setSelectedChannel(channel);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedChannel(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (channelId) => {
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
      await deleteChannel(channelId);
      await Swal.fire({
        title: "Eliminado",
        text: "El medio fue eliminado correctamente",
        icon: "success",
      });
      loadChannels();
    } catch (error) {
      console.error("Error deleting channel:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el medio",
        icon: "error",
      });
    }
  };

  const tiposDisponibles = [
    "Todos",
    ...new Set(channels.map((c) => c.type_name).filter(Boolean)),
  ];

  const filteredChannels = channels.filter((c) => {
    const matchSearch =
      `${c.channel_name || ""} ${c.type_name || ""} ${c.razon_social || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchTipo = filtroTipo === "Todos" || c.type_name === filtroTipo;
    return matchSearch && matchTipo;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Medios</h1>

      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Medios"
          filename="medios.pdf"
          columns={[
            { label: "Nombre", key: "channel_name" },
            { label: "Razón Social", key: "razon_social" },
            { label: "Tipo", key: "type_name" },
          ]}
          rows={filteredChannels.map((c) => ({
            ...c,
            razon_social: c.razon_social || "—",
          }))}
          filters={{ Tipo: filtroTipo, Búsqueda: search }}
        />
        <button
          className="bg-[#1A6795] text-white px-4 py-2 rounded-md ml-2"
          onClick={openCreateModal}
        >
          Agregar
        </button>
      </div>

      <div className="mb-8">
         <div className="flex flex-col lg:flex-row gap-3 mb-4 lg:justify-between lg:items-center">
          <div className="relative w-full lg:w-1/3">
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
              placeholder="Buscar medios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <FilterDropdown
            label="Tipo"
            options={tiposDisponibles}
            value={filtroTipo}
            onChange={setFiltroTipo}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre del medio</th>
              <th className="py-2 px-4">Razón Social</th>
              <th className="py-2 px-4">Tipo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredChannels.map((channel) => (
              <tr key={channel.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{channel.channel_name}</td>
                <td className="py-2 px-4">{channel.razon_social || "—"}</td>
                <td className="py-2 px-4">{channel.type_name}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="hover:text-blue-700 mr-2"
                      onClick={() => openModal(channel)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(channel.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-[#1A6795]"
                      title="Ver más"
                      onClick={() => setDetailChannel(channel)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {isModalOpen && (
          <ChannelModal
            channel={selectedChannel}
            onClose={closeModal}
            onSuccess={loadChannels}
          />
        )}
        {detailChannel && (
          <ChannelDetailModal
            channel={detailChannel}
            onClose={() => setDetailChannel(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Channels;
