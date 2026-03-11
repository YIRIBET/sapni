import React, { useEffect, useState } from "react";
import { fetchClients, deleteClient } from "../../services/clientService";
import ClientModal from "../../components/modals/clientModal";
import Swal from "sweetalert2";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Clients() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroContacto, setFiltroContacto] = useState("Todos");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(Array.isArray(data) ? data : data.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };
  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (clientId) => {
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
      await deleteClient(clientId);
      await Swal.fire({
        title: "Eliminado",
        text: "El cliente fue eliminado correctamente",
        icon: "success",
      });
      loadClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el cliente",
        icon: "error",
      });
    }
  };

  const contactosDisponibles = [
    "Todos",
    ...new Set(clients.map((c) => c.contact_person).filter(Boolean)),
  ];

  const filteredClients = clients.filter((client) => {
    const matchSearch =
      `${client.company_name || ""} ${client.tax_id || ""} ${client.contact_person || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchContacto =
      filtroContacto === "Todos" || client.contact_person === filtroContacto;
    return matchSearch && matchContacto;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Clientes</h1>

      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Clientes"
          filename="clientes.pdf"
          columns={[
            { label: "Empresa", key: "company_name" },
            { label: "RFC", key: "tax_id" },
            { label: "Contacto", key: "contact_person" },
          ]}
          rows={filteredClients}
          filters={{ Contacto: filtroContacto, Búsqueda: search }}
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
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <FilterDropdown
            label="Contacto"
            options={contactosDisponibles}
            value={filtroContacto}
            onChange={setFiltroContacto}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Nombre de la empresa</th>
              <th className="py-2 px-4">RFC</th>
              <th className="py-2 px-4">Contacto</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{client.company_name}</td>
                <td className="py-2 px-4">{client.tax_id}</td>
                <td className="py-2 px-4">{client.contact_person}</td>
                <td className="py-2 px-4">
                  <button
                    className="hover:text-blue-700 mr-2"
                    onClick={() => openModal(client)}
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
                    onClick={() => handleDelete(client.id)}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {isModalOpen && (
          <ClientModal
            user={selectedClient}
            onClose={closeModal}
            onSuccess={loadClients}
          />
        )}
      </div>
    </div>
  );
}

export default Clients;
