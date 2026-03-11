import React, { useEffect, useState } from "react";
import { getOrders, deleteOrder } from "../../services/orderService";
import OrderModal from "../../components/modals/ordersModal";
import Swal from "sweetalert2";
import ExportPDFButton from "../../components/ExportPDFButton";
import FilterDropdown from "../../components/FilterDropdown";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [filtroCanal, setFiltroCanal] = useState("Todos");
  const [filtroCampaña, setFiltroCampaña] = useState("Todos");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (orderId) => {
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
      await deleteOrder(orderId);
      await Swal.fire({
        title: "Eliminada",
        text: "La orden fue eliminada correctamente",
        icon: "success",
      });
      loadOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la orden",
        icon: "error",
      });
    }
  };

  const canalesDisponibles = [
    "Todos",
    ...new Set(orders.map((o) => o.channel_name).filter(Boolean)),
  ];

  const campañasDisponibles = [
    "Todos",
    ...new Set(orders.map((o) => o.campaign_name).filter(Boolean)),
  ];

  const filteredOrders = orders.filter((o) => {
    const matchSearch = `${o.campaign_name || ""} ${o.channel_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCanal =
      filtroCanal === "Todos" || o.channel_name === filtroCanal;
    const matchCampaña =
      filtroCampaña === "Todos" || o.campaign_name === filtroCampaña;
    return matchSearch && matchCanal && matchCampaña;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ordenes</h1>

      <div className="flex justify-end items-center mb-4 mr-4">
        <ExportPDFButton
          title="Reporte de Órdenes"
          filename="ordenes.pdf"
          columns={[
            { label: "ID", key: "id" },
            { label: "Campaña", key: "campaign_name" },
            { label: "Canal", key: "channel_name" },
            { label: "Spots", key: "total_spots_ordered" },
            { label: "Costo", key: "_costo" },
          ]}
          rows={filteredOrders.map((o) => ({
            ...o,
            _costo: `$${Number(o.contract_amount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
          }))}
          filters={{
            Canal: filtroCanal,
            Campaña: filtroCampaña,
            Búsqueda: search,
          }}
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
              placeholder="Buscar órdenes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Canal"
              options={canalesDisponibles}
              value={filtroCanal}
              onChange={setFiltroCanal}
            />
            <FilterDropdown
              label="Campaña"
              options={campañasDisponibles}
              value={filtroCampaña}
              onChange={setFiltroCampaña}
            />
          </div>
        </div>

        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Campaña</th>
              <th className="py-2 px-4">Canal de difusión</th>
              <th className="py-2 px-4">Spots</th>
              <th className="py-2 px-4">Costo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-t border-gray-200">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.campaign_name}</td>
                <td className="py-2 px-4">{order.channel_name}</td>
                <td className="py-2 px-4">{order.total_spots_ordered}</td>
                <td className="py-2 px-4">
                  $
                  {Number(order.contract_amount).toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="hover:text-blue-700 mr-2"
                    onClick={() => openModal(order)}
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
                    onClick={() => handleDelete(order.id)}
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

        {isModalOpen && (
          <OrderModal
            order={selectedOrder}
            onClose={closeModal}
            onSuccess={loadOrders}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;
